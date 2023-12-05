export class SFormatConfig {
    formatId: number;
    companyCode: string;
    formatName: string;
    setupType: string;
    setupCode: string;
    dateFormat: string;
    decimalFormat: string;
    thousandFormat: string;
    decimalPlacesFormat: string;
    qtyDecimalPlacesFormat: string;
    perDecimalPlacesFormat: string;
    rateDecimalPlacesFormat: string;
    status: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    quantityRoundingMethod: string;
    quantityFormat: string;
    amountRoundingMethod: string;
    amountFormat: string;
    pointRoundingMethod: string;
    pointFormat: string;
    inventoryPercent: number|null;
}