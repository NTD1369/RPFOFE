import { SClientDisallowance } from "./clientDisallowance";

export class SStoreClient {
    id: string;
    companyCode: string;
    storeId: string;
    name: string;
    localIP: string;
    publicIP: string;
    custom1: string;
    custom2: string;
    custom3: string;
    custom4: string;
    custom5: string;
    fromDate: Date | string | null;
    toDate: Date | string | null;
    status: string;

    poleName: string;
    poleBaudRate: string;
    poleParity: string;
    poleDataBits: string;
    poleStopBits: string;
    poleHandshake: string;
    printSize: string;
    printName: string;

     disallowances:  SClientDisallowance[] =  [];
}