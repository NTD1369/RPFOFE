import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { SGeneralSetting } from 'src/app/_models/generalsetting';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service'; 
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-general-setting-edit',
  templateUrl: './management-general-setting-edit.component.html',
  styleUrls: ['./management-general-setting-edit.component.scss']
})
export class ManagementGeneralSettingEditComponent implements OnInit {


  
  @Input() model: SGeneralSetting;
  functionId = "Adm_GeneralSetting";
  @Input() isNew= false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  whsTypeOptions=[];
  storeOptions=[];
  settingOption=[];
  posOptions=[];
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  
  valueOptions=[];
  controlList: any[];
  loadStore()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeOptions = response.data;
        this.storeOptions.forEach(element => {
          element.storeName = element.storeId + ' - ' + element.storeName;
        });
        console.log("store" + this.storeOptions);
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
     
    });
  }
  paymentOptions: any[];
  paymentMethod()
  {
    
     
    this.paymentService.getAll(this.authService.storeSelected().companyCode).subscribe((response: any) =>{
      if(response.success)
      {
        this.paymentOptions = response.data;//.filter(x=>x.status=== "A"); 
        this.paymentOptions.map((todo, i) => { 
          todo.paymentDesc = todo.paymentCode + ' - ' + todo.paymentDesc;
          todo.shortName = todo.paymentCode + ' - ' + todo.shortName;
       });
        console.log('this.paymentOptions' );
        console.log(this.paymentOptions);
      }
      else
      {

      }
     
    });
   

      // this.storePaymentService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '').subscribe((response: any) =>{
      //   if(response.success)
      //   {
      //     this.paymentOptions = response.data;//.filter(x=>x.status=== "A"); 
      //     this.paymentOptions.map((todo, i) => { 
      //       todo.paymentDesc = todo.paymentCode + ' - ' + todo.paymentDesc;
      //       todo.shortName = todo.paymentCode + ' - ' + todo.shortName;
      //    });
      //     console.log('this.paymentOptions' );
      //     console.log(this.paymentOptions);
      //   }
      //   else
      //   {

      //   }
       
      // });
  }
  loadValueMethod()
  {
    this.paymentOptions  = [];
    this.paymentOptions.push({
      paymentCode: "Auto",
      paymentDesc: "Auto",
      shortName: "Auto"
    });
    this.paymentOptions.push({
      paymentCode: "Manual",
      paymentDesc: "Manual",
      shortName: "Manual"
    });
  }
  loadSettingOption()
  {
    this.commonService.getPOSType().subscribe((response: any)=>{
      // response.data;
      debugger;
      response.data.forEach(element => {
        this.posOptions.push({name: element.Type, value: element.Type});
      });
      let findOption = this.posOptions.find(x=>x.value === this.model.settingId );
      if(findOption=== null || findOption=== undefined)
      {
        this.posOptions.push({name: this.model.settingId, value: this.model.settingId});
      }
      
      console.log("posOptions");
      console.log(this.posOptions);
    });
  }
  settingChange(setting) {
    debugger;
    // this.commonService.getPOSOption(setting.value);
    this.commonService.getPOSOption(setting.value).subscribe((response: any)=>{
      if(response.success)
      {
        this.valueOptions=response.data; 
         
        // console.log(this.valueOptions);
      }
      else
      {
         this.alertifyService.warning(response.message);
      }
       
    })
  }
  constructor( private storeService: StoreService,  private paymentService: PaymentmethodService , private storePaymentService: StorePaymentService ,  private authService: AuthService, private commonService: CommonService,
    private controlService: ControlService, private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }
  ngOnInit() {
     console.log('model', this.model);
    this.loadStore();
    this.loadSettingOption();
  
    if(this.model.settingId === "OMSInputMode")
    {
      this.paymentMethod();
    }
    if(this.model.settingId === "PaymentMode")
    {
      this.loadValueMethod();
    }
    if(this.model.settingId === "CustomerYearOld")
    {
      this.valueOptions=[];
      for (let index = 1; index <= 100; index++) {
        this.valueOptions.push(
          {
            Code: index.toString(), Name: index.toString(),
          } 
        );
        
      }
    }
    else
    {
      
      this.commonService.getPOSOption(this.model.settingId).subscribe((response: any)=>{
        if(response.success)
        {
          this.valueOptions=response.data; 
          console.log(this.valueOptions);
        }
        else
        {
           this.alertifyService.warning(response.message);
        }
         
      })
    }
    
     
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
      if(response.data.length > 0)
      { 
       if(this.model.settingId !== "OMSInputMode" && this.model.settingId !== "PaymentMode")
       {
         let cus1 = response.data.find(x=>x.controlId === "customField1");
         if(cus1!==null && cus1!==undefined)
         {
          cus1.controlType = "TextBox";
          cus1.require = false;
         }
       }
       if(this.model.valueType !== "DropDown")
       {
          let cus1 = response.data.find(x=>x.controlId === "settingValue");
          if(cus1!==null && cus1!==undefined)
          {
            cus1.controlType = this.model.valueType ;//"TextBox";
            cus1.require = true;
          }
       }
       this.controlList= response.data.filter(x=>x.controlType !== 'Button');
      //  console.log(this.controlList);
        let group: any = {  };
        response.data.forEach(item=>{
          debugger;
          if(item.controlType ==="DateTime" || item.controlType ==="Date" || item.controlType ==="Time")
          {
            if(item.controlType ==="Time")
            { 
              // this.updateSettingModel[item.settingId]
              let date = new Date();
              
              let timeValue = this.model[item.controlId];
              let hour = timeValue.split(':')[0];
              let min = timeValue.split(':')[1];
              let second = timeValue.split(':')[2];
              date.setHours(hour);
              date.setMinutes(min);
              date.setSeconds(second); 
              this.model[item.controlId] = date; 
              group[item.controlId] = new FormControl({ value: date, disabled: false }) 
              
            }
            else
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
         
             
          }
          else{
            if(item.controlType ==="CheckBox")
            { 
              debugger;
              let itemValue = this.model[item.controlId];
              if(itemValue==="true" || itemValue==="1")
              {
                group[item.controlId] = true;
              }
              else
              {
                group[item.controlId] = false;
              } 
              this.model[item.controlId] = group[item.controlId];
            }
            else
            {
              group[item.controlId] = [''];

            }
           
          }
        });
      debugger;
     
       this.editForm = this.formBuilder.group(group);
      //  if(this.model.uomC === null || this.model.whsCode === "" || this.model.whsCode === undefined)
      //  {
      //    this.isNew = true;
      //    this.model.createdOn = new Date();
      //    this.model.modifiedOn = null;
      //  }
      }
     });
    
    
  }
   
  update() { 
    debugger;
    // this.model.companyCode = "CP001";
    // this.model.createdBy = this.authService.decodeToken?.unique_name;
    if(this.model.status=== null || this.model.status===undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;
    if(this.model.valueType === "Time")
    {
      debugger;
      var date = new Date(this.model.settingValue); 
      this.model.settingValue = moment(date).local().format('YYYY-MM-DD HH:mm:ss');
    }
    else
    {
      this.model.settingValue = this.model.settingValue.toString();
    }
    this.outModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }

}
