import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'path';
import { MItemUom } from 'src/app/_models/mitemuom';
import { MUom } from 'src/app/_models/muom';
import { MTimeFrame } from 'src/app/_models/timeframe';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { TimeframeService } from 'src/app/_services/data/timeframe.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-timeframe-edit',
  templateUrl: './management-timeframe-edit.component.html',
  styleUrls: ['./management-timeframe-edit.component.scss']
})
export class ManagementTimeframeEditComponent implements OnInit {


  @Input() model: MTimeFrame;
  functionId = "Adm_TimeFrame";
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
  constructor(private timeframeService: TimeframeService, public authService: AuthService,  
    private controlService: ControlService, private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute,
     private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  ngOnInit() {


    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        console.log(this.controlList);
        let group: any = {};
        response.data.forEach(item => {

          if (item.controlType === "DateTime" || item.controlType === "Date") {

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
            if (item.controlType === "Time") {

              debugger;
              // invalidDate.setDate(today.getDate());
              let hours  = this.model[item.controlId].hours;
              let minutes  = this.model[item.controlId].minutes;
              let value = hours.toString() + ':' + minutes.toString() + ":00" ;
               
              var newDate = new Date("1/1/2020 " + value); 
              
              // let date = new Date(this.model[item.controlId]);
              this.model[item.controlId] =  newDate;
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: newDate , disabled: false })
              //group["createdOn"] = new FormControl({ value: date, disabled: false })
              // this.model[item.controlId].setDate(this.model[item.controlId]);
              console.log(this.model[item.controlId]);
  
            }
            else{
              group[item.controlId] = [''];
            }
         

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

          console.log("this.groupControlList", this.groupControlList);
        }

      }
    });


  }

  update() {
    debugger;
    // this.model.companyCode = "CP001";
  
    if (this.model.status === null || this.model.status === undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;

    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }

}
