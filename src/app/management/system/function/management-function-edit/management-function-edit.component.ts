import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MFunction } from 'src/app/_models/mfunction';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service'; 

@Component({
  selector: 'app-management-function-edit',
  templateUrl: './management-function-edit.component.html',
  styleUrls: ['./management-function-edit.component.scss']
})
export class ManagementFunctionEditComponent implements OnInit {
  @Input() model: MFunction;
  functionId = "Adm_Function";
  editForm: FormGroup;
  isNew= false;
  @Output() functionModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  statusSelect: any = {};
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  
  constructor( 
    private controlService: ControlService, public authService: AuthService, private alertifyService: AlertifyService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean
  {
    return this.authService.checkRole(this.functionId , controlId, permission);
  }
  controlList: any[];
  ngOnInit() {
    // this.editForm = this.formBuilder.group({
    //   functionId: [''],
    //   functionName: [''],
    //   functionUrl: [''],
    //   parentId: [''],
    //   icon: [''],
    //   orderNo: [''],
    //   licenseType: [''],
    //   status: ['']
    // });
    // if(this.function===null)
    // { 
      
    // }
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
      if(response.data.length > 0)
      {
       debugger;
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
      debugger;
     
       this.editForm = this.formBuilder.group(group);
       if(this.model.createdBy === null || this.model.createdBy === "" || this.model.createdBy === undefined)
       {
         this.isNew = true;
         this.model.createdOn = new Date();
         this.model.modifiedOn = null;
       }
      }
     });
    // else
    // {
    //   this.statusSelect = this.statusOptions.find(x=>x.value === this.function.status);
    //   this.editForm = this.formBuilder.group({
    //     functionId: [''],
    //     functionName: [''],
    //     url: [''],
    //     parentId: [''],
    //     icon: [''],
    //     orderNo: [''],
    //     licenseType: [''],
    //     status: [this.statusSelect]
    //   });
      
    // }
  }
   
  updateRole() { 
    debugger;
    this.model.companyCode = this.authService.storeSelected().companyCode;
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    // this.function.status = this.statusSelect.value;
    // this.function.status= this.statusSelect.value;
    this.functionModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
}
