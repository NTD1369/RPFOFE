export interface SLicense {
    licenseId: string;
    companyCode: string;
    licenseType: string;
    licenseDesc: string;
    licenseCode: string;
    contractNo: string; 
    validFrom: Date | string | null;
    validTo: Date | string | null;
    createdOn: Date | string | null;
    vreatedBy: string;
    modifiedOn: Date | string | null;
    modifiedBy: string;
    status: string;
    licenseAmt: number | null;
    licenseRemain: number | null;
    numOfDevice: number | null;
    token: string;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
    customF6: string;
    customF7: string;
    customF8: string;
    customF9: string;
    customF10: string;
    customF11: string;
    customF12: string;
    customF13: string;
    customF14: string;
    customF15: string;
    licenseCusF1: string;
    licenseCusF2: string;
    licenseCusF3: string;
    licenseCusF4: string;
    licenseCusF5: string;
    mergeToken: string;

    // export string MergeToken {
    //     get
    //     {

    //         result: string;
    //         if (!string.IsNullOrEmpty(CustomF1)) result += CustomF1;
    //         if (!string.IsNullOrEmpty(CustomF2)) result += CustomF2;
    //         if (!string.IsNullOrEmpty(CustomF3)) result += CustomF3;
    //         if (!string.IsNullOrEmpty(CustomF4)) result += CustomF4;
    //         if (!string.IsNullOrEmpty(CustomF5)) result += CustomF5;
    //         if (!string.IsNullOrEmpty(CustomF6)) result += CustomF6;
    //         if (!string.IsNullOrEmpty(CustomF7)) result += CustomF7;
    //         if (!string.IsNullOrEmpty(CustomF8)) result += CustomF8;
    //         if (!string.IsNullOrEmpty(CustomF9)) result += CustomF9;
    //         if (!string.IsNullOrEmpty(CustomF10)) result += CustomF10;
    //         if (!string.IsNullOrEmpty(CustomF11)) result += CustomF11;
    //         if (!string.IsNullOrEmpty(CustomF12)) result += CustomF12;
    //         if (!string.IsNullOrEmpty(CustomF13)) result += CustomF13;
    //         if (!string.IsNullOrEmpty(CustomF14)) result += CustomF14;
    //         if (!string.IsNullOrEmpty(CustomF15)) result += CustomF15;


    //         result: return;
    //     }
    // }
    numOfShowNotify: number | null;
    licenseInfor: LicenseInfor | null;

}

export class LicenseInfor 
{
    companyCode: string;
    companyName: string;
    contractNo: string;
    licenseType: string;
    licenseNo: string;

    description: string;
    numOfDevice: number;

    validFrom: Date | string | null;
    validTo: Date | string | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string;
    numOfShowNotify: number | null;
}