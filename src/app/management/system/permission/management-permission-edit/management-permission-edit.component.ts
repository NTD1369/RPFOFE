import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MPermission } from 'src/app/_models/mpermission';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service'; 

@Component({
  selector: 'app-management-permission-edit',
  templateUrl: './management-permission-edit.component.html',
  styleUrls: ['./management-permission-edit.component.scss']
})
export class ManagementPermissionEditComponent implements OnInit {


  @Input() model: MPermission;
  functionId = "Function";
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
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
  
  constructor(  private authService: AuthService, 
    private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean
  {
    return this.authService.checkRole(this.functionId , controlId, permission);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group({
      functionId: [''],
      controlId: [''],
      permissions: [''], 
      status: ['']
    }); 
  }
   
  update() { 
    debugger;
    
    this.model.companyCode = this.authService.storeSelected().companyCode;
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    
    // this.function.status = this.statusSelect.value;
    // this.function.status= this.statusSelect.value;
    this.outModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }

}
