import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MControl } from 'src/app/_models/control';
import { AuthService } from 'src/app/_services/auth.service'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-control-edit',
  templateUrl: './management-control-edit.component.html',
  styleUrls: ['./management-control-edit.component.scss']
})
export class ManagementControlEditComponent implements OnInit {


  @Input() model: MControl;
  functionId = "Control";
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
  

  typeOptions = [
    {
      value: "Button", name: "Button",
    },
    {
      value: "TextBox", name: "TextBox",
    },
    {
      value: "DropDown", name: "DropDown",
    },
    {
      value: "DateTime", name: "DateTime",
    },
    {
      value: "Date", name: "Date",
    },
    {
      value: "CheckBox", name: "CheckBox",
    },
  ];
  
  constructor(   private authService: AuthService, 
    private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean
  {
    return this.authService.checkRole(this.functionId , controlId, permission);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group({
      controlType: [''],
      controlName: [''],
      action: [''], 
      controlId: [''], 
      status: [''],
      orderNum: [''], 
      require: [''], 
      optionName: [''], 
      optionKey: [''], 
      optionValue: [''],
      custom1: [''], 
      custom2: ['']
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
