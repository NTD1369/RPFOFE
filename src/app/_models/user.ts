export class User {
    id: string="";
    username: string="";
    knownAs: string="";
    age: number;
    createdOn: Date;
    lastActive: Date;
    photoUrl: string="";
    city: string="";
    country: string="";
    interests?: string="";
    introduction?: string="";
    lookingFor?: string="";
    defEmployee: string="";
    defStore: string="";
    customF1: string="";
    customF2: string="";
    customF3: string="";
    customF4: string="";
    customF5: string="";
    qrBarcode: string="";
    // photos?: Photo[];
  }

  export class MUser {
      userId: string="";
      companyCode: string="";
      username: string="";
      password: string="";
      createdBy: string="";
      createdOn: Date | string | null=null;
      modifiedBy: string="";
      modifiedOn: Date | string | null=null;
      lastLoginStoreId: string="";
      lastLoginStoreLang: string="";
      status: string="";
      storeId: string="";
      storeName: string="";
      role: string="";
      roleId: string="";
      roleName: string="";
      lastName: string="";
      firstName: string="";
      position: string="";
      defaultScreen: string="";
      oldPassword: string="";
      newPassword: string="";
      defEmployee: string="";
      defStore: string="";
      customF1: string="";
      customF2: string="";
      customF3: string="";
      customF4: string="";
      customF5: string="";
      qrBarcode: string="";
      license: string="";
      setLicense: boolean | null=null;
      statusMask: string="";
      validFrom: Date | string | null=null;
      validTo: Date | string | null=null;
      expiredNumber: number | null=null;
      notifyShowOn: number | null=null;
    //   numOfShowNotify: number | null=null;

  }