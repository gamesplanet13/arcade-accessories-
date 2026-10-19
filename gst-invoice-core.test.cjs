const assert=require('assert/strict'),C=require(process.cwd()+'/gst-invoice-core.js');
const input=`🟢 Prepaid Order on WhatsApp
Order ID: TEST-1
Name: Raj Customer
Mobile: +91 7983624797
Address: 10 Example Street
Pincode: 244901
State: Uttar Pradesh
Product: PS2 Controller
Quantity: 2
Base Amount: ₹750
Discount Applied: ₹50
Amount Paid: ₹500
Courier Charges: ₹100`;
let [d]=C.parse(input);assert.equal(d.customer,'Raj Customer');assert.equal(d.mobile,'7983624797');assert.equal(d.lines[0].qty,2);assert.equal(d.lines[0].rate,375);assert.equal(d.discount,50);assert.equal(d.paid,500);assert.equal(d.freight,100);assert.equal(d.state,'09');let t=C.calculate(d);assert.equal(t.total,944);assert.equal(t.balance,444);assert.equal(t.cgst,72);assert.equal(t.sgst,72);
d.state='07';t=C.calculate(d);assert.equal(t.igst,144);assert.equal(t.cgst,0);d.taxMode='inclusive';t=C.calculate(d);assert.equal(t.total,800);assert(Math.abs(t.taxable-800/1.18)<0.01);
let [x]=C.parse('COD Order on WhatsApp\nOrder ID: COD1\nName: Test\nProduct: Console\nCOD Advance: ₹500');assert.equal(x.lines[0].rate,0);assert.equal(x.paid,500);assert(x.warnings.length);
let all=C.parse(input+'\n\n'+input.replace('TEST-1','TEST-2'));assert.equal(all.length,2);
const complex=`Prepaid Order on WhatsApp\nOrder ID: GP123\nName: Another\nState: Delhi\n1. PRODUCT\nName / Variant: GameBox\nQuantity: 2\nUnit Price: ₹1,200\nLine Total: ₹2,400\n2. ADD-ON\nName / Variant: AV Cable\nQuantity: 1\nUnit Price: ₹99\nLine Total: ₹99\nAmount Paid: ₹500`;
x=C.parse(complex)[0];assert.equal(x.lines.length,2);assert.equal(x.lines[0].rate,1200);assert.equal(x.paid,500);assert.equal(C.calculate(x).gross,2499);
const csv='order_id,name,mobile,address,state,product,quantity,unit_price,hsn,gst_rate,amount_paid\nA,One,7983624797,"Address, Rampur",Uttar Pradesh,Controller,2,375,95045000,18,500\nA,One,7983624797,"Address, Rampur",Uttar Pradesh,Cable,1,99,85444299,18,500\nB,Two,7983624797,Delhi address,Delhi,Box,1,1000,95045000,18,0';all=C.parse(csv,'orders.csv');assert.equal(all.length,2);assert.equal(all[0].lines.length,2);assert.equal(all[0].paid,500);assert.equal(all[0].state,'09');assert.equal(all[1].state,'07');
x=C.normalise({name:'Test',items:[{name:'CPU',quantity:2,lineTotal:2000}],amountPaid:500});assert.equal(x.lines[0].rate,1000);assert.equal(x.paid,500);
assert.equal(C.words(123456.78),'Rupees One Lakh Twenty Three Thousand Four Hundred Fifty Six and Seventy Eight Paise Only');
console.log('PASS: WhatsApp single/multiple orders, detailed products, CSV grouping/quoted addresses, JSON totals, advances, discounts, GST extra/included and inter/intra-state arithmetic.');
// Anonymised prepaid/COD fixture with the six-line accessory-order structure.
const six=`Prepaid Order on WhatsApp
Order ID: DEMO-SIX
Name: Example Buyer
Mobile: 9000000000
Address: Example street
Landmark: Near market
Pincode: 244901
State: Uttar Pradesh
District/City: Rampur
Product: Summary must not become an extra line
Base Price: ₹2,196
Amount Paid: ₹2,592
${['Ice Blue','Pink','Green','Black','Yellow','Handle'].map((name,i)=>`${i+1}. ${i?'ADD-ON':'PRODUCT'}\nName / Variant: ${name}\nQuantity: ${i===3?10:2}\nUnit Price: ₹${i===5?585:46}\nLine Total: ₹${i===5?1170:i===3?460:92}`).join('\n')}
Courier Charges: +₹198
Customer / Business Name: Example Electricals
Customer GSTIN: 09ABCDE1234F1Z5
GST Billing Address: Example billing street
Final Order Total: ₹2,592
Payment Method: Prepaid`;
let sixOrder=C.parse(six)[0];assert.equal(sixOrder.lines.length,6);assert.equal(sixOrder.firm,'Example Electricals');assert.equal(sixOrder.gstin,'09ABCDE1234F1Z5');assert.match(sixOrder.address,/Example billing street/);assert.equal(sixOrder.freight,198);assert.equal(sixOrder.paid,2592);assert.equal(sixOrder.statedTotal,2592);let sixTotals=C.calculate(sixOrder);assert.equal(sixTotals.gross,1998);assert.equal(sixTotals.taxable,2196);assert.equal(sixTotals.tax,395.28);assert.equal(sixTotals.total,2591.28);assert.equal(sixTotals.overpaid,.72);sixOrder.roundoff=.72;assert.equal(C.calculate(sixOrder).total,2592);assert.equal(C.calculate(sixOrder).balance,0);assert.equal(C.calculate(sixOrder).overpaid,0);
const cod=C.parse(six.replace('Prepaid Order','COD Order').replace('Amount Paid: ₹2,592','Amount Paid: ₹500').replace('Payment Method: Prepaid','Payment Method: COD'))[0];assert.equal(cod.paid,500);assert.equal(cod.paymentMode,'COD');assert.equal(C.calculate(cod).balance,2091.28);
console.log('PASS: six-line prepaid/COD, buyer GST billing fields, freight, exact GST, stated-total mismatch and explicit round-off.');
