import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { MCustomer } from 'src/app/_models/customer';
import { familyModel, MWICustomerModel } from 'src/app/_models/mwi/customer';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-customer-edit',
  templateUrl: './shop-customer-edit.component.html',
  styleUrls: ['./shop-customer-edit.component.css']
})
export class ShopCustomerEditComponent implements OnInit {
  @Input() customer: MCustomer;
  @Input() isNew: false;
  // family_members : familyModel[]=[]
  @Output() outModel = new EventEmitter<any>();
  rules: any;
  constructor(private authService: AuthService, private alertify: AlertifyService, public datepipe: DatePipe, private mwiService: MwiService,) {
    this.customer = new MCustomer();
    this.rules = { "X": /[02-9]/ };
  }
  dateFormat = "";
  // {
  //   value: "M", name: "Male",
  // },
  // {
  //   value: "F", name: "Female",
  // },
  genderOptions = [
    {
      value: "male", name: "Male",
    },
    {
      value: "female", name: "Female",
    },
   
    {
      value: "not to mention", name: "Not to mention",
    },
  ];
  loadVoucherList() {
    debugger;
    this.mwiService.getVoucherListByCustomer(this.customer.id, this.storeSelected.storeId).subscribe((response: any) => {
      // console.log(response);
      if (response.status === 1) {

        // this.customer = customer;
        this.customer.vouchers = response.data;
        // this.customer.mobile = this.customer.mobile.replace("84", "0");
        this.showVoucher = true;
      }
      else {
        this.alertify.warning(response.msg);
      }
    });

  }
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  triggerSnapshot(): void {
    this.trigger.next();
  }
  removeSnapshot() {
    this.webcamImage = null;
  }

  // customerTabs 

  showVoucher = false;
  
  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }
  selectTab(e) {
    // this.tabContent = this.tabs[].content;
    console.log('e.itemIndex', e.itemIndex);
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  //   onToolbarPreparing(e) {
  //     e.toolbarOptions.items.unshift( {
  //             location: 'before',
  //             widget: 'dxButton',
  //             options: {
  //                 width: 136, 
  //                 icon:"add", type:"success", text:"Add",
  //                 onClick: this.newPromotion.bind(this)
  //             } 
  //         });
  // }
  // newPromotion()
  // { 
  //   // this.router.navigate(["admin/purchase"]);
  // }
  storeSelected: MStore;
  ngOnInit() {
    
    this.dateFormat = this.authService.loadFormat().dateFormat;

    console.log('dateFormat', this.dateFormat);
    // debugger;
    
    this.storeSelected = this.authService.storeSelected();

    //  debugger;

  }
  source = '';
  defaultYearOld = 10;
  loadGeneral() {
    let source = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId);
    if (source !== null && source !== undefined) {
      let sourceX = source.find(x => x.settingId === 'CustomerYearOld');
      if (sourceX !== null && sourceX !== undefined) {
        this.defaultYearOld = parseInt(sourceX.settingValue);
      }

    }

  }
  getAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    return moment(new Date()).diff(dob, 'years') + 1;
  };
  checkValidate(): boolean {
    let result = true;
    if (this.customer.mobile === null || this.customer.mobile === undefined) {
      result = false;
      this.alertify.warning("Please input Mobile");
      return result;
    }
    if (this.customer.first_name === null || this.customer.first_name === undefined) {
      result = false;
      this.alertify.warning("Please input First name");
      return result;
    }
    if (this.customer.last_name === null || this.customer.last_name === undefined) {
      result = false;
      this.alertify.warning("Please input Las name");
      return result;
    }
    // if (this.customer.email === null || this.customer.email === undefined) {
    //   result = false;
    //   this.alertify.warning("Please input Email");
    //   return result;
    // }
    if (this.customer.dob === null || this.customer.dob === undefined) {
      result = false;
      this.alertify.warning("Please enter Date of Birth");
      return result;
    }
    return result;
  }
  saveCustomer() {
    debugger;
    if (this.checkValidate()) {

      if (this.customer.mobile !== null && this.customer.mobile !== undefined) {
        console.log(this.customer.mobile.toString().substring(0,2))
        // this.customer.mobile = "84" + this.customer.mobile;
        // console.log("aaa",this.customer.mobile.substring(1,this.customer.mobile.length));
        let twoChar = this.customer.mobile.toString().substring(0,2);
        if(twoChar ==="84")
        {
          this.customer.mobile= "84" + this.customer.mobile.toString().substring(2,this.customer.mobile.length);
        }
        else
        {
          let firstChar = this.customer.mobile.toString().substring(0,1);
          if(firstChar ==="0")
          {
            this.customer.mobile= "84" + this.customer.mobile.toString().substring(1,this.customer.mobile.length);
          }
          else
          {
            this.customer.mobile= "84" + this.customer.mobile;
          }
          
        }
      }

      // const oneday = 24 * 60 * 60 * 1000;
      // const momentDate = new Date(this.customer.dob); // Replace event.value with your date value
      // const formattedDate = moment(momentDate).format("YYYY-MM-DD");
      // const formattedDatecurrent = new Date();

      // const Difference_In_Time = Math.round(Math.abs((Number(momentDate)  - Number(formattedDatecurrent) )/oneday));
      // this.getAge();
      // this.customer.family_member =this.family_members;

      if (this.getAge(this.customer.dob) < this.defaultYearOld) {
        this.alertify.warning('Year old more than ' + this.defaultYearOld);
      }
      else {
        let formatDob = new Date(this.customer.dob);
        this.customer.dob = new DatePipe("en-US").transform(formatDob, 'yyyy-MM-dd');
        console.log("this.customer.dob", this.customer.dob);
        if(this.customer.email==="" || this.customer.email===null|| this.customer.email===undefined)
        {
          this.customer.email = null;
        }
        // this.customer.createdByStore = this.authService.storeSelected().storeId;
        if(this.customer.family_member!==null && this.customer.family_member!==undefined && this.customer.family_member?.length > 0)
        {
          this.customer.family_member.forEach(member => {
            let formatDobMember = new Date(member.dob);
            member.dob = new DatePipe("en-US").transform(formatDobMember, 'yyyy-MM-dd');
          });
        }
        this.outModel.emit(this.customer);
      }
    }

  }
}
