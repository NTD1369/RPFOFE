import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MArea } from 'src/app/_models/area';
import { MCountry } from 'src/app/_models/common/country';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StoregroupService } from 'src/app/_services/data/storegroup.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MRegion } from 'src/app/_models/region';
import { FormatconfigService } from 'src/app/_services/data/formatconfig.service';
import { StoreWareHouseViewModel } from 'src/app/_models/viewmodel/StoreWareHouseViewModel';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-management-store-edit',
  templateUrl: './management-store-edit.component.html',
  styleUrls: ['./management-store-edit.component.scss'],
  providers: [DatePipe]
})
export class ManagementStoreEditComponent implements OnInit, OnDestroy {

  @Input() model: MStore;
  functionId = "Adm_OUTLETSETUP";
  @Input() isNew = false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  countryOptions = [];
  areaOptions = [];
  provinceOptions = [];
  districtOptions = [];
  regionOptions = [];
  currencyOptions = [];
  formatOptions = [];
  whsOptions = [];
  defaultCustomerOptions = [];
  storeGroupOptions = [];
  storeTypeOptions = [];
  listTypeOptions = [];
  wardOptions = [];
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  
  controlList: any[];
  groupControlList: {};
  constructor(private elementRef: ElementRef, private storeService: StoreService, private formatConfig: FormatconfigService, private datePipe: DatePipe,
    private whsService: WarehouseService, private storeGroupService: StoregroupService
    , private commonService: CommonService, private controlService: ControlService,
    private authService: AuthService, private alertifyService: AlertifyService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private modalService: BsModalService) {
      debugger;
  }
  ngOnDestroy(): void {
    this.elementRef.nativeElement.remove();
  }
  getPayment()
  {
    this.router.navigate(["admin/masterdata/store-payment/", this.model.storeId]);
  }
  getCurrency()
  {
    this.router.navigate(["admin/masterdata/store-currency/",  this.model.storeId]);
  }
  getWhs()
  {
    this.router.navigate(["admin/masterdata/store-warehouse/",  this.model.storeId]);
  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  loadStoreGroup() {
    this.storeGroupService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if(response.success)
      {
        this.storeGroupOptions = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
     
      
    });
  }
  loadFormatConfig() {
    this.formatConfig.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      //
      if(response.success)
      {
        this.formatOptions= response.data;
        this.formatOptions.forEach(element => {
          element.formatId = element.formatId.toString();
        });
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
     
     
      // console.log( this.formatOptions);

    })
  }
  loadWhs() {
    this.whsService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.whsOptions = response.data;
        this.whsOptions.map((todo, i) => { todo.whsName = todo.whsCode + ' - ' + todo.whsName;
       
        });
        // console.log("this.whsOptions 1111",this.whsOptions);
        
      }
      else {
        this.alertifyService.error(response.message);
      }
    });

    // this.whsService.getAllByStoreWhs(this.authService.getCurrentInfor().companyCode, this.model.storeId).subscribe((response: any) => {
    //   if (response.success) {
    //     console.log("this.whsOptions",this.whsOptions);
    //     this.whsOptions.forEach(whs => {
    //       whs.whsName =  whs.whsCode + ' - ' + whs.whsName;
    //     });
    //   }
    //   else {
    //     this.alertifyService.error(response.message);
    //   }
    // });
  }
  loadCurrency() {
    this.commonService.getCurencyList().subscribe((response: any) => {

      if (response.success) {
        this.currencyOptions = response.data;
        // console.log(this.currencyOptions);
        this.currencyOptions.forEach(currency => {
          currency.CurrencyName =  currency.CurrencyCode + ' - ' + currency.CurrencyName;
        });
      }
      else {
        this.alertifyService.error(response.message);
      }
    })
  }
  loadListType() {

  }
  loadStoreType() {

  }
  loadCountry() {
    // debugger;
    this.commonService.getCountries("").subscribe((response: any) => {
      // debugger;
      if (response.success) {

        this.countryOptions = response.data;
        // console.log(this.countryOptions);
        if (this.isNew) {
          // this.countryOptions = [];
          this.districtOptions = [];
          this.provinceOptions = [];
          this.areaOptions = [];
          this.wardOptions = [];
        }
        else {
          if(this.model?.countryCode!==null && this.model?.countryCode!==undefined && this.model?.countryCode?.length > 0)
          {
            this.loadRegion(this.model?.countryCode)
          }
          if(this.model?.regionCode!==null && this.model?.regionCode!==undefined && this.model?.regionCode?.length > 0)
          {
            this.loadArea(this.model?.regionCode)
          }
          if(this.model?.areaCode!==null && this.model?.areaCode!==undefined && this.model?.areaCode?.length > 0)
          {
            this.loadProvince(this.model?.areaCode);
          }
          if(this.model?.provinceId!==null && this.model?.provinceId!==undefined && this.model?.provinceId?.length > 0)
          {
            this.loadDistrict(this.model?.provinceId);
          }
          if(this.model?.districtId!==null && this.model?.districtId!==undefined && this.model?.districtId?.length > 0)
          {
            this.loadWard(this.model?.districtId);
          }
         

        }
      }
      else {
        this.alertifyService.error(response.message);
      }
    })
  }
  loadRegion(country) {

    if (country !== null && country !== undefined && country !== "") {
      this.commonService.getRegionList().subscribe((response: any) => {

        if (response.success) {
          let list: MRegion[] = response.data;
          // console.log(list);
          // debugger;
          if (country !== null && country !== "") {
            // country = parseInt(country);
            list = list.filter(x => x.CountryCode === country);
          }
          this.regionOptions = list;
          // console.log(this.regionOptions);
          // this.loadProvince(this.model.areaCode);
        }
        else {
          this.alertifyService.error(response.message);
        }
      })
    }
    else {
      this.regionOptions = [];
    }

  }
  loadArea(region) {
    // debugger;
    if (region !== null && region !== undefined && region !== "") {
      this.commonService.getAreaList().subscribe((response: any) => {
        // debugger;
        if (response.success) {
          let list: MArea[] = response.data;
          // console.log(list);
          // debugger;
          if (region !== null && region !== "") {
            // region = parseInt(region);
            list = list.filter(x => x.RegionCode === region);
          }
          this.areaOptions = list;
          // console.log(this.areaOptions);
          // this.loadProvince(this.model.areaCode);
        }
        else {
          this.alertifyService.error(response.message);
        }
      })
    }
    else {
      this.areaOptions = [];
    }

  }
  areaChange(area) {
    // debugger;
    this.loadProvince(area.value);
  }

  regionChange(region) {
    // debugger;
    this.loadArea(region.value);
  }
  provinceChange(province) {
    this.loadDistrict(province.value);
  }
  districtChange(district) {
    this.loadWard(district.value);
  }
  loadProvince(areaCode) {

    if (areaCode !== "" && areaCode !== undefined && areaCode !== null) {
      let provinces = this.commonService.getProvinces();
      let provinceShow = provinces.filter(x => x.AreaCode === areaCode).map(x => ({ ProvinceId: x.ProvinceId, ProvinceName: x.ProvinceName }));
      debugger;
      const key = 'ProvinceId';
      const arrayUniqueByKey = [...new Map(provinceShow.map(item =>
        [item[key], item])).values()];
      this.provinceOptions = arrayUniqueByKey;
      // this.loadDistrict(this.model.provinceId);
      // console.log(this.provinceOptions);
    }
    else {
      this.provinceOptions = [];
    }
  }
  loadDistrict(provinceId) {
    if (provinceId !== "" && provinceId !== undefined && provinceId !== null) {
      let provinces = this.commonService.getProvinces();
      let provinceShow = provinces.filter(x => x.ProvinceId === provinceId).map(x => ({ DistrictId: x.DistrictId, DistrictName: x.DistrictName }));
      const key = 'DistrictId';
      const arrayUniqueByKey = [...new Map(provinceShow.map(item =>
        [item[key], item])).values()];
      this.districtOptions = arrayUniqueByKey;
      // this.loadDistrict(this.model.districtId);
      // console.log(this.districtOptions);
    }
    else {
      this.districtOptions = [];
    }
  }
  loadWard(districtId) {
    if (districtId !== "" && districtId !== undefined && districtId !== null) {
      let provinces = this.commonService.getProvinces();
      let provinceShow = provinces.filter(x => x.DistrictId === districtId).map(x => ({ WardId: x.WardId, WardName: x.WardName }));
      const key = 'WardId';
      const arrayUniqueByKey = [...new Map(provinceShow.map(item =>
        [item[key], item])).values()];
      this.wardOptions = arrayUniqueByKey;
      // console.log(this.wardOptions);
    }
    else {
      this.wardOptions = [];
    }
  }
  parseDate(str): Date {

    return new Date(str);
  }
  countryChange(country) {
    //  debugger;
    console.log('Country change');
    this.loadRegion(country.value);
  }



  ngOnInit() {
    debugger;
    if(this.model!==null && this.model!==undefined)
    {
      
      // if(this.model.countryCode!==null && this.model.countryCode!==undefined  && this.model.countryCode!== '')
      // {
       
      // }
      this.loadCountry();
      // console.log(this.isNew);
      this.loadStoreGroup();
      this.loadCurrency();
      this.loadWhs();
      this.loadFormatConfig();
      //   this.loadStoreType();
      //   this.loadListType();
  
      //  this.loadProvince();

      setTimeout(() => {
        this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
          if (response.data.length > 0) {
            // debugger;
            this.controlList = response.data.filter(x => x.controlType !== 'Button');
            // console.log(this.controlList);
            let group: any = {};
            response.data.forEach(item => {
    
              if (item.controlType === "DateTime" || item.controlType === "Date" || item.controlType === "Time") {
    
                // invalidDate.setDate(today.getDate());
                let date = new Date(this.model[item.controlId]);
                this.model[item.controlId] = new Date(this.model[item.controlId]);
                // group[item.controlId] = [this.model[item.controlId] , ];
                group[item.controlId] = new FormControl({ value: date, disabled: false })
                //group["createdOn"] = new FormControl({ value: date, disabled: false })
                // this.model[item.controlId].setDate(this.model[item.controlId]);
                // console.log(this.model[item.controlId]);
    
              }
              else {
    
                group[item.controlId] = [''];
    
              }
            });
          
    
            this.editForm = this.formBuilder.group(group);
            // if (this.model.whsCode === null || this.model.whsCode === "" || this.model.whsCode === undefined) {
            //   this.isNew = true;
            //   this.model.createdOn = new Date();
            //   this.model.modifiedOn = null;
            // }
    
            if (this.controlList.length > 0) {
              this.controlList.forEach(item=>{
                item.isView= this.checkPermission(item.controlId,'V'),
                item.isEdit=  item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
                item.isInsert=  item?.readOnly ? false : this.checkPermission(item.controlId,'I')
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
                  isView:item.isView,
                  isEdit:item.isEdit,
                  isInsert:item.isInsert,
                });
                return obj;
              }, {});
              this.groupControlList = Object.keys(groups).map(function (key) {
                let indexKey = 0;
                if (key === "CheckBox") {
                  indexKey = 6;
                } else if (key === "DateTime" || key === "Date" ||  key === "Time" ) {
                  indexKey = 2;
                } else if (key === "TextBox") {
                  indexKey = 3;
                } else if (key === "DropDown") {
                  indexKey = 4;
                }
                else if (key === "NumberBox") {
                  indexKey = 5;
                }
                return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
              }).sort((a, b) => a.index > b.index ? 1 : -1);
    
              // console.log("this.groupControlList", this.groupControlList);
            }
          }
        });
      }, 500);

    
    }
    else
    {

    }
   


  }

  update() {
    debugger;

    // this.model.companyCode = "CP001";
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    if (this.model.status === null || this.model.status === undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;

    // this.function.status = this.statusSelect.value;
    // this.function.status= this.statusSelect.value;
    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }
  myInputVariable: ElementRef;
  modalRef: BsModalRef; 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      animated: true,
      backdrop: 'static',
    });
  }
}
