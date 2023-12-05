import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MStore } from 'src/app/_models/store';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { CurrencyService } from 'src/app/_services/data/currency.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-store-currency-edit',
  templateUrl: './management-store-currency-edit.component.html',
  styleUrls: ['./management-store-currency-edit.component.scss']
})
export class ManagementStoreCurrencyEditComponent implements OnInit {

 
  constructor(private currencyService: CurrencyService, private controlService: ControlService,  private storeService: StoreService, 
     private authService: AuthService,  private alertifyService: AlertifyService, 
     private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  {
   
  }
  
  @Input() isNew = false;
  @Input() model: MStoreCurrency;
  functionId = "Adm_StoreCurrency";

  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  companyOptions = [];
  currencyOptions = [];
  storeOptions = [];
  showOptions = [
    {
      value: "true", name: "Yes",
    },
    {
      value: "false", name: "No",
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
  groupControlList: {};
  // constructor(private paymentService: PaymentmethodService, private storeService: StoreService, private controlService: ControlService,
  //   private authService: AuthService, private alertifyService: AlertifyService,
  //   private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {

  // }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  loadCurrencyList() {
    this.currencyService.getAll().subscribe((response: any) => {
      debugger;
      if(response.success)
      {
        this.currencyOptions = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
     
    });
  }
  loadStoreList() {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      debugger;
      if(response.success)
      {
        this.storeOptions = response.data;
       
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.storeOptions = response;
    });
  }

  ngOnInit() {
    debugger;
    this.loadCurrencyList();
    this.loadStoreList();
    // console.log("a - " +this.model);
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
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

  }

  update() {
    debugger;

    // this.model.companyCode = "CP001";

    // this.function.status = this.statusSelect.value;
    // this.function.status= this.statusSelect.value;
    this.outModel.emit(this.model);
  }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }


}
