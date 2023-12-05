export class SReleaseNote {
        id: string;
        companyCode: string;
        version: string;
        description: string;
        releaseTime: Date | string | null;
        releaseContent: string;
        releaseContentForeign: string;
        customF1: string;
        customF2: string; 
        customF3: string;
        customF4: string;
        customF5: string;
        createdBy: string;
        createdOn: Date | string | null;
        modifiedBy: string;
        modifiedOn: Date | string | null;
        status: string;
        versionReleaseTime:Date | string | null;
        versionBy: string;
        versionDescription: string;
    }