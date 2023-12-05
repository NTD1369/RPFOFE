import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { MCustomer } from 'src/app/_models/customer';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { PrintwaiverService } from 'src/app/_services/data/printwaiver.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-waiver-form',
  templateUrl: './waiver-form.component.html',
  styleUrls: ['./waiver-form.component.scss']
})
export class WaiverFormComponent implements OnInit {

  version = "vi";
  participantsVal: boolean = false;
  parentsVal: boolean = false;
  legalGuardianVal: boolean = false;
  personParentsVal: boolean = false;
  list: ItemList[] = [];
  arrVersion = [];
  isChecked: boolean = false;
  UserWaiverList: UserWaiver[] = [];
  UserListReport: [] = [];
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
      id: "male",
      index: 0,
      name: "Nam",
    },
    {
      id: "female",
      index: 1,
      name: "Nữ",
    },
  ];
  genderENOptions = [
    {
      id: "male",
      index: 0,
      name: "Male",
    },
    {
      id: "female",
      index: 1,
      name: "Female",
    },
  ];

  constructor(private authService: AuthService, private mwiService: MwiService, private printerService: NgxPrinterService, private alertifyService: AlertifyService,
    private printService: PrintwaiverService) { }
  dateFormat = "";


  currentYear = 2022;

  ngOnInit() {
    let date = new Date();
    this.currentYear =  date.getFullYear()
    this.getData();
  }

  changed(evt) {
    this.isChecked = evt.target.checked;
    console.log(evt.target.checked)
  }

  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;

  getData() {
    console.log("this.version", this.version);
    debugger;
    this.dateFormat = this.authService.loadFormat().dateFormat;
    console.log("this.dateForma", this.dateFormat);
    let user = new UserWaiver();
    user.id = 1;
    user.name = "";
    user.dob = "";
    user.gender = "";
    user.address = "";
    user.email = "";
    user.phone = "";
    user.gender = "male";
    // if (this.version === 'vi') {
     
    //   user.version = "vi";
    // }
    // else {
    //   user.gender = "male";
    //   user.version = "en";
    // }
    user.from = new Date();
    user.to = new Date();
    user.itemList = [];
    user.participantsVal = false;
    user.parentsVal = false;
    user.legalGuardianVal = false;
    user.personParentsVal = false;

    this.UserWaiverList.push(user);
    this.UserWaiverList = this.UserWaiverList.concat(this.arrVersion);
    console.log("user", this.UserWaiverList);
    this.printService.changeParam(this.UserWaiverList);
  }
  printPage() {
    console.log("user", this.UserWaiverList);
    window.print();
  }
  printTemplate() {
    this.printerService.printAngular(this.PrintTemplateTpl);
  }
  changeVer(version) {
    this.version = version;
  }
  addNewWaiverByCus(customer: MCustomer) {
    let count = this.UserWaiverList.length;
    count++;
    debugger;
    let user = new UserWaiver();
    user.id = count;
    user.name = customer.customerName;
    user.dob = customer.dob;

    user.address = customer.address;
    user.email = customer.email;
    user.phone = customer.mobile;
    user.from = new Date();
    user.to = new Date();
    user.gender = customer.gender;
    // if (this.version === 'vi') {
    //   user.gender = "male";
    //   user.version = "vi";
    // }
    // else {
    //   user.gender = "male";
    //   user.version = "en";
    // }
    user.itemList = [];
    if(customer.family_member!==null && customer.family_member!==null &&  customer.family_member.length > 0)
    {
      let sttmember = 1;
      customer.family_member.forEach(member => {
        let item = new ItemList ();
        item.id= sttmember; 
        item.name= member.name;
        item.dob= member.dob;
        item.gender = member.gender;
        user.itemList.push(item);
        sttmember ++;
      });
     
    }
    

    console.log("user", user);
    this.UserWaiverList = this.UserWaiverList.filter(a => a.phone !== customer.mobile);
    this.UserWaiverList.push(user);
   
    // console.log("arr", arr);
    // this.UserWaiverList = arr;
    // console.log("this.UserWaiverList-filter", this.UserWaiverList);
    this.printService.changeParam(this.UserWaiverList);

  }
  addNewWaiver() {
    let count = this.UserWaiverList.length;
    count++;
    let user = new UserWaiver();
    user.id = count;
    user.name = "";
    user.dob = "";

    user.address = "";
    user.email = "";
    user.phone = "";
    user.from = new Date();
    user.to = new Date();

    if (this.version === 'vi') {
      user.gender = "male";
      user.version = "vi";
    }
    else {
      user.gender = "male";
      user.version = "en";
    }
    user.itemList = [];
    this.UserWaiverList.push(user);
    this.printService.changeParam(this.UserWaiverList);
  }
  removeWaiver(waiver: UserWaiver) {
    debugger;
    this.UserWaiverList = this.UserWaiverList.filter(x => x.id != waiver.id);
    this.refreshUserList();
    this.printService.changeParam(this.UserWaiverList);
  }
  addNewRow(waiver: UserWaiver) {
    // debugger;
    let count = waiver.itemList.length;
    count++;
    let newRow = new ItemList();
    newRow.id = count;
    newRow.name = "";
    newRow.dob = "";
    if (this.version === 'vi') {
      newRow.gender = "male";
    }
    else {
      newRow.gender = "male";
    }

    //  this.list.push(newRow);
    waiver.itemList.push(newRow);
    // this.printService.changeParam(this.UserWaiverList);
  }
  switchVersion() {
    console.log("this", this.version);
    if (this.version === 'vi') {
      this.version = 'en';
    }
    else {
      this.version = 'vi';
    }
    this.UserWaiverList = this.pushData(this.version, false, false, false, false);

    this.printService.changeParam(this.UserWaiverList);

  }

  pushData(ver, chb1, chb2, chb3, chb4) {
    let res = this.UserWaiverList.map((val) => {
      let country = Object.keys(val)[0];
      return {
        version: ver,
        id: val.id,
        name: val.name,
        dob: val.dob,
        from: val.from,
        to: val.to,
        gender: val.gender,
        address: val.address,
        email: val.email,
        phone: val.phone,
        participantsVal: chb1,
        parentsVal: chb2,
        legalGuardianVal: chb3,
        personParentsVal: chb4,
        itemList: val.itemList.length > 0 ? val.itemList.map((item) => ({ id: item.id, name: item.name, dob: item.dob, gender: item.gender })) : []
      }
    });
    return res;
  }

  removeRow(waiver, item) {
    waiver.itemList = waiver.itemList.filter(x => x.id != item.id);
    let stt = 1;
    waiver.itemList.forEach(item => {
      item.id = stt;
      stt++;
    });
    this.printService.changeParam(this.UserWaiverList);
  }
  refreshUserList() {
    let stt = 1;
    this.UserWaiverList.forEach(item => {
      item.id = stt;
      stt++;
    });
  }
  refreshList() {
    let stt = 1;
    this.list.forEach(item => {
      item.id = stt;
      stt++;
    });
  }
  mapWMiCustomer2Customer(customer: any): MCustomer {
    let newCus = new MCustomer();
    debugger;
    newCus = customer;
    newCus.customerId = customer.id;
    newCus.mobile = customer.mobile;
    let fullname = "";
    if (customer.first_name !== null && customer.first_name !== undefined) {
      fullname = customer.first_name;
    }
    if (customer.last_name !== null && customer.last_name !== undefined) {
      fullname += " " + customer.last_name;
    }
    newCus.customerName = fullname;
    newCus.address = customer.address;
    newCus.gender = customer.gender;
    return newCus;
    // newCus.email= customer.cu
  }

  findCustomer(phone) {
    let firstChar = phone.toString().substring(0, 1);
    if (firstChar === "0") {
      phone = "84" + phone.toString().substring(1, phone.length);
    }
    // console.log("phone", phone);
    this.mwiService.getCustomerInformation(phone, this.authService.storeSelected().storeId).subscribe((response: any) => {
      // console.log("response", response);
      debugger;
      if (response !== null && response !== undefined) {
        if (response.status === 1) {
          if(response.data!==null && response.data!==undefined)
          {
            let cus = this.mapWMiCustomer2Customer(response.data);
            this.addNewWaiverByCus(cus);
          }
          else
          {
            this.alertifyService.warning('Data not found');
          }
         
        }
        else {
          this.alertifyService.warning(response.msg);
        }
      }
      else {
        this.alertifyService.warning('Data not found');
      }
    })

  }

  somethingChanged() {
    console.log("this.UserWaiverList", this.UserWaiverList);
    this.printService.changeParam(this.UserWaiverList);
  }

  checkValue(event) {

    console.log("event.value", event);
    // this.UserWaiverList = this.pushData(null, event.value, event.value, event.value, event.value);
    // this.printService.changeParam(this.UserWaiverList);
  }
}

export class ItemList {
  id: number;
  name: string;
  dob: Date | string | null;
  gender: string;
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
  version: string;
  participantsVal: boolean;
  parentsVal: boolean;
  legalGuardianVal: boolean;
  personParentsVal: boolean;
  itemList: ItemList[] = [];
}
