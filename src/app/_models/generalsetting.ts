import { MStore } from "./store";

export class SGeneralSetting {
    settingId: string;
    companyCode: string;
    settingName: string;
    settingValue: string;
    settingDescription: string;
    valueType: string;
    status: string;
    createdBy: string;
    createdOn: Date | string | null;
    modifiedBy: string;
    modifiedOn: Date | string | null;
    storeId: string;
    tokenExpired: number | null;
    defaultValue: string;
    customField1: string;
    customField2: string;
    customField3: string;
    customField4: string;
    customField5: string;
    options: any[] = [];
}

export class GeneralSettingStore extends MStore {
     
    generalSettings: SGeneralSetting[];
}