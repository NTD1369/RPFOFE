import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { MCustomer } from 'src/app/_models/customer';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { PrintwaiverService } from 'src/app/_services/data/printwaiver.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-waiver-form-template',
  templateUrl: './waiver-form-template.component.html',
  styleUrls: ['./waiver-form-template.component.scss']
})
export class WaiverFormTemplateComponent implements OnInit {

  @Input() version = "vi";
  list: ItemList[] = [];

  @Input() UserWaiverList: UserWaiver[] = [];
  @Output() outModel = new EventEmitter<any>();

  arrUserWaiverList = [];
  arrUserWaiverListNew = [];
  arrItemList = [];
  statusOptions = [
    {
      id: "vi",
      index: 0,
      name: "Vietnamese",
    },
    {
      id: "en",
      index: 1,
      name: "English",
    },
  ];
  genderVNOptions = [
    {
      id: "Nam",
      index: 0,
      name: "Nam",
    },
    {
      id: "Nữ",
      index: 1,
      name: "Nữ",
    },
  ];
  genderENOptions = [
    {
      id: "Male",
      index: 0,
      name: "Male",
    },
    {
      id: "Female",
      index: 1,
      name: "Female",
    },
  ];

  constructor(private authService: AuthService, private mwiService: MwiService, private printerService: NgxPrinterService, private alertifyService: AlertifyService,
    private printService: PrintwaiverService) {
  }

  dateFormat = "";
  ngOnInit() {
    this.inItArraySelected();
  }

  inItArraySelected() {
    this.printService.sharedParam.subscribe((response: any) => {
      this.arrUserWaiverList = [];
      if(response!==null && response!==undefined)
      {
        let arr = response.filter(a => a.name !== "");

        console.log("response", response);
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          this.arrItemList = [];
          if (element.itemList.length > 0) {
            // this.arrItemList = [];
            for (let j = 0; j < element.itemList.length; j++) {
              const item = element.itemList[j];
              this.arrItemList.push({
                id: item.id,
                name: item.name,
                dob: item.dob,
                gender: item.gender,
              })
            }
            console.log("this.arrItemList", this.arrItemList);
  
          }
  
          this.arrUserWaiverList.push({
            id: element.id,
            name: element.name,
            dob: element.dob,
            from: element.from,
            to: element.to,
            gender: element.gender,
            address: element.address,
            email: element.email,
            phone: element.phone,
            version: element.version != undefined ? element.version : "vi",
            participantsVal: element.participantsVal,
            parentsVal: element.parentsVal,
            legalGuardianVal: element.legalGuardianVal,
            personParentsVal: element.personParentsVal,
            itemList: this.arrItemList
          })
        }
        console.log(" this.arrUserWaiverList", this.arrUserWaiverList);
        this.arrUserWaiverNew(this.arrUserWaiverList);
      }
   
    });
  }

  arrUserWaiverNew(arrUserWaiverList) {
    this.arrUserWaiverListNew = arrUserWaiverList;
  }
  // @ViewChild('PrintTemplate')
  // private PrintTemplateTpl: TemplateRef<any>;


  // printTemplate() {
  //   this.printerService.printAngular(this.PrintTemplateTpl);
  // }
  // changeVer(version) {
  //   this.version = version;
  // }
  // addNewWaiverByCus(customer: MCustomer) {
  //   let count = this.UserWaiverList.length;
  //   count++;
  //   let user = new UserWaiver();
  //   user.id = count;
  //   user.name = customer.name;
  //   user.dob = customer.dob;

  //   user.address = customer.address;
  //   user.email = customer.email;
  //   user.phone = customer.mobile;
  //   user.from = new Date();
  //   user.to = new Date();

  //   if (this.version === 'vi') {
  //     user.gender = "Nam";
  //   }
  //   else {
  //     user.gender = "Male";
  //   }
  //   user.itemList = [];
  //   this.UserWaiverList.push(user);
  // }
  // addNewWaiver() {
  //   let count = this.UserWaiverList.length;
  //   count++;
  //   let user = new UserWaiver();
  //   user.id = count;
  //   user.name = "";
  //   user.dob = "";

  //   user.address = "";
  //   user.email = "";
  //   user.phone = "";
  //   user.from = new Date();
  //   user.to = new Date();

  //   if (this.version === 'vi') {
  //     user.gender = "Nam";
  //   }
  //   else {
  //     user.gender = "Male";
  //   }
  //   user.itemList = [];
  //   this.UserWaiverList.push(user);
  // }
  // removeWaiver(waiver: UserWaiver) {
  //   debugger;
  //   this.UserWaiverList = this.UserWaiverList.filter(x => x.id != waiver.id);
  //   this.refreshUserList();
  // }
  // addNewRow(waiver: UserWaiver) {
  //   debugger;
  //   let count = waiver.itemList.length;
  //   count++;
  //   let newRow = new ItemList();
  //   newRow.id = count;
  //   newRow.name = "";
  //   newRow.dob = "";
  //   if (this.version === 'vi') {
  //     newRow.gender = "Nam";
  //   }
  //   else {
  //     newRow.gender = "Male";
  //   }

  //   //  this.list.push(newRow);
  //   waiver.itemList.push(newRow);

  // }
  // switchVersion() {
  //   if (this.version === 'vi') {
  //     this.version = 'en';
  //   }
  //   else {
  //     this.version = 'vi';
  //   }
  // }
  // removeRow(waiver, item) {
  //   waiver.itemList = waiver.itemList.filter(x => x.id != item.id);
  //   let stt = 1;
  //   waiver.itemList.forEach(item => {
  //     item.id = stt;
  //     stt++;
  //   });
  // }
  // refreshUserList() {
  //   let stt = 1;
  //   this.UserWaiverList.forEach(item => {
  //     item.id = stt;
  //     stt++;
  //   });
  // }
  // refreshList() {
  //   let stt = 1;
  //   this.list.forEach(item => {
  //     item.id = stt;
  //     stt++;
  //   });
  // }
  // mapWMiCustomer2Customer(customer: any): MCustomer {
  //   let newCus = new MCustomer();
  //   debugger;
  //   newCus = customer;
  //   newCus.customerId = customer.id;
  //   newCus.mobile = customer.mobile;
  //   let fullname = "";
  //   if (customer.first_name !== null && customer.first_name !== undefined) {
  //     fullname = customer.first_name;
  //   }
  //   if (customer.last_name !== null && customer.last_name !== undefined) {
  //     fullname += " " + customer.last_name;
  //   }
  //   newCus.customerName = fullname;
  //   newCus.address = customer.address;

  //   return newCus;
  //   // newCus.email= customer.cu
  // }

  // findCustomer(phone) {
  //   this.mwiService.getCustomerInformation(phone, this.authService.storeSelected().storeId).subscribe((response: any) => {
  //     if (response !== null && response !== undefined) {
  //       if (response.status === 1) {
  //         let cus = this.mapWMiCustomer2Customer(response.data);
  //         this.addNewWaiverByCus(cus);
  //       }
  //       else {
  //         this.alertifyService.warning(response.msg);
  //       }
  //     }
  //     else {
  //       this.alertifyService.warning('Data not found');
  //     }
  //   })
  // }

}


export class UserWaiver {
  id: number;
  name: string;
  dob: Date | string | null;
  from: Date | string | null;
  to: Date | string | null;
  gender: string;
  address: string;
  email: string;
  phone: string;
  itemList: ItemList[] = [];
}
export class ItemList {
  id: number;
  name: string;
  dob: Date | string | null;
  gender: string;
}
