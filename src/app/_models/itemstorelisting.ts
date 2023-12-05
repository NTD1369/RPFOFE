export class MItemStoreListing {
    companyCode: string;
    storeId: string;
    storeName: string;
    itemCode: string; 
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;
    statusTemp: boolean | null;
}