import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemSearch } from 'src/app/shop/shop-customer/shop-customer.component';
import { MCustomer, MCustomerGroup } from 'src/app/_models/customer';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { CustomergroupService } from 'src/app/_services/data/customergroup.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-customer-list',
  templateUrl: './management-customer-list.component.html',
  styleUrls: ['./management-customer-list.component.scss']
})
export class ManagementCustomerListComponent implements OnInit {
  functionId = "Adm_Customer";
  functionIdFilter = "Cpn_CustomerFilter"; 
  customers: MCustomer[];
  userParams: any = {};
  modalRef: BsModalRef;
  customer: MCustomer;
  isNew: boolean = false;
  lguAdd: string = "Add";
  controlList: any[];
  groupControlList = {};
  model: ItemSearch;
  customerId = "";
  customerSearchForm: FormGroup;
  source = "Local";

  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];

  genderOptions = [
    {
      value: "M", name: "Male",
    },
    {
      value: "F", name: "Female",
    },
    {
      value: "O", name: "Order",
    },
  ];

  customerGroupOptions: MCustomerGroup[] = [];
  openModal(isNew: boolean, customer: MCustomer, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.customer = new MCustomer();
      this.customer.status = this.statusOptions[0].value;
      this.customer.gender = this.genderOptions[0].value;
      this.customer.cusType = "C";

      // this.customerGroupService.getAllViewModel(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      //   // debugger;
      //   if (response.success) {
      //     this.customerGroupOptions = responsse.data;
      //     this.customer.customerGrpId = response.data[0].customerGrpId;
      //     
      //   }
      //   else {
      //     this.alertifyService.warning(response.message);
      //   }
      //   // this.customerGroupOptions = response;
  
      // });

      this.customer.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.customer = customer;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  storeSelected: MStore;
  constructor(private customerService: CustomerService, private alertify: AlertifyService, private authService: AuthService, private alertifyService: AlertifyService, private commonSerrvice: CommonService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute, private customerGroupService: CustomergroupService, private controlService: ControlService,
    private formBuilder: FormBuilder) {
    this.customizeText = this.customizeText.bind(this);
    this.model = new ItemSearch();
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
  }

  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  selectedDate;
 
  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.selectedDate = new Date();
    this.storeSelected = this.authService.storeSelected();
    // this.route
    // this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.customers = data['customers'].result; 

    // // this.userParams.keyword = ''; 
    // // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
    // this.loadItems();
    this.canView = this.checkPermission('', 'V');
    this.getControlList();
    setTimeout(() => {
      if(this.model.display!=null)
      this.searchItem();
    }, 100);
  }




  loadItems() {

    this.customerService.getByCompany(this.storeSelected.companyCode, "").subscribe((response: any) => {
      // loadItems
      // debugger;
      if (response.success) {
        this.customers = response.data;
      }
      else {
        this.alertify.warning(response.message)
      }

      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }

  getItem(item: MCustomer) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }

  @ViewChild('template', { static: false }) template;
  show = false;
  checkPermission(controlId: string, permission: string): boolean {
    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  checkFilterPermission(controlId: string, permission: string): boolean {
    debugger;
    let res = this.authService.checkRole(this.functionIdFilter, controlId, permission);
    console.log('res', controlId + ' - ' + res);
    if(controlId ==='display' && res ==true)
    this.model.display = 20
    return res
  }
  canView = false;
  onToolbarPreparing(e) {
    if (this.checkPermission('', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.openModal.bind(this, true, null, this.template)
        }
      });
    }
  }

  updateModel(model) {
    // debugger; 
    if (this.isNew) {
      let store = this.authService.storeSelected();
      // debugger;
      //  model.storeId = store.storeId;
      model.companyCode = store.companyCode;
      model.joinedDate = new Date();
      model.createdBy = this.authService.decodeToken?.unique_name;
      this.customerService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loadItems();
          this.modalRef.hide();

          
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
    else {
      let store = this.authService.storeSelected();
      // debugger;
      //  model.storeId = store.storeId;
      model.companyCode = store.companyCode;
      model.modifiedBy = this.authService.decodeToken?.unique_name;
      this.customerService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }

      }, error => {
        this.alertify.error(error);
      });
    }

  }
  initDataCompleted = false;
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // console.log( 'this.dropViews', this.dropViews);
    // debugger;
    this.loadStoreGroup();
  }

  loadStoreGroup() {
    this.customerGroupService.getAllViewModel(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      debugger;
      if (response.success) {
        this.customerGroupOptions = response.data;
      
        if(this.customerGroupOptions?.length > 0)
        {
          this.customerGroupOptions = this.customerGroupOptions.filter(x=>x.status === 'A');
        }
        this.customerGroupOptions.map((todo, i) => { todo.customerGrpId = todo.cusGrpId; todo.customerGrpDesc = todo.cusGrpDesc});
        
      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.customerGroupOptions = response;

    });
  }
  dropViews = [];
  setDataSoure(strSource)
  {
    // debugger;
    let source = [];
    if(this.dropViews?.length > 0)
    {
       let ViewSource = this.dropViews.find(x=>x.id === strSource);
       source  = ViewSource.models;
      //  debugger;
    }
    return source;
  }
  gridControlComponent = [];
  getControlList() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionIdFilter).subscribe((response: any) => {
      if (response.data.length > 0) {
        debugger;
        this.controlList = response.data.filter(x => x.status === 'A' && x.controlType !== 'Button' && x.controlType !== 'Grid' && x.controlType !== 'GridColumn');
        this.gridControlComponent= response.data.filter(x=> x.status === 'A' && x.custom2!=='button' && x.controlType === 'GridColumn') ;
        this.gridControlComponent.map((todo, i) => { 
          let controlIdSplit = todo.controlId.split("_"); 
          if(controlIdSplit?.length > 1)
          {
            todo.controlId =controlIdSplit[1];
          } 
         });
        this.gridControlComponent= this.gridControlComponent.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  );
        // this.controlList = this.controlList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1); 

        // console.log("controlList", this.controlList);
        // console.log("response", response);
        let group: any = {};

        response.data.forEach(item => {
          if (item.controlType === "DateTime" || item.controlType === "Date") {
            // debugger;
            if (this.model[item.controlId] === null || this.model[item.controlId] === undefined) {
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: null, disabled: false });
            }
            else {
              // invalidDate.setDate(today.getDate());
              let date = new Date(this.model[item.controlId]);
              this.model[item.controlId] = new Date(this.model[item.controlId]);
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: date, disabled: false });
            }
          }
          else {
            // debugger;
            if(item.controlType?.toLowerCase() === "dropdown" && item.custom1?.length > 0 )
            {
              let dropView: DropView = new DropView();
              dropView.id = item.controlId; 
              dropView.name = item.optionName; 
              dropView.query = item.custom1;
              this.dropViews.push(dropView);
            }
            
              group[item.controlId] = [''];
             
          }
        });
        // console.log('this.dropViews', this.dropViews);
      

        this.customerSearchForm = this.formBuilder.group(group);

        if (this.controlList.length > 0) {
          this.controlList.forEach(item=>{
          
            item.isView = this.checkFilterPermission(item.controlId,'V');
            // console.log('item.controlId', item.controlId);
            // console.log('item.isView', item.isView);
            // debugger;
          });
          var groups = this.controlList.reduce(function (obj, item) {
            obj[item.controlType] = obj[item.controlType] || [];

            obj[item.controlType].push({
              controlId: item.controlId,
              companyCode: item.companyCode,
              controlName: item.controlName,
              functionId: item.functionId,
              action: item.action,
              controlType: item.controlType,
              createdBy: item.createdBy,
              createdOn: item.createdOn,
              optionName: item.optionName,
              require: item.require,
              optionKey: item.optionKey,
              custom1: item.custom1,
              custom2: item.custom2,
              optionValue: item.optionValue,
              status: item.status,
              orderNum: item.orderNum,
              isView: item.isView,
            });
            return obj;
          }, {});
          this.groupControlList = Object.keys(groups).map(function (key) {
            let indexKey = 0;
            if (key === "CheckBox") {
              indexKey = 6;
            } else if (key === "DateTime") {
              indexKey = 2;
            } else if (key === "TextBox") {
              indexKey = 3;
            } else if (key === "DropDown") {
              indexKey = 4;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);

          this.route.params.subscribe(data => {
            this.customerId = data['id'];
            if (this.customerId === null || this.customerId === undefined) {
              this.customerId = "";
            }
            if (this.source === 'Capi') {
              this.customers = null;

            }
            else {
              // this.source = "Local";


              // this.searchItem();
            }

          });
          if(this.dropViews?.length > 0)
          {
            let store= this.authService.storeSelected();
            let dropStt= 0;
            let loadDataStt = this.dropViews.filter(x=>x.query?.length > 0).length;
            this.dropViews.forEach(drop => {
              if(drop?.query?.length > 0)
              {
                this.commonSerrvice.getQuery(store.companyCode, drop.id, drop.query).subscribe((response: any) =>{
                  dropStt++;
                  if(response.success)
                  {
                     drop.models = response.data;
                  }
                  else
                  {
                    this.alertify.error(response.message);
                  }
                  debugger;
                  if(dropStt === loadDataStt )
                  {
                    this.initDataCompleted= true;
                  }
                })
      
              }
            }, error =>{
              this.initDataCompleted= true;
              this.alertify.error(error);
            });
          }
          else
          {
            this.initDataCompleted= true;
          }
          console.log("this.groupControlList", this.groupControlList);
        }
      }
    });
  }
  searchItem() {
    let filter = this.model;
    debugger;
    this.loadCustomer('C', filter.customerGrpId === null || filter.customerGrpId === undefined ? '' : filter.customerGrpId,
      filter.customerId === null || filter.customerId === undefined ? '' : this.customerId, filter.status === null || filter.status === undefined ? '' : filter.status
      , filter.keyword === null || filter.keyword === undefined ? '' : filter.keyword, filter.customerName === null || filter.customerName === undefined ? '' : filter.customerName, 
      filter.customerRank === null || filter.customerRank === undefined ? '' : filter.customerRank,  filter.address === null || filter.address === undefined ? '' : filter.address
      , filter.phone === null || filter.phone === undefined ? '' : filter.phone, filter.dob === null || filter.dob === undefined ? '' : filter.dob,filter.display === null || filter.display === undefined ? '' : filter.display);
  }
  loadCustomer(Type, CustomerGrpId, CustomerId, Status
    , Keyword, CustomerName,  CustomerRank, Address, Phone, DOB,display) {
    debugger;
    this.customerService.getByCompanyFilter(this.authService.getCurrentInfor().companyCode, Type, CustomerGrpId, CustomerId, Status
      , Keyword, CustomerName, CustomerRank, Address, Phone, DOB,display).subscribe((response: any) => {

        if (response.success) {
          this.customers = response.data;// this.mapCustomer2WMiCustomer(response) ;

          console.log("4", this.customers);
        }
        else {
          this.alertify.warning(response.message);
          //Msg  MsgVN
          console.log('failed');
        }
        // this.customers = response;
      })
  }
}

export class DropView{
   id: string = '';
   name: string = '';
   query: string = '';
   event: string = '';
   models: any;
}