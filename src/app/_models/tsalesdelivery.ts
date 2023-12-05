export class TSalesDelivery {
    id: string='';
    transId: string='';
    companyCode: string=''; 
    deliveryType: string='';
    deliveryMethod: string='';
    deliveryFee: number| null = null;

    storeId: string='';
    storeName: string='';
    deliveryPartner: string='';
    deliveryId: string='';
    email: string='';
    address: string='';
    phone: string='';
    remark: string='';
    createdOn: Date | string | null= null;
    createdBy: string='';
    modifiedOn: Date | string | null= null;
    modifiedBy: string='';
    
}