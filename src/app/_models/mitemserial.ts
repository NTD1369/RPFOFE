import { MItemSerialStock } from "./itemserialstock";

export class MItemSerial {
        companyCode: string="";
        itemCode: string="";
        serialNum: string="";
        quantity: number | null=null;
        expDate: Date | string | null=null;
        storedDate: Date | string | null=null;
        createdBy: string="";
        createdOn: Date | string | null=null;
        modifiedBy: string="";
        modifiedOn: Date | string | null=null;
        status: string="";
        serialStock: MItemSerialStock= null;
        redeemedTransId: string="";
        transId: string="";
        prefix: string="";
        name: string="";
        phone: string="";
        description: string="";
        customF1: string="";
        customF2: string="";
        bookletNo: string="";
        price: number | null=null;
        licensePlates:string ="";

    }