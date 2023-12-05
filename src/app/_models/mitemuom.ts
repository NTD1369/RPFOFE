export class MItemUom {
    itemCode: string="";
    uomCode: string="";
    factor: number | null=null;
    barCode: string="";
    qrCode: string="";
    createdBy: string="";
    createdOn: Date | string | null=null;
    modifiedBy: string="";
    modifiedOn: Date | string | null=null;
    status: string="";
    defaultFixedQty: number | null=null;
    plu_Flag: string;
    plu: string;
    weightValue: number | null;
    weightCount: number;
    weightUnit: string; 
}
export class ItemUomViewModel implements MItemUom
{
    itemCode: string="";
    uomCode: string="";
    uomName: string="";
    factor: number=null;
    barCode: string="";
    qrCode: string="";
    createdBy: string="";
    createdOn: string | Date | null=null;
    modifiedBy: string="";
    modifiedOn: string | Date | null=null;
    status: string="";
    defaultFixedQty: number | null=null;
    plu_Flag: string="";
    plu: string="";
    weightValue: number | null=null;
    weightCount: number| null=null;
    weightUnit: string="";
}