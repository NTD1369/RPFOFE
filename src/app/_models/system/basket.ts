 
import { v4 as uuidv4 } from 'uuid';
import { MCustomer } from '../customer';
import { MEmployee } from '../employee';
import { MPaymentMethod } from '../paymentmethod';
import { PromotionViewModel } from '../promotion/promotionViewModel';
import { SchemaViewModel } from '../promotion/schemaViewModel';
import { TSalesStaff } from '../tsaleline';
import { TSalesDelivery } from '../tsalesdelivery';
import { TSalesInvoice } from '../tsalesinvoice';
import { TapTapVoucherDetails } from '../voucherdetail';
// import * as uuid from 'uuid';

export interface IBasket {
  id: string;
  tempTransId: string;
  responseStatus: boolean;
  salesType: string;
  userApproval: string;
  contractNo?: string;
  clearPromotion: boolean;
  discountType: string;
  discountValue?: number;
  discountTypeTemp: string;
  discountValueTemp?: number;
  promotionId: string;
  promotionIdTemp: string;
  customer: MCustomer;
  items: IBasketItem[];
  staffs: TSalesStaff[];
  promoItemApply: IBasketItem[]; 
  payments: IBasketPayment[];       // Thông tin thanh toán 
  paidPayments: IBasketPayment[];       // Thông tin thanh toán 
  paymentHistories: IBasketPayment[];       // Lịch sử thông tin thanh toán 
  promotionItems: IBasketItem[];    // Thông item lưu tạm trước lúc discount
  tmpItems: IBasketItem[];
  voucherApply: TapTapVoucherDetails[];
  voucherApplyTemp: TapTapVoucherDetails[];
  invoice: TSalesInvoice;
  promotionApply: PromotionViewModel[]; //List Promotion được Apply sau khi chạy promotion
  promotionApplyTemp: PromotionViewModel[];
  employee: MEmployee;
  returnMode: boolean;
  note: string;
  transId: string;
  refTransId: string;
  manualPromotion: PromotionViewModel;
  manualSchema: SchemaViewModel;
  delivery: TSalesDelivery;
  isManualDiscount: boolean | null;
  undefinedAmount: number | null;
  startTime: Date | null;
  paymentMode: string ;
  roundingOff?: number | null; 
  reason?: string;
  omsId: string;
  placeId: string;
  omsSource: string;
  dataSource: string;
  negativeOrder: boolean | null; 
  excludePaidPayment: boolean | null; 
  isApplyPromotion: boolean | null; 
  orginalItems: IBasketItem[] | null; 
  lastedItem: IBasketItem | null; 
  custom1: string;
  custom2: string;
  custom3: string;
  custom4: string;
  custom5: string;
  saleschannel: string;
  isSimulate: boolean | null; 
}
export interface IBasketPayment {
  id: string;
  refNum: string;
  shortName: string;
  paymentDiscount?: number;
  paymentTotal?: number;
  paymentCharged?: number;
  lineNum?: number;
  isRequireRefNum?: boolean;
  allowChange?:boolean | null;
  voucherSerial: string;
  mainBalance?: number;
  subBalance?: number;
  cardNo: string;
  cardType: string;
  cardHolderName: string;
  canEdit?: boolean;
  fcAmount?: number;
  rate?: number;
  currency: string;
  paidAmt?: number;
  paymentMode: string;
  paymentType: string;
  forfeitCode: string;
  roundingOff?: number;
  fcRoundingOff?: number; 
  forfeit: number;
  customF1: string ; 
  customF2: string ; 
  customF3: string ; 
  customF4: string ; 
  customF5: string ; 
  apiUrl: string ; 
  isCloseModal?: boolean | null;
  bankPaymentType:string;
  transId: string  | null; 
  promoId?: string; 
  lines: MPaymentMethod[];
  undefinedAmount?: number;
  isPaid:  boolean | null; // Show riêng ra 1 tab riêng nếu bằng true
}
// export interface IBasketItemPromotion {
//   id: string;
//   productName: string;
//   price: number;
//   quantity: number;
//   pictureUrl: string;
//   brand: string;
//   type: string;
//   linetotal?: number;
//   discountValue?: number;
//   protionType: string;  
// }
export class PromotionItem{
  promotionType?: string;
  promotionDiscountPercent?: number | null;
  promotionLineTotal?: number | null;
  promotionItemGroup?: string;
  promotionPriceAfDisAndVat?: number | null;
  promotionRate?: number | null;
  promotionCollection?: string;
  promotionDisAmt?: number | null;
  promotionDisPrcnt?: number | null;
  promotionIsPromo?: string;
  promotionPriceAfDis?: number | null;
  promotionPromoCode?: string;
  promotionPromoName?: string;
  promotionSchemaCode?: string;
  promotionSchemaName?: string;
  promotionTotalAfDis?: number | null;
  promotionUnitPrice?: number | null;
  promotionUoMCode?: string;
  promotionUoMEntry?: number | null;
  promotionVatGroup?: string;
  promotionVatPerPriceAfDis?: number | null;
}
export class IBasketItem extends PromotionItem{
  lineNum?: number| null;
  id: string;
  isNegative: boolean | null;
  productName: string;
  slocId: string;
  price: number | null;
  oldPrice?: number | null;
  quantity: number | null;
  oldQuantity?: number | null;
  pictureUrl: string;
  uom: string;
  barcode: string;
  brand: string;
  type: string;
  isLock: boolean| null;
  isSerial: boolean| null;
  isVoucher: boolean| null;
  isBOM: boolean| null;
  isBOMLine: boolean| null;
  isPriceTime: boolean| null;
  serialNum: string;
  discountValue?: number| null;
  discountType: string; 
  lineTotal?: number| null;
  note: string;
  productId: string; // Ori Product
  isCapacity: boolean| null;
  storeAreaId: string;
  timeFrameId: string;
  capacityValue: number | null;
  appointmentDate: string;
  currency?:string; 
  historyNo?: number | null;
  lineItems: IBasketItem[] = [];
  discountHistory: IBasketItem[] = [];
  staffs: TSalesStaff[] = [];
  prepaidCardNo?:string; 
  memberDate?: Date | string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  memberValue?: number | null;
  customField1?: string="";
  customField2?: string="";
  customField3?: string="";
  customField4?: string="";
  customField5?: string="";
  customField6?: string="";
  customField7?: string="";
  customField8?: string="";
  customField9?: string="";
  customField10?: string="";
  rejectPayType?: string="";
  openQty?: number | null;
  oriQty?: number | null;
  canRemove?: boolean | null;
  itemType?: string | null; 
  salesTaxCode: string="";
  salesTaxRate:number | null;
  purchaseTaxCode: string="";
  purchaseTaxRate:number | null;
  taxAmt?: number | null;
  applyType: string="";
  refTransId: string="";
  baseLine?: string="";
  baseTransId?: string="";
  mcid: string="";
  itemGroupId: string="";
  itemCategory_1: string="";
  itemCategory_2: string="";
  itemCategory_3: string="";
  prefix: string="";
  name: string="";
  phone: string="";  
  priceListId: string="";
  priceListName: string="";  
  isHighLight:string="";  
  custom1: string="";
  custom2?: string="";
  custom3?: string="";
  custom4?: string="";
  custom5?: string="";
  weightScaleBarcode?: string="";
  isWeightScaleItem: boolean| null;
  expDate: Date | string | null= null;
  responseTime: Date | string | null= null;
  bookletNo: string="";
  allowSalesNegative: boolean | null;
  mappingCode: string="";
  isFixedQty: boolean | null= null;
  defaultFixedQty: number | null=null;
  isManualDiscount: boolean | null=null;
}


// const { v4: uuidv4 } = require('uuid');
export class Basket implements IBasket {
  
 
  id = uuidv4();
  tempTransId: string= "";
  responseStatus: boolean=false;
  salesType: string = "";
  clearPromotion: boolean=false;
  customer: MCustomer;
  invoice: TSalesInvoice;
  delivery: TSalesDelivery;
  undefinedAmount: number | null;
  items: IBasketItem[] = []; 
  staffs: TSalesStaff[] = [];
  promoItemApply: IBasketItem[] = [];  
  payments: IBasketPayment[]= []; 
  paidPayments: IBasketPayment[]= []; 
  paymentHistories: IBasketPayment[];       // Lịch sử thông tin thanh toán 
  promotionItems: IBasketItem[]= []; 
  tmpItems: IBasketItem[]= []; 
  voucherApply: TapTapVoucherDetails[]=[];
  voucherApplyTemp: TapTapVoucherDetails[]=[];
  discountType: string = "";
  discountValue?: number = 0;
  discountTypeTemp: string = "";
  discountValueTemp?: number = 0;
  promotionId: string = "";
  promotionIdTemp: string = "";
  promotionApply: PromotionViewModel[]=[];
  promotionApplyTemp: PromotionViewModel[]=[];
  employee: MEmployee;
  returnMode: boolean=false;
  note: string= "";
  placeId: string = "";
  transId: string = "";
  refTransId: string = "";
  manualPromotion: PromotionViewModel;
  manualSchema: SchemaViewModel;
  isManualDiscount:  boolean=false;
  startTime: Date | null; 
  paymentMode: string;
  roundingOff?: number | null;  
  omsId:string;
  omsSource:string;
  dataSource: string;
  userApproval: string;
  reason?: string="";
  negativeOrder: boolean | null; 
  isApplyPromotion: boolean | null; 
  excludePaidPayment: boolean | null; 
  orginalItems: IBasketItem[] | null; 
  lastedItem: IBasketItem | null; 
  custom1: string="";
  custom2: string="";
  custom3: string="";
  custom4: string="";
  custom5: string="";
  saleschannel :string ;
  isSimulate: boolean | null; 
}

export class IBasketTotal {
   ship: number;
   subtotal: number;
   total: number;
   totalQty: number;
   billTotal?: number = 0;
   discountTotal?: number = 0;
   totalAmount?: number = 0;
   changeAmount?: number = 0;
   amountLeft?: number = 0;
   charged?: number = 0;
   discountBillValue?: number = 0;  
   billRoundingOff?: number = 0;
   paymentDiscount?: number = 0;
   actualAmount?: number = 0;
    
}
export class IBasketCurrencyTotal {
  currency: string='';
  rate: number;
  ship: number;
  subtotal: number;
  total: number;
  totalQty: number;
  billTotal?: number = 0;
  discountTotal?: number = 0;
  totalAmount?: number = 0;
  changeAmount?: number = 0;
  amountLeft?: number = 0;
  charged?: number = 0;
  discountBillValue?: number = 0;  
  billRoundingOff?: number = 0;
  paymentDiscount?: number = 0;
  actualAmount?: number = 0;
}

export class IBasketDiscountTotal {
  ship: number;
  subtotal: number;
  total: number;
  billTotal?: number = 0;
  discountTotal?: number = 0; 
  discountBillValue?: number = 0;
  billRoundingOff?: number = 0;
  discountType: string ="";
}