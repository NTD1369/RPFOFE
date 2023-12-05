import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";

export class MProduct {
    companyCode: string="";
    productId: string="";
    productName: string="";
    createdOn: Date | string | null=null;
    createdBy: string="";
    modifiedOn: Date | string | null=null;
    modifiedBy: string="";
    status: string="";
}