import { TimeSpan } from "../system/timespan";

 

export class CapacityViewModel {
   companyCode: string;
   storeId: string;
   storeAreaId: string; 
   timeFrameId: string;
   startDate: Date | string;
   endDate: Date | string;
   transDate: Date | string;
   startTime: TimeSpan | string;
   endTime: TimeSpan | string;
   duration: number;
   maxCapacity: number;
   currentCapacity: number;
   remainCapacity: number;
   color: string;
 
}