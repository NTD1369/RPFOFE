import { TimeSpan } from "../_models/system/timespan";
export class MTimeFrame {
    companyCode: string;
    timeFrameId: string;
    startTime: TimeSpan | null;
    endTime: TimeSpan | null;
    duration: number | null;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    status: string;

    startTimeStr: string ;
    endTimeStr: string ;
}

export class TimeFrameViewModel
{
    companyCode: string;
    timeFrameId: string;
    startTime: number;
    endTime: number;
    duration: number;
    status: string; 
}