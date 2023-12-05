import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MRole } from 'src/app/_models/mrole';
import { AuthService } from 'src/app/_services/auth.service'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { RoleService } from 'src/app/_services/system/role.service';
 

@Component({
  selector: 'app-management-role-edit',
  templateUrl: './management-role-edit.component.html',
  styleUrls: ['./management-role-edit.component.scss']
})
export class ManagementRoleEditComponent implements OnInit {

  // @Input() model: MRole; 
  // @Input() isNew: false; 
  // functionId = "Adm_Role"; 
  // editForm: FormGroup;
  // @Output() outModel = new EventEmitter<any>();
  // @HostListener('window:beforeunload', ['$event'])
  // marked = false;
  // theCheckbox = false;
  // companyOptions=[];   
  // statusOptions = [
  //   {
  //     value: "A", name: "Active",
  //   },
  //   {
  //     value: "I", name: "Inactive",
  //   },
  // ];
  // controlList: any[];
  // constructor( 
  //    private authService: AuthService,  private alertifyService: AlertifyService, 
  //    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  // {
   
  // }
  // ngAfterViewInit() {
  //   console.log("afterinit");
  //    this.showForm=true;
  // }
 
  // showForm=false;
  // checkPermission(controlId: string, permission: string): boolean
  // {
    
  //   return this.authService.checkRole(this.functionId , controlId, permission );
  // }
    
 
  // ngOnInit() {
 
 
  //    this.getControlByFunction(this.functionId).subscribe((response)=>{
  //      if(response.length > 0)
  //      {
  //       debugger;
  //       this.controlList= response.filter(x=>x.controlType !== 'Button');
  //       console.log(this.controlList);
  //        let group: any = {  };
  //        response.forEach(item=>{
          
  //          if(item.controlType ==="DateTime")
  //          {
  //             if(this.model[item.controlId]===null || this.model[item.controlId]===undefined)
  //             {
                
                
  //                 // group[item.controlId] = [this.model[item.controlId] , ];
  //                 group[item.controlId] = new FormControl({ value: null, disabled: false })
                
  //             }
  //             else
  //             {
  //                 // invalidDate.setDate(today.getDate());
  //                 let date = new Date(this.model[item.controlId]);
  //                 this.model[item.controlId] = new Date(this.model[item.controlId]);
  //                   // group[item.controlId] = [this.model[item.controlId] , ];
  //                   group[item.controlId] = new FormControl({ value: date, disabled: false })
                  
  //             }
  //          }
  //          else{
             
  //             group[item.controlId] = [''];
            
  //          }
  //        });
  //      debugger;
      
  //       this.editForm = this.formBuilder.group(group);
       
  //      }
  //     });
     
   
  // }
   
  // update() { 
  //   debugger;
    
    
  //   if(this.model.status=== null || this.model.status===undefined || this.model.status === "")
  //     this.model.status = this.statusOptions[0].value;
    
  //   // this.function.status = this.statusSelect.value;
  //   // this.function.status= this.statusSelect.value;
  //   this.outModel.emit(this.model); 
  // }
  // toggleVisibility(e){
  //   this.marked= e.target.checked;
  // }

  @Input() role: any;
  editForm: FormGroup
  @Output() roleModel = new EventEmitter<any>();
  // @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  config = {
    displayKey: "name", // if objects array passed which key to be displayed defaults to description
    search: false,
    limitTo: 5,
  };
  statusSelect: any = {};
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];

  // tslint:disable-next-line: max-line-length
  constructor(private roleSerice: RoleService,private authService: AuthService, private alertifyService: AlertifyService, private formBuilder: FormBuilder,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   this.role = data['role'];
    // });
    console.log(this.role);
    if(this.role===null)
    {
     
      this.editForm = this.formBuilder.group({
        roleName: [''],
        description: [''],
        status: []
      });
      
    }
    else
    {
      this.statusSelect = this.statusOptions.find(x=>x.value === this.role.status);
      this.editForm = this.formBuilder.group({
        roleName: [''],
        description: [''],
        status: [this.statusSelect]
      });
      
    }
    debugger;
    
    // console.log(this.item);
  }
  
  updateRole() { 
    // this.role.companyCode = "CP001";
    // this.role.createdBy = "admin";
    // this.role.status= this.statusSelect.value;
    this.roleModel.emit(this.role); 
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
