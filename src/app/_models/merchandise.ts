export class MMerchandiseCategory
    {
        

        mcid: string="";
        companyCode: string="";
        mchier: string="";
        mcname: string="";
        createdBy: string="";
        createdOn: Date | string | null=null;
        modifiedBy: string="";
        modifiedOn: Date | string | null=null;
        status: string=""; 
        isShow:  boolean | null=null;
        orderNum:  Number | null=null;
        merchandiseList: MMerchandiseCategory[] = []; 
        keyId: string="";
    }