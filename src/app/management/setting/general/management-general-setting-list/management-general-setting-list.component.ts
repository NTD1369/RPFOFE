import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThumbnailsMode } from 'ng-gallery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralSettingStore, SGeneralSetting } from 'src/app/_models/generalsetting';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { GeneralsettingService } from 'src/app/_services/data/generalsetting.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-management-general-setting-list',
  templateUrl: './management-general-setting-list.component.html',
  styleUrls: ['./management-general-setting-list.component.scss']
})
export class ManagementGeneralSettingListComponent implements OnInit {

  functionId = "Adm_GeneralSetting";
  items: SGeneralSetting[]; 
  userParams: any = {};
  isNew:boolean = false;
  constructor(private generalsettingService: GeneralsettingService, private alertify: AlertifyService, private router: Router, 
    private authService: AuthService,  private commingService: CommonService,
    private modalService: BsModalService,  private formBuilder: FormBuilder,private route: ActivatedRoute) { }
  
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
  displayMode = "form";
  async changeDisplayMode() {
    
    if (this.displayMode === "form") {
      this.displayMode = "list";
       
    }
    else {
      this.displayMode = "form";
      
    } 
     
  }
 

  update()
  {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        console.log(this.updateSettingModel);
        debugger;
        this.currentStore.generalSettings.forEach(setting => {
          setting.modifiedBy = this.authService.getCurrentInfor().username;
          setting.storeId = this.currentStore.storeId;
          setting.settingValue = this.updateSettingModel[setting.settingId].toString();
          if(setting.valueType === "Time")
          {
            debugger;
            var date = new Date(setting.settingValue); 
            setting.settingValue = moment(date).local().format('YYYY-MM-DD HH:mm:ss');
          }
        });
        debugger;
        this.generalsettingService.updateGeneralSettingList(this.currentStore.generalSettings).subscribe((response: any)=>{
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
    })
    
  }
  listSelectionChanged = (e) => {
   
    if(e.addedItems.length > 0)
    {
      this.currentStore = e.addedItems[0];
      this.generalsettingService.GetGeneralSettingByStore(this.currentStore.companyCode, this.currentStore.storeId).subscribe((response: any)=>{
        // debugger;
        if(response.success)
        {
          
          this.items = response.data[0].generalSettings as SGeneralSetting[];
          this.currentStore.generalSettings = this.items;
          this.controlList= this.items.filter(x=>x.valueType !== 'Button');
            // console.log(this.controlList);
              let group: any = {  };
              this.updateSettingModel ={};
              this.controlList.forEach((item: SGeneralSetting)=>{
                // debugger;
                this.updateSettingModel[item.settingId] = item.settingValue;
                
                if(item.valueType===null || item.valueType ===undefined || item.valueType === '')
                {
                  item.valueType = 'TextBox';
                }
                if(item.valueType ==="DateTime" || item.valueType ==="Date"  || item.valueType ==="Time" )
                { 
                  debugger;
                  if(item.valueType ==="Time")
                  { 
                    // this.updateSettingModel[item.settingId]
                    let date = new Date();
                    let timeValue = this.updateSettingModel[item.settingId];
                    let hour = timeValue.split(':')[0];
                    let min = timeValue.split(':')[1];
                    let second = timeValue.split(':')[2];
                    date.setHours(hour);
                    date.setMinutes(min);
                    date.setSeconds(second);
                    // this.updateSettingModel[item.settingId]
                    this.updateSettingModel[item.settingId] = date; 
                    group[item.settingId] = new FormControl({ value: date, disabled: false }) 
                    
                  }
                  else
                  {
                    let date = new Date(this.updateSettingModel[item.settingId]);
                    this.updateSettingModel[item.settingId] = new Date(this.updateSettingModel[item.settingId]); 
                    group[item.settingId] = new FormControl({ value: date, disabled: false })  
                  }
                
                }
                else{
                  if(item.valueType ==="CheckBox")
                  { 
                    if(item.settingValue==="true" || item.settingValue==="1")
                    {
                      group[item.settingId] = true;
                    }
                    else
                    {
                      group[item.settingId] = false;
                    } 
                    this.updateSettingModel[item.settingId] = group[item.settingId];
                  }
                  else
                  {
                    if(item.valueType === "DropDown")
                    {
                      item.options = this.POSOption.filter(x=>x.Type === item.settingId);
                      group[item.settingId] = ['']; 
                    }
                    else
                    {
                      group[item.settingId] = ['']; 
                    }
                    
                  }
                
                }
              });
            debugger;
           console.log(this.updateSettingModel);
            this.editForm = this.formBuilder.group(group);
            console.log('group', group);
            if (this.controlList.length > 0) {
              console.log("controlList", this.controlList);
              var groups = this.controlList.reduce(function (obj, item) {
    //             settingId: string;
    // companyCode: string;
    // settingName: string;
    // settingValue: string;
    // settingDescription: string;
    // valueType: string;
 
    // storeId: string;
    // tokenExpired: number | null;
    // defaultValue: string;
    // customField1: string;
    // customField2: string;
    // customField3: string;
    // customField4: string;
    // customField5: string;
    // options: any[] = [];
                obj[item.valueType] = obj[item.valueType] || [];

                obj[item.valueType].push({
                  settingId: item.settingId,
                  companyCode: item.companyCode,
                  settingName: item.settingName,
                  settingValue: item.settingValue,
                  settingDescription: item.settingDescription,
                  valueType: item.valueType,
                  createdBy: item.createdBy,
                  createdOn: item.createdOn,
                  modifiedBy: item.modifiedBy,
                  modifiedOn: item.modifiedOn,
                  storeId: item.storeId,
                  tokenExpired: item.tokenExpired,
                  defaultValue: item.defaultValue,
                  customField1: item.customField1,
                  customField2: item.customField2,
                  customField3: item.customField3,
                  customField4: item.customField4,
                  customField5: item.customField5,
                  options: item.options,
                });
                return obj;
              }, {});
              this.groupControlList = Object.keys(groups).map(function (key) {
                let indexKey = 0;
                if (key === "CheckBox" || key === "NumberBox") {
                  indexKey = 6;
                } else if (key === "DateTime") {
                  indexKey = 2;
                } else if (key === "TextBox") {
                  indexKey = 1;
                } else if (key === "DropDown") {
                  indexKey = 4;
                }
                else if (key === "Time") {
                  indexKey = 3;
                }
                else if (key === "Date") {
                  indexKey = 5;
                }
                return { valueType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
              }).sort((a, b) => a.index > b.index ? 1 : -1);

              console.log("this.groupControlList", this.groupControlList);
            }

        }
        else
        {
          this.alertify.warning(response.message);
        }
      })
     
    }
    
  };
  dataSource: GeneralSettingStore[]= [];
  currentStore: GeneralSettingStore;
  loadGeneralSetting(storeId)
  {
    this.generalsettingService.GetGeneralSettingByStore(this.authService.getCurrentInfor().companyCode,storeId).subscribe((response: any)=>{
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
   
   
  modalRef: BsModalRef;
  model: SGeneralSetting;
  updateSettingModel: any;
  openModal(isNew: boolean, model: SGeneralSetting, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    // var modelClone = Object.assign({}, model);
    let loaded = false;
    if(isNew)
    {
      this.model = new SGeneralSetting();
      this.model.companyCode = this.authService.storeSelected().companyCode;
      loaded = true;
      if(loaded)
      {
        this.model.storeId = this.currentStore.storeId;
        setTimeout(() => {
          this.modalRef = this.modalService.show(template, {
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title', 
            class: 'modal-dialog modal-dialog-centered modal-sm'
          });
        });
      }
    }
    else
    {
      // this.model = modelClone;
      this.generalsettingService.getItem(model.companyCode, model.storeId, model.settingId).subscribe((respone: any) =>
      {
        loaded = true;
        if(respone.success)
        {
          debugger;
          if(respone.data===null || respone.data === undefined)
          {
            Swal.fire('General Setting', 'Data not found', 'error'); 
          }
          else
          {
            this.model = respone.data;
            if(loaded)
            {
              this.model.storeId = this.currentStore.storeId;
              setTimeout(() => {
                this.modalRef = this.modalService.show(template, {
                  ariaDescribedby: 'my-modal-description',
                  ariaLabelledBy: 'my-modal-title', 
                  class: 'modal-dialog modal-dialog-centered modal-sm'
                });
              });
            }
          }
         
        }
        else
        {
           this.alertify.warning(respone.message);
        }
      })
     
    }
    
    
 
  }
  
  updateModel(model) {
    debugger; 
    if(this.isNew)
    {
      this.model.createdBy = this.authService.getCurrentInfor().username;
      this.generalsettingService.create(model).subscribe((response: any) => {
        if(response.success)
        {
          this.alertify.success('Create completed successfully'); 
          this.loadGeneralSetting(this.currentStore.storeId);
          this.modalRef.hide();
        }
        else{
          this.alertify.error(response.message);
        } 
      }, error => {
        this.alertify.error(error);
      });
    }
    else{
      this.model.modifiedBy = this.authService.getCurrentInfor().username;
      this.generalsettingService.update(model).subscribe((response: any) => {
        if(response.success)
        {
          // this.model = model;
          this.loadGeneralSetting(this.currentStore.storeId);
          this.alertify.success('Update completed successfully.'); 
          this.modalRef.hide();
        }
        else{
          this.alertify.error(response.message);
        }
       
      }, error => {
        this.alertify.error(error);
      });
    }
   
  }
   
  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift( {
            location: 'before',
            widget: 'dxButton',
            options: {
                width: 136, 
                icon:"add", type:"default", text:"Add",
                onClick: this.openModal.bind(this, true, null, this.template)
            } 
        });
  }

}
