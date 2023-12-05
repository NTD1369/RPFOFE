export class SToDoList { 
    id: string;
    code: string;
    name: string;
    description: string;
    content: string;
    remark: string;
    status: string;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
}