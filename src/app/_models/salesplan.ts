export class SSalesPlanType { 
    companyCode: string;
    code: string;
    name: string;
    description: string;
    status: string;
}


export class SSalesPlan {
    id: string;
    companyCode: string;
    name: string;
    description: string;
    storeId: string;
    type: string;
    target: number | null;
    percent: number | null;
    priority: number | null;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string; 
    fromDate: Date | string | null;
    toDate: Date | string | null;
    status: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
}

export class MSalesPlanHeader {
    id: string;
    companyCode: string; 
    name: string;
    description: string;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    // setupType: string;
    // setupValue: string;
    // target: number | null;
    // commissionType: string;
    // commissionValue: number | null; 
    // filterBy: string;
    remark: string;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string; 
    status: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    lines: MSalesPlanLine[]=[];
}

export class MSalesPlanLine {
    id: string;
    companyCode: string; 
    name: string;
    salesPlanId: string;
    lineNum: number | null; 
    // description: string;
    // fromDate: Date | string | null;
    // toDate: Date | string | null;
    setupType: string;
    setupValue: string;
    target: number | null;
    commissionType: string;
    commissionValue: number | null; 
    filterBy: string;
    remark: string;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string; 
    status: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
}