import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SVersion } from 'src/app/_models/system/version';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-version-edit',
  templateUrl: './management-version-edit.component.html',
  styleUrls: ['./management-version-edit.component.scss']
})
export class ManagementVersionEditComponent implements OnInit {
 
  @Input() model: SVersion; 
  @Input() modalRef;
  functionId = "Adm_Version";
  marked = false;
  @Input() isNew= false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])

  theCheckbox = false;
  companyOptions=[];   
  groupControlList = {};
  
 statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  controlList: any[];
  constructor( private controlService: ControlService,  
     private authService: AuthService,  private alertifyService: AlertifyService, 
     private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  {
   
  }
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
  
  canEdit=false;
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
 
  ngOnInit() {
     // debugger;
     this.canEdit= this.checkPermission('','E'); 
     this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
       if(response.data.length > 0)
       {
        // debugger;
        this.controlList= response.data.filter(x=>x.controlType !== 'Button');
        console.log(this.controlList);
         let group: any = {  };
         response.data.forEach(item=>{
          
           if(item.controlType ==="DateTime")
           {
             debugger;
              if(this.model[item.controlId]===null || this.model[item.controlId]===undefined)
              {
                
                
                  // group[item.controlId] = [this.model[item.controlId] , ];
                  group[item.controlId] = new FormControl({ value: null, disabled: false })
                 
              }
              else
              {
                   // invalidDate.setDate(today.getDate());
                  let date = new Date(this.model[item.controlId]);
                  this.model[item.controlId] = new Date(this.model[item.controlId]);
                    // group[item.controlId] = [this.model[item.controlId] , ];
                    group[item.controlId] = new FormControl({ value: date, disabled: false })
                   
              }
           
              
           }
           else{
             
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
            item.isView=this.checkPermission(item.controlId,'V'),
            item.isEdit= item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
            item.isInsert= item?.readOnly ? false : this.checkPermission(item.controlId,'I')
          });

          console.log("controlList",this.controlList);
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
              isInsert:item.isInsert
            });
            return obj;
          }, {});
          this.groupControlList = Object.keys(groups).map(function (key) {
            let indexKey = 0;
            if(key === "CheckBox"){
              indexKey = 1;
            }else if(key === "DateTime"){
              indexKey = 2;
            }else if(key === "TextBox"){
              indexKey = 3;
            }else if(key === "DropDown"){
              indexKey = 4;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len : groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);

          console.log("this.groupControlList", this.groupControlList);
        }


       }
      });
     
   
  }
   
  update() { 
    
    this.outModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }
}
