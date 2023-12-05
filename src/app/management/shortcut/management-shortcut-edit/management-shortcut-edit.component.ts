import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MDenomination } from 'src/app/_models/denomination';
import { MKeyCap } from 'src/app/_models/shortcut';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { KeycapService } from 'src/app/_services/data/keycap.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-shortcut-edit',
  templateUrl: './management-shortcut-edit.component.html',
  styleUrls: ['./management-shortcut-edit.component.css']
})
export class ManagementShortcutEditComponent implements OnInit {

  

  @Input() model: MDenomination;
  @Input() isNew: false;
  functionId = "Adm_Shortcut";
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  companyOptions = [];
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
  constructor(private shortcutService: ShortcutService, private controlService: ControlService, private commonService: CommonService,
    private authService: AuthService, private alertifyService: AlertifyService, private keycapService: KeycapService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {

  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  currencyOptions = [];
  loadCurrency() {
    this.commonService.getCurencyList().subscribe((response: any) => {

      if (response.success) {
        this.currencyOptions = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
    })
  }
  keycapOptions: MKeyCap[];
  loadKeyCap()
  {
    this.keycapService.getAll().subscribe((response: any) =>{
      if(response.success)
      {
        this.keycapOptions = response.data;
      }
      else{
        this.alertifyService.warning(response.message);
      }
     
    })
  }
  ngOnInit() {
    this.loadKeyCap();
    this.loadCurrency();
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        console.log(this.controlList);
        let group: any = {};
        response.data.forEach(item => {

          if (item.controlType === "DateTime") {
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
        //  debugger;

        this.editForm = this.formBuilder.group(group);

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
    debugger;


    if (this.model.status === null || this.model.status === undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;

    // this.function.status = this.statusSelect.value;
    // this.function.status= this.statusSelect.value;
    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }


}
