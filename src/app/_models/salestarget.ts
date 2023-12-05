

export class MEmployeeSalary {
    id: string;
    companyCode: string;
    employeeId: string;
    employeeName: string;
    position: string;
    status: string;
    salary: number | null;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string; 
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
}

export class TEmployeeSalesTargetSummary {
    id: string;
    companyCode: string;
    employeeId: string;
    employeeName: string;
    position: string;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    salary: string; 
    commisionValue: number | null;
    salesTarget: string;
    lineTotal: number | null;
    lineTotal1: number | null;
    lineTotal2: number | null; 
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
