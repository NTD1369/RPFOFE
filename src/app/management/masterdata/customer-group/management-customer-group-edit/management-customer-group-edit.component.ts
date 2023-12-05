import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MCustomerGroup } from 'src/app/_models/customer';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CustomergroupService } from 'src/app/_services/data/customergroup.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-customer-group-edit',
  templateUrl: './management-customer-group-edit.component.html',
  styleUrls: ['./management-customer-group-edit.component.scss']
})
export class ManagementCustomerGroupEditComponent implements OnInit {

  @Input() model: MCustomerGroup;
  functionId = "Adm_CustomerGroup";
  marked = false;
  isNew = false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])

  theCheckbox = false;
  companyOptions = [];
  groupControlList = {};
  typeOptions = [
    {
      value: "S", name: "Vendor",
    },
    {
      value: "C", name: "Customer",
    },
  ];
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  controlList: any[];
  constructor(private controlService: ControlService, private customerGroupService: CustomergroupService,
    private authService: AuthService, private alertifyService: AlertifyService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {

  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  customerGroupOptions: MCustomerGroup[];
  loadStoreGroup() {
    this.customerGroupService.getAllViewModel(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.customerGroupOptions = response.data;
      }
      else {
        this.alertifyService.warning(response.message);
      }


    });
  }
  canEdit = false;
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return date.getFullYear() + '-' + month + '-' + (day);
  }

  ngOnInit() {
    this.canEdit = this.checkPermission('', 'E');
    this.loadStoreGroup();
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        console.log("this.controlList aaa", this.controlList);
        let group: any = {};
        response.data.forEach(item => {
          if (item.controlType === "DateTime") {
            debugger;
            if (this.model[item.controlId] === null || this.model[item.controlId] === undefined) {
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: null, disabled: false })
            }
            else {
              // invalidDate.setDate(today.getDate());
              let date = new Date(this.model[item.controlId]);
              this.model[item.controlId] = new Date(this.model[item.controlId]);
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: date, disabled: false })
            }
          }
          else {
            group[item.controlId] = [''];
          }
        });
        this.editForm = this.formBuilder.group(group);
        console.log("this.model", this.model);
        if (this.model.createdBy === null || this.model.createdBy === "" || this.model.createdBy === undefined) {
          this.isNew = true;
        }

        if (this.controlList.length > 0) {
          console.log("controlList", this.controlList);
          this.controlList.forEach(item=>{
            item.isView= this.checkPermission(item.controlId,'V'),
            item.isEdit=  item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
            item.isInsert=  item?.readOnly ? false : this.checkPermission(item.controlId,'I')
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
              isInsert:item.isInsert,
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


  }

  update() {
    console.log("1", this.model);
    console.log("2", this.model.cusGrpDesc);
    if (this.model.cusGrpDesc !== null && this.model.cusGrpDesc !== undefined) {
      this.model.cusGrpDesc = this.model.cusGrpDesc;//this.GetDateFormat();
    }
    if (this.model.cusGrpId !== null && this.model.cusGrpId !== undefined) {
      this.model.cusGrpId = this.model.cusGrpId;//this.GetDateFormat();
    }
    // // this.model.companyCode = "CP001";
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    if (this.model.status === null || this.model.status === undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;

    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }

}
