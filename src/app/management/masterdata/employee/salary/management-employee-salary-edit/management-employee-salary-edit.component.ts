import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MEmployeeSalary } from 'src/app/_models/salestarget';
import { DropView } from 'src/app/_models/viewmodel/DropView';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { EmployeeSalaryService } from 'src/app/_services/data/employee-salary.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-employee-salary-edit',
  templateUrl: './management-employee-salary-edit.component.html',
  styleUrls: ['./management-employee-salary-edit.component.scss']
})
export class ManagementEmployeeSalaryEditComponent implements OnInit {


  @Input() model: MEmployeeSalary; 
  functionId = "Adm_EmployeeSalary";
  @Input() isNew= false;
  editForm: FormGroup;
  // stores: MEmployeeStore[]=[]
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
  constructor(private salaryService: EmployeeSalaryService, private controlService: ControlService,  private commonService: CommonService, private storeService: StoreService, 
     private authService: AuthService,  private alertifyService: AlertifyService, 
     private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  {
   
  }
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
    
  dateFormat="";
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
  initDataCompleted = false;
  ngOnInit() {
     // debugger;
     this.dateFormat = this.authService.loadFormat().dateFormat;
    // this.loadStore();
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
       debugger;
      
        this.editForm = this.formBuilder.group(group);
        // if(this.model.createdBy === null || this.model.createdBy === "" || this.model.createdBy === undefined)
        // {
        //   this.isNew = true;
        // }
        if (this.controlList.length > 0) {
          console.log("controlList", this.controlList);
          this.controlList.forEach(item=>{
            item.isView=this.checkPermission(item.controlId,'V'),
            item.isEdit= item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
            item.isInsert= item?.readOnly ? false : this.checkPermission(item.controlId,'I')
          });
          console.log("controlList", this.controlList);
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

          if(this.dropViews?.length > 0)
          {
  
            let store= this.authService.storeSelected();
            let dropStt= 0;
            let loadDataStt = this.dropViews.filter(x=>x.query?.length > 0).length;
            this.dropViews.forEach(drop => {
              if(drop?.query?.length > 0)
              {
                this.commonService.getQuery(store.companyCode, drop.id, drop.query).subscribe((response: any) =>{
                  dropStt++;
                  if(response.success)
                  {
                     drop.models = response.data;
                  }
                  else
                  {
                    this.alertifyService.error(response.message);
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
              this.alertifyService.error(error);
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
    //  this.stores = this.model.stores;
   
  }
   
  update() { 
    debugger;
    
 
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    this.model.modifiedBy = this.authService.decodeToken?.unique_name;
    if(this.model.status=== null || this.model.status===undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;
  
   
    this.outModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }
}
