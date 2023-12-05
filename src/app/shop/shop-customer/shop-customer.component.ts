
import { ViewChild } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManagementCustomerEditComponent } from 'src/app/management/masterdata/customer/management-customer-edit/management-customer-edit.component';
import { MCustomer, MCustomerGroup } from 'src/app/_models/customer';
import { MWICustomerModel } from 'src/app/_models/mwi/customer';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { CustomergroupService } from 'src/app/_services/data/customergroup.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { ShopCustomerEditComponent } from '../customer/shop-customer-edit/shop-customer-edit.component';
export class ItemSearch {
  address: string = '';
  customerGrpId: string = '';
  keyword: string = '';
  customerId: string = '';
  customerName: string = '';
  customerRank: string = '';
  cusType: string = '';
  dob: Date | string | null = null;
  phone: string = '';
  status: string = '';
  display: number = null;
}
@Component({
  selector: 'app-shop-customer',
  templateUrl: './shop-customer.component.html',
  styleUrls: ['./shop-customer.component.scss']
})
export class ShopCustomerComponent implements OnInit {
  @Input() Mode = "";

  @Output() outEvent = new EventEmitter<any>();
  customerMode = "Link"; loyalty = "false";
  sourceCrm = "Local";
  customerId = "";
  loadSetting() {
    let customerMode = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'CustomerDisplayMode');
    if (customerMode !== null && customerMode !== undefined) {
      this.customerMode = customerMode.settingValue;
    }
    let loyalty = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'Loyalty');
    if (loyalty !== null && loyalty !== undefined) {
      this.loyalty = loyalty.settingValue;

    }
  }
  model: ItemSearch;
  functionId = "Cpn_CustomerFilter";
  functionPrimary = "Adm_Customer";
  marked = false;
  theCheckbox = false;
  companyOptions = [];
  phoneFil: string = '';
  firstChar: string = '';
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

  optionValue: string;
  openModal(isNew: boolean, customer: MCustomer, template: TemplateRef<any>) {
    this.isNew = isNew;
    if (this.source === 'Local') {
      this.isNew = isNew;
      if (isNew) {
        this.customer = new MCustomer();
        console.log("aaa", customer);
        this.customer.status = this.statusOptions[0].value;
      }
      else {
        this.customer = customer;
      }
      // this.customer.status = this.statusOptions[0].value;
      // this.customer.gender = this.genderOptions[0].value;

      // this.customerGroupService.getAllViewModel(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      //   // debugger;
      //   if (response.success) {
      //     this.customerGroupOptions = response.data;
      //     this.customer.customerGrpId = response.data[0].customerGrpId;
      //     this.customer.cusType = "C";
      //   }
      //   else {
      //     this.alertifyService.warning(response.message);
      //   }
      //   // this.customerGroupOptions = response;

      // });


      this.customer.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      debugger;
      if (isNew) {
        // this.employee = new MWICustomerModel();
        if (customer === null || customer === undefined) {
          this.customer = new MCustomer;
        }
        else {
          if (customer.family_member !== null && customer.family_member !== undefined) {
            let stt = 1;
            // debugger;
            customer.family_member.forEach(member => {
              member.lineNum = stt++;
            });
            // this.family_members=this.customer.family_member;
            // console.log(this.customer.family_member);
          }
          //  this.loadVoucherList(customer);

        }

      }
      else {
        if (customer.family_member !== null && customer.family_member !== undefined) {
          let stt = 1;
          // debugger;
          customer.family_member.forEach(member => {
            member.lineNum = stt++;
          });
          // this.family_members=this.customer.family_member;
          // console.log(this.customer.family_member);
        }
        this.customer = customer;
        // this.loadVoucherList(this.customer);
        // this.customer = customer;
      }


    }
    debugger;

    setTimeout(() => {

      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    }, 1000);

  }

  customers: MCustomer[];
  pagination: Pagination;
  userParams: any = {};
  modalRef: BsModalRef;
  customer: MCustomer;
  source = "Local";
  storeSelected: MStore;
  selectedKey = [];
  allMode: string;
  checkBoxesMode: string;
  constructor(private customerService: CustomerService, private mwiService: MwiService, private commonService: CommonService, private customerGroupService: CustomergroupService, private controlService: ControlService, private basketSerrvice: BasketService, private alertify: AlertifyService,
    private alertifyService: AlertifyService, private basketService: BasketService, private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private routenav: Router,
    private modalService: BsModalService) {

    this.model = new ItemSearch();
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    // this.customizeText= this.customizeText.bind(this);
  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  checkPermissionPrima(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionPrimary, controlId, permission);
  }
  customerSearchForm: FormGroup;
  cardNameColumn_calculateCellValue(rowData) {
    let value = rowData.first_name;
    if (rowData.last_name !== null && rowData.last_name !== undefined)
      value = rowData.first_name + " " + rowData.last_name;
    return value;
  }
  dropViews = [];
  setDataSoure(strSource) {
    // debugger;
    let source = [];
    if (this.dropViews?.length > 0) {
      let ViewSource = this.dropViews.find(x => x.id === strSource);
      source = ViewSource.models;
      //  debugger;
    }
    return source;
  }
  controlList: any[];
  groupControlList = {};
  canEdit = false;
  canAdd = false;

  getControlList() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button' && x.controlType !== 'Grid' && x.controlType !== 'GridColumn');
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
            if (item.controlType?.toLowerCase() === "dropdown" && item.custom1?.length > 0) {
              let dropView: DropView = new DropView();
              dropView.id = item.controlId;
              dropView.name = item.optionName;
              dropView.query = item.custom1;
              this.dropViews.push(dropView);
            }

            group[item.controlId] = [''];

          }
        });

        this.customerSearchForm = this.formBuilder.group(group);

        if (this.controlList.length > 0) {
          this.controlList.forEach(item => {
            item.isView = this.checkPermission(item.controlId, 'V')
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
            else if (this.source === 'Tera') {
              this.customers = null;

            }
            else {
              // this.source = "Local";


              // this.searchItem();
            }

          });
          if (this.dropViews?.length > 0) {
            let store = this.authService.storeSelected();
            let dropStt = 0;
            let loadDataStt = this.dropViews.filter(x => x.query?.length > 0).length;
            this.dropViews.forEach(drop => {
              if (drop?.query?.length > 0) {
                this.commonService.getQuery(store.companyCode, drop.id, drop.query).subscribe((response: any) => {
                  dropStt++;
                  if (response.success) {
                    drop.models = response.data;
                  }
                  else {
                    this.alertify.error(response.message);
                  }
                  debugger;
                  if (dropStt === loadDataStt) {
                    this.initDataCompleted = true;
                  }
                })

              }
            }, error => {
              this.initDataCompleted = true;
              this.alertify.error(error);
            });
          }
          else {
            this.initDataCompleted = true;
          }
          // console.log("this.groupControlList", this.groupControlList);
        }
      }
    });
  }
  initDataCompleted = false;
  ngOnInit() {

    debugger;
    this.canAdd = this.checkPermissionPrima('', 'I');
    this.canEdit = this.checkPermissionPrima('', 'E');
    this.storeSelected = this.authService.storeSelected();
    let source = this.authService.getCRMSource();
    this.loadSetting();
    this.getControlList();
    // this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId);
    if (source === 'Capi') {
      this.customers = null;
      this.source = "Capi";
    }
    else if (source === 'Tera') {
      this.customers = null;
      this.source = "Tera";
    }
    else {
      this.source = "Local";
    }

    this.loadStoreGroup();

    console.log("aaa", this.customer);
    // console.log("bbbb", this.source);

  }
  customerGroupOptions: MCustomerGroup[] = [];
  loadStoreGroup() {
    this.customerGroupService.getAllViewModel(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      debugger;
      if (response.success) {
        this.customerGroupOptions = response.data;

        if (this.customerGroupOptions?.length > 0) {
          this.customerGroupOptions = this.customerGroupOptions.filter(x => x.status === 'A');
        }
        this.customerGroupOptions.map((todo, i) => { todo.customerGrpId = todo.cusGrpId; todo.customerGrpDesc = todo.cusGrpDesc });

      }
      else {
        this.alertifyService.warning(response.message);
      }
      // this.customerGroupOptions = response;

    });
  }
  isNew = false;
  searchItem() {
    let filter = this.model;
    debugger;
    this.loadCustomer('C', filter.customerGrpId === null || filter.customerGrpId === undefined ? '' : filter.customerGrpId,
      filter.customerId === null || filter.customerId === undefined ? '' : this.customerId, filter.status === null || filter.status === undefined ? '' : filter.status
      , filter.keyword === null || filter.keyword === undefined ? '' : filter.keyword, filter.customerName === null || filter.customerName === undefined ? '' : filter.customerName,
      filter.customerRank === null || filter.customerRank === undefined ? '' : filter.customerRank, filter.address === null || filter.address === undefined ? '' : filter.address
      , filter.phone === null || filter.phone === undefined ? '' : filter.phone, filter.dob === null || filter.dob === undefined ? '' : filter.dob, filter.display === null || filter.display === undefined ? '' : filter.display);
  }
  loadCustomer(Type, CustomerGrpId, CustomerId, Status
    , Keyword, CustomerName, CustomerRank, Address, Phone, DOB, display) {
    debugger;
    this.customerService.getByCompanyFilter(this.authService.getCurrentInfor().companyCode, Type, CustomerGrpId, CustomerId, Status
      , Keyword, CustomerName, CustomerRank, Address, Phone, DOB, display).subscribe((response: any) => {

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
  loadVoucherList(customer) {
    // debugger;
    this.mwiService.getVoucherListByCustomer(customer.id, this.storeSelected.storeId).subscribe((response: any) => {
      // console.log(response);
      if (response.status === 1) {

        this.customer = customer;
        this.customer.vouchers = response.data;
        this.customer.mobile = this.customer.mobile.replace("84", "0");
      }
      else {
        this.alertify.warning(response.msg);
      }
    });

  }
  @ViewChild('localTemplate', { static: false }) template;
  onToolbarPreparing(e, localTemplate) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        width: 136,
        icon: "add", type: "default", text: "Add",
        onClick: this.openModal.bind(this, true, null, localTemplate)
      }
    });
  }
  newCustomerModal() {
    const initialState = {
      model: new MCustomer(), title: 'Item Serial',

    };
    const modalRef = this.modalService.show(ManagementCustomerEditComponent, {
      initialState, animated: true,
      keyboard: true,
      backdrop: true,
      // ignoreBackdropClick: false, 
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    });

    modalRef.content.outModel.subscribe((receivedEntry) => {
      // debugger;
      // console.log('result', receivedEntry);
      if (receivedEntry !== null && receivedEntry != undefined) {
        modalRef.hide();
        this.updateModel(receivedEntry);

      }
    });
  }

  updateModel(model) {
    // debugger;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if (this.source === 'Local') {
          // debugger;
          if (this.isNew) {
            let store = this.authService.storeSelected();
            model.companyCode = store.companyCode;
            model.createdBy = this.authService.decodeToken?.unique_name;
            model.cusType = 'C';
            if (model.customerId === " ")
              model.customerId = "";
            this.customerService.create(model).subscribe((response: any) => {
              if (response.success) {
                this.alertify.success('Create completed successfully');
                this.loadItems();
                this.modalRef.hide();

                if (model.customerId === "") {
                  this.customerService.getByCompanyFilter(model.companyCode, "", "", "", "", "", "", "", "", model.phone, "").subscribe((res: any) => {
                    if (res.data.length > 0) {
                      model.customerId = res.data[0].customerId;
                      localStorage.setItem('basket', JSON.stringify(model))
                      debugger;
                      let basket = this.basketSerrvice.getCurrentBasket();
                      if (basket !== null && basket !== undefined) {
                        this.basketSerrvice.changeCustomer(model, basket.salesType);

                        this.intervalCus = setInterval(() => {
                          basket = this.basketSerrvice.getCurrentBasket();
                          let itemCount = basket?.items;
                          if (itemCount === null || itemCount === undefined || itemCount?.length <= 0) {
                            basket.isApplyPromotion = null;
                          }
                          // console.log('start interval cus');
                          if (basket?.isApplyPromotion === null || basket?.isApplyPromotion === undefined || basket?.isApplyPromotion === true) {
                            this.pauseIntervalCus();
                            if (this.authService.getShopMode() === 'FnB') {
                              this.routenav.navigate(["shop/order"]).then(() => {
                                // window.location.reload();
                              });
                            }
                            if (this.authService.getShopMode() === 'Grocery') {
                              this.routenav.navigate(["shop/order-grocery"]).then(() => {
                                // window.location.reload();
                              });

                            }
                          }
                        }, 500);
                        // if (this.authService.getShopMode() === 'FnB') {
                        //   this.routenav.navigate(["shop/order"]).then(() => {
                        //     // window.location.reload();
                        //   });
                        // }
                        // if (this.authService.getShopMode() === 'Grocery') {
                        //   this.routenav.navigate(["shop/order-grocery"]).then(() => {
                        //     // window.location.reload();
                        //   });

                        // }
                      }
                    }
                  })
                }



              }
              else {
                // this.alertify.error(response.message);
                Swal.fire({
                  icon: 'warning',
                  title: 'Create Customer',
                  text: response.message
                });
              }
            }, error => {
              // this.alertify.error(error);
              Swal.fire({
                icon: 'error',
                title: 'Create Customer',
                text: "Failed to Create customer information"
              });
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
                // this.alertify.error(response.message);
                Swal.fire({
                  icon: 'warning',
                  title: 'Customer',
                  text: response.message
                });
              }

            }, error => {
              // this.alertify.error(error);
              Swal.fire({
                icon: 'error',
                title: 'Update Customer',
                text: "Failed to update customer information"
              });
            });
          }
        }
        else if (this.source === 'Tera') {
          if (this.isNew === true) {
            // this.customer.registered_store = this.authService.storeSelected().storeId;
            this.customer.id = null;
            this.customer = this.mapCustomer2TeraCustomer(model);
            // this.customer.sourceID = 'JAPOS';
            // this.customer.updated_store = this.authService.storeSelected().storeId;
            this.mwiService.createTeraCustomer(this.customer).subscribe((response: any) => {
              // debugger;
              if (response.success === true) {
                this.alertifyService.success(response.message);
                this.modalRef.hide();
              }
              else {
                if (response.message === null || response.message === undefined || response.message === '' || response.message === 'null') {
                  this.alertifyService.warning('Unable Connect To CRM System');
                }
                else {
                  this.alertifyService.warning(response.message);
                }
                // this.alertifyService.warning(response.msg);
              }


            }, error => {
              this.alertifyService.error(error);
            });
          }
          else {
            this.customer = this.mapCustomer2TeraCustomer(model);
            // this.customer.sourceID = 'JAPOS';
            // this.customer.source_of_customers = this.storeSelected.storeId;
            // this.customer.updated_store =this.authService.storeSelected().storeId;
            this.mwiService.updateTeraCustomer(this.customer).subscribe((response: any) => {
              if (response.success === true) {
                this.alertifyService.success(response.message);
                this.modalRef.hide();
              }
              else {
                // this.alertifyService.warning(response.msg);
                if (response.message === null || response.message === undefined || response.message === '' || response.message === 'null') {
                  this.alertifyService.warning('Unable Connect To CRM System');
                }
                else {
                  this.alertifyService.warning(response.message);
                }
              }


              // this.alertifyService.success('Customer updatedcompleted successfully.'); 
              // 
            }, error => {
              this.alertifyService.error(error);
            });
          }
        }
        else {
          if (this.isNew === true) {
            this.customer.registered_store = this.authService.storeSelected().storeId;
            this.customer.id = null;
            this.customer = model;
            // this.customer.sourceID = 'JAPOS';
            if (this.customer?.source_of_customers === null || this.customer?.source_of_customers === undefined || this.customer?.source_of_customers === '') {
              this.customer.source_of_customers = this.authService.storeSelected().storeId;
            }
            this.customer.updated_store = this.authService.storeSelected().storeId;
            this.mwiService.createCustomer(this.customer).subscribe((response: any) => {
              // debugger;
              if (response.status === 1) {
                this.alertifyService.success(response.msg);
                this.modalRef.hide();
              }
              else {
                if (response.msg === null || response.msg === undefined || response.msg === '' || response.msg === 'null') {
                  this.alertifyService.warning('Unable Connect To CRM System');
                }
                else {
                  this.alertifyService.warning(response.msg);
                }
                // this.alertifyService.warning(response.msg);
              }


            }, error => {
              this.alertifyService.error(error);
            });
          }
          else {
            this.customer = model;
            // this.customer.sourceID = 'JAPOS';
            // this.customer.source_of_customers = this.storeSelected.storeId;
            this.customer.updated_store = this.authService.storeSelected().storeId;
            this.mwiService.updateCustomer(this.customer).subscribe((response: any) => {
              if (response.status === 1) {
                this.alertifyService.success(response.msg);
                this.modalRef.hide();
              }
              else {
                // this.alertifyService.warning(response.msg);
                if (response.msg === null || response.msg === undefined || response.msg === '' || response.msg === 'null') {
                  this.alertifyService.warning('Unable Connect To CRM System');
                }
                else {
                  this.alertifyService.warning(response.msg);
                }
              }


              // this.alertifyService.success('Customer updatedcompleted successfully.'); 
              // 
            }, error => {
              this.alertifyService.error(error);
            });
          }
        }
      }
    });

  }
  tabs = [
    {
      id: 0,
      text: 'informartion',
      icon: 'user',
      // content: 'User tab content',
    },
    {
      id: 1,
      text: 'voucher',
      icon: 'comment',
      // content: 'Comment tab content',
    },

  ];
  filterBy(txtFilter: string, name, email = '') {
    // debugger;
    // this.userParams.keyword = txtFilter;
    // xxxx
    this.time = 0;
    if ((txtFilter !== null && txtFilter !== undefined && txtFilter !== '') || (name !== null && name !== undefined && name !== '')) {
      this.firstChar = txtFilter.substring(0, 1);
      this.phoneFil = txtFilter;
      if (this.firstChar === "0" && this.source !== 'Tera') {
        this.phoneFil = txtFilter.replace("0", "84");
      } else {
        this.phoneFil = txtFilter;
      }
      this.loadCustomerList(this.phoneFil, name, '', email);
    }
    else {
      this.alertifyService.warning('Please input value');
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
  mapWMiCustomer2Customer(customer: any): MCustomer {
    let newCus = new MCustomer();
    newCus = customer;
    newCus.customerId = customer.id;
    newCus.mobile = customer.mobile;
    let name = customer.first_name;
    if (customer.last_name !== null && customer.last_name !== undefined) {
      name = name + ' ' + customer.last_name;
    }
    newCus.customerName = name;//customer.first_name + ' ' + customer.last_name;
    newCus.address = customer.address;


    return newCus;
    // newCus.email= customer.cu
  }

  mapTeraCustomer2Customer(customer: any): MCustomer {
    let newCus = new MCustomer();
    newCus = customer;
    newCus.customerId = customer.customerId;
    newCus.mobile = customer.phone;
    // newCus.first_name = customer.customerName;
    newCus.customerName = customer.customerName;//customer.first_name + ' ' + customer.last_name;
    newCus.address = customer.address;
    newCus.email = customer.email;
    newCus.dob = customer.dob;
    newCus.joinedDate = customer.joinedDate;
    newCus.customerGrpId = customer.customerGrpId;
    newCus.createdBy = customer.createdBy;
    newCus.createdOn = customer.createdOn;
    newCus.modifiedBy = customer.modifiedBy;
    newCus.modifiedOn = customer.modifiedOn;


    return newCus;
    // newCus.email= customer.cu
  }
  mapCustomer2TeraCustomer(customer: MCustomer): any {
    let newCus: any;
    newCus = customer;
    newCus.customerId = customer.customerId;
    newCus.phone = customer.mobile;
    // newCus.first_name = customer.customerName;
    newCus.customerName = customer.customerName;//customer.first_name + ' ' + customer.last_name;
    newCus.address = customer.address;
    newCus.email = customer.email;
    newCus.dob = customer.dob;
    newCus.joinedDate = customer.joinedDate;
    newCus.customerGrpId = customer.customerGrpId;
    newCus.createdBy = customer.createdBy;
    newCus.createdOn = customer.createdOn;
    newCus.modifiedBy = customer.modifiedBy;
    newCus.modifiedOn = customer.modifiedOn;
    return newCus;
    // newCus.email= customer.cu
  }
  message = "";
  time: number = 0;
  display;
  interval;

  startTimer() {
    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform(this.time)
    }, 1000);
  }
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ' minutes : ' + (value - minutes * 60) + ' seconds';
  }
  pauseTimer() {
    clearInterval(this.interval);
  }
  loadCustomerList(phone, name, cusId, email = '') {
    this.message = "";
    if (this.source === "Capi") {
      let store = this.authService.storeSelected().storeId;
      this.message = "Loading Customer Information From CRM System. Please wait a minute.";
      this.startTimer();
      this.mwiService.getCustomerList(name, phone, cusId, store).subscribe((response: any) => {
        // debugger;
        this.customers = [];
        this.message = "";
        this.pauseTimer();
        if (response !== null && response !== undefined) {
          if (response.status === 1) {
            //  this.customer = response.data; 
            response.data.forEach(cus => {
              let customer = this.mapWMiCustomer2Customer(cus);
              // console.log("3");
              this.customers.push(customer);
            });

          }
          else {
            //Msg  MsgVN
            if (response.msg === null || response.msg === undefined || response.msg === '' || response.msg === 'null') {
              this.alertify.warning('Unable Connect To CRM System');
            }
            else {
              this.alertify.warning(response.msg);
            }

          }
        }
        else {
          this.alertify.warning('Data not found');

        }

      }, error => {
        debugger;
        this.message = ""
        this.pauseTimer();
        // this.alertifyService.warning('denomination ' + error);
        Swal.fire({
          icon: 'warning',
          title: "Unable Connect To CRM System",
          text: error
        });
      });
      // this.mwiService.getCustomerInformation(phone, 'JAPOS').subscribe((response: any)=>{
      //   debugger;
      //   if(response!==null && response!==undefined)
      //   {
      //     if(response.status === 1)
      //     {
      //        this.customer = this.mapWMiCustomer2Customer(response.data); 
      //     }
      //     else
      //     {
      //       this.alertify.warning(response.msg);
      //     }
      //   }
      //   else
      //   {
      //     this.alertify.warning('Data not found');
      //   }


      // });
    }
    else if (this.source === "Tera") {
      let store = this.authService.storeSelected().storeId;
      this.message = "Loading Customer Information From CRM System. Please wait a minute.";
      this.startTimer();
      this.mwiService.getTeraCustomerList(name, phone, email).subscribe((response: any) => {
        // debugger;
        this.customers = [];
        this.message = "";
        this.pauseTimer();
        if (response !== null && response !== undefined) {
          if (response.success === true) {
            //  this.customer = response.data; 
            response.data.forEach(cus => {
              let customer = this.mapTeraCustomer2Customer(cus);
              console.log("cus", cus);
              console.log("cus", customer);
              this.customers.push(customer);
            });

          }
          else {
            //Msg  MsgVN
            if (response.message === null || response.message === undefined || response.message === '' || response.message === 'null') {
              this.alertify.warning('Unable Connect To CRM System');
            }
            else {
              this.alertify.warning(response.message);
            }

          }
        }
        else {
          this.alertify.warning('Data not found');

        }

      }, error => {
        debugger;
        this.message = ""
        this.pauseTimer();
        // this.alertifyService.warning('denomination ' + error);
        Swal.fire({
          icon: 'warning',
          title: "Unable Connect To CRM System",
          text: error
        });
      });
    }
    else {
      let store = this.authService.storeSelected();
      this.customerService.getByCompany(store.companyCode, phone).subscribe((response: any) => {
        // debugger;


        if (response.success) {
          console.log("2");
          this.customers = response.data;// this.mapCustomer2WMiCustomer(response) ;
        }
        else {
          this.alertify.warning(response.message);
          //Msg  MsgVN
          console.log('failed');
        }

      });

    }


  }
  intervalCus;
  pauseIntervalCus() {
    // console.log('pause interval cus');
    clearInterval(this.intervalCus);
  }

  selectCustomer(customer: any) {
    if (customer.status !== 'I') {
      if (this.customerMode === 'Link') {
        let basket = this.basketSerrvice.getCurrentBasket();
        if (basket !== null && basket !== undefined) {
          this.basketSerrvice.changeCustomer(customer, basket.salesType);
          // setInterval(flashText, 1000);
          this.intervalCus = setInterval(() => {
            basket = this.basketSerrvice.getCurrentBasket();
            let itemCount = basket?.items;
            if (itemCount === null || itemCount === undefined || itemCount?.length <= 0) {
              basket.isApplyPromotion = null;
            }
            // console.log('start interval cus');
            if (basket?.isApplyPromotion === null || basket?.isApplyPromotion === undefined || basket?.isApplyPromotion === true) {
              this.pauseIntervalCus();
              if (this.authService.getShopMode() === 'FnB') {
                this.routenav.navigate(["shop/order"]).then(() => {
                  // window.location.reload();
                });
              }
              if (this.authService.getShopMode() === 'Grocery') {
                this.routenav.navigate(["shop/order-grocery"]).then(() => {
                  // window.location.reload();
                });
              }
            }
          }, 500);

        }
        else {
          this.basketSerrvice.changeCustomer(customer);
          this.intervalCus = setInterval(() => {
            // console.log('start interval cus');
            basket = this.basketSerrvice.getCurrentBasket();
            let itemCount = basket?.items;
            // if (itemCount === null || itemCount === undefined || itemCount?.length <= 0) {             
            //   basket?.isApplyPromotion = null;
            // }
            if (basket?.isApplyPromotion === null || basket?.isApplyPromotion === undefined || basket?.isApplyPromotion === true) {
              this.pauseIntervalCus();
              // this.routenav.navigate(['/shop/order']);
              if (this.authService.getShopMode() === 'FnB') {
                this.routenav.navigate(["shop/order"]).then(() => {
                  // window.location.reload();
                });
              }
              if (this.authService.getShopMode() === 'Grocery') {
                this.routenav.navigate(["shop/order-grocery"]).then(() => {
                  // window.location.reload();
                });
              }
            }
          }, 150);
        }

      }
      else {
        if (this.loyalty === "true") {
          if (this.source === 'Local') {
            this.customerService.getItem(this.storeSelected.companyCode, customer.customerId).subscribe((response: any) => {

              if (response.success) {
                if (response.data !== null && response.data !== undefined) {
                  //  debugger;
                  customer = response.data;
                  setTimeout(() => {
                    this.outEvent.emit(customer);
                  }, 100);
                }
              }
              else {
                this.alertify.warning(response.message);
                //Msg  MsgVN
                console.log('failed');
              }

            })
          }
        }
        else {
          setTimeout(() => {
            this.outEvent.emit(customer);
          }, 100);
        }
      }
    }
    else {    
      this.alertify.warning(`${customer.customerName} is inactive !`);
    }
  }

  loadItems() {
    this.customerService.getItemPagedList().subscribe((res: PaginatedResult<MCustomer[]>) => {
      // loadItems
      debugger;
      console.log("1");
      this.customers = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      // this.alertify.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Customer',
        text: "Can't get Customer"
      });
    });
  }
}

export class DropView {
  id: string = '';
  name: string = '';
  query: string = '';
  event: string = '';
  models: any;
}