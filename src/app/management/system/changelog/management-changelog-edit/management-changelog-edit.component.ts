import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SReleaseNote } from 'src/app/_models/system/releaseNote';
import { AuthService } from 'src/app/_services/auth.service';
import { ReleaseNoteService } from 'src/app/_services/common/release-note.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { VersionService } from 'src/app/_services/data/version.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-changelog-edit',
  templateUrl: './management-changelog-edit.component.html',
  styleUrls: ['./management-changelog-edit.component.scss']
})
export class ManagementChangelogEditComponent implements OnInit {


  @Input() model: SReleaseNote;
  @Input() modalRef;
  functionId = "Adm_ChangeLog";
  @Input() isNew = false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  whsTypeOptions = [];
  statusOptions = [
    {
      value: "N", name: "New & Feature",
    },
    {
      value: "E", name: "Enhance",
    },
    {
      value: "I", name: "Inactive",
    },
    {
      value: "F", name: "Fixed",
    },
    {
      value: "IM", name: "Improved",
    },
    {
      value: "M", name: "Maintainance",
    },
  ];
  // statusOptions = [
  //   {
  //     value: "A", name: "Active",
  //   },
  //   {
  //     value: "I", name: "Inactive",
  //   },
  // ];
  controlList: any[];
  versionOptions: any;
  groupControlList: any;
  constructor(private releaseNoteService: ReleaseNoteService, private authService: AuthService,  private versionService: VersionService, 
    private controlService: ControlService, private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute, 
    private router: Router) { }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  loadVersion()
  {
    let store = this.authService.storeSelected();
    this.versionService.getAll(store.companyCode).subscribe((response: any) =>{
      if(response.success)
      {
        debugger;
        this.versionOptions = [];
        if(response.data?.length > 0)
        {
          if(this.isNew)
          {
            response.data = response.data.filter(x=>x.status === 'A');
            if(response.data?.length >0 )
            {
              response.data.forEach(data => {
                this.versionOptions.push({name: data.version, value: data.version});
              });
            }
            
          }
          else
          {
            response.data.forEach(data => {
              this.versionOptions.push({name: data.version, value: data.version});
            });
          }
         
          console.log('this.versionOption', this.versionOptions)
        }
        else
        {
          this.alertifyService.warning("version is null");
        }
       
      }
      else{
        this.alertifyService.warning(response.message);
      }
    })
  }
  ngOnInit() {
    console.log('model', this.model);
    this.loadVersion();
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        console.log(this.controlList);
        let group: any = {};
        response.data.forEach(item => {

          if (item.controlType === "DateTime" || item.controlType === "Date") {
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
        // debugger;

        this.editForm = this.formBuilder.group(group);
        // if(this.model.createdBy === null || this.model.createdBy === "" || this.model.createdBy === undefined)
        // {
        //   this.isNew = true;
        // }

        if (this.controlList.length > 0) {
          // 
          this.controlList.forEach(item=>{
            item.isView=this.checkPermission(item.controlId,'V'),
            item.isEdit= item?.readOnly ? false : this.checkPermission(item.controlId,'E'),
            item.isInsert= item?.readOnly ? false : this.checkPermission(item.controlId,'I')
          });
          console.log("controlList", this.controlList);
          var groups = this.controlList.filter(x => x.status === 'A').reduce(function (obj, item) {
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
            else if (key === "Editor") {
              indexKey = 5;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);
          // this.groupControlList.arrayGroup.forEach(item => {
          //   item.isView=this.checkPermission(item.controlId,'V'),
          //   item.isEdit=this.checkPermission(item.controlId,'E'),
          //   item.isInsert=this.checkPermission(item.controlId,'I')
          // });
          console.log("this.groupControlList", this.groupControlList);
        }


      }
    });


  }

  update() {
    debugger;
    // this.model.companyCode = "CP001";
    // this.model.createdBy = this.authService.decodeToken?.unique_name;
    // if (this.model.status === null || this.model.status === undefined || this.model.status === "")
    //   this.model.status = this.statusOptions[0].value;

    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }


}
