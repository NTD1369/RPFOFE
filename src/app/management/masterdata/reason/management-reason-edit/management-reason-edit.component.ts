import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MReason } from 'src/app/_models/reason';
import { DropView } from 'src/app/_models/viewmodel/DropView';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-reason-edit',
  templateUrl: './management-reason-edit.component.html',
  styleUrls: ['./management-reason-edit.component.scss']
})
export class ManagementReasonEditComponent implements OnInit {

  
  @Input() model: MReason;
  functionId = "Adm_Reason";
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
  langOptions = [
    {
      value: "en", name: "English",
    },
    {
      value: "vi", name: "Vietnamese",
    },
  ];
  typeOptions = [
    {
      value: "Return/Exchange", name: "Return/Exchange",
    },
    {
      value: "Cancel", name: "Cancel",
    },
    {
      value: "Line Item", name: "Line Item",
    },
  ];
  controlList: any[];
  groupControlList: {};
  constructor(private authService: AuthService, private commonService: CommonService,
    private controlService: ControlService, private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute, 
    private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  dropViews = [];
  setDataSoure(strSource)
  {
    // debugger;
    let source = [];
    if(this.dropViews?.length > 0)
    {
       let ViewSource = this.dropViews.find(x=>x.id === strSource);
       source  = ViewSource.models;
      //  debugger;
    }
    return source;
  }
  gridControlComponent = [];
  ngOnInit() {


    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        console.log(this.controlList);
        let group: any = {};
        response.data.forEach(item => {

          if (item.controlType === "DateTime") {

            // invalidDate.setDate(today.getDate());
            let date = new Date(this.model[item.controlId]);
            this.model[item.controlId] = new Date(this.model[item.controlId]);
            // group[item.controlId] = [this.model[item.controlId] , ];
            group[item.controlId] = new FormControl({ value: date, disabled: false         }, [
              // Validators.required,
              // Validators.minLength(2),
              // Validators.maxLength(30)
          ])
            //group["createdOn"] = new FormControl({ value: date, disabled: false })
            // this.model[item.controlId].setDate(this.model[item.controlId]);
            console.log(this.model[item.controlId]);

          }
          else {
            if(item.controlType?.toLowerCase() === "dropdown" && item.queryStr?.length > 0 )
            {
              let dropView: DropView = new DropView();
              dropView.id = item.controlId; 
              dropView.name = item.optionName; 
              dropView.query = item.queryStr;
              this.dropViews.push(dropView);
            }
            
            group[item.controlId] = ['' ];
            // , Validators.required
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

        if(this.dropViews?.length > 0)
        {
          let store= this.authService.storeSelected();
          let dropStt= 0;
          let loadDataStt = this.dropViews.filter(x=>x.query?.length > 0).length;
          this.dropViews.forEach(drop => {
            if(drop?.query?.length > 0)
            {
              this.commonService.getQuery(store.companyCode, drop.id, drop.query).subscribe((response: any) =>{
                dropStt++;
                if(response.success)
                {
                   drop.models = response.data;
                }
                else
                {
                  this.alertifyService.error(response.message);
                }
                debugger;
                if(dropStt === loadDataStt )
                {
                  this.initDataCompleted= true;
                }
              })
    
            }
          }, error =>{
            this.initDataCompleted= true;
            this.alertifyService.error(error);
          });
        }
        else
        {
          this.initDataCompleted= true;
        }
      }
    });


  }
  initDataCompleted = false;
  dynamicRequiredValidator(control: FormControl, fieldValue):{[key: string]: boolean}
  {
    if(fieldValue.require && !control.value){
      return {required: true};
    }
    return {};
  }
  update() {
    // debugger;
    // this.model.companyCode = "CP001";
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    if (this.model.status === null || this.model.status === undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;

    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }


}
