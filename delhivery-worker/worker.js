function cors(origin,allowed){
  const ok=origin===allowed||origin==="http://localhost:8000"||origin==="http://127.0.0.1:8000";
  return {"Access-Control-Allow-Origin":ok?origin:allowed,"Access-Control-Allow-Methods":"GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin","Cache-Control":"no-store"};
}
function json(body,status,headers){return new Response(JSON.stringify(body),{status,headers:{...headers,"Content-Type":"application/json;charset=UTF-8"}})}
function number(v,min,max){const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null}
function findAmount(payload){
  const row=Array.isArray(payload)?payload[0]:payload;
  if(!row||typeof row!=="object")return 0;
  for(const key of ["total_amount","total","gross_amount","amount","charged_amount","freight_charge"]){const n=Number(row[key]);if(Number.isFinite(n)&&n>0)return n}
  return 0;
}
export default {async fetch(request,env){
  const origin=request.headers.get("Origin")||"";
  const headers=cors(origin,env.ALLOWED_ORIGIN||"https://gamesplanet13.github.io");
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
  const url=new URL(request.url);if(request.method!=="GET"||url.pathname!=="/rate")return json({error:"Not found"},404,headers);
  if(origin&&origin!==env.ALLOWED_ORIGIN&&!/^http:\/\/(localhost|127\.0\.0\.1):8000$/.test(origin))return json({error:"Origin not allowed"},403,headers);
  if(!env.DELHIVERY_API_TOKEN)return json({error:"DELHIVERY_API_TOKEN is not configured"},503,headers);
  const originPin=(url.searchParams.get("origin")||"").replace(/\D/g,"");
  const destination=(url.searchParams.get("destination")||"").replace(/\D/g,"");
  const weight=number(url.searchParams.get("weight_grams"),1,1000000);
  const length=number(url.searchParams.get("length"),1,500),width=number(url.searchParams.get("width"),1,500),height=number(url.searchParams.get("height"),1,500);
  const payment=url.searchParams.get("payment_mode")==="cod"?"COD":"Pre-paid";
  if(originPin.length!==6||destination.length!==6||!weight||!length||!width||!height)return json({error:"Invalid rate request"},400,headers);
  const volumetricKg=length*width*height/5000,actualKg=weight/1000,chargeableGrams=Math.ceil(Math.max(actualKg,volumetricKg)*1000);
  const api=new URL(env.DELHIVERY_RATE_URL||"https://track.delhivery.com/api/kinko/v1/invoice/charges/.json");
  api.search=new URLSearchParams({md:"S",ss:"Delivered",o_pin:originPin,d_pin:destination,cgm:String(chargeableGrams),pt:payment}).toString();
  const upstream=await fetch(api,{headers:{Authorization:"Token "+env.DELHIVERY_API_TOKEN,Accept:"application/json"}});
  const text=await upstream.text();let payload;try{payload=JSON.parse(text)}catch{payload={raw:text.slice(0,300)}}
  if(!upstream.ok)return json({error:"Delhivery rate API rejected the request",status:upstream.status},502,headers);
  const amount=findAmount(payload);if(!amount)return json({error:"Delhivery response did not include a rate"},502,headers);
  return json({amount:Math.ceil(amount),actualKg:Number(actualKg.toFixed(3)),volumetricKg:Number(volumetricKg.toFixed(3)),chargeableKg:Number(Math.max(actualKg,volumetricKg).toFixed(3)),paymentMode:payment,source:"Delhivery Live API"},200,headers);
}};
