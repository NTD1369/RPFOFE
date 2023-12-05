export class MTableInfor {
    id: string="";
    companyCode: string="";
    storeId: string="";
    tableId: string="";
    tableName: string="";
    description: string="";
    height: number | null = null;
    width: number | null = null;
    longs: number | null = null;
    slot: number | null = null;
    remark: string="";
    createdBy?: string="";
    createdOn?: Date | string | null=null;
    modifiedBy?: string="";
    modifiedOn?: Date | string | null=null;
    status: string="";
    customField1?: string="";
    customField2?: string="";
    customField3?: string="";
    customField4?: string="";
    customField5?: string="";
    urlImage: string="";
    type: string="";
    key: string="";
    text: string="";
    isOrdered?: boolean | null = false; 
    orderCustomF1: string;
    orderCustomF2: string;
    orderCustomF3: string;
    orderCustomF4: string;
    orderCustomF5: string;
    transId: string;
}


export class MPlaceInfor {
    id: string="";
    companyCode: string="";
    storeId: string="";
    placeId: string="";
    placeName: string="";
    description: string="";
    height: number | null = null;
    width: number | null = null;
    longs: number | null = null;
    slot: number | null = null;
    remark: string="";
    createdBy?: string="";
    createdOn?: Date | string | null=null;;
    modifiedBy?: string="";
    modifiedOn?: Date | string | null=null;;
    status: string="";
    customField1?: string="";
    customField2?: string="";
    customField3?: string="";
    customField4?: string="";
    customField5?: string="";
    urlImage: string="";
}