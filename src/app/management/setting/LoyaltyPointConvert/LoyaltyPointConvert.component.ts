import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GeneralSettingStore, SGeneralSetting } from 'src/app/_models/generalsetting';
import { SLoyaltyPointConvert } from 'src/app/_models/sloyaltyPointConvert';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { GeneralsettingService } from 'src/app/_services/data/generalsetting.service';
import { LoyaltyPointConvertService } from 'src/app/_services/data/LoyaltyPointConvert.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-LoyaltyPointConvert',
  templateUrl: './LoyaltyPointConvert.component.html',
  styleUrls: ['./LoyaltyPointConvert.component.scss']
})
export class ManagementLoyaltyPointConvertComponent implements OnInit {
  functionId = "Adm_LoyaltyPointConvert";
  model: SLoyaltyPointConvert;
  userParams: any = {};
  isNew:boolean = false;
  constructor(private generalsettingService: GeneralsettingService, private alertify: AlertifyService, private router: Router, 
    private authService: AuthService,  private commingService: CommonService,private loyaltyPointConvertService:LoyaltyPointConvertService,
    private controlService: ControlService, private formBuilder: FormBuilder ,private alertifyService: AlertifyService) { }
  
  ngOnInit() {
    // this.route
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    
    // this.loadItems();
    // debugger;
    this.loadPOSOption();
    this.loadGeneralSetting('');
    
  }
  controlList: any[];
  groupControlList: {};
  editForm: FormGroup;
  POSOption: any[] = [];
  loadPOSOption()
  {
     this.commingService.getPOSOption("").subscribe((response: any)=>{
       if(response.success)
       {
         debugger;
        this.POSOption = response.data;

       }
       else
       {
        this.alertify.warning(response.message);
       }
      
     })
  }
  
  dataSource: GeneralSettingStore[]= [];
  currentStore: GeneralSettingStore;
  loadGeneralSetting(storeId)
  {
    this.generalsettingService.GetGeneralSettingByStore(this.authService.getCurrentInfor().companyCode,'').subscribe((response: any)=>{
      debugger;
      if(response.success)
      {
        if(storeId===null || storeId===undefined || storeId==='')
        { 
          this.currentStore = this.dataSource[0];
          this.dataSource = response.data;
        }     
        // this.items = this.currentStore.generalSettings;
      }
      else
      {
        this.alertify.warning(response.message);
      }
    })
  }
  loaddata(storeId) {
    this.loyaltyPointConvertService.getByStore(this.authService.getCurrentInfor().companyCode,storeId).subscribe((response: any) => {
      debugger;
      if (response.success) {
        if(response.data.length >0)
        this.model = response.data[0];
      }
      else {
        this.alertifyService.warning(response.message);
      }


    });
  }
  update()
  {
    // debugger;
    this.model.companyCode = this.currentStore.companyCode;
    this.model.storeId = this.currentStore.storeId;
    this.model.createdBy = this.authService.getCurrentInfor().username;
    this.model.createdOn = null;
    this.model.modifiedBy = this.authService.getCurrentInfor().username;
    this.model.modifiedOn = null;
    this.loyaltyPointConvertService.createUpdate(this.model).subscribe((response: any)=>{
      if(response.success)
      {
        this.alertify.success("Update successfully completed.");

      }
      else
      {
       this.alertify.warning(response.message);
      }
    })
  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  listSelectionChanged = (e) => {
   
    if(e.addedItems.length > 0)
    {
      this.model = new SLoyaltyPointConvert();
      this.currentStore = e.addedItems[0];
      this.loaddata(this.currentStore.storeId);
      this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
        if (response.data.length > 0) {
          // debugger;
          this.controlList = response.data.filter(x => x.controlType !== 'Button');
          // console.log(this.controlList);
          let group: any = {};
          response.data.forEach(item => {
  
            if (item.controlType === "DateTime") {
              debugger;
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
          // if(this.model.createdBy === null || this.model.createdBy === "" || this.model.createdBy === undefined)
          // {
          //   this.isNew = true;
          // }
  
          if (this.controlList.length > 0) {
            
            this.controlList.forEach(item=>{
              // debugger;
              item.isView=this.checkPermission(item.controlId,'V');
              item.isEdit=this.checkPermission(item.controlId,'E');
              item.isInsert=this.checkPermission(item.controlId,'I');
              if(item.controlType ==="TextBox")
              item.type = this.checkType(item.controlId)
            });
            // console.log("controlList", this.controlList);
            var groups = this.controlList.filter(x => x.status === 'A').reduce(function (obj, item) {
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
                type:item.type,
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
            // this.groupControlList.arrayGroup.forEach(item => {
            //   item.isView=this.checkPermission(item.controlId,'V'),
            //   item.isEdit=this.checkPermission(item.controlId,'E'),
            //   item.isInsert=this.checkPermission(item.controlId,'I')
            // });
            console.log("this.groupControlList", this.groupControlList);
          }
  
  
        }
      });
    }
    
  };
  checkType(controlId){
    return typeof(this.model[controlId]);
  }
}
