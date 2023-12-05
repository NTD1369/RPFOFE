import { NumberValueAccessor } from "@angular/forms";
import { MWICustomerModel } from "./mwi/customer";
import { TapTapVoucherDetails } from "./voucherdetail";

export class MCustomer extends MWICustomerModel {
    companyCode: string = "";
    customerId: string = "";
    createdByStore: string = "";
    customerGrpId: string = "";
    customerGrpName: string = "";
    customerName: string = "";
    address: string = "";
    phone: string = "";
    dob:Date | string | null = null;
    email:string ="";
    joinedDate: Date | string | null = null;
    createdBy: string = "";
    createdOn: Date | string | null = null;
    modifiedBy: string = "";
    modifiedOn: Date | string | null = null;
    status: string = "";
    cusType: string = "";
    customerRank: string = "";
    customerRankName: string = "";
    rewardPoints: number | null = null;
    length: number;
    expiryDate: Date | string | null = null;
    customF1: string = "";
    customF2: string = "";
    customF3: string = "";
    customF4: string = "";
    customF5: string = "";
    doNotAccumPoints:boolean|null = null;
    defaultCusId: string = "";

    
}




export class MCustomerGroup extends MWICustomerModel{
    companyCode: string = "";
    cusGrpId: string = "";
    cusGrpDesc: string = "";
    createdOn: Date | string | null = null;
    createdBy: string = "";
    modifiedOn: Date | string | null = null;
    modifiedBy: string = "";
    status: string = "";
    customerGrpId: string = "";
    customerGrpDesc: string = "";
}


export class CustomerGroupViewModel {

    customerGrpId: string = "";
    customerGrpDesc: string = "";

}