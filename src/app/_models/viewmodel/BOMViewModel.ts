import { MBomheader } from "../mbomheader";
import { MBomline } from "../mbomline";

 export class BOMViewModel extends MBomheader {
         
    lines: MBomline[];
    success: boolean | null=null;
    message: string="";
}

export class BOMDataImport  {
    createdBy: string="";
    companyCode: string="";
    data: BOMViewModel[];
    
}