
///api/CRM/PushSalesServay
export class SalesServayModel {
  locationCode: string;
  terminalCode: string;
  receiptNo: string;
  shiftCode: string;
  receiptTime: string;
  cashierID: string;
  refID: string;
  refNo: string;
  priceID: string;
  itemCount:  number | null;
  subTotal:  number | null;
  grandTotal:  number | null;
  paidCashTotal:  number | null;
  paidOtherTotal:  number | null;
  changeTotal:  number | null;
  isVoid:  number | null;
  isReturn:  number | null;
  reason: string;
  authCode: string;
  authBy: string;
  reprint:  number | null;
  itemDetail: SalesServayDetailModel[]=[];
}

export class SalesServayDetailModel {
  locationCode: string;
  terminalCode: string;
  receiptNo: string;
  rowNo: number | null;
  receiptTime: string;
  description: string;
  quantity:  number | null;
  factor:  number | null;
  totalQuantity:  number | null;
  unitCost:  number | null;
  totalCost:  number | null;
  unitPrice:  number | null;
  discRate: number | null;
}