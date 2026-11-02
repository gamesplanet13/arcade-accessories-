/* Games Planet – Delhivery Forward COD estimator, based on seller screenshots (02 Nov 2026).
 * The 3 named city groups below are illustrative quotes, NOT a national/ZIP tariff.
 * Rates include COD collection charge, provider surcharges and 18% GST.
 * Do not use these rates for prepaid, return (RTO), or reverse pickup shipments.
 */
(function(root){
  'use strict';
  function number(v){return Math.max(0, Number(v)||0);}
  function norm(v){return String(v||'').toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();}
  function round100(v){const n=number(v);return n?Math.max(200,Math.ceil((n-0.000001)/100)*100):0;}
  const CITY_GROUPS={
    delhi:{state:['delhi'],city:['delhi','new delhi'],surface:[33,65,97],express:[33,65,97],sDiesel:[1.22,2.40,3.57],eDiesel:[1.22,2.40,3.57]},
    ghaziabad:{state:['uttar pradesh'],city:['ghaziabad'],surface:[33,65,97],express:[33,65,97],sDiesel:[1.22,2.40,3.57],eDiesel:[1.22,2.40,3.57]},
    mumbai:{state:['maharashtra'],city:['mumbai'],surface:[54,106,158],express:[73,142,211],sDiesel:[1.99,3.91,5.82],eDiesel:[2.69,5.23,7.78]}
  };
  function locationGroup(city,state){
    const c=norm(city),s=norm(state);
    for(const key of Object.keys(CITY_GROUPS)){
      const group=CITY_GROUPS[key];
      if(group.city.includes(c) && (!s||group.state.includes(s)))return {key,group};
    }
    return null;
  }
  function quote(opts){
    const groupMatch=locationGroup(opts.city,opts.state);
    if(!groupMatch)return null; // Unverified city: use a plainly labelled estimate or live quote.
    const g=groupMatch.group;
    const kg=Math.max(.5,number(opts.chargeableKg));
    const halfKgSlab=Math.max(0,Math.ceil((kg-0.0000001)/.5)-1);
    const idx=Math.min(halfKgSlab,2);
    const isExpress=opts.speed==='air'||opts.speed==='express';
    const bases=isExpress?g.express:g.surface;
    const diesel=isExpress?g.eDiesel:g.sDiesel;
    // Extrapolation beyond sampled 1.5 kg is explicitly provisional.
    const extra=halfKgSlab>2?halfKgSlab-2:0;
    const base=bases[idx]+extra*(bases[2]-bases[1]);
    const dieselCost=diesel[idx]+extra*(diesel[2]-diesel[1]);
    const lastMile=halfKgSlab===0?2.50:5.00;
    const peak=isExpress?4:2;
    const collection=number(opts.codAmount)*.02;
    const raw=Number(((base+lastMile+peak+dieselCost+collection)*1.18).toFixed(2));
    return {raw,rounded:round100(raw),city:groupMatch.key,estimated:true,
      source:'Delhivery Forward COD city screenshot-based estimate (GST included)',
      slabKg:(halfKgSlab+1)*.5,codCollectionFee:collection,overSampledWeight:halfKgSlab>2};
  }
  root.GPZForwardCOD=Object.freeze({quote,round100,locationGroup});
})(window);
