import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MExchangeRate } from 'src/app/_models/exchangerate';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CurrencyService } from 'src/app/_services/data/currency.service';
import { ExchangerateService } from 'src/app/_services/data/exchangerate.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StorecurrencyService } from 'src/app/_services/data/storecurrency.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { status } from 'src/environments/environment';
@Component({
  selector: 'app-management-exchange-rate-edit',
  templateUrl: './management-exchange-rate-edit.component.html',
  styleUrls: ['./management-exchange-rate-edit.component.scss']
})
export class ManagementExchangeRateEditComponent implements OnInit {



  constructor(private exchangerateService: ExchangerateService, private controlService: ControlService,  private storeService: StoreService, 
    public authService: AuthService, private alertifyService: AlertifyService,  private storecurrencyService: StorecurrencyService, 
    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {

  }

  @Input() model: MExchangeRate;
  functionId = "Adm_ExchangeRate";

  @Input() isNew: false;

  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  companyOptions = [];
  currencyOptions = [];
  storeOptions = [];
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  controlList: any[];
  groupControlList = {};
  storeChange(store) {
    console.log("country change");
    //  debugger;
    this.loadCurrency(store.value);
  }
  exchangeRateList: MExchangeRate[]=[];
  remove(e)
  {
    debugger;
    let model = e.data;
    
    // this.store= this.getStoreModel(this.storeSelected);
    // model.storeId = this.storeSelected;
    this.exchangerateService.delete(model).subscribe((response: any)=>{
      if(response.success)
      {
          this.alertifyService.success("Delete completed successfully");
      }
      else{
        this.alertifyService.warning("Delete failed: " + response.message);
      }
   });
  }
  mode:string="";
  status = status.active;
  dateFormat = "";
  fromDate: Date;
  toDate: Date;
  save(e) {
    debugger; 
    let model = e.changes[0].data;
    model.storeId = this.model.storeId;
    model.companyCode = this.model.companyCode;
    model.currency = this.model.currency;
    if(this.mode==='E')
    {
      let check =  this.authService.checkRole(this.functionId , '', 'E' );
      if(check===true)
      {
        this.exchangerateService.update(model).subscribe((response: any)=>{
          if(response.success)
          {
              this.alertifyService.success("update completed successfully");
          }
          else{
            this.alertifyService.warning("update failed: " + response.message);
          }
       });
      }
      else
      {
        this.alertifyService.success("Permission denied");
      }
       
    }
    else
    {
      let check =  this.authService.checkRole(this.functionId , '', 'I' );
      if(check===true)
      {
        this.exchangerateService.create(model).subscribe((response: any)=>{
          debugger;
          if(response.success)
          {
              this.alertifyService.success("insert completed successfully");
          }
          else{
            this.alertifyService.warning("insert failed: " + response.message);
          }
      });
      }
      else
      {
        this.alertifyService.success("Permission denied.");
      }
    }
    // this.events.unshift(eventName);
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  loadExchangeRate(from, to)
  {
    let store  = "";
    let currency = "";
    let fromvl= null;  let tovl= null;
    if(from===null||from===undefined)
    {
      from=null;
    }
    if(to===null||to===undefined)
    {
      to=null;
    }
    if(from!=null)
    {
      fromvl=this.GetDateFormat(from);
    }
    if(to!=null)
    {
      tovl= this.GetDateFormat(to);
    }
    this.exchangerateService.getAll(this.authService.getCurrentInfor().companyCode,  this.model.storeId, this.model.currency, fromvl, tovl).subscribe((response: any)=>{
      if(response.success)
      {
        this.exchangeRateList = response.data;
        // console.log('currency' , this.currencyOptions)
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  loadCurrency(store)
  {
    this.storecurrencyService.getAll(this.authService.getCurrentInfor().companyCode,  store).subscribe((response: any)=>{
      if(response.success)
      {
        this.currencyOptions = response.data;
        console.log('currency' , this.currencyOptions)
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  loadStore()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      
      if(response.success)
      {
          this.storeOptions = response.data;
      }
    
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  checkPermission(controlId: string, permission: string): boolean {
    return this.authService.checkRole(this.functionId, controlId, permission);
  }

  ngOnInit() {
    // 
    if(this.model.storeId!==null && this.model.storeId!==undefined)
    {
      this.loadCurrency(this.model.storeId);
    }
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.loadStore();
    this.loadExchangeRate(null, null);
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        console.log(this.controlList);
        let group: any = {};
        response.data.forEach(item => {
          if (item.controlType === "DateTime") {
            if (this.model[item.controlId] === null || this.model[item.controlId] === undefined) {
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: null, disabled: false })
            }
            else {
              // invalidDate.setDate(today.getDate());
              let date = new Date(this.model[item.controlId]);
              this.model[item.controlId] = new Date(this.model[item.controlId]);
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: date, disabled: false })
            }
          }
          else {
            group[item.controlId] = [''];
          }
        });
        // debugger;

        this.editForm = this.formBuilder.group(group);

        if (this.controlList.length > 0) {
          console.log("controlList", this.controlList);
          this.controlList.forEach(item=>{
            item.isView=this.checkPermission(item.controlId,'V'),
            item.isEdit= item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
            item.isInsert= item?.readOnly ? false : this.checkPermission(item.controlId,'I')
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
            } else if (key === "DateTime" || key === "Date" || key === "Time") {
              indexKey = 2;
            } else if (key === "TextBox") {
              indexKey = 3;
            } else if (key === "DropDown") {
              indexKey = 4;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);

          console.log("this.groupControlList", this.groupControlList);
        }
      }
    });
    console.log(this.model);
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const lastDay =  new Date(year, month +1, 0).getDate();

    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
  }
  view(from, to)
  {
    this.loadExchangeRate(from, to);
  }
  update() {
    // debugger;
    if (this.model.status === null || this.model.status === undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;

    // this.function.status = this.statusSelect.value;
    // this.function.status= this.statusSelect.value;
    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }

}
