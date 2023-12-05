export class MPlaceInfor {
    companyCode: string;
    storeId: string;
    placeId: string;//note
    placeName: string;
    description: string;
    height: number | null = null;
    urlImage: string;
    assignMap: string;
    width: number | null = null;
    longs: number | null = null;
    slot: number | null = null;
    remark: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
    createdBy: string;
    createdOn: Date | string | null = null;
    modifiedBy: string;
    modifiedOn: Date | string | null = null;
    status: string;
    type: string;
    urlImageSave: string = "";
    donViDoDai: string;
    isDefault: string;
}