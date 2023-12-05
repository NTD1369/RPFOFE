import { S4VoucherModel } from "./mwi/s4voucher";

export class TapTapVoucherDetails extends S4VoucherModel {
    voucher_code: string;
    name: string;
    code: string;
    image: string;
    start_date: string;
    end_date: string;
    issued_date: string;
    intouch_point: string;
       //IntouchSeriesId: string;
    status: string;
    brand: string;
    tc: string;
    discount_type: string;
    discount_value: string;
    discount_upto: string='';
    discount_code: string;
    is_ecom: string;
    max_redemption : number | null = null;
    min_bill_amount: string; 
    redemption_count: number | null = null;
    source: string;
    materialCode: string;
    voucherType: string;
    voucherPartner: string;
    
}