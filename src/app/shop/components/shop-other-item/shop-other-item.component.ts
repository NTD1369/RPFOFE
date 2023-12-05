import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MStore } from 'src/app/_models/store';
import { IBasketItem } from 'src/app/_models/system/basket';
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
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ItemSearch } from '../shop-search-item/shop-search-item.component';

@Component({
  selector: 'app-shop-other-item',
  templateUrl: './shop-other-item.component.html',
  styleUrls: ['./shop-other-item.component.scss']
})
export class ShopOtherItemComponent implements OnInit {


  model: ItemSearch; 
  @Output() ItemsSelected = new EventEmitter<any>();
  @Input() modalRef;
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
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closeModal(true);
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
  closeModal(close) {
    if (close === true) {
      this.modalRef.hide();
    }

    let basketCheck = this.basketService.getCurrentBasket();
    basketCheck.voucherApply = [];
    this.basketService.setBasket(basketCheck);
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
  constructor(private itemService: ItemService,  public commonService: CommonService, private controlService: ControlService, private basketService: BasketService, private itemgroupService: ItemgroupService,
    private authService: AuthService, private alertifyService: AlertifyService, private uomService: UomService, private merchandiseService: Merchandise_categoryService,

    private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.model = new ItemSearch();
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.customizeText = this.customizeText.bind(this);
  }
  // checkPermission(controlId: string, permission: string): boolean {

  //   return this.authService.checkRole(this.functionId, controlId, permission);
  // }
  editForm: FormGroup;
  storeSelected: MStore;
  production = false;
  ngOnInit() {
    this.production =  environment.production;
    // this.loadCustom();
    // this.loadGroup();
    // this.loadUom();
    // this.loadMerchandise();
    this.storeSelected = this.authService.storeSelected();
    // this.getData();
    // console.log(this.customF1Options);
    this.loadItem();
  }
  shortcuts: ShortcutInput[] = [] ;
 
  autoNavigateToFocusedRow = true;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  
  loadShortcut()
  {
    this.shortcuts=[];
    this.shortcuts.push(
      {
        key: ["enter"],
        label: "Add item to order",
        description: "Add item to order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {  
          debugger;
          console.log("enter");
          if(this.item!==null && this.item!==undefined)
          {
            this.addToOrder(true);
          }
          // else
          // {
          //   if(this.dataGrid.focusedRowKey!==null && this.dataGrid.focusedRowKey!==undefined && this.dataGrid.focusedRowKey!=='')
          //   {
          //     let item  = this.items.find(x=>x.keyId === this.dataGrid.focusedRowKey);
          //     if(item!==null && item!==undefined)
          //     {
          //       this.selectItem(item, null, true); 
          //     }  
          //   }
          // } 
        },
        preventDefault: true
      },
      {
        key: ["cmd + x"],
        label: "Close",
        description: "Close",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => { 
          this.closeModal(true);
        },
        preventDefault: true
      },
      {
        key: ["escape"],
        label: "Close",
        description: "Close",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => { 
          this.closeModal(true);
        },
        preventDefault: true
      }, 
      {
        key: ["alt + r"],
        label: "Ignore select",
        description: "Ignore select",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          this.item = null;
        },
        preventDefault: true
      },
      {
        key: ["ctrl + s"],
        label: "Select row",
        description: "Select row",
        command: (e) => {
          // this.ApplyToCart();
          debugger;
          if(this.dataGrid.focusedRowKey!==null && this.dataGrid.focusedRowKey!==undefined && this.dataGrid.focusedRowKey!=='')
          {
            let item  = this.items.find(x=>x.keyId === this.dataGrid.focusedRowKey);
            if(item!==null && item!==undefined)
            {
              this.selectItem(item, null, true);
              
            }  
          
          }
         
        },
        preventDefault: true
      },
      {
        key: ["cmd + p"],
        label: "",
        description: "",
        allowIn: [AllowIn.Textarea, AllowIn.Input],
        command: (e) => { 

        },
        preventDefault: true
      },
      {
        key: ["ctrl + f"],
        label: "Focus grid",
        description: "Focus grid",
        command: (e) => { 
          // this.dataGrid.instance.refresh();
          debugger;
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
    setTimeout(() => {
      debugger;
      this.commonService.changeShortcuts(this.shortcuts, true); 
      if(this.items!==null && this.items!==undefined && this.items?.length > 0)
      { 
       this.dataGrid.focusedRowKey = this.items[0].keyId;   
       this.dataGrid.instance.focus(); 
      }
    }, 100);
   
 
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this.loadShortcut();
    }, 100);
  
  }
  selectItem(item, event, isShorcut )
  {
    
    this.item = this.basketService.mapProductItemtoBasket(item, 1);
    debugger;
    if(this.item.customField1?.toLowerCase()==='pin' || this.item.customField1?.toLowerCase()==='pn')
    {
      // if(event !== null && event!== undefined && this.production !== true)
      // {
      //   this.commonService.adddItemToCartEffect(event?.element);
      // }
      // console.log('event', event?.element?.lastElementChild?.lastElementChild?.offsetLeft,  event?.element?.lastElementChild?.lastElementChild?.offsetTop );
      this.addToOrder(isShorcut);
    }
    else
    {
      setTimeout(() => {
        this.txtAccountNo.nativeElement.focus();
      }, 10);
    
    }
    // this.item.custom1= item.custom1;
    // this.item.custom2= item.custom2;
    // this.item.custom3= item.custom3;
    
  }
  @ViewChild('txtAccountNo', { static: false }) txtAccountNo: ElementRef;
  @ViewChild('txtPrice', { static: false }) txtPrice: ElementRef;
  @ViewChild('txtCustom2', { static: false }) txtCustom2: ElementRef;
  addToOrder(isShocut)
  {
    // debugger;
    if(this.item.customField1?.toLowerCase()==='pin' || this.item.customField1?.toLowerCase()==='pn')
    {
        this.item.memberValue = this.item.quantity;
       
        this.item.lineTotal = this.item.quantity * this.item.price ;
        this.item.promotionLineTotal = this.item.lineTotal ;
        this.item.promotionUnitPrice = this.item.price;
        
        debugger;
        this.basketService.addItemBasketToBasketNoPromotion(this.item, this.item.quantity , null, true);
       
        this.item=null;
        // if(isShocut)
        // {
          setTimeout(() => {
            this.closeModal(true);
          }, 10);
      
        // }
    }
    else
    {
      if((this.item.custom1===null || this.item.custom1===undefined) && (this.item.customField1?.toLowerCase()!=='pin' && this.item.customField1?.toLowerCase()!=='pn'))
      {
        
        this.alertifyService.warning("Account No is null. Please input Account No");
      }
      else
      {
        debugger;
        if(this.item.quantity===null || this.item.quantity===undefined ||  this.item.quantity===0 )
        {
          this.alertifyService.warning("Quantity is null. Please input quantity");
        }
        else
        { 
          let basket = this.basketService.getCurrentBasket();
          let checkAccount = basket.items.some(i=> i.id === this.item.id && i.uom === this.item.uom && i.barcode === this.item.barcode  
                && i?.custom1 === this.item?.custom1  && i.promotionIsPromo !== '1' && i.isWeightScaleItem!==true);
          if(checkAccount)
          {
            Swal.fire({
              icon: 'warning',
              title: 'Account No',
              text: this.item?.custom1 + " already in order. Please input another account."
            }).then(() =>{
              this.txtAccountNo.nativeElement.focus();
              this.txtAccountNo.nativeElement.value = '';
            }) 
          
          
          }
          else
          {
            this.item.memberValue = this.item.quantity;
            // if(this.item.isPriceTime)
            // {
            //   this.item.price = parseFloat(this.item.custom2) ;
            // }
            // debugger;
            // let test = this.basketService.mapProductItemtoBasket(this.item);
            this.item.lineTotal =this.item.quantity * this.item.price ;
            this.item.promotionLineTotal = this.item.lineTotal ;
            this.item.promotionUnitPrice = this.item.price;
            
            debugger;
            this.basketService.addItemBasketToBasketNoPromotion(this.item, this.item.quantity , null, true);

            // this.setBasket(basket);
            // this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
            // this.modalRef.hide();
    
    
            // let basket  = this.basketService.getCurrentBasket();
            // console.log(basket);
            // debugger;
            this.item=null;

            setTimeout(() => {
              this.closeModal(true);
            }, 10);
          }
         
        }
       
      }
    }
   
   
    // this.basketService.addItemtoBasket(this.item, 1, response);
    // this.outItem.emit(this.item); 
  }
  // getData() {
  //   this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
  //     if (response.data.length > 0) {
       
  //       this.controlList = response.data.filter(x => x.controlType !== 'Button');
        
  //       let group: any = {};
  //       response.data.forEach(item => {

  //         if (item.controlType === "DateTime") {
           
  //           if (this.model[item.controlId] === null || this.model[item.controlId] === undefined) {
 
  //             group[item.controlId] = new FormControl({ value: null, disabled: false }) 
  //           }
  //           else {
             
  //             let date = new Date(this.model[item.controlId]);
  //             this.model[item.controlId] = new Date(this.model[item.controlId]); 
  //             group[item.controlId] = new FormControl({ value: date, disabled: false })

  //           }


  //         }
  //         else {

  //           group[item.controlId] = [''];

  //         }
  //       });

  //       this.editForm = this.formBuilder.group(group);

  //       if (this.controlList.length > 0) {
  //         var groups = this.controlList.reduce(function (obj, item) {
  //           obj[item.controlType] = obj[item.controlType] || [];

  //           obj[item.controlType].push({
  //             controlId: item.controlId,
  //             companyCode: item.companyCode,
  //             controlName: item.controlName,
  //             functionId: item.functionId,
  //             action: item.action,
  //             controlType: item.controlType,
  //             createdBy: item.createdBy,
  //             createdOn: item.createdOn,
  //             optionName: item.optionName,
  //             require: item.require,
  //             optionKey: item.optionKey,
  //             custom1: item.custom1,
  //             custom2: item.custom2,
  //             optionValue: item.optionValue,
  //             status: item.status,
  //             orderNum: item.orderNum,
  //           });
  //           return obj;
  //         }, {});
  //         this.groupControlList = Object.keys(groups).map(function (key) {
  //           let indexKey = 0;
  //           if (key === "CheckBox") {
  //             indexKey = 1;
  //           } else if (key === "DateTime") {
  //             indexKey = 2;
  //           } else if (key === "TextBox") {
  //             indexKey = 3;
  //           } else if (key === "DropDown") {
  //             indexKey = 4;
  //           }
  //           return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
  //         }).sort((a, b) => a.index > b.index ? 1 : -1);

  //         console.log(this.groupControlList);
  //       }
  //     }
  //   });
  // }
  clickEvent() {
    this.status = !this.status;
    console.log("aaa", this.status);
  }

  ApplyToCart() {

    this.ItemsSelected.emit(this.selectedKey);

  }
  selectedKey = [];
  allMode: string;
  checkBoxesMode: string;
  // searchItem() {


  //   let filter = this.model;
    
  //   let CustomerGroupId = "";
  //   if(this.basketService.getCurrentBasket()?.customer!==null && this.basketService.getCurrentBasket()?.customer !==undefined )
  //   {
  //     CustomerGroupId =  this.basketService.getCurrentBasket().customer.customerGrpId;
  //   }
  //   else
  //   {
  //     CustomerGroupId =  this.authService.getDefaultCustomer().customerGrpId;
  //   }
    
     
  //   this.loadItem(filter.itemCode === null ? '' : filter.itemCode, filter.uomcode === null ? '' : filter.uomcode, filter.barcode === null ? '' : filter.barcode, filter.keyword === null ? '' : filter.keyword, filter.merchandise === null ? '' : filter.merchandise
  //     , filter.group === null ? '' : filter.group, filter.itemCate1 === null ? '' : filter.itemCate1, filter.itemCate2 === null ? '' : filter.itemCate2, filter.itemCate3 === null ? '' : filter.itemCate3,
  //     filter.customF1 === null ? '' : filter.customF1, filter.customF2 === null ? '' : filter.customF2, filter.customF3 === null ? '' : filter.customF3, filter.customF4 === null ? '' : filter.customF4,
  //     filter.customF5 === null ? '' : filter.customF5, filter.customF6 === null ? '' : filter.customF6, filter.customF7 === null ? '' : filter.customF7, filter.customF8 === null ? '' : filter.customF8,
  //     filter.customF9 === null ? '' : filter.customF9, filter.customF10 === null ? '' : filter.customF10, filter.validFrom === null ? '' : filter.validFrom, filter.validTo === null ? '' : filter.validTo,
  //     filter.isSerial === null ? '' : filter.isSerial, this.model.isBOM !== null && this.model.isBOM !== undefined ? this.model.isBOM : '', filter.isVoucher === null ? '' : filter.isVoucher, filter.isCapacity === null ? '' : filter.isCapacity, CustomerGroupId);
  // }
  @Input() item: IBasketItem;
  items: ItemViewModel[] = [];
  showGrid = false;
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  loadItem() {
    // debugger; company: any, store: any, itemcode: any, uomcode: any, barcode: any, keyword: any, merchandise: any, CustomerGroupId: any, type?: any, PriceListId?: any
    this.itemService.getItemViewList(this.storeSelected.companyCode, this.storeSelected.storeId,'','','','','','','Other').subscribe((response: any) => {
        if (response.success) {
          this.items = response.data;
          this.showGrid = true;
        }
        else {
          this.alertifyService.warning(response.message);
        }
      });
  }
 
  toggleVisibility(e) {
    this.marked = e.target.checked;
  }
}
