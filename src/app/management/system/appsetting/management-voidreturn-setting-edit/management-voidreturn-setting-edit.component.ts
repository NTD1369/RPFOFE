import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SSalesType } from 'src/app/_models/salestype';
import { SVoidOrderSetting } from 'src/app/_models/voidordersetting';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { SalestypeService } from 'src/app/_services/data/salestype.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { VoidreturnsettingService } from 'src/app/_services/system/voidreturnsetting.service';

@Component({
  selector: 'app-management-voidreturn-setting-edit',
  templateUrl: './management-voidreturn-setting-edit.component.html',
  styleUrls: ['./management-voidreturn-setting-edit.component.scss']
})
export class ManagementVoidreturnSettingEditComponent implements OnInit {

  
  @Input() model: SVoidOrderSetting; 
  @Input() isNew = false; 
  functionId = "Adm_VoidReturnSetting";
 
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
  model1: SVoidOrderSetting;
  constructor(private voidreturnsettingService: VoidreturnsettingService, private controlService: ControlService, private salestypeService: SalestypeService,
     private authService: AuthService,  private alertifyService: AlertifyService, 
     private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  {
  }
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
 
  salesTypeOptions: SSalesType[];
  loadSalesType()
  { 
    this.salestypeService.getAll().subscribe((response: any)=>{
      debugger;
      this.salesTypeOptions = response;  
      console.log(this.salesTypeOptions);
    });
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
 
  ngOnInit() {
     debugger;
     this.model1 = Object.assign({}, this.model);
    this.loadSalesType();
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
             debugger;
              if(this.model1[item.controlId]===null || this.model1[item.controlId]===undefined)
              {
                 
                  // group[item.controlId] = [this.model[item.controlId] , ];
                  group[item.controlId] = new FormControl({ value: null, disabled: false })
                 
              }
              else
              {
                   // invalidDate.setDate(today.getDate());
                  let date = new Date(this.model1[item.controlId]);
                  this.model1[item.controlId] = new Date(this.model1[item.controlId]);
                    // group[item.controlId] = [this.model[item.controlId] , ];
                    group[item.controlId] = new FormControl({ value: date, disabled: false })
                   
              }
           
              
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
    // this.model = this.model1;
    // console.log(this.model)
    this.outModel.emit(this.model1); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }

}
