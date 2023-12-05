import { TapTapVoucherDetails } from "../voucherdetail";

export class MWICustomerModel {
    id: string;
    mobile: string;
    name: string;
    email: string;
    sourceID: string;
    custom_Field: string;
    external_id: string;
    gender: string;
    dob: Date | string | null;
    first_name: string;
    last_name: string;
    created_on: string;
    created_by: string;
    registered_store: string;
    group: string;
    address: string;
    district: string;
    city: string;
    member_type: string;
    description: string;
    residental_type: string;
    acquisition_channel: string;
    source_of_customers: string;
    reference_name: string;
    reference_email: string; 
    reference_mobile: string;
    waiver_skill: string;
    social_account: string;
    promotion_tracker: string;
    updated_store: string;
    loyalty_points: string;
    family_member: familyModel[] =[]; 
    current_vui_point: number | null;
    vouchers: TapTapVoucherDetails[] = [];
    customerId: string;
}
    
export class familyModel{
    lineNum: number | null;
    name : string;
    email: string;
    mobile: string;
    gender: string;
    dob: string;
    waiver_relationship: string;
}