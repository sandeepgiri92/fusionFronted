import { makeBillHtml } from './src/lib/billPdf.js';
import fs from 'fs';
const html=makeBillHtml({type:'Sale',party:{name:'ABC Industries',address:'Boisar, Maharashtra 401501'},entry:{invoiceNo:'INV-2026-001',date:'2026-09-13',productName:'Printer Service & Repair',amount:3000,serialNo:'SER-123',remarks:''}});
fs.writeFileSync('/tmp/test-bill.html',html);
