const esc=(s)=>String(s??"").replace(/[^\x20-\x7E]/g," ").replace(/([\\()])/g,"\\$1");
const money=n=>`Rs. ${Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const wrap=(text,max=78)=>{const words=String(text||"").split(/\s+/);const out=[];let line="";for(const w of words){if((line+" "+w).trim().length>max){if(line)out.push(line);line=w}else line=(line+" "+w).trim()}if(line)out.push(line);return out};
export function makeBillPdf({type,party,entry}){
  const service=type==="Service", paid=Number(entry.totalPaid||0), total=Number(entry.amount||0), due=Math.max(total-paid,0);
  const title=service?"SERVICE RECEIPT":"SALES INVOICE", number=service?`SR-${String(entry._id||"").slice(-8).toUpperCase()}`:(entry.invoiceNo||`INV-${String(entry._id||"").slice(-8).toUpperCase()}`);
  const lines=["FUSION ENTERPRISE","",title,`Document No: ${number}`,`Date: ${new Date(entry.date).toLocaleDateString("en-IN")}`,"",`Customer: ${party?.name||"Customer"}`,`Mobile: ${party?.contactNo||"-"}`,"","------------------------------------------------------------"];
  if(service){lines.push("Service Details:");wrap(entry.serviceDetail,70).forEach(x=>lines.push(x));}
  else {lines.push(`Product: ${entry.productName||"-"}`,`Serial No: ${entry.serialNo||"-"}`,`Invoice No: ${entry.invoiceNo||number}`);}
  lines.push("------------------------------------------------------------",`Total Amount: ${money(total)}`,`Total Paid: ${money(paid)}`,`Balance Due: ${money(due)}`,`Payment Status: ${paid>=total?"PAID":paid>0?"PARTIAL":"UNPAID"}`);
  if(entry.payments?.length){lines.push("","Payment History:");entry.payments.forEach(p=>lines.push(`${new Date(p.paymentDate).toLocaleDateString("en-IN")}   ${money(p.amount)}${p.remarks?`   ${p.remarks}`:""}`));}
  if(entry.remarks)lines.push("","Remarks:",...wrap(entry.remarks,70));
  lines.push("","Thank you for your business.");
  const content=[];content.push("BT","/F1 18 Tf","50 790 Td");
  lines.forEach((line,i)=>{if(i===0)content.push(`(${esc(line)}) Tj`);else content.push("0 -22 Td",`(${esc(line)}) Tj`);});content.push("ET");
  const stream=content.join("\n");const objs=[];objs[1]="<< /Type /Catalog /Pages 2 0 R >>";objs[2]="<< /Type /Pages /Kids [3 0 R] /Count 1 >>";objs[3]="<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>";objs[4]="<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";objs[5]=`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  let pdf="%PDF-1.4\n%FUSION\n",offsets=[0];for(let i=1;i<=5;i++){offsets[i]=pdf.length;pdf+=`${i} 0 obj\n${objs[i]}\nendobj\n`;}const xref=pdf.length;pdf+=`xref\n0 6\n0000000000 65535 f \n`;for(let i=1;i<=5;i++)pdf+=`${String(offsets[i]).padStart(10,"0")} 00000 n \n`;pdf+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;return new Blob([pdf],{type:"application/pdf"});
}
export async function deliverBill({type,party,entry}){const blob=makeBillPdf({type,party,entry});const name=`${type==="Service"?"Service-Receipt":"Sales-Invoice"}-${entry.invoiceNo||String(entry._id).slice(-8)}.pdf`;const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);if(mobile&&navigator.share){const file=new File([blob],name,{type:"application/pdf"});if(!navigator.canShare||navigator.canShare({files:[file]})){await navigator.share({title:type==="Service"?"Service Receipt":"Sales Invoice",text:`${party?.name||"Customer"} - ${money(entry.amount)}`,files:[file]});return {shared:true,blob,name};}}const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();return {shared:false,blob,name,url};}
export function printBill(blob){const url=URL.createObjectURL(blob);const w=window.open(url,"_blank");if(w){w.addEventListener("load",()=>w.print(),{once:true});}return url;}
