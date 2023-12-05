export interface MCurrency {
    currencyCode: string;
    currencyName: string;
    tounding: string;
    createdBy: string;
    createdOn: Date | string | null;
    nodifiedBy: string;
    nodifiedOn: Date | string | null;
    status: string;
    maxValue: number | null;
}