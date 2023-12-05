export class MPrepaidCard {
    companyCode: string="";
    prepaidCardNo: string="";
    mainBalance: number | null=null;
    subBalance: number | null=null;
    startDate: Date | string | null=null;
    duration: number| null=null;
    status: string="";
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string;
    modifiedOn: Date | string | null=null;
}

export class TPrepaidCardTrans {
    companyCode: string;
    transId: string;
    prepaidCardNo: string;
    transType: string;
    mainBalance: number | null;
    subBlance: number | null; 
    subBalance: number | null; 
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
}