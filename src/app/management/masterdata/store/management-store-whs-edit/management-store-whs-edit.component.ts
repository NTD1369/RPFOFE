import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';;
import { StoreWareHouseViewModel } from 'src/app/_models/viewmodel/StoreWareHouseViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { StorewarehouseService } from 'src/app/_services/data/storewarehouse.service';
import { WarehouseService } from 'src/app/_services/data/warehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-store-whs-edit',
  templateUrl: './management-store-whs-edit.component.html',
  styleUrls: ['./management-store-whs-edit.component.scss']
})
export class ManagementStoreWhsEditComponent implements OnInit {
  model: StoreWareHouseViewModel = new StoreWareHouseViewModel();
  @Input() isNew = true;
  @Input() store:string="";
  @Output() outModel = new EventEmitter<any>();
  editForm: FormGroup;
  functionId = "Adm_StoreWareHouse";
  controlList: any[];
  groupControlList: {};
  whsOptionsTypeS = [];
  whsOptionsTypeT = [];
  whsOptionsTypeO = [];
  gridBoxValue: string[] = [];
  constructor(private alertifyService: AlertifyService,
               private formBuilder: FormBuilder,
               private controlService: ControlService,
               private authService: AuthService,
               private storewarehouseService:StorewarehouseService,
               private whsService: WarehouseService,
               private alertify: AlertifyService) { }


  checkPermission(controlId: string, permission: string): boolean {
    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  loaddata(){
    this.storewarehouseService.getAll(this.store).subscribe((res:any)=>{
      this.model = res.data;
      // this.gridBoxValue = ['WFM001','WFM002'];
      this.gridBoxValue=[];
      this.model.oWareHouseID.forEach(item=>{
        this.gridBoxValue.push(item);
      })
      this.model.storeID = this.store;
      this.model.oWareHouseID = this.gridBoxValue;
    })
  }
  loadWhs() {
    this.whsService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.whsOptionsTypeS = response.data.filter(x=>x.whsType ==='S');
        this.whsOptionsTypeT = response.data.filter(x=>x.whsType ==='T');
        this.whsOptionsTypeO = response.data.filter(x=>x.whsType ==='W');
        // this.whsOptionsTypeO = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
      // this.whsOptions = response;
      // console.log(this.whsOptions)

    });
   
  }
  ngOnInit() {
    
    this.loadWhs();
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
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
    setTimeout(() => {
      this.loaddata();
    }, 1000); 
  }
  update() {
    console.log(this.gridBoxValue);
    this.model.oWareHouseID = this.gridBoxValue;
    this.outModel.emit(this.model);
   
  }
  
}
