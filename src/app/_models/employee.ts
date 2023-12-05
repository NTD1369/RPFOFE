export class MEmployee {
    employeeId: string="";
    companyCode: string="";
    employeeName: string="";
    position: string="";
    status: string="";
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string="";
    modifiedOn: Date | string | null=null;
    storeId: string="";
    storeName: string="";
    fromDate: Date | string | null=null;
    toDate: Date | string | null=null; 
    stores: MEmployeeStore[]=[];
}


export class MEmployeeStore {
    id: string;
    employeeId: string;
    storeId: string;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    status: string;
}