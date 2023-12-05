import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxTextBoxComponent } from 'devextreme-angular';
import { MCustomer } from 'src/app/_models/customer';
import { MWICustomerModel } from 'src/app/_models/mwi/customer';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-promotion-customer',
  templateUrl: './management-promotion-customer.component.html',
  styleUrls: ['./management-promotion-customer.component.scss']
})
export class ManagementPromotionCustomerComponent implements OnInit {

  customerSelectedList: MCustomer[] = [];
  customer: MCustomer;
  selectedKey: any;
  allMode: string;
  checkBoxesMode: string;
  @Output() customersSelected = new EventEmitter<MCustomer[]>();
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  constructor(public authService: AuthService, private customerService: CustomerService, private mwiService: MwiService, private alertify: AlertifyService) {
    this.customer = new MCustomer();
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
  }
  selectCustomer() {
    if(this.customer!==null && this.customer!==undefined && this.customer?.mobile!=='' && this.customer?.mobile!==null && this.customer?.mobile!==undefined)
    {
      if(!this.customerSelectedList.some(x=>x.customerId))
      {
        this.customerSelectedList.push(this.customer);
        this.customer = new MCustomer();
      }
      else
      {
        this.alertify.warning('Customer in data');
      }
    }
    else
    {
      this.alertify.warning('Please check your data');
    }
    // console.log(this.customerSelectedList);
  }
  applyCustomer() {
    // debugger;
    let selectedRowsData = this.dataGrid.instance.getSelectedRowsData();
    // console.log('Customer Selected' , this.selectedKey);
    // if(this.selectedKey!==null && )
    // {

    // }
    this.customersSelected.emit(selectedRowsData);
  }
  source = "Local";
  mapWMiCustomer2Customer(customer: any): MCustomer {
    let newCus = new MCustomer();
    newCus = customer;
    newCus.customerId = customer.id;
    newCus.mobile = customer.mobile;
    newCus.customerName = customer.first_name + ' ' + customer.last_name;
    newCus.address = customer.address;


    return newCus;
    // newCus.email= customer.cu
  }
  ngOnInit() {
    //this.loadCustomerList('090876548');
    let source = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId);
    if (source !== null && source !== undefined) {
      let sourceX = source.find(x => x.settingId === 'CRMSystem');
      if (sourceX.settingValue === "Capi") {
        this.source = "Capi";
      }
      if (sourceX.settingValue === "Local") {
        this.source = "Local";

      }
    }
    else {
      this.source = "Local";

    }
  }
  mapCustomer2WMiCustomer(customer: MCustomer): MWICustomerModel {
    let newCus = new MWICustomerModel();
    newCus.id = customer.customerId;
    newCus.name = customer.customerName;
    newCus.mobile = customer.customerId;
    return newCus;
    // newCus.email= customer.cu
  }
  
  @ViewChild('txtFilter', { static: false }) txtFilter: DxTextBoxComponent;
  @ViewChild('txtId', { static: false }) txtId: DxTextBoxComponent;
  @ViewChild('txtName', { static: false }) txtName: DxTextBoxComponent;
  @ViewChild('txtEmail', { static: false }) txtEmail: DxTextBoxComponent;
  @ViewChild('txtMobile', { static: false }) txtMobile: DxTextBoxComponent; 

  loadCustomerList() {
    let store = this.authService.storeSelected();


    if (this.source === "Capi") {
      let phone  = this.txtFilter.value;
      let firstChar = phone.toString().substring(0, 1);
      if (firstChar === "0") {
        phone = "84" + phone.toString().substring(1, phone.length);
      }

      this.mwiService.getCustomerInformation(phone, store.storeId).subscribe((response: any) => {
        debugger;
        if (response !== null && response !== undefined) {
          if (response.status === 1) {
            this.customer = this.mapWMiCustomer2Customer(response.data);
          }
          else {
            this.alertify.warning(response.msg);
          }
        }
        else {
          this.alertify.warning('Data not found');
        }


      });
    }
    else {
       let companyCode= store.companyCode;
       let type= "";
       let CustomerGrpId= "";
       let CustomerId = this.txtId.value === undefined ||  this.txtId.value ===  null ? '' : this.txtId.value;
       let Status="";
       let Keyword = this.txtFilter.value === undefined || this.txtFilter.value === null ? '' : this.txtFilter.value;
       let CustomerName="";
       let Address="";
        let Phone= this.txtMobile.value === undefined || this.txtMobile.value === null ? '' : this.txtMobile.value;
        let dob= "";
    //   companyCode, type, CustomerGrpId, CustomerId, Status
    // , Keyword, CustomerName, Address, Phone, DOB
      this.customerService.getByCompanyFilter(companyCode, type,CustomerGrpId,CustomerId, Status
         , Keyword, CustomerName, "", Address, Phone, dob ).subscribe((response: any) => {
        debugger;
        if(response.success)
        {
          // this.customer = response.data;
          this.customerSelectedList = response.data;
        }
        else
        {
          this.alertify.warning(response.message)
        }
        // this.customer = response;
        //this.mapCustomer2WMiCustomer(response) ;
        // if(response.Status === 1)
        // {
        //    this.customer = response.Data;

        // }
        // else
        // {
        //   //Msg  MsgVN
        //   console.log('failed');
        // }

      });

    }



  }
}
