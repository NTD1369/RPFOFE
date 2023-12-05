import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SFormatConfig } from 'src/app/_models/sformatconfig';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service'; 
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-format-edit',
  templateUrl: './management-format-edit.component.html',
  styleUrls: ['./management-format-edit.component.scss']
})
export class ManagementFormatEditComponent implements OnInit {


  @Input() model: SFormatConfig; 
  functionId = "Adm_FormatConfig";
  @Input() isNew= false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  companyOptions=[];  
  setupTypeOptions=[];
  storeOptions=[]; 
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  roundingMethodOptions=[];
  loadRoundingMethod()
  {
    this.commonService.getRoundingMethod().subscribe((response: any)=>{
      if(response.success)
      {
        this.roundingMethodOptions = response.data;
      }
      else
      { 
        this.alertifyService.warning("Can't load rounding method");
      }
     
    })
  }
  controlList: any[];
  constructor( private commonService: CommonService, private storeService: StoreService, private controlService: ControlService, 
     private authService: AuthService,  private alertifyService: AlertifyService, 
     private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  {
   
  }
  loadConfigType()
  {
     this.commonService.getConfigType().subscribe((responese: any)=>{
       debugger;
       if(responese.success)
       {
        this.setupTypeOptions = responese.data;
       }
       else
       {
          this.alertifyService.warning(responese.message);
       }
     
     });
    //  debugger;
    
  }
  loadStore()
  {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
          this.storeOptions = response.data;
      }
    
      else
      {
        this.alertifyService.warning(response.message);
      }
      //  this.storeOptions = data; 
    })
  }
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
    

  
 
  ngOnInit() {
    console.log(this.model);
    this.loadStore();
    this.loadRoundingMethod();
    this.loadConfigType();
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
       
       }
      });
     
   
  }
   
  update() { 
    debugger;
    
    this.outModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }

}
