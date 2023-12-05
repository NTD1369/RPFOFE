import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemgroupService } from 'src/app/_services/data/itemgroup.service';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
export class ItemSearch {
  itemCode: string = '';
  group: string = '';
  keyword: string = '';
  barcode: string = '';
  itemCate1: string = '';
  itemCate2: string = '';
  itemCate3: string = '';
  uomcode: string = '';
  merchandise: string = '';
  customF1: string = '';
  customF2: string = '';
  customF3: string = '';
  customF4: string = '';
  customF5: string = '';
  customF6: string = '';
  customF7: string = '';
  customF8: string = '';
  customF9: string = '';
  customF10: string = '';
  validFrom: Date | string | null = null;
  validTo: Date | string | null = null;
  isSerial: boolean | null = null;
  isBOM: boolean | null = null;
  isVoucher: boolean | null = null;
  isCapacity: boolean | null = null;
  display:number =null;
}
@Component({
  selector: 'app-shop-search-item',
  templateUrl: './shop-search-item.component.html',
  styleUrls: ['./shop-search-item.component.scss']
})
export class ShopSearchItemComponent implements OnInit {

  model: ItemSearch;
  functionId = "Cpn_ItemFilter";
  @Input() searchKey = "";
  @Output() ItemsSelected = new EventEmitter<any>();
  marked = false;
  theCheckbox = false;
  companyOptions = [];
  status: boolean = false;
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  customF1Options = [];
  customF10Options = [];
  customF2Options = [];
  customF3Options = [];
  customF4Options = [];
  customF5Options = [];
  customF6Options = [];
  customF7Options = [];
  customF8Options = [];
  customF9Options = [];
  groupOptions = [];
  itemCate1Options = [];
  itemCate2Options = [];
  itemCate3Options = [];
  merchandiseOptions = [];
  uomOptions = [];
  controlList: any[];
  groupControlList = {};
  FilterOnGrid(data)
  {
    data =   data.value.replace(/\s/g, '');
    this.dataGrid.instance.filter(["serialNum", "contains", data]);
     
  }
  loadMerchandise() {
    this.merchandiseService.getByCompany(this.authService.getCurrentInfor().companyCode, '', '', '').subscribe((response: any) => {
      if (response.success) {
        this.merchandiseOptions = response.data;
        // console.log('merchandiseOptions');
        // console.log(this.merchandiseOptions);
      }
      else {

      }

    })
  }
  loadUom() {
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
        this.uomOptions = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.uomList = response;
      // console.log(this.uomList);
    });
    // this.uomService.getAll().subscribe((response: any) => {
    //   this.uomOptions = response;
    //   // console.log('uomOptions');
    //   // console.log(this.uomOptions);
    // })
  }
  loadGroup() {
    this.itemgroupService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      
      if(response.success)
        {
          this.groupOptions = response.data;
        }
        else{
          this.alertifyService.error(response.message);
        }
      // console.log('roupOptions');
      // console.log(this.groupOptions);
    })
  }
  genArray(cus) {
    if(cus!==null && cus!==undefined )
    {
      let arr = cus.split(',');
      let result = [];
      arr.forEach(element => {
        result.push({ name: element, value: element })
      });
      return result;
    }
    
  }
  loadCustom() {
    this.commonService.getItemCustomList('').subscribe((response: any) => {
      if (response.success) {
        for (let i = 1; i <= 10; i++) {
          let name = 'CustomField' + i;
          let object = 'customF' + i + 'Options';
          //  debugger;
          let cus = response.data.find(x => x.Column === name);
          if (cus !== null && cus !== undefined) {
            this[object] = this.genArray(cus.csv);

          }

        }
        for (let i = 1; i <= 3; i++) {
          let name = 'itemCate' + i;
          let object = 'itemCate' + i + 'Options';
          //  debugger;
          let cus = response.data.find(x => x.Column === name);
          if (cus !== null && cus !== undefined) {
            this[object] = this.genArray(cus.csv);
          }

        }

      }
      else {
        this.alertifyService.warning(response.message);
      }

    })
  }
  constructor(private itemService: ItemService, private commonService: CommonService, private controlService: ControlService, private basketService: BasketService, private itemgroupService: ItemgroupService,
    private authService: AuthService, private alertifyService: AlertifyService, private uomService: UomService, private merchandiseService: Merchandise_categoryService,

    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.model = new ItemSearch();
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.customizeText = this.customizeText.bind(this);
  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  editForm: FormGroup;
  storeSelected: MStore;
  shortcuts: ShortcutInput[] = [] ;
  focusedRowKey = "";
  focusedcelKey= -1;
  autoNavigateToFocusedRow = true;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
 
  loadShortcut()
  {
    
    this.shortcuts.push(
      {
        key: ["ctrl + f"],
        label: "Search item",
        description: "Search item",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
           this.searchItem();
        },
        preventDefault: true
      },
        
      {
        key: ["ctrl + d"],
        label: "Apply Search",
        description: "Apply Search",
        command: (e) => {
          // this.ApplyToCart();
          if(this.selectedKey!==null && this.selectedKey!==undefined && this.selectedKey?.length > 0)
          {
            setTimeout(() => { 
              // this will make the execution after the above boolean has changed
              this.ItemsSelected.emit(this.selectedKey);
            });
          }
         
        },
        preventDefault: true
      },
        
      {
        key: ["ctrl + s"],
        label: "Focus grid",
        description: "Focus grid",
        command: (e) => { 
          this.dataGrid.instance.refresh();
           if(this.items!==null && this.items!==undefined && this.items?.length > 0)
           {
            // this.focusedRowKey= this.items[0].keyId;
            this.dataGrid.focusedRowKey = this.items[0].keyId;  
            // const scrollTo = document.querySelector(".gridContainerX");
            // if (scrollTo) {
            //   scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
            // }
            this.dataGrid.instance.focus();
            // this.focusedcelKey = 1;
            // this.dataGrid.instance.navigateToRow(1);
           }
          
        },
        preventDefault: true
      },
        
    )
    
    this.commonService.changeShortcuts(this.shortcuts, true); 
 
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadShortcut();
    if(this.searchKey!==null && this.searchKey!==undefined && this.searchKey!=="")
    {
      setTimeout(() => { 
        // this will make the execution after the above boolean has changed
        this.loadItem("","","",this.searchKey,"","","","","","","","","","","","","","","","","","","","","","","");
      }, 200);
      
    }
    
  }
  ngOnInit() {
    this.loadCustom();
    this.loadGroup();
    this.loadUom();
    this.loadMerchandise();
    this.storeSelected = this.authService.storeSelected();
    setTimeout(() => { 
      // this will make the execution after the above boolean has changed
      this.getData();
    },100);
    // console.log('searchKey', this.searchKey);
    // console.log(this.customF1Options);
  }

  getData() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        // this.controlList = this.controlList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1); 

        // console.log("controlList", this.controlList);
        // console.log("response", response);
        let group: any = {};
        response.data.forEach(item => {

          if (item.controlType === "DateTime") {
            // debugger;
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

        if (this.controlList.length > 0) {
          this.controlList.forEach(item=>{
            item.isView=this.checkPermission(item.controlId,'V'),
            item.isEdit=this.checkPermission(item.controlId,'E'),
            item.isInsert=this.checkPermission(item.controlId,'I')
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
 
        }
      }
    });
  }
  clickEvent() {
    this.status = !this.status;
  }

  ApplyToCart() {
    // debugger;
     setTimeout(() => { 
      // this will make the execution after the above boolean has changed
      this.ItemsSelected.emit(this.selectedKey);
    });
 

  }
  selectedKey = [];
  allMode: string;
  checkBoxesMode: string;
  searchItem() {


    let filter = this.model;
    
    let CustomerGroupId = "";
    if(this.basketService.getCurrentBasket()?.customer!==null && this.basketService.getCurrentBasket()?.customer !==undefined )
    {
      CustomerGroupId =  this.basketService.getCurrentBasket().customer.customerGrpId;
    }
    else
    {
      CustomerGroupId =  this.authService.getDefaultCustomer().customerGrpId;
    }
    
    // debugger;
    this.loadItem(filter.itemCode === null ? '' : filter.itemCode, filter.uomcode === null ? '' : filter.uomcode, filter.barcode === null ? '' : filter.barcode, filter.keyword === null ? '' : filter.keyword, filter.merchandise === null ? '' : filter.merchandise
      , filter.group === null ? '' : filter.group, filter.itemCate1 === null ? '' : filter.itemCate1, filter.itemCate2 === null ? '' : filter.itemCate2, filter.itemCate3 === null ? '' : filter.itemCate3,
      filter.customF1 === null ? '' : filter.customF1, filter.customF2 === null ? '' : filter.customF2, filter.customF3 === null ? '' : filter.customF3, filter.customF4 === null ? '' : filter.customF4,
      filter.customF5 === null ? '' : filter.customF5, filter.customF6 === null ? '' : filter.customF6, filter.customF7 === null ? '' : filter.customF7, filter.customF8 === null ? '' : filter.customF8,
      filter.customF9 === null ? '' : filter.customF9, filter.customF10 === null ? '' : filter.customF10, filter.validFrom === null ? '' : filter.validFrom, filter.validTo === null ? '' : filter.validTo,
      filter.isSerial === null ? '' : filter.isSerial, this.model.isBOM !== null && this.model.isBOM !== undefined ? this.model.isBOM : '', filter.isVoucher === null ? '' : filter.isVoucher, filter.isCapacity === null ? '' : filter.isCapacity, CustomerGroupId,
      filter.display === null ? '' : filter.display);
  }
  items: ItemViewModel[] = [];
  showGrid = false;
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  loadItem(itemcode, uomcode, barcode, keyword, merchandise, Group, ItemCate1, ItemCate2, ItemCate3, CustomF1, CustomF2, CustomF3, CustomF4, CustomF5
    , CustomF6, CustomF7, CustomF8, CustomF9, CustomF10, ValidFrom, ValidTo, IsSerial, IsBOM, IsVoucher, IsCapacity, CustomerGrpId,display) {
    // debugger;
    this.itemService.getItemFilter(this.storeSelected.companyCode, this.storeSelected.storeId, itemcode, uomcode, barcode, keyword, merchandise, Group, ItemCate1, ItemCate2, ItemCate3, CustomF1, CustomF2, CustomF3, CustomF4, CustomF5
      , CustomF6, CustomF7, CustomF8, CustomF9, CustomF10, ValidFrom, ValidTo, IsSerial, IsBOM, IsVoucher, IsCapacity, CustomerGrpId,'', '','','',display).subscribe((response: any) => {
        if (response.success) {

          this.items = response.data.filter(x => x.barCode !== '');
          this.items.map((todo, i) => { todo.responseTime = response.responseTime});
          setTimeout(() => { 
            // this will make the execution after the above boolean has changed
            this.showGrid = true; 
          },100);

          
        }
        else {
          this.alertifyService.warning(response.message);
        }
      });
  }
  // update() { 
  //   debugger;

  //   // this.model.companyCode = "CP001";
  //   this.model.createdBy = this.authService.decodeToken?.unique_name;
  //   if(this.model.status=== null || this.model.status===undefined || this.model.status === "")
  //     this.model.status = this.statusOptions[0].value;

  //   // this.function.status = this.statusSelect.value;
  //   // this.function.status= this.statusSelect.value;
  //   this.outModel.emit(this.model); 
  // }
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }

}
