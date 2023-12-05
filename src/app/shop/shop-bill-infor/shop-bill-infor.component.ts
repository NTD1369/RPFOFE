import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, resolveForwardRef, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IKeyboardLayouts, keyboardLayouts, MAT_KEYBOARD_LAYOUTS } from 'angular-onscreen-material-keyboard';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxPrinterService } from 'ngx-printer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MCustomer } from 'src/app/_models/customer';
import { MEmployee } from 'src/app/_models/employee';
import { MInvoiceInfor } from 'src/app/_models/invoiceinfor';
import { Item } from 'src/app/_models/item';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MSalesChannel } from 'src/app/_models/msaleschannel';
import { Payment } from 'src/app/_models/payment';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { IBasket, IBasketDiscountTotal, IBasketItem, IBasketPayment, IBasketTotal } from 'src/app/_models/system/basket';
import { NumpadDiscountParam } from 'src/app/_models/system/numpadDiscountParam';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { EmployeeService } from 'src/app/_services/data/employee.service'; 
import { ItemService } from 'src/app/_services/data/item.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { SalesChannelService } from 'src/app/_services/data/sales-channel.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { ShopCapacityComponent } from '../capacity/shop-capacity/shop-capacity.component';
import { ShopCardInputComponent } from '../components/shop-card-input/shop-card-input.component';
import { ShopMemberInputComponent } from '../components/shop-member-input/shop-member-input.component'; 
import { ShopInvoiceInputComponent } from '../tools/shop-invoice-input/shop-invoice-input.component';
import { ShopItemSerialComponent } from '../tools/shop-item-serial/shop-item-serial.component';
import { ShopPaymentChangePopupComponent } from '../tools/shop-payment-change-popup/shop-payment-change-popup.component'; 
import { ShopToolsAssignStaffComponent } from '../tools/shop-tools-assign-staff/shop-tools-assign-staff.component';

@Component({
  selector: 'app-shop-bill-infor',
  templateUrl: './shop-bill-infor.component.html',
  styleUrls: ['./shop-bill-infor.component.scss'],

})
export class ShopBillInforComponent implements OnInit, AfterViewInit {

  discountSelectedRow: number;

  isShowNumpadDiscount: boolean = false;
  itemPromotionSelected: IBasketItem;

  formatNumber: string = "4.5-5";
  @Input() IsEvent = false;
  @Output() ItemType = new EventEmitter<any>();
  @Output() fetchItemData = new EventEmitter<any>();
  
  @ViewChildren('input') inputs: QueryList<ElementRef>;
  typeOrder: string = "Receipt";
  onClick(index) {
    // debugger;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.inputs.toArray()[index].nativeElement.focus();
    }, 0);

  }
  allowNegativeExchange="false";
  enableEdit = false;
  enableEditIndex = null;
  amountCharge: string = "";
  selectedRow: number;
  functionId = "Adm_Shop";
  checkAction:boolean = false;
  setClickedRow(index, payment: Payment) {
    // debugger;
    this.amountCharge = "";
    this.selectedRow = index;

    this.payment = payment;

    this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().replace(',', ''));

    this.basketService.changePaymentCharge(this.payment);
    // this.basketService.addPaymentToBasket(this.payment);
  }
  changeValuePayment(value: any, index, payment: Payment) {
    // debugger;
    this.selectedRow = index;
    this.payment = payment;
    // this.payment.paymentCharged = parseFloat(this.payment.paymentCharged.toString().replace(',', ''));
    // this.payment.paymentDiscount = parseFloat(this.payment.paymentDiscount.toString().replace(',', ''));
    this.payment.paymentTotal = parseFloat(this.payment.paymentTotal.toString().replace(',', ''));
    let valueX = parseFloat(value.toString().replace(',', ''));
    if (valueX != this.payment.paymentTotal) {
      this.payment.paymentTotal = valueX;
    }
    this.basketService.changePaymentCharge(this.payment);
    if (value !== "") {
      this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);

    }
    else {
      this.basketService.addPaymentToBasket(this.payment, 0);

    }
  }

  removeselect(index, payment: Payment) {
    // debugger;
    // this.selectedRow = null;

    this.payment = payment;
    this.basketService.changePaymentCharge(this.payment);
    this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
  }
  withShadingOptionsVisible: boolean;
  toggleWithShadingOptions() {
    this.withShadingOptionsVisible = !this.withShadingOptionsVisible;
  }

  removeDiscountSelect(index, item: IBasketItem) {
    // this.discountSelectedRow = null;
    // this.isShowNumpadDiscount=false;
    // this.basketService.changePaymentCharge(this.payment);
    // this.basketService.addPaymentToBasket(this.payment, this.payment.paymentTotal);
  }

  enableEditMethod(e, i) {
    // debugger;
    this.enableEdit = true;
    this.enableEditIndex = i;
    console.log(i, e);
    this.inputs.toArray()[i].nativeElement.focus();
    // this.input.nativeElement.focus();
  }


  myDate = new Date();
  orderNo: string;
  @Output() getPaymentCharge = new EventEmitter<Payment>();
  VirtualKey$: Observable<boolean>;

  constructor(public authService: AuthService, private shortcutService: ShortcutService, private printerService: NgxPrinterService, private mwiService: MwiService, private itemService: ItemService, private billService: BillService, public commonService: CommonService, private basketService: BasketService, private customerService: CustomerService,
    private employeeService: EmployeeService, private alertify: AlertifyService, private modalService: BsModalService, private activatedRoute: ActivatedRoute, private route: Router,
    private licensePlateService :LicensePlateService,private storePaymentService: StorePaymentService,private SalesPlanService: SalesChannelService) {
    this.payment = new Payment();
    //this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.withShadingOptionsVisible = false;
    this.order = new Order();
  }

  modalRef: BsModalRef;
  selectRow(item) {
    debugger;
    this.itemSelectedRow = item.id + item.promotionIsPromo + item.uom + item.promotionPromoCode;
  }
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
  showModal: boolean = false;
  payment: Payment;
  discountModalShow: boolean = false;
  discountAmount: string;
  itemSelectedRow: string = "";
  @ViewChild('template')
  template: TemplateRef<any>;
  openModal(template: TemplateRef<any>) {
    debugger;
    let mode = this.mode;
    let basket = this.basketService.getCurrentBasket();
    let employee = basket.employee;
    this.basketService.removePayments(basket);
    if (employee !== null && employee !== undefined) {
      if(basket.custom1!== null && basket.custom1 !== undefined && basket.custom1 !=='')	
      {	
        let paymentid = basket.items[0].customField10;	
        this.addPaymentDebt(paymentid);	
      }	
      else	
      {	
        this.showModal = true;	
        if(this.poleDisplay==='true')
        {
          // this.
          let poleValue = this.getPole();
          let basketInfor= this.basketService.getTotalBasket(); 
          
          // await this.WriteValue("     WELCOME TO", this.authService.getCompanyInfor().companyName, false);
          this.commonService.WritePoleValue(this.store.companyCode, this.store.storeId, poleValue, this.poleDisplayType, "TOTAL PAYABLE","(" + this.store?.currencyCode + ") " + this.authService.formatCurrentcy(basketInfor.total), false);
        }
        // await this.WriteValue("TOTAL PAYABLE", "(" + this.storeSelected.currencyCode + ") " + this.authService.formatCurrentcy(basketInfor.total), false);
        setTimeout(() => {	
          this.modalRef = this.modalService.show(template, {	
            ariaDescribedby: 'my-modal-description',	
            ariaLabelledBy: 'my-modal-title',	
  	
            class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'	
          });	
        });	
  	
        this.selectedRow = null;	
        this.amountCharge = null;	
        this.payment = null;	
      }
    }
    else {
      this.alertify.warning("Please select employee name");
    }

  }
  selectCustomer(customer) {
    debugger;
    if(customer!==null && customer !==undefined)
    {
      let basket= this.basketService.getCurrentBasket();
      let type = basket.salesType;
      if(type === null || type === undefined || type === '')
      {
        type = "Retail";
      } 
      this.basketService.changeCustomer(customer, type);
      this.modalRef.hide();
    } 
    if(this.storecurrency!==null && this.storecurrency!==undefined && this.storecurrency.length >1)
    {
      this.fetchItemData.emit(true);
    }
  }
  viewCustomer(template: TemplateRef<any>) {
    if (this.customerMode === 'Link') {
      this.route.navigate(['/shop/customer']);
    }
    else {
      this.showModal = true;
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',

          class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
        });
      });

      // const initialState = {
      //   Mode:  'Popup', title: 'Item Serial',
      // };
      // // this.modalRef = this.modalService.show(ShopCustomerComponent , {initialState});
      // let modalRefX = this.modalService.show(ShopCustomerComponent, {initialState ,  animated: true,
      //   keyboard: true,
      //   backdrop: true,
      //   // ignoreBackdropClick: true, 
      //   ariaDescribedby: 'my-modal-description',
      //   ariaLabelledBy: 'my-modal-title', 
      //   class: 'modal-dialog modal-dialog-centered modal-lg '}
      //   );
      //   modalRefX.content.outEvent.subscribe((receivedEntry) => {
      //     console.log('result', receivedEntry);  
      //     debugger;
      //     // this.basketSerrvice.changeCustomer(customer);
      //     if(receivedEntry===true)
      //     {
      //       this.modalRef.hide();

      //     }
      //   });
      // medium-center-modal
    }
    // [routerLink]="['/shop/customer']"
  }
  openInvoiceModal() {

    this.modalRef = this.modalService.show(ShopInvoiceInputComponent);
    // this.modalRef = this.modalService.show(template, {
    //   ariaDescribedby: 'my-modal-description',
    //   ariaLabelledBy: 'my-modal-title', 
    //   class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
    // });

  }
  redirectToTablePage()
  {
    this.route.navigate(["admin/table-cashier/", this.store.storeId , this.placeid]).then(()=>{
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }
  ngAfterViewInit() {
    console.log("afterinit");
    if (this.basket$ !== null && this.basket$ !== undefined) {
      this.basket$.subscribe(data => {
        this.itemSelectedRow = "";
      });
    }

    // setTimeout(() => {
    //   console.log(this.inputs.toArray()[0].nativeElement.focus()); // throws an error
    // }, 1000);
  }

  // selectedItem: IBasketItem;
  selectSerial(item: IBasketItem) {
    // debugger; 
    const initialState = {
      item: item, title: 'Item Serial',
    };
    this.modalRef = this.modalService.show(ShopItemSerialComponent, { initialState });
  }
  SetSerialItem(serialList: MItemSerial[]) {
    // debugger;
    console.log(serialList);
    //  this.alertify.warning("" +serialItem.serialNum);
  }
  orderId = "";
  order: Order;
  changeCustomer(customer: MCustomer) {
    this.basketService.changeCustomer(customer);
  }
  setItemToBasket(lines: TSalesLine[]) {
    lines.forEach(async item => {
      // debugger;
      
      await this.itemService.getItemViewList(this.order.companyCode, this.order.storeId, item.itemCode, item.uomCode, '', '', '', this.order.cusId).subscribe((response: any) => {
        // debugger;
        if (response.data.length > 0) {
          let infor = response.data[0];
          infor.slocId = item.slocId;
          // console.log(ressponse[0]);
          this.basketService.addItemtoBasket(infor, item.quantity);
        }

      })
      //.toPromise();

      //
    });
  }
  removeBasket() {
    const basket = this.basketService.getCurrentBasket();
    this.basketService.deleteBasket(basket);
  }
  store: MStore;
  mode="";
  functionPage = 'Adm_ShopOrder';
  shortcuts: ShortcutInput[] = [];  
  @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;  
  // @ViewChild('filter' , { static: false}) filter: ElementRef;  
  @ViewChild(DxSelectBoxComponent)  employee: DxSelectBoxComponent;  
 loadShortcut()
  {
    this.shortcutService.getByFunction(this.authService.getCurrentInfor().companyCode , this.functionPage).subscribe((response: any) =>{
      // debugger;
      this.shortcuts = this.commonService.getCurrentShortcutKey();
      if( response.data!==null &&  response.data!==undefined &&  response.data.length > 0)
      {
        response.data.forEach(shortcut => {
          let combokey = '';
            if(shortcut.key1==='ctrl')
            {
              shortcut.key1 = 'cmd' ;
            }
            if(shortcut.key1!==undefined && shortcut.key1!==null && shortcut.key1!=='' )
            {
              combokey += shortcut.key1;
            }
            if(shortcut.key2!==undefined && shortcut.key2!==null && shortcut.key2!=='' )
            {
              combokey += " + " +  shortcut.key2;
            }
            if(shortcut.key3!==undefined && shortcut.key3!==null && shortcut.key3!=='' )
            {
              combokey += " + " +  shortcut.key3;
            }
            if(shortcut.key4!==undefined && shortcut.key4!==null && shortcut.key4!=='' )
            {
              combokey += " + " +  shortcut.key4;
            }
            if(shortcut.key5!==undefined && shortcut.key5!==null && shortcut.key5!=='' )
            {
              combokey += " + " +  shortcut.key5;
            }
          if(shortcut.custom1 === 'Invoice' || shortcut.custom1 === 'NewOrder' || shortcut.custom1 === 'Payment' || shortcut.custom1 === 'Employee')
          {
            if(this.shortcuts!==null && this.shortcuts!==undefined)
            {
              this.shortcuts.push(
                {
                  key: [combokey],
                  label: shortcut.name,
                  description: shortcut.description,
                  command: (e) => {
                    // console.log("Test X mark clicked", { e });
                    debugger;
                    if(shortcut.custom1 === 'Invoice')
                    {
                      this.openInvoiceModal()
                    }
                    if(shortcut.custom1 === 'NewOrder')
                    {
                      this.cancelOrder();
                    }
                    if(shortcut.custom1 === 'Employee')
                    {
                      this.employee.instance.focus();
                      this.employee.instance.open();
                    }
                    if(shortcut.custom1 === 'Payment')
                    {
                      this.openModal(this.template);
                    }
                    
                    
                  
                  },
                  preventDefault: true
                }
              )
            }
          
          }
      
        });
        this.commonService.changeShortcuts(this.shortcuts);
        // debugger;
        // console.log(this.shortCutList);
      }
    })
  }
  storecurrency : MStoreCurrency[] = [];
  IsGenOrderNo$: Observable<boolean>;
  addRemark()
  {
    Swal.fire({
      title: 'Remark!',
      input: 'text',
      icon: 'question',
      // text: 'Remark',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Yes',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.inputNote(result.value);  
      }
    })
  }
  inputNote(value) {
    // debugger;
    if (value !== null && value !== undefined && value !== '') {
      this.basketService.changeNote(value).subscribe((response) => {

      });
      this.alertify.success('Set note successfully completed.');
      ;
      // console.log( this.basketService.getCurrentBasket());
    }

  }
  holdOrderX() {
    this.basketService.addOrder("", "HOLD").subscribe(
      (response: any) => {
        this.basketService.changeIsCreateOrder(false);
        this.basketService.changeBasketResponseStatus(true);   
        if (response.success) {
          this.alertify.success(response.message);
          this.getBill(response.message, null);

        }
        else {
          this.basketService.changeIsCreateOrder(false);
          this.basketService.changeBasketResponseStatus(true);   
          this.alertify.error(response.message);


        }

      },
      (error) => {
        this.basketService.changeIsCreateOrder(false);
        this.basketService.changeBasketResponseStatus(true);   
        this.alertify.error(error);

      }
    );
  }
  // getBill(transId) {
  //   return this.billService.getBill(transId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any) => {
  //     this.basketService.changeIsCreateOrder(false);
  //     this.basketService.changeBasketResponseStatus(true);   
  //     if (response.success) {
  //       if (response.data !== null && response.data !== undefined) {
  //         console.log('this.outPutModel', this.outPutModel);
  //         // clearInterval(this.interval);
  //         setTimeout(() => {
  //           this.outPutModel = response.data;
  //         }, 100);
  //         setTimeout(() => {
  //           this.clearOrder();
  //         }, 300);
         
  //         // this.printTemplate();
  //       }
  //       else {
  //         this.alertify.warning(response.message);
  //       }
  //     }
  //   })
  // }
  placeid="";
  tableid = "";
  ngOnInit() {
    this.storecurrency = this.authService.getStoreCurrency();
    this.shortcuts = this.authService.getShortcutWindown(this.functionPage, '');
    this.checkAction =  this.authService.checkRole(this.functionId , 'isCheckLicensePlate', 'V');
    this.loadShortcut();
    this.IsGenOrderNo$ = this.basketService.IsGenOrderNo$;
    debugger;
    if(this.basketService.getCurrentIsNewGenOrderNo())
    {
      console.log("Gen New Order");
    }

    this.store = this.authService.storeSelected();
    // this.activatedRoute.params.subscribe(data => { 
    //   this.orderId = data['id'];
    // })
    debugger;
    this.activatedRoute.params.subscribe(data => {
      debugger;
      this.orderId = data['id'];
      this.mode = data['m']; 
      this.placeid = data['placeid'];
    })
    console.log("this.mode", this.mode);
    if (this.mode?.toLowerCase() === "checkout" || this.mode?.toLowerCase() === "table" || this.mode?.toLowerCase() === "preorder" ) { 
     
       this.tableid= this.orderId;// String.ass Object.assign("", ).toString();
       this.orderId ="" ; 
    }


    // else
    // {

    // }
    this.poleValue = this.getPole();
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
    this.basketDiscountTotal$ = this.basketService.basketTotalDiscount$;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    const basket = this.basketService.getCurrentBasket();
    if (this.orderId === "" || this.orderId === null || this.orderId === undefined || this.orderId.toString() === "undefined") {
      this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {

        this.orderNo = data;
      });
    }
    else {
      this.orderNo = this.orderId;
    }

    
    this.loadSetting();
    // debugger;
    // if(basket===null || (basket.customer===null || basket.customer===undefined))
    // {

    //      this.addNewOrder(); 
    // }
    // else
    // {


    //   if(this.orderId==="" || this.orderId ===null || this.orderId===undefined || this.orderId.toString() ==="undefined")
    //   {

    //   }

    // }

    this.loadEmployee();
    this.loadChannel();

  }
  employees: MEmployee[];
  showAssignStaff(item)
  {
    const initialState = {
     item: item, 
     AssignType : this.AssignType
    };
    this.modalService.show(ShopToolsAssignStaffComponent, {
      initialState, 
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
    });
  }
  loadEmployee() {
    let checkAv = false;
    if(this.employeeSystem !== 'Local')
    {
      checkAv = true;
    }
    if(checkAv)
    {

      this.employeeService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, checkAv).subscribe((response: any) => {
        if(response.success)
        {
  
          this.employees = response.data;
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Employee Data',
            text: response.message
          });
        }
      });
    }
    else
    {
      
      this.employeeService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).subscribe((response: any) => {
        if(response.success)
        {

          this.employees = response.data;
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Employee Data',
            text: response.message
          });
        }
      });
    }
  }
  channels:MSalesChannel[];
  loadChannel(){
    this.SalesPlanService.getAll(this.authService.storeSelected().companyCode,'').subscribe(res=>
      {
        if(res.success = true)
        {
          this.channels = res.data;
        }
        else
        {
          this.alertify.error(res.message);
        }
       
      });
  }
  onchannelChanged(e){
    if (e !== null && e !== undefined && this.channels !== null && this.channels !== undefined && this.channels?.length > 0) {
      const previousValue = e.previousValue;
      const newValue = e.value;
      // Event handling commands go here
      // debugger;
            let basket = this.basketService.getBasketLocal();
            basket.saleschannel = e.value;
            this.basketService.setBasket(basket);
    }
  }
  toggleModal() {
    // debugger;
    this.discountModalShow = !this.discountModalShow;
  }
  increment(item: IBasketItem) {
    this.basketService.incrementItemQty(item);
  }
  onBlurMethod(item: IBasketItem) {
    debugger;
    let basket = this.basketService.getCurrentBasket();
    let basketlocal = this.basketService.getBasketLocal();
    const foundItem  = basketlocal.items.find((x) => x.id === item.id && x.uom === item.uom); 
    const quantity = foundItem.quantity;
    if (basket.salesType.toLowerCase() == 'ex' || basket.salesType.toLowerCase() == 'exchange') {
      if (item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
        item.quantity = 0;
      }
    }
    else {
      if (item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
        item.quantity = 0;
      }
    }
    if(item.customField9==="Y")
    {
      this.licensePlateService.checkLicensePlate(this.authService.getCurrentInfor().companyCode,item.custom1,item.quantity).subscribe((x:any)=>
      {
        if(x.success ==true)
        {
          this.basketService.updateItemQty(item);
          return;
        }
        else if(x.Message!=null || x.Message!=undefined|| x.Message!='' )
        {
          item.quantity = quantity;
          this.basketService.updateItemQty(item);
            // this.alertify.error("Too many times used today")
            Swal.fire({
            
              title: 'Too many times used today',
              icon:"warning",
              // input: 'text',
              inputAttributes: {
                autocapitalize: 'off'
              },
              // showCancelButton: true,
              confirmButtonText: 'OK',
              showLoaderOnConfirm: true,
        
              allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {});
          return;
        }
        else{
          this.alertify.error(x.Message);
          return;
        }
      })
    }
    else
    this.basketService.updateItemQty(item);
  }
  updateNote(item: IBasketItem) {
    // debugger;
    if (item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
      item.quantity = 0;
    }
    this.basketService.updateRemark(item);
  }
  decrement(item: IBasketItem) {
    this.basketService.decrementItemQty(item);
  }
  remove(item: IBasketItem) {
    this.basketService.removeItem(item);
  }
  removeCapacityLine(item: IBasketItem,ispromo = false) {
    debugger;
    // this.basketService.removeCapacityLine(item, ispromo);
    this.basketService.removeCapacityLine(item);
  }
  editCapacityLine(item: IBasketItem,ispromo =false) {
    item.quantity = item.quantity / item.capacityValue;
    const initialState = {
      basketModel: item, title: 'Item Capacity',
      ispromo :ispromo
    };

    this.modalRef = this.modalService.show(ShopCapacityComponent, { initialState });
  }


  // showInfor()
  // {
  //   let basketTotal = basketTotal basketTotal$.discountBillValue > 0
  // }
  editCardLine(item: IBasketItem) {
    const initialState = {
      item: item, title: 'Item Capacity',
    };
    // debugger;
    if (item.quantity === 0 || item.quantity === null) {
      item.quantity = 1;
    }
    this.modalRef = this.modalService.show(ShopCardInputComponent, { initialState });
  }
  editMemberLine(item: IBasketItem) {
    const initialState = {
      item: item,
      selectedKey : [item.serialNum],
      title: 'Item Capacity',
    };
    // debugger;
    if (item.quantity === 0 || item.quantity === null) {
      item.quantity = item.memberValue;
    
    }
    this.modalRef = this.modalService.show(ShopMemberInputComponent, { initialState });
  }
  removePayment(payment: IBasketPayment) {
    this.basketService.removePayment(payment);
    this.selectedRow = null;
    this.amountCharge = null;
    this.payment = null;
  }
  clearAmount(i, payment: Payment) {
    this.amountCharge = "";
  }
  isShowOtherPayment: boolean = false;
  showOtherPayment() {
    this.isShowOtherPayment = !this.isShowOtherPayment;

  }
  showToggle = false;
  toggleInfor() {
    let vl = 0;
    this.basketTotal$.subscribe((data: any) => vl = data)
    if (vl > 0) {
      this.showToggle = true;
    }
  }
  closeOtherPad() {
    this.isShowOtherPayment = !this.isShowOtherPayment;
  }
  clearAmountPayment(payment: Payment) {
    this.basketService.addPaymentToBasket(payment, 0);
  }
  addPayment(paymentId: string, isClose?: boolean) {
    // debugger;
    let numCollected = 0;
    if (this.payment !== null) {
      let paymentX = this.basketService.getCurrentBasket().payments.find(x => x.id === this.payment.id);
      if (paymentX !== null && paymentX !== undefined) {
        numCollected = paymentX.paymentTotal;
      }
    }
    if (this.payment !== null && numCollected == 0) {
      // this.alertify.warning("Please Complete progress payment " + this.payment.id + "!");
      Swal.fire({
        icon: 'warning',
        title: 'Payment',
        text: "Please Complete progress payment " + this.payment.id + "!"
      });
    }
    else {
      this.amountCharge = "";
      let amountLeft = 0;
      this.basketTotal$.subscribe(data => {
        console.log(data);
        amountLeft = data.subtotal - data.totalAmount;
      });
      if (amountLeft <= 0) {
        this.alertify.warning("Can't add new payment to bill.");
      }
      else {
        this.payment = new Payment();
        // let paymentX = new Payment();
        // .id=
        this.payment.id = paymentId;
        this.payment.refNum = "";
        this.payment.paymentDiscount = 0;
        this.payment.paymentTotal = 0;
        this.basketTotal$.subscribe(data => {
          console.log(data);
          this.payment.paymentCharged = data.subtotal - data.totalAmount;
        });
        let linenum = this.basketService.getCurrentBasket().payments.length + 1;
        this.payment.lineNum = linenum;

        this.basketService.changePaymentCharge(this.payment);
        this.basketService.addPaymentToBasket(this.payment);
        var payments = this.basketService.getCurrentPayment();
        if (payments.length > 0) {
          this.selectedRow = this.basketService.getCurrentPayment().length - 1;
          this.setClickedRow(this.selectedRow, this.payment);
          for (let i = 0; i < payments.length; i++) {
            if (payments[i].id === paymentId) {
              this.selectedRow = i;
              this.setClickedRow(this.selectedRow, this.payment);
            }
          }

        }
        else {
          this.selectedRow = 0;
        }
        if (isClose) {
          this.closeOtherPad();
        }
      }

    }

  }

  inputNum(num: string) {
    // debugger;
    if (!this.isFastClick) {
      this.amountCharge = "";
    }
    if (this.amountCharge === null || this.amountCharge === undefined) {
      this.amountCharge = "";
    }
    this.isFastClick = true;
    //  this.payment.paymentCharged =
    let currentX = this.amountCharge === "" ? 0 : parseFloat(this.amountCharge);
    let numX = num === "" ? 0 : parseFloat(num);
    let value = currentX + numX;
    this.amountCharge = value.toString();
    // this.selectedRow = index;

    // this.payment.paymentCharged = parseFloat(this.amountCharge);
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));

    //  this.selectedRow = null;
  }
  isFastClick: boolean = false;
  pressKey(key: string) {
    if (this.isFastClick) {
      this.amountCharge = "";
    }
    if (this.amountCharge === null || this.amountCharge === undefined) {
      this.amountCharge = "";
    }
    this.isFastClick = false;
    // debugger;
    if (key === "000") {
      this.amountCharge = this.payment.paymentCharged.toString();
      // this.basketTotal$.subscribe(data => {
      //   debugger;

      // });
    }
    else {
      //  this.payment.paymentCharged =
      this.amountCharge += key;
    }

    // this.selectedRow = index;

    // this.payment.paymentCharged = parseFloat(this.amountCharge);
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
  }

  submitPayment() {

    // this.basketService.changePaymentCharge(this.payment); 
    this.basketService.addPaymentToBasket(this.payment, parseFloat(this.amountCharge));
    this.amountCharge = "";
  }
  async newOrder() {
    let store = this.authService.storeSelected();
    let currentType = "Retail";
    debugger;
    this.basketService.changeIsCreateOrder(false); 
    this.basketService.changeBasketResponseStatus(true);
    console.log("newOrder");
    let defEmployee = this.authService.getCurrentInfor()?.defEmployee;
    this.order = new Order();
    this.outPutModel = null;
    this.order.salesPerson = null;
    const basket = this.basketService.getCurrentBasket();
    if (basket !== null && basket !== undefined) {

      this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {

        this.orderNo = data;
      });
      this.basketService.deleteBasket(basket).subscribe(() => {


      });

      let cus = this.authService.getDefaultCustomer();
      // debugger;
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          // if(this.mode === 'table' ||this.mode === 'preorder')
          // {
          //   currentType = "Table";
          // }
          this.basketService.changeCustomer(cus, currentType);
          // debugger;
          // this.route.navigate(['/shop/order']);
          if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
            // debugger;
            let employee = this.employees.find(x => x.employeeId === defEmployee);
            if (employee !== null && employee !== undefined) {
              this.order.salesPerson = defEmployee;
              this.basketService.changeEmployee(employee);
              // this.basketService.changeEmployee(employee);
            }
            else {
              if (this.employees.length > 0) {
                this.order.salesPerson = this.employees[0].employeeId;
              }
              // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
            }
          }
          debugger;
          if (this.authService.getShopMode() === 'FnB') {
            if(this.mode === 'table' ||this.mode === 'preorder')
            {
              // this.route.navigate(["admin/table-design/", this.orderId, this.placeid ]);
              this.route.navigate(["admin/table-cashier/", this.store.storeId , this.placeid]).then(()=>{
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              });
            }
            else  
            {
              this.route.navigate(["shop/order"]).then(() => {
                if(this.checkAction)
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
               
                // window.location.reload();
              });
            }
           
          }
          if (this.authService.getShopMode() === 'Grocery') {
            this.route.navigate(["shop/order-grocery"]).then(() => {
              // window.location.reload();
            });

          }
          // this.routeNav.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
        }, 2);
      }
    }
    else {
      let cus = this.authService.getDefaultCustomer();
      // debugger;
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          // if(this.mode === 'table' ||this.mode === 'preorder')
          // {
          //   currentType = "Table";
          // }
          this.basketService.changeCustomer(cus, currentType);
          // this.route.navigate(['/shop/order']);
          if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
            let employee = this.employees.find(x => x.employeeId === defEmployee);
            if (employee !== null && employee !== undefined) {
              this.order.salesPerson = defEmployee;
              this.basketService.changeEmployee(employee);
              // this.basketService.changeEmployee(employee);
            }
            else {
              if (this.employees.length > 0) {
                this.order.salesPerson = this.employees[0].employeeId;
              }
              // this.alertify.warning("Can't set default employee. B/c employee " + defEmployee + " has not existed in store " + this.storeSelected.storeId);
            }
          }
          debugger;
          if (this.authService.getShopMode() === 'FnB') {
            if(this.mode === 'table' ||this.mode === 'preorder')
            {
              // this.route.navigate(["admin/table-design/", this.orderId, this.placeid ]);
              this.route.navigate(["admin/table-cashier/", this.store.storeId , this.placeid]).then(()=>{
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              });
            }
            else  
            {
              this.route.navigate(["shop/order"]).then(() => {
                if(this.checkAction)
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
               
                // window.location.reload();
              });
            }
           
          }
          if (this.authService.getShopMode() === 'Grocery') {
            this.route.navigate(["shop/order-grocery"]).then(() => {
              // window.location.reload();
            });

          }
          // this.routeNav.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
        }, 2);
      }

    }
   
    
  }
  addNewOrder() {
    let test = this.basketService.getCurrentBasket()
    // debugger;
    if (test === null) {
      this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
        // console.log(data);
        this.orderNo = data;
      });
      // this.alertify.success("AAAA");
      let cus = this.authService.getDefaultCustomer();
      // debugger;
      if (cus !== null && cus !== undefined) {
        setTimeout(() => {
          this.basketService.changeCustomer(cus, "Retail").subscribe(() => {
            // this.route.navigate(['/shop/order']).then();
            if (this.authService.getShopMode() === 'FnB') {
              this.route.navigate(["shop/order"]).then(() => {
                // window.location.reload();
              });
            }
            if (this.authService.getShopMode() === 'Grocery') {
              this.route.navigate(["shop/order-grocery"]).then(() => {
                // window.location.reload();
              });

            }
          });
        }, 2);
      }
      else {
        this.customerService.getItem(this.store.companyCode, this.store.defaultCusId).subscribe((reponse: any) => {
          // debugger;
          this.basketService.changeCustomer(reponse.data, "Retail").subscribe(() => {
            if (this.authService.getShopMode() === 'FnB') {
              this.route.navigate(["shop/order"]).then(() => {
                // window.location.reload();
              });
            }
            if (this.authService.getShopMode() === 'Grocery') {
              this.route.navigate(["shop/order-grocery"]).then(() => {
                // window.location.reload();
              });

            }
          });
          // this.route.navigate(['/shop/order']);


        });
      }

    }
  }
  onTypeChanged(type) {
    // debugger;
    if (type !== null && type !== undefined) {
      this.ItemType.emit(type);
    }

  }
  voucherVisible = false;
  toggleVoucherVisible() {
    this.voucherVisible = !this.voucherVisible;
  }
  typeOptions = [
    {
      value: "", name: "All",
    },
    {
      value: "S", name: "Service",
    },
    {
      value: "I", name: "Inventory",
    },

  ];
  withTotalDiscountVisible = false;
  toggleTotalDiscountOptions() {
    this.withTotalDiscountVisible = !this.withTotalDiscountVisible;
  }

  customerMode = "Link";
  exchangeItemMode = "FromOrder";
  eInvoice = "false"; loyalty = "false";
  poleDisplay="false";
  poleDisplayType="";
  ignorePoleDisplay=true;
  printShow="ItemCode";
  employeeSystem="Local";
  AssignStaff = "false";// "false";
  AssignType = "OnBill";
  chanel = "false"; 
 

  loadSetting() {
    let mode = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'CustomerDisplayMode');
    if (mode !== null && mode !== undefined) {
      this.customerMode = mode.settingValue;
    }
    let employeeSystemData = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'EmployeeSystem');
    if (employeeSystemData !== null && employeeSystemData !== undefined) {
      this.employeeSystem = employeeSystemData.settingValue;
    }
    let exMode = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'ExchangeItems');
    if (exMode !== null && exMode !== undefined) {
      this.exchangeItemMode = exMode.settingValue;

    }
    let assignStaff = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'AssignStaff');
    if (assignStaff !== null && assignStaff !== undefined) {
      this.AssignStaff =  assignStaff.settingValue; 
      if(this.AssignStaff === "true")
      {
        if(assignStaff.customField2 !== undefined && assignStaff.customField2 !== null && assignStaff.customField2 !== "")
        {
          this.AssignType = assignStaff.customField2; 
        }
        else  
        {
          this.AssignType = "OnBill"; 
        }
      }
      this.AssignStaff = "true";
      this.AssignType = "OnBill";
    }


    let eInvoice = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'Invoice');
    if (eInvoice !== null && eInvoice !== undefined) {
      this.eInvoice = eInvoice.settingValue;

    }
    let loyalty = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'Loyalty');
    if (loyalty !== null && loyalty !== undefined) {
      this.loyalty = loyalty.settingValue;

    }
    let printByApp = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'PrintByApp');
    if (printByApp !== null && printByApp !== undefined) {
      this.printByApp = printByApp.settingValue; 
    }
    let printShow = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CustomerDisplayMode');
    if (printShow !== null && printShow !== undefined) {
      this.printShow = printShow.settingValue;
    }
    let allowNegativeExchange = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'AllowNegativeExchange');
    if (allowNegativeExchange !== null && allowNegativeExchange !== undefined) {
      this.allowNegativeExchange = allowNegativeExchange.settingValue;
    }
    let poleDisplay = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PoleDisplay');
    if (poleDisplay !== null && poleDisplay !== undefined) {
      this.ignorePoleDisplay=false;
      this.poleDisplay = poleDisplay.settingValue;
      let cusF1 = poleDisplay.customField1; 
      if(cusF1!==null && cusF1!==undefined && cusF1?.toLowerCase() ==='serialport')
      {
        this.poleDisplayType = "serialport";
      }
      else
      {
        this.poleDisplayType = "";
      }
    }
    let chanel = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'chanel');
    if (chanel !== null && chanel !== undefined) {
      this.chanel = chanel.settingValue;

    }
  }
  // viewCustomer()
  // {
  //   if(this.customerMode==='Link')
  //   {
  //     this.route.navigate(['/shop/customer']);
  //   }
  //   else
  //   {
  //     const initialState = {
  //       Mode:  'Popup', title: 'Item Serial',
  //     };
  //     // this.modalRef = this.modalService.show(ShopCustomerComponent , {initialState});
  //     this.modalRef = this.modalService.show(ShopCustomerComponent, {initialState ,  animated: true,
  //       keyboard: true,
  //       backdrop: true,
  //       ignoreBackdropClick: true, 
  //       ariaDescribedby: 'my-modal-description',
  //       ariaLabelledBy: 'my-modal-title', 
  //       class: 'modal-dialog modal-dialog-centered modal-lg '}
  //       );
  //       this.modalRef.content.outEvent.subscribe((receivedEntry) => {
  //         console.log('result', receivedEntry);  
  //         if(receivedEntry===true)
  //         {
  //           this.modalRef.hide();

  //         }
  //       });
  //       // medium-center-modal
  //   }
  //   // [routerLink]="['/shop/customer']"
  // }
  exchangeItems = 'FromOrder';
  switchValueChanged(e) {
    const previousValue = e.previousValue;
    const newValue = e.value;
    console.log(newValue);
    this.basketService.changeReturnMode(newValue);
    // Event handling commands go here
  }
  returnMode = true;
  @ViewChild('PrintTemplate')
  private PrintTemplateTpl: TemplateRef<any>;

  
  printTemplate() {
    this.printerService.printAngular(this.PrintTemplateTpl);
  }
  outPutModel: Order;
  discountLine = 0;
  bonusLine = 0;
  printByApp="true";
  getPole() : SStoreClient
  {
    let poleSetup = localStorage.getItem("poleSetup");
    let result = null;
    if(poleSetup!==null && poleSetup!==undefined)
    {
      result = JSON.parse(poleSetup);
    }
    return result;
  }
  getBill(transId, ChangeAmount ) {
    let loopNum =0;
    let waitingAPi = true;
    let basket = this.basketService.getCurrentBasket();
    debugger;
    // this.interval = setInterval(()=>{
    //   if(loopNum < 3 && waitingAPi===true)
    //   {  
      // console.log('respone 3' , this.basketService.getBasketResponseStatus());
      this.basketService.changeIsCreateOrder(false);
      if(this.printByApp==="true")
      {
        this.billService.getBill(transId, this.store.companyCode, this.store.storeId).subscribe((response: any) => {
          loopNum++;
          this.basketService.changeBasketResponseStatus(true);
          // console.log("getBill");
          if (response.success) {
            
            response.data.totalQty = 0;
            // console.log('response.data print', response.data);
            response.data.lines.forEach(line => {
              if(line.discountType !== "Bonus Amount"){
                this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
                this.order.discountLine = this.discountLine;
                // console.log("this.discountLine", this.discountLine);
              }else{
                this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
                this.order.bonusLine = this.bonusLine;
                // console.log("this.bonusLine", this.bonusLine);
              }
              response.data.totalQty += line.quantity;
            
            }); 
            
            // console.log("this.outPutModel", this.outPutModel);
           
            debugger;
            if(response.data!==null && response.data!==undefined)
            {
              if(response.data.salesType.toLowerCase() !== 'table')
              {
                    // console.log('this.outPutModel', this.outPutModel);
                waitingAPi = false;
                // clearInterval(this.interval);
              
                if(basket.salesType?.toLowerCase() === 'return' 
                  || basket.salesType?.toLowerCase() === 'ex' 
                  || basket.salesType?.toLowerCase() === 'exchange')
                  {
                  
                    // setTimeout(() => {
                    //   this.outPutModel = response.data;
                    //   // window.print(); 
                    // }, 200);
                  
                    setTimeout(() => {
                      this.outPutModel = response.data;
                      // window.print(); 
                    }, 100);
                    Swal.fire({
                      title: 'This is Return / Exchange Bill?',
                      text: 'Do you want to have a copy',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Yes',
                      cancelButtonText: 'No'
                    }).then((result) => {
                      if (result.value) {
                        debugger;
                        setTimeout(() => {
                          this.outPutModel = null;
                          
                        }, 10);
                        setTimeout(() => {
                          // this.outPutModel = null;
                          this.outPutModel = response.data; 
                          setTimeout(() => { 
                            this.authService.deleteOrderLog();
                            this.newOrder();
                          }, 100);
                        }, 50);
                      }
                      else
                      {
                        if(ChangeAmount!==null && ChangeAmount!==undefined && ChangeAmount !== 0)
                        {
                          
                          if(this.poleDisplay==='true'   )
                          {
                            if(ChangeAmount !== 0)
                            {
                              
                              this.WriteValue("CHANGE AMOUNT", "(" + this.store.currencyCode + ") " + this.authService.formatCurrentcy(ChangeAmount), false);
                            }
                          
                          }
                          setTimeout(()=>{
                            Swal.fire({
                              icon: 'info',
                              title: 'Amount Change: ' + this.authService.formatCurrentcy(ChangeAmount),
                              text: 'Order Id: ' + transId,
                              allowEscapeKey : false,
                              allowOutsideClick: false,
                              showConfirmButton:true,
                              confirmButtonText: 'Ok',
                              focusConfirm:true
                            }).then(()=>{
                              this.authService.deleteOrderLog();
                              this.newOrder();
                            }) 
                          },10)
                        }
                        else
                        {
                          this.authService.deleteOrderLog();
                          this.newOrder();
                        }
                        // setTimeout(() => {
                        //   this.outPutModel = response.data;
                        //   // window.print(); 
                        // }, 200);
                      
                      }
                    });
                  }
                  else
                  {
                    // setTimeout(() => {
                    //   this.outPutModel = response.data;
                    //   // window.print(); 
                    // }, 100);

                    setTimeout(() => { 
                      if(ChangeAmount!==null && ChangeAmount!==undefined && ChangeAmount !== 0)
                        {
                          setTimeout(()=>{
                            Swal.fire({
                              icon: 'info',
                              title: 'Amount Change: ' + this.authService.formatCurrentcy(ChangeAmount),
                              text: 'Order Id: ' + transId,
                              allowEscapeKey : false,
                              allowOutsideClick: false,
                              showConfirmButton:true,
                              confirmButtonText: 'Ok',
                              focusConfirm:true
                            }).then(()=>{
                              this.authService.deleteOrderLog();
                              this.newOrder();
                            }) 
                          },10)
                        }
                        else
                        {
                          this.authService.deleteOrderLog();
                          this.newOrder();
                        }
                      
                    }, 100);

                    setTimeout(() => {
                      this.outPutModel = response.data;
                      // window.print(); 
                    }, 200);
                  }

                
                // setTimeout(() => {
                
                //   this.newOrder();
                // }, 600);
              }
              else
              {
                // if(this.mode === 'table' ||this.mode === 'preorder')
                // {
                  // this.route.navigate(["admin/table-design/", this.orderId, this.placeid ]);
                  //navigate : thanh toán xong redirect về đâu đó 
                  this.route.navigate(["admin/table-cashier", this.store.storeId , this.placeid]).then(()=>{
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                  });
                // }
              }
            
            }
            else{
              Swal.fire({
                icon: 'warning',
                title: 'Print bill',
                text: "Can't get data of order. Please manual print"
              }).then(() => {
                this.route.navigate(["shop/bills/print", transId, this.store.companyCode, this.store.storeId]).then(() => {
                  window.location.reload();
                }); 
              });
            }
            // debugger;
          
            // this.printTemplate();
            
           
            // this.outPutModel = response.data;
           
            // setTimeout(() => {
            //   window.print();
            // }, 1000);
    
            // this.newOrder()
          }
          else {
            this.alertify.warning(response.message);
          }
          
        })
      }
      else
      {
        
        this.basketService.changeBasketResponseStatus(true);
        let reprint = false;
        if(basket.salesType?.toLowerCase() === 'return' 
        || basket.salesType?.toLowerCase() === 'ex' 
        || basket.salesType?.toLowerCase() === 'exchange')
        {
          reprint = true;
        }
        setTimeout(() => {
          if(ChangeAmount!==null && ChangeAmount!==undefined && ChangeAmount !== 0)
          {
            setTimeout(()=>{
              if(this.poleDisplay==='true'   )
              {
                if(ChangeAmount !== 0)
                {
                  
                  this.WriteValue("CHANGE AMOUNT", "(" + this.store.currencyCode + ") " + this.authService.formatCurrentcy(ChangeAmount), false);
                }
               
              }

              Swal.fire({
                icon: 'info',
                title: 'Amount Change: ' + this.authService.formatCurrentcy(ChangeAmount),
                text: 'Order Id: ' + transId,
                allowEscapeKey : false,
                allowOutsideClick: false,
                showConfirmButton:true,
                confirmButtonText: 'Ok',
                focusConfirm:true
              }).then(()=>{
                this.authService.deleteOrderLog();
                this.newOrder();
              }) 
            },10)
          }
          else
          {
            this.authService.deleteOrderLog();
            this.newOrder();
          } 
          // this.newOrder();
        }, 5);
        let poleValue = this.getPole();
        let size = "";
        if(poleValue!==null && poleValue!==undefined)
        {
          if(poleValue?.printSize!==null && poleValue?.printSize!==undefined)
          {
            size = poleValue?.printSize;
          }
        }
        this.billService.PrintReceipt( this.store.companyCode, this.store.storeId, transId, 'Receipt', size, poleValue.printName ).subscribe((response: any) => {
          
          if (response.success) {
            if(reprint)
            {
              Swal.fire({
                title: 'This is Return / Exchange Bill?',
                text: 'Do you want to have a copy',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
              }).then((result) => {
                if (result.value) {
                  this.billService.PrintReceipt( this.store.companyCode, this.store.storeId, transId, 'Receipt copy', size, poleValue.printName ).subscribe((response: any) => {
                    if (response.success) {
                    }
                    else
                    {
                      this.alertify.warning(response.message);
                    }
                  })
                }
               
              });
            }
            
          }
          else {
            this.alertify.warning(response.message);
          }
          
        })
      }
       
      // }
    // }, 600);
    // var handleinterval = interval(500).subscribe(x => {
     
      
    //   // else
    //   // {
    //   //   this.waitingAPi= false;
    //   //   this.confirmResult =false;
    //   //   payment.refNum ="";
    //   //   payment.customF1 = "";
    //   //   let basket = this.basketService.getCurrentBasket();
    //   //   this.basketService.addOrUpdatePayment(basket.payments, payment, payment.paymentTotal);
    //   //   this.loadingService.endLoading(this, LoadingIndicator.MANUAL);
        
    //   // }
    // }); 
    // if(loopNum > 3 && waitingAPi)
    // {
    //   // this.alertify.warning("Can't get data of order. Please manual print");
    //   clearInterval(this.interval);
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Print bill',
    //     text: "Can't get data of order. Please manual print"
    //   }).then(() => {
    //     this.routeNav.navigate(["shop/bills/print", transId, this.storeSelected.companyCode, this.storeSelected.storeId]).then(() => {
    //       window.location.reload();
    //     }); 
    //   });
     
     
     
    // }
 
  }
  poleValue: SStoreClient;
  async WriteValue(string1, string2, tryConnect) {
    let poleValue = this.getPole();
    if(poleValue!==null && poleValue!==undefined )
    {
      if(poleValue?.poleName?.toString()!== '' && poleValue?.poleBaudRate?.toString()!== '' )
      {
        this.commonService.PoleShowMess(poleValue?.poleName?.toString(), poleValue?.poleBaudRate?.toString() , poleValue?.poleParity?.toString(), '', '', '', this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, poleValue.publicIP, string1, string2).subscribe((response: any)=>{
          if(response.success)
          {
            // this.alertifyService.success("Connect pole display completed successfully.");
          }
          else
          {
            // this.alertify.warning(response.message);
          }
        });
      }
     
    }
  }
  // getBill(transId) {
  //   let basket = this.basketService.getCurrentBasket();
  //   return this.billService.getBill(transId, this.store.companyCode, this.store.storeId).subscribe((response: any) => {
  //     // debugger;
  //      if(response.success)
  //     {
  //       response.data.totalQty=0;
  //         response.data.lines.forEach(line => {
  //           if(line.discountType !== "Bonus Amount"){
  //             this.discountLine += line.discountAmt === null ? 0 : line.discountAmt;
  //             this.order.discountLine = this.discountLine;
  //             console.log("this.discountLine", this.discountLine);
  //           }else{
  //             this.bonusLine += line.discountAmt === null ? 0 : line.discountAmt;
  //             this.order.bonusLine = this.bonusLine;
  //             console.log("this.bonusLine", this.bonusLine);
  //           }
  //           response.data.totalQty += line.quantity;
  //         });
     
  //         if(response.data!==null && response.data!==undefined)
  //         {
  //           // console.log('this.outPutModel', this.outPutModel);
  //           // waitingAPi = false;
  //           // clearInterval(this.interval);
  //           setTimeout(() => {
  //             this.outPutModel = response.data;
  //             // window.print(); 
  //           }, 300);
  //           if(basket.salesType?.toLowerCase() === 'return' 
  //             || basket.salesType?.toLowerCase() === 'ex' 
  //             || basket.salesType?.toLowerCase() === 'exchange')
  //             {
  //               Swal.fire({
  //                 title: 'This is Return / Exchange Bill?',
  //                 text: 'Do you want to have a copy',
  //                 icon: 'question',
  //                 showCancelButton: true,
  //                 confirmButtonText: 'Yes',
  //                 cancelButtonText: 'No'
  //               }).then((result) => {
  //                 if (result.value) {
  //                   // debugger;
  //                   setTimeout(() => {
  //                     this.outPutModel = null;
  //                     // window.print(); 
  //                   }, 10);
  //                   setTimeout(() => {
  //                     this.outPutModel = response.data;
  //                     // window.print(); 
  //                     setTimeout(() => {
            
  //                       this.newOrder();
  //                     }, 200);
  //                   }, 50);
  //                 }
  //                 else
  //                 {
  //                   this.newOrder();
  //                 }
  //               });
  //             }
  //             else
  //             {
  //               setTimeout(() => {
            
  //                 this.newOrder();
  //               }, 600);
  //             }
  //           // setTimeout(() => {
            
  //           //   this.newOrder();
  //           // }, 600);
  //         }
  //         else{
  //           Swal.fire({
  //             icon: 'warning',
  //             title: 'Print bill',
  //             text: "Can't get data of order. Please manual print"
  //           }).then(() => {
  //             this.route.navigate(["shop/bills/print", transId, this.store.companyCode, this.store.storeId]).then(() => {
  //               window.location.reload();
  //             }); 
  //           });
  //         }

 
  //     }
  //     else
  //     {
  //       this.alertify.warning(response.message);
  //     }
      
     
  //   })
  // }
  @ViewChild('currencyTemplate',{static: false})
  currencyTemplate: ElementRef;
  triggerAlert(amount, message){
    if(this.storecurrency!==null && this.storecurrency!==undefined && this.storecurrency.length > 1)
    {
      const initialState = { 
        currency:  this.storecurrency,  
        amount: amount
      };
      let modalRefX = this.modalService.show(ShopPaymentChangePopupComponent, {initialState ,  animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false, 
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'});
       
        modalRefX.content.outPayment.subscribe((payment) => {
          console.log(payment) // here you will get the value
         if(payment===true)
         {
          modalRefX.hide();
         
          this.getBill(message, 0);
         }
       
        });
    }
    else
    {
      Swal.fire({
        icon: 'info',
        title: 'Amount Change: ' + this.authService.formatCurrentcy(amount),
         
      }).then(()=>{
        this.getBill(message, amount);
      })
    }
    

  }
 
  addOrder(value) {

  
    
    if (value === true) {
      if(this.IsEvent)
      {
        Swal.fire({
          title: 'Remarks',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
          showLoaderOnConfirm: true,

          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) { 
            this.basketService.changeNote(result.value);
            setTimeout(() => {
              this.createOrder();
            }, 10)
 
           
          }
        });
      }
      else
      {
        this.createOrder();
      }
      


    }
    else {
      this.modalRef.hide();

    }

  }
  openPromotion(promotionId)
  {
    window.open('admin/promotion/edit/' + promotionId, "_blank");
    // debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    //  this.routeNav.navigate(["shop/bills", this.order.transId, this.order.companyCode, this.order.storeId]).then(() => {
    //   window.location.reload();
    // }); 
  }
  createOrder()
  {
    debugger;
    let amountLeft = this.basketService.getAmountChange(); 
    this.outPutModel = null;
    let saveOrderNum = this.orderNo;
      if (this.orderId === "" || this.orderId === null || this.orderId === undefined || this.orderId.toString() === "undefined") {
        this.orderNo = "";
      }
      // this.testRemoveBasket();
      let basket = this.basketService.getCurrentBasket();
      let saleMode = "SALES";
      // debugger;
      if (basket.salesType === "Exchange") {
        saleMode = "EX";
        this.orderNo = this.orderId;

      }
      debugger;
     
      basket.payments.forEach(paymentLine => {
        if(paymentLine.paymentMode?.toLowerCase()==='change')
        {
          paymentLine.paymentCharged = -paymentLine.paymentCharged;
        }
      });
      // debugger;
      // if(this.mode?.toLowerCase() === 'preorder' || this.mode?.toLowerCase() === 'table')
      // {
      //   saleMode = "Table";
      // }   
      let leftPayment = basket.payments.filter(x => x.paymentCharged <= 0);
      if (leftPayment !== null && leftPayment !== undefined && leftPayment.length > 0) {
        this.alertify.warning("Have an incomplete or zero payment method");
      }
      else {
        // let cusId = basket.customer.id;
        // let contractNo = basket.contractNo;
        this.basketService.changeBasketResponseStatus(false);
        this.basketService.changeIsCreateOrder(true);
        this.basketService.addOrder(this.orderNo, saleMode).subscribe(
          (response: any) => {
            this.basketService.changeIsCreateOrder(false);
            if (response.success) {
              debugger;
              this.alertify.success(response.message);
              console.log("amountLeft", amountLeft);
              // if(amountLeft > 0)
              // { 
              //   this.triggerAlert(amountLeft, response.message);
              // }
              // else
              // { 
                
              // } 
            if(response.data?.status ==="I")
            {
              Swal.fire({
                title: 'warning!',
                // input: 'text',
                icon: 'warning',
                 text: 'Bill: '+response.message + " Chưa nhận được phản hồi từ Payoo! Vui lòng liên hệ với Payoo để hoàn tất đơn.",
                inputAttributes: {
                  autocapitalize: 'off'
                },
                // showCancelButton: true,
                // confirmButtonText: 'Yes',
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                window.open('shop/bills/' +  response.message +'/'+ response.data.companyCode+'/'+response.data.storeId, "_blank");
               setTimeout(() => {
                this.newOrder();
               }, 100); 
              })
            }
            else
              this.getBill(response.message, amountLeft);
             
            }
            else {

              this.alertify.error(response.message);
              this.orderNo = saveOrderNum;

            }

          },
          (error) => {
            this.basketService.changeIsCreateOrder(false);
            this.basketService.changeBasketResponseStatus(true);
            this.alertify.error(error);
          }
        );
        if(this.modalRef!==null && this.modalRef!==undefined)
        {
          this.modalRef.hide();
        }
      }

  }
  clearOrder() {
 
    const basket = this.basketService.getCurrentBasket();
    let currentType = basket.salesType;
    this.basketService.deleteBasket(basket).subscribe(() => {
      // this.addNewOrder()
      // this.route.navigate(['/shop/sales-type']);


    });

    this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
      // console.log(data);
      this.orderNo = data;
    });
    let cus = this.authService.getDefaultCustomer();

    if (cus !== null && cus !== undefined) {
      // debugger;
      // setTimeout(() => {
      this.basketService.changeCustomer(cus, "Retail").subscribe(() => {
        // this.route.navigate(['/shop/order']).then();

      });
      if (this.authService.getShopMode() === 'FnB') {
        this.route.navigate(["shop/order"]).then(() => {
          // window.location.reload();
        });
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.route.navigate(["shop/order-grocery"]).then(() => {
          // window.location.reload();
        });

      }
      // }, 2); 
    }
    else {
      this.customerService.getItem(this.store.companyCode, this.store.defaultCusId).subscribe((reponse: any) => {
        // debugger;
        this.basketService.changeCustomer(reponse.data, "Retail").subscribe(() => {

        });
        if (this.authService.getShopMode() === 'FnB') {
          this.route.navigate(["shop/order"]).then(() => {
            // window.location.reload();
          });
        }
        if (this.authService.getShopMode() === 'Grocery') {
          this.route.navigate(["shop/order-grocery"]).then(() => {
            // window.location.reload();
          });

        }
        // this.route.navigate(['/shop/order']);


      });
    }
  }
  onValueChanged(e) {
    if (e !== null && e !== undefined && this.employees !== null && this.employees !== undefined && this.employees?.length > 0) {
      const previousValue = e.previousValue;
      const newValue = e.value;
      // Event handling commands go here
      // debugger;
      let employee: MEmployee = this.employees.find(x => x.employeeId === newValue);
      this.basketService.changeEmployee(employee);
      let basket = this.basketService.getCurrentBasket();
      basket.employee = employee;
    }

  }
  // poleValue: SStoreClient;
  // getPole() : SStoreClient
  // {
  //   let poleSetup = localStorage.getItem("poleSetup");
  //   let result = null;
  //   if(poleSetup!==null && poleSetup!==undefined)
  //   {
  //     result = JSON.parse(poleSetup);
  //   }
  //   return result;
  // }
  myIntervalWelCome;
  cancelOrder() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to clear this bill',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        // this.basketService.writeLogRemove(this.orderNo).subscribe(async (response: any)=>{
        //   if(response.success)
        //   {
            if(this.poleDisplay==='true')
            {
              // this.
              let poleValue = this.getPole();
              let string2 = this.authService.getCompanyInfor().companyName;
              // await this.WriteValue("     WELCOME TO", this.authService.getCompanyInfor().companyName, false);
              this.commonService.WritePoleValue(this.store.companyCode, this.store.storeId,poleValue, this.poleDisplayType, "     WELCOME TO", string2, false, true);
    
            
            }
            
            const basket = this.basketService.getCurrentBasket();
            let currentType = basket.salesType;
            debugger;
            this.basketService.deleteBasket(basket, this.orderNo).subscribe(() => {
              // this.addNewOrder()
              // this.route.navigate(['/shop/sales-type']);


            });
            this.basketService.getNewOrderCode(this.store.companyCode, this.store.storeId).subscribe(data => {
              // console.log(data);
              this.orderNo = data;
            });
            let cus = this.authService.getDefaultCustomer();
            // debugger;
            if (cus !== null && cus !== undefined) {
              setTimeout(() => {
                // debugger
                this.basketService.changeCustomer(cus, "Retail").subscribe(() => {
                  // this.route.navigate(['/shop/order']).then();

                });
                if (this.authService.getShopMode() === 'FnB') {
                  this.route.navigate(["shop/order"]).then(() => {
                    window.location.reload();
                  });
                }
                if (this.authService.getShopMode() === 'Grocery') {
                  this.route.navigate(["shop/order-grocery"]).then(() => {
                    // window.location.reload();
                  });

                }
              }, 2);

            }
            else {
              this.customerService.getItem(this.store.companyCode, this.store.defaultCusId).subscribe((reponse: any) => {
                // debugger;
                this.basketService.changeCustomer(reponse.data, "Retail").subscribe(() => {

                });
                if (this.authService.getShopMode() === 'FnB') {
                  this.route.navigate(["shop/order"]).then(() => {
                    window.location.reload();
                  });
                }
                if (this.authService.getShopMode() === 'Grocery') {
                  this.route.navigate(["shop/order-grocery"]).then(() => {
                    // window.location.reload();
                  });

                }
                // this.route.navigate(['/shop/order']);


              });
            }
        //   }
        //   else
        //   {
        //       Swal.fire({
        //           icon: 'warning',
        //           title: 'Log Remove Basket',
        //           text: response.message
        //         });
        //   }
        // }, error=>{
        //   console.log('Log Remove Basket Error', error);
        //     Swal.fire({
        //       icon: 'error',
        //       title: 'Log Remove Basket',
        //       text:"Failed to connect System. Please Try again or contact to support team."
        //     });
        // })
      }
    });
  }
  addPaymentDebt(paymentid)
  {
    let terminalId = "";
    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      terminalId = this.authService.getLocalIP();
    }
    this.storePaymentService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, terminalId).subscribe((res: any) => {
      debugger
      if(res.success)
      {
        let defautPayment = res.data.filter(x=>x.paymentCode ===paymentid);
        if(defautPayment?.length>0)
        {
          let payment = new Payment();
          payment.id = defautPayment[0].paymentCode;
          payment.currency = defautPayment[0].currency;
          payment.shortName = defautPayment[0].shortName;
          payment.refNum = "";
          payment.paymentDiscount = 0;
          
          payment.lineNum = 1;
          payment.rate = 1;
          payment.fcRoundingOff = 0;
          payment.roundingOff = 0;
          payment.customF2 = defautPayment[0].paymentType;
          this.basketTotal$.subscribe(data => {
            console.log(data);
            // this.payment.paymentCharged = data.subtotal - data.totalAmount;
          //  payment.paymentTotal = data.billTotal;
           payment.paymentCharged = data.billTotal;
           data.totalAmount = data.billTotal;
          });
          // payment.
          this.basketService.addPaymentToBasket(payment,payment.paymentCharged);
          this.addOrder(true);
        }
        else
        {
          this.alertify.error("Payment "+paymentid + " Not found!")
        }
      }
      else
      {
        this.alertify.error(res.message);
      }
    });
  }
  
  

  basketDiscountTotal$: Observable<IBasketDiscountTotal>;






}
