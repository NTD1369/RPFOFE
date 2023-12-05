export class LicensePlateHearder {
    transId: string;
    companyCode: string;
    contract: string ;
    startDate: Date | string | null;
    endDate: Date | string | null;
    times: number;
    timesInDay: number;
    remark: string;
    itemCode: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn:Date | string | null;
    lines: LicensePlateLine[];
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
}
export class LicensePlateLine {
    transId: string;
    companyCode: string;
    lineId: string;
    licensePlate: string;
    remark: string;
    createdBy: string;
    createdOn:  Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
}
export class LicensePlateHearderTemplate {
    transId: string = '';
    companyCode: string = '';
    contract:  string= '';
    startDate: Date | string | null = null;
    endDate: Date | string | null = null;
    times: number =0;
    timesInDay: number = 0;
    remark: string = '';
    itemCode: string = '';
    createdBy: string ='';
    createdOn: Date | string | null = null;
    modifiedBy: string = '';
    modifiedOn:Date | string | null = null;
    lines: LicensePlateLine[];
    customF1: string = '';
    customF2: string = '';
    customF3: string = '';
    customF4: string = '';
    customF5: string = '';
}
export class LicensePlateLineTemplate {
    transId: string     ='';
    companyCode: string ='';
    lineId: string  ='';
    licensePlate: string    ='';
    remark: string  ='';
    createdBy: string   ='';
    createdOn:  Date | string | null = null;
    modifiedBy: string;
    modifiedOn: Date | string | null = null;
    customF1: string    ='';
    customF2: string    ='';
    customF3: string    ='';
    customF4: string    ='';
    customF5: string    ='';
}