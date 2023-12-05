export class SBarcodeSetup {
    companyCode: string;
    id: string;
    name: string;
    prefix: string;
    prefixPosition: number | null;
    barCodePosition: number | null;
    pluPosition: number | null;
    barCodeStr:string = '';
    qtyPosition: number | null;
    qtyStr:string = '';
    amountPosition: number | null;
    amountStr:string = '';
    checkPosition: number | null;
    weightPosition: number | null;
    weightStr: string;
    checkCode: string;
    charSeparator: string;
    status: string;
    type: string; 
    pluStr : string; 

    pluLength: number | null;
    barCodeLength: number | null;
    qtyLength: number | null;
    weightLength: number | null;
    checkCodeLength: number | null;
    amountLength: number | null;
    barcodeLength: number | null;


    amountCalculation: string | null;
    amountValue: number | null;
    weightCalculation: string | null;
    weightValue: number | null;

    prefixCheckLength: number | null;
    isOrgPrice: boolean | null;
    customF1 : string | null;
    customF2 : string | null;
    customF3 : string | null;
    customF4 : string | null;
    customF5 : string | null;

}