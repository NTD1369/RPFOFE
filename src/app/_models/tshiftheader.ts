export class TShiftHeader
{
    shiftId: string;
    companyCode: string;
    storeId: string;
    dailyId: string;
    deviceId: string;
    openAmt: number | null;
    endAmt: number | null;
    shiftTotal: number | null;
    createdOn: Date | string | null;
    createdBy: string;
    modifiedOn: Date | string | null;
    modifiedBy: string;
    status: string;
}