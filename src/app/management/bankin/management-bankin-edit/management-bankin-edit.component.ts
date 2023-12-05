import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TBankIn } from 'src/app/_models/bankin';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StorecurrencyService } from 'src/app/_services/data/storecurrency.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-bankin-edit',
  templateUrl: './management-bankin-edit.component.html',
  styleUrls: ['./management-bankin-edit.component.css']
})
export class ManagementBankinEditComponent implements OnInit {

  
  @Input() model: TBankIn; 
  functionId = "Adm_BankIn";
  @Input() isNew= false;
  editForm: FormGroup; 
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  companyOptions=[];   
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
  // storelist: MStore[]=[];
  // loadStore()
  // {
  //   this.storeService.getAll(this.authService.getCurrentInfor().companyCode ).subscribe((response: any)=>{
  //     if(response.success)
  //     {
  //       this.storelist= response.data;
  //       this.storelist.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName});
  //     }
  //     else
  //     {
  //       this.alertifyService.warning(response.message);
  //     }
      
  //   });
  // }
  constructor( private controlService: ControlService, private commonService: CommonService,  private storeService: StoreService, private storecurrencyService: StorecurrencyService,
     private authService: AuthService,  private alertifyService: AlertifyService, 
     private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  {
   
  }
  isShow = false;
  storeList: MStore[];
  loadStore()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeList= response.data;
         this.storeList.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName; });
        
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
     
    });
  }
  
  currencyList = [];
  storeChange(store)
  {
   
    if (store !== null && store !== undefined && store !== "") {
      this.storecurrencyService.getByStoreWExchangeRate(this.authService.getCurrentInfor().companyCode, store).subscribe((response: any) => {
        debugger;
        if (response.success) {
           
          this.currencyList = response.data;
          this.currencyList.map(x=>x.currencyName = x.currency + " - " + x.currencyName);
          // console.log(this.areaOptions);
          // this.loadProvince(this.model.areaCode);
        }
        else {
          this.alertifyService.error(response.message);
        }
      })
    }
    else {
      this.currencyList = [];
    }
  }
  defStoreId= "";
  defCurren= "";
  date: Date = new Date();
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) + ' 12:00:00';
  }
  datetimeValueChange(e)
  {
    const previousValue = e.previousValue;
    const newValue = e.value;
    let storeCurr = this.authService.storeSelected();
    let dateStr = this.GetDateFormat(newValue);
    this.commonService.getDailyId(storeCurr.companyCode, storeCurr.storeId, dateStr ).subscribe((response: any) =>{
      debugger;
      if(response.success)
      {
         this.model.dailyId = response.data;
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: "Get Daily Id",
           text:  response.message,
        })
        
      }
    }, error =>{
      Swal.fire({
        icon: 'error',
        title: "Get Daily Id",
         text:  error,
      })
    })
  }
  currencyChange(currency)
  {
    
    if(currency!==null &&  currency!==undefined &&  currency!== "")
    {
       let curre = this.currencyList.find(x=>x.currency === currency);
      //  if(curre!==null && curre!==undefined)
      //  {

      //  }
       this.model.rate = curre?.rate ?? 1;
    }
    else
    {
      this.model.rate = 1;
    }
  }
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }

  ngAfterViewInit() {
     setTimeout(() => {
       this.isShow = true;
       if(this.isNew)
       {
        this.model.storeId = this.defStoreId;
        this.model.currency = this.defCurren;
       }
     
       if(this.model.storeId!==null && this.model.storeId!==undefined && this.model.storeId!== "")
       {

         this.storeChange(this.model.storeId);
       }
       if(this.model.currency!==null && this.model.currency!==undefined && this.model.currency!== "")
       {

         this.currencyChange(this.model.currency);
       }
       
     }, 1000);
  }
  dateFormat="";
  formatStr = "#,##0.######";

  ngOnInit() {
     // debugger;
     this.defStoreId = this.authService.storeSelected().storeId;
     this.defCurren = this.authService.storeSelected().currencyCode;
     this.formatStr =   this.authService.formatNumberByPattern() ;
     if(this.model.docDate===null || this.model.docDate ===undefined  || this.model.docDate === "")
     {
       this.model.docDate = new Date();
     }
   
     this.loadStore();
     this.dateFormat = this.authService.loadFormat().dateFormat;
    // this.loadStore();
     this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
       if(response.data.length > 0)
       {
        // debugger;
        
     
        setTimeout(() => {
          // debugger;
          this.controlList= response.data.filter(x=>x.controlType !== 'Button');
          console.log(this.controlList);
          let group: any = {  };
          response.data.forEach(item=>{
            
            if(item.controlType ==="DateTime")
            {

              // invalidDate.setDate(today.getDate());
              let date = new Date(this.model[item.controlId]);
              this.model[item.controlId] = new Date(this.model[item.controlId]);
                // group[item.controlId] = [this.model[item.controlId] , ];
                group[item.controlId] = new FormControl({ value: date, disabled: false })
                //group["createdOn"] = new FormControl({ value: date, disabled: false })
                // this.model[item.controlId].setDate(this.model[item.controlId]);
                console.log(this.model[item.controlId]);
                
            }
            else{
              
                group[item.controlId] = [''];
              
            }
          });
      
        
          this.editForm = this.formBuilder.group(group);
          // if(this.model.createdBy === null || this.model.createdBy === "" || this.model.createdBy === undefined)
          // {
          //   this.isNew = true;
          // }
          if (this.controlList.length > 0) {
            this.controlList.forEach(item=>{
              item.isView= this.checkPermission(item.controlId,'V'),
              item.isEdit=  item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
              item.isInsert=  item?.readOnly ? false : this.checkPermission(item.controlId,'I')
            });
            console.log("controlList", this.controlList);
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
              } else if (key === "TextBox" ) {
                indexKey = 3;
              } else if (key === "DropDown") {
                indexKey = 4;
              }
              else if (key === "NumberBox") {
                indexKey = 5;
              }
              return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
            }).sort((a, b) => a.index > b.index ? 1 : -1);

            console.log("this.groupControlList", this.groupControlList);
          }

        }, 20);

       
        
       }
      });
    //  this.stores = this.model.stores;
   
  }
   
  update() { 
    debugger;
    
    // this.model.companyCode = "CP001";
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    // if(this.model.status=== null || this.model.status===undefined || this.model.status === "")
    //   this.model.status = this.statusOptions[0].value;
    // // this.model.stores = this.stores;
    // this.model.stores.forEach(item => {
    //   item.employeeId = this.model.employeeId;
    // });
    // this.function.status = this.statusSelect.value;
    // this.function.status= this.statusSelect.value;
    this.outModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }
}
