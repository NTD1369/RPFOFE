export class MItemRejectPayment {
    id: string;
    companyCode: string; 
    itemCode: string;
    paymentType: string; 
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null; 
    status: string;
}