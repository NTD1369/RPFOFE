export class TSalesLine {
  transId: string='';
  lineId: string='';
  companyCode: string='';
  storeId: string='';
  itemCode: string='';
  itemName: string='';
  barCode: string='';
  uomCode: string='';
  uomName: string='';
  quantity: number | null = null;
  allowSalesNegative: boolean | null = null;
  price: number | null = null;
  lineTotal: number | null = null;
  discountType: string=''; 
  discountAmt: number | null = null;
  discountRate: number | null = null;
  createdBy: string='';
  createdOn: Date | string | null = null;
  modifiedBy: string='';
  modifiedOn: Date | string | null = null;
  status: string='';
  remark: string='';
  promoId: string='';
  promoType: string='';
  promoPercent: number | null = null;
  promoBaseItem: string='';
  salesMode: string='';
  taxRate: number | null = null;
  taxAmt: number | null = null;
  taxCode: string='';
  slocId: string='';
  minDepositAmt: number | null = null;
  minDepositPercent: number | null = null;
  deliveryType: string='';
  posservice: string='';
  returnQty: number | null = 0;
  returnAmt: number | null = 0;
  storeAreaId: string='';
  timeFrameId: string='';
  appointmentDate: Date | string | null = null;
  bomId: string='';
  promoPrice : number | null = null;
  promoLineTotal : number | null = null;
  openQty : number | null = null;
  baseLine : number | null = null;
  baseTransId : string | null = null;
  promoDisAmt : number | null = null;
  isPromo : string | null = null;
  isSerial : boolean | null = null;
  isVoucher : boolean | null = null;
  bookletNo :string | null = null;
  description: string='';
  serialLines: TSalesLineSerial[];
  memberValue : number | null = null;
  prepaidCardNo: string='';
  memberDate: Date | string | null = null;
  itemType: string='';
  checkedQty?: number | null = null;
  startDate: Date | string | null = null;
  endDate: Date | string | null = null;
  isExchange: boolean | null = null; 
  lineTotalBefDis : number | null = null;
  lineTotalDisIncludeHeader : number | null = null;
  phone: string='';
  name: string='';
  serialNum: string='';
  priceListId: string='';
  itemTypeS4: string='';
  custom1: string='';
  custom2: string='';
  custom3: string='';
  custom4: string='';
  custom5: string='';
  sapPromoId: string='';
  sapBonusBuyId: string=''; 
  weightScaleBarcode: string=''; 
  productId : string | null = null;
  lines:  TSalesLine[]; 
  staffs:  TSalesStaff[] = null;
  lineTotalAfRound: number | null = null;
  lineDisAfRound: number | null = null;
  amtCustom1: number | null = null; 
  amtCustom2: number | null = null; 
  amtCustom3: number | null = null; 
  amtCustom4: number | null = null; 
  amtCustom5: number | null = null; 

}

export class TSalesStaff {
  companyCode: string;
  storeId: string;
  transId: string;
  itemLine: string;
  lineId: number | null; 
  staff: string;
  position: string;
  remark: string;
  percent: number | null;
  amount: number | null;
  createdBy: string;
  createdOn: Date | string | null;
  modifiedBy: string;
  modifiedOn: Date | string | null;
  status: string;
}

export class TSalesPromo {
    transId: string='';
    companyCode: string='';
    storeId: string='';
    itemCode: string='';
    itemName: string='';
    barCode: string='';
    refTransId: string='';
    applyType: string='';
    itemGroupId: string='';
    uomCode: string='';
    uomName: string='';
    value: number | null = null;
    promoId: string='';
    promoType: string='';
    promoTypeLine: string='';
    createdBy: string='';
    createdOn: Date | string | null = null;
    modifiedBy: string='';
    modifiedOn: Date | string | null = null;
    status: string='';
    promoPercent: number | null = null;
    promoAmt: number | null = null;
}

export class TSalesLineSerial {
    transId: string='';
    lineId: string='';
    companyCode: string='';
    storeId: string='';
    itemCode: string='';
    itemName: string='';
    serialNum: string='';
    slocId: string='';
    quantity: number | null = null;
    uomCode: string='';
    uomName: string='';
    createdBy: string='';
    createdOn: Date | string | null = null;
    modifiedBy: string='';
    modifiedOn: Date | string | null = null;
    status: string='';
    openQty : number | null = null;
    baseLine : number | null = null;
    baseTransId : string | null = null;
    lineNum: number | null = null;
    prefix : string | null = null;
    phone : string | null = null;
    name : string | null = null;
    customF1 : string | null = null;
    customF2 : string | null = null; 
    price : number | null = null;
    expDate: Date | string | null = null;
    sapPromoId: string='';
    sapBonusBuyId: string=''; 
    customF3 : string | null = null;
    customF4 : string | null = null; 
    customF5 : string | null = null; 
}