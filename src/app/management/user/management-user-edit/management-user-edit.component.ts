import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { MEmployee } from 'src/app/_models/employee';
import { MRole } from 'src/app/_models/mrole';
import { MUser } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { EmployeeService } from 'src/app/_services/data/employee.service';
import { UserService } from 'src/app/_services/data/user.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { RoleService } from 'src/app/_services/system/role.service';

@Component({
  selector: 'app-management-user-edit',
  templateUrl: './management-user-edit.component.html',
  styleUrls: ['./management-user-edit.component.scss']
})
export class ManagementUserEditComponent implements OnInit {


  @Input() model: MUser;
  functionId = "Adm_User";
  @Input() isNew = false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  whsTypeOptions = [];
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
  constructor(private userService: UserService, private authService: AuthService, private roleService: RoleService, private employeeService: EmployeeService,
    private controlService: ControlService, private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean {
    // debugger;
    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  
  @ViewChild('txtQRBarcode', { static: false }) txtQRBarcode;
  roleOptions: MRole[] = [];
  loadRoleList() {
    this.roleService.getAll().subscribe((response: any) => {
      if(response.success)
      {
        this.roleOptions = response.data;
      }
      else
      {
       this.alertifyService.warning(response.message);
      }
      
    })

  }
  employees: MEmployee[]=[];
  loadEmployeeX=false;
  loadEmployee()
  {
    // this.model.companyCode, this.model.storeId
    this.employeeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      debugger;
      if(response.success)
      {
        this.loadEmployeeX= true;
        this.employees = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
 
    });
  }
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  downloadImage(){
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = this.model.username + '_barcode.png';
      this.downloadLink.nativeElement.click();
    });
  }
  ngOnInit() {
    this.loadEmployee();
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button' && x.controlId?.toLowerCase() !== 'qrbarcode');
        console.log(this.controlList);
        let group: any = {};
        response.data.forEach(item => {

          if (item.controlType === "DateTime") {

            // invalidDate.setDate(today.getDate());
            let date = new Date(this.model[item.controlId]);
            this.model[item.controlId] = new Date(this.model[item.controlId]);
            // group[item.controlId] = [this.model[item.controlId] , ];
            group[item.controlId] = new FormControl({ value: date, disabled: false })
            //group["createdOn"] = new FormControl({ value: date, disabled: false })
            // this.model[item.controlId].setDate(this.model[item.controlId]);
            console.log(this.model[item.controlId]);

          }
          else {

            group[item.controlId] = [''];

          }
        });
        // debugger;

        this.editForm = this.formBuilder.group(group);
        //  if(this.model.uomC === null || this.model.whsCode === "" || this.model.whsCode === undefined)
        //  {
        //    this.isNew = true;
        //    this.model.createdOn = new Date();
        //    this.model.modifiedOn = null;
        //  }

        if (this.controlList.length > 0) {
          console.log("controlList", this.controlList);
          this.controlList.forEach(item=>{
            item.isView=this.checkPermission(item.controlId,'V'),
            item.isEdit= item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
            item.isInsert= item?.readOnly ? false : this.checkPermission(item.controlId,'I')
          });

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

          console.log("this.groupControlList", this.groupControlList);
        }
      }
    });

    this.loadRoleList();
  }

  update() {
    debugger; 
    // this.model.companyCode = "CP001";
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    if (this.model.status === null || this.model.status === undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;
    // let barcode = this.txtQRBarcode.nativeElement.value;
    // if(barcode?.length > 0 && ( this.model.qrBarcode ===null || this.model.qrBarcode===undefined || this.model.qrBarcode?.length <=0))
    // {
    //   this.model.qrBarcode = barcode;
    // }
    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }

}
