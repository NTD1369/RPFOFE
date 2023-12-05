import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxButtonComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { PromotionDocument, PromotionDocumentLine } from 'src/app/_models/promotion/document';
import { MStore } from 'src/app/_models/store';
import { IBasket, IBasketDiscountTotal, IBasketItem } from 'src/app/_models/system/basket';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { TapTapVoucherDetails } from 'src/app/_models/voucherdetail';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-manual-promotion',
  templateUrl: './shop-manual-promotion.component.html',
  styleUrls: ['./shop-manual-promotion.component.css']
})
export class ShopManualPromotionComponent implements OnInit {

  basket$: Observable<IBasket>;
  moreOptionsVisible: boolean;
  withCheckInCheckOutVisible: boolean;
  withDiscountVisible: boolean;
  itemByVouchers: ItemViewModel[] = [];
  itemByVoucher: ItemViewModel;
  loadingData = false;
  promolist = [];
  schemalist = [];
  storeSelected: MStore;
  @Output() outputPromotion = new EventEmitter<any>();
  @Input() discountApprove = "false";
  loadPromoListSimulate() {
    let document = new PromotionDocument();
    let basket = this.basketService.getCurrentBasket(); 
    let source = this.authService.getCRMSource();
    let storeSelected = this.authService.storeSelected();
      let now = new Date();
      document.docDate = now;
      // document.cardCode= basket.customer.mobile;
      // document.cardGroup= basket.customer.customerGrpId;
      if (basket.customer.mobile !== null && basket.customer.mobile !== undefined && source === 'Capi') {
        document.cardCode = basket.customer.mobile;
      }
      else {
        document.cardCode = basket.customer.customerId;
      }
      
      document.storeId = storeSelected.storeId;
      document.cardGroup = basket.customer.customerGrpId;
      document.customerRank = basket.customer?.customerRank ;
      // currencyCode: string="";
      // storeType: string="";
      // listType: string="";
      // formatConfigId: string="";
      // whsCode: string="";
      document.docCurrency = storeSelected.currencyCode;
      document.uCompanyCode = storeSelected.companyCode;
      document.u_CompanyCode = storeSelected.companyCode;
      // currencyCode: string="";
      // storeType: string="";
      // listType: string="";
      // formatConfigId: string="";
      // whsCode: string="";
      document.docCurrency = storeSelected.currencyCode;
      document.uCompanyCode = storeSelected.companyCode;
      document.u_CompanyCode = storeSelected.companyCode;
      
      let lines: PromotionDocumentLine[] = [];
      let itemCancelPromotion = [];
      basket.promotionItems.forEach(item => {
        debugger;
        if (item.promotionIsPromo !== "1") //if(item.promotionIsPromo!=="1" )
        {
          if (item.discountType === null || item.discountType === undefined || item.discountType === "") {
            item.discountType = 'Discount Percent';
            item.discountValue = 0;
          }
          // item.discountType = '';
          // item.discountValue = 0;
          let itemLine = lines.find(x=>x.itemCode === item.id && x.uoMCode === item.uom && x.barCode === item.barcode);
          // debugger;
          if(itemLine!==null && itemLine!==undefined)
          {
            itemLine.quantity += item.quantity; 
            itemLine.lineTotal += this.authService.roundingAmount(item.lineTotal) ;
          }
          else
          {
            let docLine = new PromotionDocumentLine();
            docLine.lineNum = item.lineNum;
            docLine.itemCode = item.id;
            // docLine.itemGroup = item.
            docLine.quantity = item.quantity;
            docLine.currency = storeSelected.currencyCode;
            // docLine.vatGroup= '';
            docLine.unitPrice = item.price;
            docLine.uoMCode = item.uom;
            docLine.barCode = item.barcode;
            docLine.lineTotal = item.lineTotal;
            let group = '';
            if(item.mcid !== (null || undefined || "") )
            {
              group = item.mcid;
              
            }
            if( item.itemGroupId !== (null || undefined || '') && group==="")
            {
              group = item.itemGroupId ;
            }
            docLine.itemGroup = group;
            docLine.uCollection = item.itemCategory_1;
            lines.push(docLine);
          }
        }
        else {
          itemCancelPromotion.push(item);

        }


      });

      document.documentLines = lines;
      this.loadingData = true;
      debugger;
      this.promotionService.runSimulator(document, 'N').subscribe((response: any) => {
        debugger;
      if (response.success) {
        this.loadingData = false;
        this.promolist = response.data;
       
        console.log('this.promolist', this.promolist);
        // console.log(this.promolist);
        this.loadSchemaListSimulate();
      }
      else
      {
        this.alertify.warning("Promo " + response.message);
      }
    })

  }
  loadSchemaListSimulate() {
    let document = new PromotionDocument();
    let basket = this.basketService.getCurrentBasket(); 
    let source = this.authService.getCRMSource();
    let storeSelected = this.authService.storeSelected();
      let now = new Date();
      document.docDate = now;
      // document.cardCode= basket.customer.mobile;
      // document.cardGroup= basket.customer.customerGrpId;
      if (basket.customer.mobile !== null && basket.customer.mobile !== undefined && source === 'Capi') {
        document.cardCode = basket.customer.mobile;
      }
      else {
        document.cardCode = basket.customer.customerId;
      }
      document.storeId = storeSelected.storeId;
      document.cardGroup = basket.customer.customerGrpId;
      document.customerRank = basket.customer?.customerRank ;
      // currencyCode: string="";
      // storeType: string="";
      // listType: string="";
      // formatConfigId: string="";
      // whsCode: string="";
      document.docCurrency = storeSelected.currencyCode;
      document.uCompanyCode = storeSelected.companyCode;
      document.u_CompanyCode = storeSelected.companyCode;
      // currencyCode: string="";
      // storeType: string="";
      // listType: string="";
      // formatConfigId: string="";
      // whsCode: string="";
      document.docCurrency = storeSelected.currencyCode;
      document.uCompanyCode = storeSelected.companyCode;
      document.u_CompanyCode = storeSelected.companyCode;
      let lines: PromotionDocumentLine[] = [];
      let itemCancelPromotion = [];
      basket.promotionItems.forEach(item => {

        if (item.promotionIsPromo !== "1") //if(item.promotionIsPromo!=="1" )
        {
          // item.discountType = '';
          // item.discountValue = 0;
          if (item.discountType === null || item.discountType === undefined || item.discountType === "") {
            item.discountType = 'Discount Percent';
            item.discountValue = 0;
          }
          let itemLine = lines.find(x=>x.itemCode === item.id && x.uoMCode === item.uom && x.barCode === item.barcode);
          // debugger;
          if(itemLine!==null && itemLine!==undefined)
          {
            itemLine.quantity += item.quantity; 
            itemLine.lineTotal += this.authService.roundingAmount(item.lineTotal) ;
          }
          else
          {
            let docLine = new PromotionDocumentLine();
            docLine.lineNum = item.lineNum;
            docLine.itemCode = item.id;
            // docLine.itemGroup = item.
            docLine.quantity = item.quantity;
            docLine.currency = storeSelected.currencyCode;
            // docLine.vatGroup= '';
            docLine.unitPrice = item.price;
            docLine.uoMCode = item.uom;
            docLine.barCode = item.barcode;
            docLine.lineTotal = item.lineTotal;
            let group = '';
            if(item.mcid !== (null || undefined || "") )
            {
              group = item.mcid;
              
            }
            if( item.itemGroupId !== (null || undefined || '') && group==="")
            {
              group = item.itemGroupId ;
            }
            docLine.itemGroup = group;
            docLine.uCollection = item.itemCategory_1;
            lines.push(docLine);
          }
        }
        else {
          itemCancelPromotion.push(item);

        }


      });

      document.documentLines = lines;

    this.promotionService.runSimulator(document, 'Y').subscribe((response: any) => {

      if (response.success) {
        this.schemalist = response.data;
        // console.log('this.promolist');
        // console.log(this.promolist);
      }
      // else
      // {
      //   this.alertify.warning("Promo " + response.message);
      // }
    })

  }
  loadPromoList() {
    let basket = this.basketService.getCurrentBasket();
    let totalBasket = this.basketService.getTotalBasket();
    let now = new Date();
    let date = this.GetDateFormat(now);
    let customerCode= "";
    let customerGroup= "";
    let source = this.authService.getCRMSource();
    if (basket.customer.mobile !== null && basket.customer.mobile !== undefined && source === 'Capi') {
      customerCode = basket.customer.mobile;
    }
    else {
      customerCode = basket.customer.customerId;
      customerGroup= basket.customer.customerGrpId;
    }
    this.promotionService.getPromoList(this.storeSelected.companyCode, this.storeSelected.storeId, 0, customerCode, customerGroup, totalBasket.billTotal, date).subscribe((response: any) => {

      if (response.success) {
        this.promolist = response.data;
        // console.log('this.promolist');
        // console.log(this.promolist);
      }
      // else
      // {
      //   this.alertify.warning("Promo " + response.message);
      // }
    })

  }
  selectedIndex = 0;
  approveDisplay= false;
  shortcuts: ShortcutInput[] = [];  
  shortcuts$: Observable<ShortcutInput[]>;
  
  approveDiscount(username, password,  customCode, note) {

   


    let model = new checkLogin();

    if(customCode!==null && customCode!==undefined && customCode?.length > 0)
    {
      model.userName = '';
      model.password = '';
      model.customCode = customCode;
    }
    else
    {
      model.userName = username;
      model.password = password;
      model.customCode = '';
    }
 
    console.log(model);
    this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, model.userName,  model.password, model.customCode, 'Adm_Shop', 'btnApprovePromotion', 'I' ).subscribe((response: any)=>{
      
      if (response.success) 
      {
        let userApproval = model.userName;
        debugger;
        if (note !== null && note !== undefined && note !== '') {
          this.basketService.changeNote(note).subscribe((response) => {

          });
          this.alertify.success('Set note successfully completed.');
        }
        debugger;
        this.basketService.changeUserApproval(userApproval).subscribe((response) => {

        }); 
        
        this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
        Swal.fire('Completed Successfully', 'Promotion applied!', 'success');
       
        this.approveDisplay = false;
        this.ouputEvent(true, true, false);
      }
      else
      {
        this.alertify.warning(response.message);
      }
    // this.authService.loginAuth(model).subscribe((response: any) => {
      // const user = response;
      // debugger;
      // if (user) {
      //   let userApproval = user.user.data;
      //   debugger;
      //   if (note !== null && note !== undefined && note !== '') {
      //     this.basketService.changeNote(note).subscribe((response) => {

      //     });
      //     this.alertify.success('Set note successfully completed.');
      //   }
      //   debugger;
      //   this.basketService.changeUserApproval(userApproval.username).subscribe((response) => {

      //   }); 
      //   // debugger;
      //   this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
      //   Swal.fire('Completed Successfully', 'Discount applied!', 'success');
      //   // // this.modalRef.hide();
      //   this.approveDisplay = false;
      //   this.ouputEvent(true, true, false);
      // }
      // else {
      //   this.alertify.warning("Can't login");
      // }
    }, error => {
      this.alertify.warning("Can't login");
    });
  }
  ouputEvent(isClose?, isApply?, isReset?)
  {
    // this.outputDiscount
    let mess=  "isClose: " + isClose +  ",isApply: " + isApply +  ",isReset: " + isReset;
    let discountAllBillType = this.discountAllBillType;
    let discountAllBill = this.discountAllBill;
    this.authService.setOrderLog("Order", "Close Popup Promotion", "", mess);
    this.outputPromotion.emit({isClose, isApply , isReset , discountAllBillType , discountAllBill});
  }
  discountSelectedRow: number;
  isShowNumpadDiscount: boolean = false;
  itemPromotionSelected: IBasketItem; 
  basketDiscountTotal$: Observable<IBasketDiscountTotal>;
  IsDiscountAllBill: boolean = false;
  discountAllBill: string = "0";
  discountAllBillType: string = "Discount Percent";
  ispercentDiscountAllBill: boolean = true;
  discountInLineType: string = "Discount Percent";
  discountInLineAmount: string = "0";
  discountModalShow: boolean = false;
  discountAmount: string;
  
  applySchemaDiscount(schema) {

    this.basketService.changeManualSchema(schema);
    let basket = this.basketService.getCurrentBasket();
    // this.selectedIndex = 0;
    this.basketService.applyPromotionSimulation(basket, null, null, schema).subscribe((response: any) => {
      debugger;

    });
    setTimeout(() => { // this will make the execution after the above boolean has changed
      basket = this.basketService.getCurrentBasket();
      this.discountAllBillType = basket.discountType;
      this.discountAllBill = basket.discountValueTemp.toString();
    }, 500);
  }
  loadSchemaList() {
    // debugger;
    let basket = this.basketService.getCurrentBasket();
    let totalBasket = this.basketService.getTotalBasket();
    let now = new Date();
    let date = this.GetDateFormat(now);
    let customerCode= "";
    let customerGroup= "";
    let source = this.authService.getCRMSource();
    if (basket.customer.mobile !== null && basket.customer.mobile !== undefined && source === 'Capi') {
      customerCode = basket.customer.mobile;
    }
    else {
      customerCode = basket.customer.customerId;
      customerGroup= basket.customer.customerGrpId;
    }
    this.promotionService.getSchemaList(this.storeSelected.companyCode, customerCode, customerGroup, totalBasket.billTotal, date).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.schemalist = response.data;
        console.log('this.schemalist');
        console.log(this.schemalist);
      }
      // else
      // {
      //   this.alertify.warning("Schema " +response.message);
      // }

    })

  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    var hours = (date.getHours()).toString();
    var min = (date.getMinutes()).toString();
    var sec = (date.getSeconds()).toString();
    var time = "T" + hours + min + sec;
    return date.getFullYear() + '-' + month + '-' + (day);
  }
  constructor(public commonService: CommonService, private env: EnvService, private permissionService: PermissionService, private alertify: AlertifyService,public authService: AuthService, private basketService: BasketService,  private mwiService: MwiService, private promotionService: PromotionService, ) { }
  // this.authService.setOrderLog("Order", "Promotion Apply", "Success",  promotionLst );
  ngOnInit() {
    this.loadingData = true;
    this.storeSelected = this.authService.storeSelected();
    this.basket$ = this.basketService.basket$;
    this.basketDiscountTotal$ = this.basketService.basketTotalDiscount$;
    let basket = this.basketService.getCurrentBasket();
    console.log('promotionItems', basket.promotionItems);
    debugger;
    this.discountAllBill = basket.discountValueTemp.toString();
    // this.basketDiscountTotal$.subscribe((data: any)=>{
    //   debugger;
      
    // })
    
    // this.currentShift = this.shiftService.getCurrentShip();
    this.shortcuts$ = this.commonService.Shortcuts$;
    
    // this.loadPromoList();
   
    // this.loadSchemaList();
  }
  production= false;
  ngAfterViewInit() {
    this.production =  environment.production;
    let loginBarcode =   this.env.barcodeLogin ?? false;
    if(loginBarcode)
    {
      this.production = false;
    }
   
    setTimeout(() => {
      this.loadShortcutManual();
    }, 10);
    setTimeout(() => {
      this.loadPromoListSimulate();
    }, 30);
    

  }
  selectedTab = 'user';
  selectTab(code)
  {
    if(code === 'customCode')
    {
      this.selectedTab = "customCode";
      this.txtCustomCode.value = '';
      setTimeout(() => {
      
        this.txtCustomCode.instance.focus();
      }, 10); 
    }
    else
    {
      this.selectedTab = "user";
      setTimeout(() => {
        this.txtUserApprove.instance.focus();
      }, 10); 
    }
  }

  printShow="ItemCode";
  // @ViewChild('txtUserApprove', { static: false }) txtUserApprove;
  @ViewChild('txtUserApprove', { static: false }) txtUserApprove: DxTextBoxComponent;
  @ViewChild('txtPassApprove', { static: false }) txtPassApprove;
  @ViewChild('txtNote', { static: false }) txtNote;
  @ViewChild('txtVoucher', { static: false }) txtVoucher;
  @ViewChild('btnApprove', { static: false }) btnApprove: DxButtonComponent;
  @ViewChild('txtCustomCode', { static: false }) txtCustomCode;
  loadShortcutManual()
  {

    // this.shortcuts = this.commonService.getShortcutsTonull();
    this.shortcuts = null;
    this.shortcuts = [];
    setTimeout(() => {
      this.commonService.changeShortcuts(this.shortcuts, true);
     });

    for(let i= 1; i<= 10; i++)
    {
      let label="Row " + i;
     //  this.shortcuts = this.shortcuts.filter(x=>x.label !== label);
      this.shortcuts.push(
        {
          key: ["alt + " + i],
          label: label,
          description: "Row " + i,
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
           //  setTimeout(() => {
           //    this.removeFocusIndex();
           //  }, 50);
         
            setTimeout(() => {
              if(this.promolist!==null && this.promolist!==undefined && this.promolist?.length > 0)
              {
                let promo= this.promolist[i-1];
                if(promo!==null && promo!==undefined)
                {
                  this.applyPromotionDiscount(promo) 
                }
              }
             
              // let items= this.basketService.getCurrentBasket().promotionItems;
             
              // let item: any=  items[i - 1];
             
              // if(item!==null && item!==undefined)
              // {
              //   this.discountSelectedRow = i - 1;
               
              // }
            }, 50);
          },
          preventDefault: true
        }
      )
    }
    
    this.shortcuts.push( 
      {
        key: ["esc"],
        label: "Out of discount row" ,
        description: "Out of discount row",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          this.discountSelectedRow = -1;
        },
        preventDefault: true
      },
      {
        key: ["shift + n"],
        label: "Reset discount" ,
        description: "Reset discount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          this.discountSelectedRow = -1;
          this.ouputEvent(true, false, true)
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
        key: ["enter"],
        label: "Apply discount" ,
        description: "Apply discount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          this.ApplyDiscount();
          //  if(this.approveDisplay===false)
          //  {
          //   this.ApplyDiscount();
          //  }
          //  else{
         
          //    this.btnApprove.instance.focus();
          //    this.approveDiscount(this.txtUserApprove.value, this.txtPassApprove.value, this.txtCustomCode.value, this.txtNote.value);
          //  }
        
        },
        preventDefault: true
      },
      {
        key: ["alt + v"],
        label: "Focus voucher input" ,
        description: "Focus voucher input",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          this.txtVoucher.nativeElement.focus();
        },
        preventDefault: true
      },
      {
        key: ["alt + a"],
        label: "Apply voucher" ,
        description: "Apply voucher",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          debugger;
         this.findVoucherDetail(this.txtVoucher.nativeElement.value)
        },
        preventDefault: true
      },
      {
        key: ["alt + x"],
        label: "Close Modal" ,
        description: "Close Modal",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          debugger;
          this.ouputEvent(true, false, false)
          // if(this.approveDisplay)
          // {
          //   this.approveDisplay= false;
          // }
          
        },
        preventDefault: true
      },
      {
        key: ["backspace"],
        label: "Back",
        description: "Back",
        command: (e) => {
          // this.itemSelectedRow = '';
         //  console.log(this.selectedRow);
         //  this.selectedRow=-1;
          // debugger;
        },
        preventDefault: true
      },
      
     //  {
     //    key: ["down"],
     //    label: "Down",
     //    description: "Down",
     //    command: (e) => {
     //      debugger;
          
     //    },
     //    preventDefault: true
     //  },
     //  {
     //    key: ["up"],
     //    label: "Up",
     //    description: "Up",
     //    command: (e) => {
     //      debugger;
           
     //    },
     //    preventDefault: true
     //  }
    )
   //  console.log('this.shortcuts X', this.shortcuts);
    // this.commonService.changeShortcuts(this.shortcuts, true);
      setTimeout(() => {
     console.log("set Shortcut", this.shortcuts);
    this.commonService.changeShortcuts(this.shortcuts, true);
   }, 150);
  }
  inputNote(value) {
    // debugger;
    if (value !== null && value !== undefined && value !== '') {
      this.basketService.changeNote(value).subscribe((response) => {

      });
      this.alertify.success('Set note successfully completed.'); 
      // console.log( this.basketService.getCurrentBasket());
    }

  }
  functionId = "Adm_Shop";
 
  ApplyDiscount() {

    this.ouputEvent(false, true, false);


    // let checkAction =  this.authService.checkRole(this.functionId , 'btnApprovePromotion', 'I' );
    // if(checkAction)
    // {
    //   Swal.fire({
    //     title: 'Apply promotion to bill!',
    //     input: 'text',
    //     icon: 'question',
    //     text: 'Remark',
    //     inputAttributes: {
    //       autocapitalize: 'off'
    //     },
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes',
    //     showLoaderOnConfirm: true,
    //     allowOutsideClick: () => !Swal.isLoading()
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.inputNote(result.value); 
    //       this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill));
         
    //       Swal.fire('Completed Successfully', 'Promotion applied!', 'success');
    //       this.ouputEvent(true, true, false);
    //     }
    //   })
    // }
    // else
    // {
    //   if (this.discountApprove === 'false' || this.discountApprove === null || this.discountApprove === undefined) {
    //     Swal.fire({
    //       title: 'Apply promotion to bill!',
    //       input: 'text',
    //       icon: 'question',
    //       text: 'Remark',
    //       inputAttributes: {
    //         autocapitalize: 'off'
    //       },
    //       showCancelButton: true,
    //       confirmButtonText: 'Yes',
    //       showLoaderOnConfirm: true,
    //       allowOutsideClick: () => !Swal.isLoading()
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         this.inputNote(result.value); 
    //         this.basketService.applyDiscountPromotionToBasket(this.discountAllBillType, parseFloat(this.discountAllBill)); 
    //         Swal.fire('Completed Successfully', 'Promotion applied!', 'success');
    //         this.ouputEvent(true, true, false);
            
    //       }
    //     })
    //   }
    //   else {
    //     this.approveDisplay = true;
    //     setTimeout(() => {
    //       this.txtUserApprove.instance.focus();
    //     }, 5);
        
    //   }
  
    // }
   

  }
  removeVoucher(voucher) {
    let basket = this.basketService.getCurrentBasket();
    if (basket.voucherApply.some(x => x.discount_code === voucher.discount_code)) {
      basket.voucherApply = basket.voucherApply.filter(x => x.discount_code !== voucher.discount_code);
      this.basketService.setBasket(basket);
    }

  }
  checkVoucherInBasketTemp(voucherCode) {
    // debugger;
    let basketCheck = this.basketService.getCurrentBasket();
    if (basketCheck.voucherApplyTemp == null || basketCheck.voucherApplyTemp === undefined) {
      return true;
    }
    else {
      if (basketCheck.voucherApplyTemp.some(x => x.voucher_code === voucherCode)) {
        return false;
      }
    }
    return true;;
  }
  checkVoucherInBasket(voucherCode) {
    // debugger;
    let basketCheck = this.basketService.getCurrentBasket();
    if (basketCheck.voucherApply == null || basketCheck.voucherApply === undefined) {
      return true;
    }
    else {
      if (basketCheck.voucherApply.some(x => x.voucher_code === voucherCode)) {
        return false;
      }
    }
    return true;;
  }
  voucherValue: string = '';
  intervalSetUI
  voucherApply(basket, voucher)
  {
    if (voucher !== null && voucher !== undefined && voucher !== '') 
    {
      voucher = voucher.replace(/\s/g, "");
      if (!this.checkVoucherInBasketTemp(voucher)) {
        this.alertify.warning("Can't add voucher. Please check your voucher.");
      }
      else {

        // let voucher = new TapTapVoucherDetails(); 
        // voucher.discount_code = 'PR00000002';
        // voucher.discount_type = '';
        // voucher.discount_value = '';
        // voucher.discount_upto = '';
        // voucher.discount_code = ''; 
        // voucher.min_bill_amount = ''; 
        // let basket = this.basketService.getCurrentBasket();
        // // basket.customer.id = basket.customer.mobile;
        // this.basketService.applyPromotionSimulation(basket, voucher).subscribe(()=>{
        
        // });
      
        // setTimeout(() => { // this will make the execution after the above boolean has changed
        //   basket = this.basketService.getCurrentBasket();
        //   this.discountAllBillType = basket.discountType;
        //   this.discountAllBill = basket.discountValueTemp.toString();
        // }, 350);

        this.mwiService.validateVoucher(basket.customer.id, voucher, this.storeSelected.storeId).subscribe((response: any) => {
          console.log("response find", response);
          if (response.status === 1) {
            debugger;
            this.voucherValue = '';
            let voucher = new TapTapVoucherDetails(); 
            voucher = response.data as TapTapVoucherDetails;

            voucher.discount_type = voucher.discount_type.toString();
            voucher.discount_value = voucher.discount_value.toString();
            voucher.discount_upto = (voucher.discount_upto??'').toString();
            voucher.discount_code = (voucher.discount_code??'').toString();
            voucher.max_redemption = voucher.max_redemption;
            voucher.min_bill_amount = (voucher?.min_bill_amount??"").toString();
            voucher.redemption_count = voucher?.redemption_count;

            console.log("voucher", voucher);

            let twoChar = voucher.discount_code.substring(0, 2);
            // || "BL") || voucher.discount_code !== ("xyz_123" || 'MC')
            if (twoChar !== ("PR" || "PI" )) {
              // if (twoChar === "BL") {
              //   this.ShowAllItemByVoucher(voucher, template);
              // } else {
               
              // }
              this.alertify.warning("Voucher cannot be used to promotion. Please check your voucher.");
            }
            else {
              // if (voucher.discount_code === 'MC') {
              //   this.mwiService.redeemVoucher(cusId, voucher, this.storeSelected.storeId, '').subscribe((response: any) => {
              //     console.log(response);
              //     if (response.status === 1) {

              //       this.alertify.success(response.message);
              //     }
              //     else {
              //       this.alertify.success(response.message);
              //     }
              //   })
              // }
              // else
              // {
              let basket = this.basketService.getCurrentBasket();
              // basket.customer.id = basket.customer.mobile;
              this.basketService.applyPromotionSimulation(basket, voucher).subscribe((response: any) =>{
               
              });
             
              this.intervalSetUI = setInterval(() => {
                let basket = this.basketService.getCurrentBasket();
                if(basket.isSimulate=== null || basket.isSimulate=== false )
                {
                  this.setValueToUI(basket); 

                  
                }
                
              }, 350);
              // this.discountAllBill = this.basketService.getCurrentBasket().discountValue.toString();
              // this.discountAllBillType =  this.basketService.getCurrentBasket().discountType.toString();
              // }


            }

          }
          else {
            if(response.msg==='' || response.msg===undefined || response.msg===null)
            {
              response.msg = "Can't found data. Please check your voucher number";
            }
            this.alertify.warning(response.msg);
          }

        }, error => {
          this.txtVoucher.nativeElement.focus();
          this.txtVoucher.nativeElement.value = '';
          this.alertify.warning(error);
        });

      }
    }
    else {
      this.alertify.warning('Voucher code is null. Please input voucher');
    }
  }
  setValueToUI(basket)
  {
   
      basket = this.basketService.getCurrentBasket();
      this.discountAllBillType = basket.discountType;
      this.discountAllBill = basket.discountValueTemp?.toString();
      console.log('this.discountAllBillType X', this.discountAllBillType);
      console.log('this.discountAllBill X', this.discountAllBill);
      clearInterval(this.intervalSetUI);
  }
  // @ViewChild('txtVoucher', { static: false }) txtVoucher;
  findVoucherDetail(voucher) {
    // this.txtVoucher.value = "";
    // basket.customer.customerId


    let basket = this.basketService.getCurrentBasket();
    if(basket!==null )
    {
      let checkX = false;
      if(basket.promotionApply!==null && basket.promotionApply!==undefined && basket.promotionApply?.length > 0)
      {
        checkX = true;
      }
      if(checkX===true)
      {
        let str="";
        basket.promotionApply.forEach(element => {
          str += element.promoId + ' - ' + element.promoName;
        });
        Swal.fire('Promotion Apply', 'Promotion applied: ' + str, 'info').then(()=>{
          this.voucherApply(basket, voucher);
        }); 
      }
      else
      {
        this.voucherApply(basket, voucher);
      }
    
    }
    else
    {
      this.alertify.warning('Basket is null.');
    }
   


  }
  voucherListTemp:any =[];
  vouchertemp = {};
   applyPromotionDiscount(discountPromotion) {
    // debugger;
    this.authService.setOrderLog("Order", "Manual Promotion Apply", "Success",  discountPromotion?.promoId );
    let basket = this.basketService.getCurrentBasket();
    // this.openPromotionModal(this.ManualPromotion, true , true);
    // this.resetPromotionModal();
  
    this.basketService.applyPromotionSimulation(basket, null, discountPromotion).subscribe((response: any) => {
      debugger; 
    });
    setTimeout(() => { // this will make the execution after the above boolean has changed
      basket = this.basketService.getCurrentBasket();
      this.discountAllBillType = basket.discountType;
      this.discountAllBill = basket.discountValueTemp.toString();

      console.log('this.discountAllBillType', this.discountAllBillType);
      console.log('this.discountAllBill', this.discountAllBill);

    }, 350);
    // 

  }
  
  // openPromotionDetail(item) {

  //   const initialState = {
  //     promotionCode: item.discount_code
  //   };
  //   this.modalRef = this.modalService.show(ShopToolPromotionDetailViewComponent, { initialState });
  // }
}
export class checkLogin {
  userName: string = '';
  password: string = '';
  customCode: string = '';
}
