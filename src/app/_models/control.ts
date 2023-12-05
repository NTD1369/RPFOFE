export class MControl {
    controlId: string;
    companyCode: string;
    controlName: string;
    functionId: string;
    status: string;
    action: string;
    controlType: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;

    orderNum: number;
    require: boolean;
    optionName: string;
    optionKey: string;
    optionValue: string;
    custom1: string;
    custom2: string; 
    readOnly: boolean | null ;
    custom3: string;
    custom4: string; 
    custom5: string;
    queryStr: string; 
    totalItem: string;
    groupNum: string; 
    groupItem: string;  
}