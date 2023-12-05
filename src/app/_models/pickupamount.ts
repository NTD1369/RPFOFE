export class TPickupAmount {
    id: string;
    companyCode: string;
    storeId: string;
    counterId: string;
    shiftId: string;
    pickupBy: string;
    approveBy: string;
    amount: number | null;
    remarks: string;
    customF1: string;
    customF2: string;
    customF3: string;
    customF4: string;
    customF5: string; 
    createdBy: string;
    createdOn: Date | string | null; 
    status: string;
    print: string;
    collection: number | null;
    shiftDate:  Date | string | null; 
}