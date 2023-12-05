import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { async, BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';
import { map, switchMap, debounceTime } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { timer } from 'rxjs';
import { MCustomer } from 'src/app/_models/customer';
// import { BasketComponent } from 'src/app/tools/basket/basket.component';
// import { Basket, IBasket, IBasketItem, IBasketTotal } from 'src/app/_models/basket';
import { Item } from 'src/app/_models/item';
import { MBomline } from 'src/app/_models/mbomline';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { Payment } from 'src/app/_models/payment';
import { PromotionDocument, PromotionDocumentLine } from 'src/app/_models/promotion/document';
import {
  Basket,
  IBasket,
  IBasketItem,
  IBasketTotal,
  IBasketPayment,
  IBasketDiscountTotal,
  IBasketCurrencyTotal,
} from 'src/app/_models/system/basket';
import { ResultModel } from 'src/app/_models/system/resultModel';
import { TSalesLine, TSalesLineSerial, TSalesPromo } from 'src/app/_models/tsaleline';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { BOMViewModel } from 'src/app/_models/viewmodel/BOMViewModel';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { environment, promotion } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { ItemService } from '../data/item.service';
import { ShiftService } from '../data/shift.service';
import { PromotionService } from '../promotion/promotion.service';
import { AlertifyService } from '../system/alertify.service';
import * as moment from 'moment';
import { TSalesInvoice } from 'src/app/_models/tsalesinvoice';
import { MEmployee } from 'src/app/_models/employee';
import { debug } from 'console';
import { SchemaViewModel } from 'src/app/_models/promotion/schemaViewModel';
import { PromotionViewModel } from 'src/app/_models/promotion/promotionViewModel';
import { TSalesDelivery } from 'src/app/_models/tsalesdelivery';
import { CommonService } from './common.service';
import Swal from 'sweetalert2';
import { type } from 'os';
import { MStorePayment } from 'src/app/_models/mstorepayment';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { CurrencyService } from '../data/currency.service';
import { MCurrency } from 'src/app/_models/currency';
import { EnvService } from 'src/app/env.service';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { BarcodesetupService } from '../data/barcodesetup.service';
import { OrderLogModel } from 'src/app/_models/orderlogModel';
import { parseNumber } from 'devextreme/localization';
@Injectable({
  providedIn: 'root',
})
export class BasketService {
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(
    private http: HttpClient,
    private shiftService: ShiftService,
    private authService: AuthService,
    private alertify: AlertifyService,
    private itemService: ItemService,
    private commonService: CommonService,
    private route: Router, public env: EnvService,
    private promotionService: PromotionService,
    private currencyService: CurrencyService,
    private barcodeService: BarcodesetupService,
  ) {

    // this.responseBasket = 

    this.changeBasketResponseStatus(this.getBasketResponseStatus());
    this.changeIsCreateOrder(this.getIsCreateOrder());
    this.loadSetting();
  }
  private basketSource = new BehaviorSubject<IBasket>(null);
  private basketTotal = new BehaviorSubject<IBasketTotal>(null);
  private basketCurrencyTotal = new BehaviorSubject<IBasketCurrencyTotal>(null);
  private basketTotalDiscount = new BehaviorSubject<IBasketDiscountTotal>(null);
  private basketSourcepromo = new BehaviorSubject<IBasket>(null);

  getBasketResponseStatus() {
    // debugger;
    let value = localStorage.getItem('isResponseStatus');
    let rs: Boolean = true;
    if (value === "false") {
      rs = false;
    }
    return rs;
  }
  priceWScaleWithCfg = "false";
  loadSetting() {
    let storeSelected = this.authService.storeSelected();
    if (storeSelected !== null && storeSelected !== undefined) {
      let generalSetting = this.authService.getGeneralSettingStore(storeSelected.companyCode, storeSelected.storeId);
      if (generalSetting !== null && generalSetting !== undefined && generalSetting?.length > 0) {
        let mode = generalSetting.find(x => x.settingId === 'QtyWScaleToOne');
        if (mode !== null && mode !== undefined) {
          let rs = mode.settingValue;
          if (rs === 'true') {
            this.QtyWScaleToOne = true;
          }
          else {
            this.QtyWScaleToOne = false;
          }
        }
        else {
          this.QtyWScaleToOne = false;
        }
        let poleDisplay = this.authService.getGeneralSettingStore(storeSelected.companyCode, storeSelected.storeId).find(x => x.settingId === 'PoleDisplay');
        if (poleDisplay !== null && poleDisplay !== undefined) {
          this.poleDisplay = poleDisplay.settingValue;
          let cusF1 = poleDisplay.customField1;
          if (cusF1 !== null && cusF1 !== undefined && cusF1?.toLowerCase() === 'serialport') {
            this.poleDisplayType = "serialport";
          }
          else {
            this.poleDisplayType = "";
          }
        }
        let priceWScaleWithCfg = this.authService.getGeneralSettingStore(storeSelected.companyCode, storeSelected.storeId).find(x => x.settingId === 'PriceWScaleWithCfg');
        if (priceWScaleWithCfg !== null && priceWScaleWithCfg !== undefined) {
          this.priceWScaleWithCfg = priceWScaleWithCfg.settingValue;
        }
      }

    }
    else {
      this.QtyWScaleToOne = false;
    }


  }
  poleDisplayType = "";
  poleDisplay = "false";

  // poleDisplay="true";
  // poleDisplayType="serialport";
  getIsCreateOrder() {
    // debugger;
    let value = localStorage.getItem('isCreateOrder');
    let rs: Boolean = false;
    if (value === "true") {
      rs = true;
    }
    else {
      rs = false;
    }
    return rs;
  }
  basket$ = this.basketSource.asObservable();
  basketTotal$ = this.basketTotal.asObservable();
  basketTotalDiscount$ = this.basketTotalDiscount.asObservable();
  basketCurrencyTotal$ = this.basketCurrencyTotal.asObservable();
  private customer = new BehaviorSubject<MCustomer>(null);
  customer$ = this.customer.asObservable();
  private employee = new BehaviorSubject<MEmployee>(null);
  employee$ = this.employee.asObservable();

  private employeeList = new BehaviorSubject<MEmployee[]>(null);
  EmployeeList$ = this.employeeList.asObservable();

  paymentCharge = new BehaviorSubject<Payment>(null);

  private isResponeBasket = new BehaviorSubject<boolean>(null);
  ResponeBasket$ = this.isResponeBasket.asObservable();

  private isCreateOrder = new BehaviorSubject<boolean>(null);
  IsCreateOrder$ = this.isCreateOrder.asObservable();

  private isGenOrderNo = new BehaviorSubject<boolean>(null);
  IsGenOrderNo$ = this.isGenOrderNo.asObservable();

  currentPaymentCharge = this.paymentCharge.asObservable();
  result: ResultModel;

  private orderCached = new BehaviorSubject<string>(null);
  OrderCached$ = this.orderCached.asObservable();

  getCurrency(currency): MCurrency {

    let setting = localStorage.getItem("defCurrency" + currency);
    let result;
    // // debugger;
    if (setting === null || setting === 'null' || setting === undefined) {

      this.currencyService.getItem(currency).subscribe((response: any) => {
        if (response.success) {
          localStorage.setItem('defCurrency' + currency, JSON.stringify(response.data));
          result = response.data;
        }
        else {
          this.alertify.warning(response.message);
        }

      });
    }
    else {
      result = JSON.parse(setting);
    }

    return result;
  }

  changePaymentCharge(payment: Payment) {
    this.paymentCharge.next(payment);
  }
  getCurrentPayment() {
    return this.basketSource.getValue().payments;
  }
  getReturnMode() {
    return this.basketSource.getValue().returnMode;
  }
  getAmountChange() {

    let totalbasket = this.basketTotal.getValue();

    // let num =   value - this.basketTotal.getValue().totalAmount ;
    return totalbasket.changeAmount;
  }

  getAmountLeft() {
    // // debugger;
    let totalbasket = this.basketTotal.getValue();
    // let value= totalbasket.subtotal === 0 ? totalbasket.total : totalbasket.subtotal;
    // // debugger;
    //data.subtotal - data.totalAmount;
    // let num =   value - this.basketTotal.getValue().totalAmount ;
    return totalbasket.amountLeft;
  }

  changeContract(contractNo, placeId?) {
    // // debugger;
    let subject = new Subject();
    if (contractNo !== null && contractNo !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Contract", "Success", contractNo);
      basket.contractNo = contractNo;
      if (placeId !== null && placeId !== undefined && placeId !== '') {
        basket.placeId = placeId;
      }

      this.setBasket(basket).subscribe(() => {
        subject.next();
      });
      return subject;
    }

    // // debugger;
    //
  }
  changeReturnMode(value) {
    // 
    let subject = new Subject();
    if (value !== null || value !== undefined) {
      let basket = this.getCurrentBasket();
      // debugger;
      basket.returnMode = value;
      this.basketSource.next(basket);
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });
      return subject;
    }

  }
  changeTempTransId(value) {
    // 
    let subject = new Subject();
    if (value !== null || value !== undefined) {
      let basket = this.getCurrentBasket();
      // debugger;
      basket.tempTransId = value;
      this.basketSource.next(basket);
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });
      return subject;
    }

  }
  changeReason(value) {
    // // debugger;
    let subject = new Subject();
    if (value !== null || value !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Reason", "Success", value);
      basket.reason = value;
      this.basketSource.next(basket);
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });
      return subject;
    }

  }
  changeNegativeOrder(value) {
    let subject = new Subject();
    if (value !== null || value !== undefined) {
      let basket = this.getCurrentBasket();

      basket.negativeOrder = value;
      this.basketSource.next(basket);
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });
      return subject;
    }

  }
  changeDiscountValue(basket: IBasket, value) {

    // let basket = this.getCurrentBasket();
    // basket.discountValue = value;
    // this.basketSource.next(basket);
    if (basket.discountValue !== null && basket.discountValue !== undefined && basket.discountValue !== 0) {

      basket.discountValue = 0;
      basket.payments = [];
      this.setBasket(basket)
    }

  }
  changeDiscountValueNew(discountType, value) {

    let basket = this.getCurrentBasket();
    this.authService.setOrderLog("Order", "Change Discount Value", "Success", discountType + ' - ' + value);
    basket.discountValue = value;
    basket.discountType = discountType;
    basket.payments = [];
    // const basket = this.createBasket();
    // this.employee.next(employee);
    let subject = new Subject();
    this.setBasket(basket).subscribe(() => {
      subject.next();
    });

    return subject;

    // this.setBasket(basket)

  }
  removePayments(basket: IBasket) {

    var newArray = [];

    basket.payments.forEach(val => newArray.push(Object.assign({}, val)));

    basket.paymentHistories = newArray;
    basket.payments = [];
    if (basket?.voucherApply !== null && basket?.voucherApply !== undefined && basket?.voucherApply?.length > 0) {
      basket.voucherApply = basket.voucherApply.filter(x => x.voucherType !== "Payment");
    }
    if (basket?.promotionApply !== null && basket?.promotionApply !== undefined && basket?.promotionApply?.length > 0) {
      basket.promotionApply = basket.promotionApply.filter(x => x.promoType !== 10);
    }
    basket.undefinedAmount = null;
    this.calculateCurrencyBasket('', 1);
    this.setBasket(basket);


  }
  changeInvoice(invoice: TSalesInvoice) {
    // // debugger;
    let subject = new Subject();
    if (invoice !== null && invoice !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Invoice", "Success", invoice.phone);
      basket.invoice = invoice;
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });
      return subject;
    }

    // // debugger;
    //
  }

  changePaymentModeBasket(paymentMode) {
    // // debugger;

    let basket = this.getCurrentBasket();
    basket.paymentMode = paymentMode;
    this.setBasket(basket);
  }
  changeDelivery(delivery: TSalesDelivery) {
    // // debugger;
    let subject = new Subject();
    if (delivery !== null && delivery !== undefined) {
      let basket = this.getCurrentBasket();

      basket.delivery = delivery;
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });
      return subject;
    }

    // // debugger;
    //
  }
  changeEmployee(empolyee: MEmployee) {
    // // debugger;
    if (empolyee !== null && empolyee !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Employee", "Success", empolyee.employeeId);
      basket.employee = empolyee;
      // const basket = this.createBasket();
      // this.employee.next(employee);
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

    // // debugger;
    //
  }
  changeEmployeeList(empolyees: MEmployee[]) {
    console.log('empolyees', empolyees);
    this.employeeList.next(empolyees);
    console.log('Get empolyees', this.getCurrentEmployeeList());

  }
  changeIsGenOrderNo(value) {
    this.isGenOrderNo.next(value);
    console.log('Change Is Gen Order', this.getCurrentIsNewGenOrderNo());
  }
  changeManualPromotion(promo: PromotionViewModel) {
    // // debugger;
    if (promo !== null && promo !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Manual Promotion", "Success", promo.promoId);
      basket.manualPromotion = promo;
      // const basket = this.createBasket();
      // this.employee.next(employee);
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

    // // debugger;
    //
  }
  changeDateTime(date: Date) {
    // // debugger;
    if (date !== null && date !== undefined) {
      let basket = this.getCurrentBasket();
      basket.id = uuidv4();
      basket.startTime = date;
      this.authService.setOrderLog("Order", "Set New Guid Id", "Success", basket?.id);
      // const basket = this.createBasket();
      // this.employee.next(employee);
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

  }
  changeManualSchema(schema: SchemaViewModel) {
    // // debugger;
    if (schema !== null && schema !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Manual Schema", "Success", schema.schemaId);
      basket.manualSchema = schema;
      // const basket = this.createBasket();
      // this.employee.next(employee);
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

    // // debugger;
    //
  }
  changeOMSId(value) {
    // // debugger;
    if (value !== null && value !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change OMS Id", "Success", value);
      basket.omsId = value;
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

  }
  changeOMSSource(value) {
    // // debugger;
    if (value !== null && value !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change OMS Source", "Success", value);
      basket.omsSource = value;
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

  }
  changeRefTransId(value) {
    // // debugger;
    if (value !== null && value !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Ref TransId", "Success", value);
      basket.refTransId = value;
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

  }
  changeDataSource(value) {
    // // debugger;
    if (value !== null && value !== undefined) {
      let basket = this.getCurrentBasket();
      this.authService.setOrderLog("Order", "Change Data Source", "Success", value);
      basket.omsSource = value;
      let subject = new Subject();
      this.setBasket(basket).subscribe(() => {
        subject.next();
      });

      return subject;
    }

  }
  changeNote(value) {
    // // debugger;
    let subject = new Subject();
    if (value !== null && value !== undefined) {
      let basket = this.getCurrentBasket();
      if (basket !== null && basket !== undefined) {
        this.authService.setOrderLog("Order", "Change Note / Reason", "Success", value);
        basket.note = value;
        // const basket = this.createBasket();
        // this.employee.next(employee);

        this.setBasket(basket).subscribe(() => {
          subject.next();
        });


      }

    }
    return subject;
    // // debugger;
    //
  }
  changeBasketResponseStatus(value) {
    // debugger; 
    // console.log(this.getIsCreateOrder());
    if (this.getIsCreateOrder() === false) {
      // console.log('isResponseStatus' , value);
      localStorage.setItem('isResponseStatus', value.toString());
      this.isResponeBasket.next(value);
    }

  }
  changeIsCreateOrder(value) {
    localStorage.setItem('isCreateOrder', value.toString());
    console.log("changeIsCreateOrder", value.toString());
    this.isCreateOrder.next(value);
  }
  // changeOrderCached(value) { 
  //   localStorage.setItem('isCreateOrder', value.toString());
  //   console.log("changeIsCreateOrder", value.toString());
  //   this.isCreateOrder.next(value);
  // }

  // changeBasketResponseStatus(value) {
  //   // // debugger;
  //     localStorage.setItem('', value);
  //     let subject = new Subject();
  //     this.setBasket(basket).subscribe(() => {
  //       subject.next();
  //     });

  //     return subject;

  // }
  changeUserApproval(value) {
    // // debugger;
    let subject = new Subject();
    if (value !== null && value !== undefined) {
      let basket = this.getCurrentBasket();
      if (basket !== null && basket !== undefined) {
        this.authService.setOrderLog("Order", "Set User Approval", "Success", value);
        basket.userApproval = value;
        // const basket = this.createBasket();
        // this.employee.next(employee);

        this.setBasket(basket).subscribe(() => {
          subject.next();
        });


      }

    }
    return subject;
    // // debugger;
    //
  }

  changeCustomer(customer: MCustomer, salesType?, isSetPromotion?: boolean) {

    if ((customer !== null && customer !== undefined) && (salesType !== null && salesType !== undefined)) {
      let basket = this.getCurrentBasket();
      if (basket === null) {
        basket = this.createBasket(customer);
      }
      basket.customer = customer;
      basket.isApplyPromotion = false;
      // Reset discount total
      basket.discountType = "Discount Percent";
      basket.discountTypeTemp = "Discount Percent";
      basket.discountValue = 0;
      basket.discountValueTemp = 0;
      if (salesType !== null || salesType !== undefined) {
        basket.salesType = salesType;
      }
      let tempTransId = "";
      if (tempTransId !== null && tempTransId !== undefined && tempTransId !== '') {
        basket.tempTransId = tempTransId;
      }
      this.authService.setOrderLog("Order", "Change Customer", "Success", customer.customerId);
      // const basket = this.createBasket();
      this.customer.next(customer);

      this.basketSource.next(basket);
      let subject = new Subject();
      this.setBasket(basket);
      // (basket).subscribe(()=>{
      //   subject.next();
      // });
      debugger;
      if (basket.items !== null && basket.items !== undefined && basket.items.length > 0 && isSetPromotion !== false) {
        this.applyPromotion(basket);
      }
      return subject;
    }

    // // debugger;
    //
  }
  addPromotionList(isVoucher) {

    let basket = this.getCurrentBasket();
    //
    // basket.promotionItems =[...basket.items];
    // let itemlist =
    var newArray = [];
    if (isVoucher === true) {
      basket.promotionItems.forEach(val => newArray.push(Object.assign({}, val)));
    }
    else {
      basket.items.forEach(val => newArray.push(Object.assign({}, val)));
    }

    // // debugger;
    newArray = newArray.filter(x => x.customField1?.toString() !== "Card");
    let stt = 0;
    // debugger;
    if (newArray !== null && newArray !== undefined) {
      if (basket.clearPromotion === true) {
        newArray = newArray.filter(x => x.promotionIsPromo !== '1');

        newArray.forEach((item) => {
          // debugger;
          stt++;
          item.lineNum = stt;
          item.discountType = 'Discount Percent';
          item.discountValue = 0;
          item.promotionIsPromo = null;

          //mới thêm
          item.promotionPromoCode = '';
          item.promotionType = null,
            item.promotionCollection = null,
            item.promotionDisAmt = null,
            item.promotionDisPrcnt = null,
            item.promotionDiscountPercent = null,
            item.promotionIsPromo = null,
            //  promotionItemGroup: promotionItem.
            item.promotionLineTotal = null,
            item.promotionPriceAfDis = null,
            item.promotionPriceAfDisAndVat = null,
            item.promotionPromoCode = null,
            item.promotionPromoName = null,
            item.promotionRate = null,
            item.promotionSchemaCode = null,
            item.promotionSchemaName = null,
            item.promotionTotalAfDis = null,
            item.promotionUnitPrice = null,
            item.promotionUoMCode = null,
            item.promotionUoMEntry = null,
            item.promotionVatGroup = null,
            item.promotionVatPerPriceAfDis = null,

            // hết mới thêm
            item.promotionPriceAfDis = item.price;
          let lineTotalAmount = item.quantity * item.price;
          item.lineTotal = lineTotalAmount;
          item.promotionLineTotal = lineTotalAmount;


        });
      }
      else {

        newArray.forEach((item) => {
          // item.discountType = '';
          // item.discountValue = 0;
          // debugger;
          stt++;
          item.lineNum = stt;
          if (item.discountType === null || item.discountType === undefined || item.discountType === "") {
            item.discountType = 'Discount Percent';
            item.discountValue = 0;
          }
          if (item.promotionPriceAfDis === null || item.promotionPriceAfDis === undefined) {
            item.promotionPriceAfDis = item.price;

          }
          let lineTotalAmount = item.quantity * item.price;
          if (item.promotionLineTotal === null || item.promotionLineTotal === undefined) {
            item.promotionLineTotal = lineTotalAmount;
          }

          //2022-01-13 Gỡ Remove PromoCode
          // item.promotionPromoCode = null;
          // item.promotionPromoName = null;

          item.lineTotal = lineTotalAmount;
        });
      }
      debugger;
      basket.promotionItems = newArray;
      // console.log(basket.items);
      // // debugger;
      // this.basketSource.next(basket);
      // this.discountCalculateBasket('Discount Percent');
      // // debugger;
      this.setBasket(basket);
    }
    // newArray = newArray.filter(item=>item.promotionIsPromo!=="1" || (item?.promotionIsPromo==='1' && item?.promotionType!=='Fixed Quantity'));
    // console.log(basket.items);

  }

  applyDiscountPromotionToBasket(discountType: string, value: number) {
    // debugger;

    let basket = this.getCurrentBasket();
    if (basket.clearPromotion === true) {
      basket.promoItemApply = null;
      basket.promotionItems = basket.promotionItems.filter(item => item.promotionIsPromo !== "1" || (item?.promotionIsPromo === '1' && item?.promotionType !== 'Fixed Quantity'));


      // const items= basket.promotionItems.filter(x=>x.promotionIsPromo!=="1");
      // items.forEach(item => {
      //   // debugger;
      //   item.promotionPriceAfDis= item.price;
      //   item.promotionLineTotal = item.lineTotal;
      //   item.lineTotal = item.quantity * item.price;
      // });
      // basket.promotionItems = items;

    }
    // else
    // {
    //   const items= basket.promotionItems.filter(x=>x.discountValue > 0);
    //   items.forEach(item => {
    //     // debugger;
    //     item.promotionPriceAfDis= item.price;
    //     item.promotionLineTotal = item.lineTotal;
    //     item.lineTotal = item.quantity * item.price;
    //   });
    // }
    if (value !== null && value !== undefined) {
      basket.discountType = discountType;
      basket.discountValue = value;
    }
    else {
      basket.discountType = basket.discountTypeTemp;
      basket.discountValue = basket.discountValueTemp;
    }
    // debugger;
    basket.promotionItems.forEach(item => {
      if (item.discountType === null || item.discountType === undefined || item.discountType === "") {
        item.discountType = 'Discount Percent';
        item.discountValue = 0;
      }
    });
    basket.items = basket.promotionItems;
    basket.promotionApply = basket.promotionApplyTemp;
    basket.voucherApply = basket.voucherApplyTemp;
    // ngày 2022-05-11 Set lại promotion Id header = "" khi áp dụng discount tay
    // basket.promotionId = "";
    // console.log('after Dis', basket);

    //set field Discount manual  = Y khi có tác động bằng tay vào các modal manual discount
    basket.isManualDiscount = true;

    this.basketSource.next(basket);
    this.setBasket(basket);

    // this.writeLogApromotion("");


  }

  writeLogApromotion(type, transId, discountAllBillType, discountAllBillAmount) {
    let basket = this.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      const order = new Order();
      order.logs = [];//this.authService.getOrderLog();

      if (transId !== null && transId !== undefined && transId !== '') {
        order.transId = transId;
      }
      else {
        order.transId = basket.id;
      };
      order.orderId = basket.id;
      let storeClient = this.authService.getStoreClient();
      if (storeClient !== null && storeClient !== undefined) {
        order.terminalId = this.authService.getStoreClient().publicIP;
      }
      else {
        order.terminalId = this.authService.getLocalIP();
      }
      order.storeId = this.authService.storeSelected().storeId;
      order.companyCode = this.authService.getCurrentInfor().companyCode;
      let approvalStr = "";
      if (basket.userApproval?.length > 0) {
        approvalStr = "Approval by " + basket.userApproval;
      }
      let noteStr = '';
      if (basket.note?.length > 0) {
        noteStr = "note: " + basket.note;
      }
      let showString = '';
      if (approvalStr?.length > 0) {
        showString = approvalStr;
      }
      if (noteStr?.length > 0 && showString?.length > 0) {
        showString = showString + ", " + noteStr;
      }
      else {
        if (noteStr?.length > 0 && showString?.length <= 0) {
          showString = noteStr;
        }

      }

      if (type === null || type === undefined || type === '') {
        type = "ManualDiscountPromotion";
      }
      let log = new OrderLogModel();
      log.type = type;
      log.action = "Request";
      log.time = new Date();
      log.result = "";
      log.value = showString;
      log.customF1 = transId;
      log.customF2 = basket?.id.toString();
      log.createdBy = this.authService.getCurrentInfor().username;
      order.logs.push(log);

      let logTotal = new OrderLogModel();
      logTotal.type = type;
      logTotal.action = "Apply Total";
      logTotal.time = new Date();
      logTotal.result = "";
      logTotal.value = discountAllBillType ?? '';
      logTotal.customF1 = transId ?? '';
      // logTotal.customF2 = 
      logTotal.customF9 = (discountAllBillAmount ?? '').toString();
      logTotal.createdBy = this.authService.getCurrentInfor().username;
      order.logs.push(logTotal);
      var items = basket.items;
      var newArray = [];
      order.createdBy = this.authService.getCurrentInfor().username;
      items.forEach(val => newArray.push(Object.assign({}, val)));
      if (newArray !== null && newArray !== undefined && newArray?.length > 0) {
        newArray.forEach((item) => {
          // debugger;

          let logItem = new OrderLogModel();
          logItem.type = type;
          logItem.action = "Apply Line";
          logItem.result = "";
          logItem.value = (item?.discountType?.toString() ?? "").toString();;
          logItem.customF1 = item?.id?.toString();
          logItem.customF2 = item?.uom?.toString();
          logItem.customF3 = (item?.barCode ?? item?.barcode) ?? "";
          logItem.customF4 = (item?.price?.toString() ?? "").toString();
          logItem.customF5 = (item?.lineTotal?.toString() ?? "").toString();
          logItem.customF6 = (item?.quantity?.toString() ?? "").toString();
          logItem.customF7 = (basket?.userApproval ?? "").toString();
          logItem.customF8 = (basket?.note?.toString() ?? "").toString();
          logItem.customF9 = (item?.discountValue?.toString() ?? "").toString();
          logItem.customF10 = (item?.promotionId ?? item?.promoId ?? "").toString();
          logItem.createdBy = this.authService.getCurrentInfor().username;
          logItem.storeId = this.authService.storeSelected().storeId;
          logItem.companyCode = this.authService.getCurrentInfor().companyCode;

          logItem.time = new Date();
          order.logs.push(logItem);

        });
      }

      this.clickStream.pipe(debounceTime(500)).pipe(e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
        .subscribe(response => {
          // this.orderCached.next("");
          // this.alertify.success("Successfully completed.");
        });
    }

  }
  getNewOrderCode(companyCode, StoreCode: string) {
    return this.http.get(
      this.baseUrl + 'sale/getNewOrderNum?companyCode=' + companyCode + '&StoreCode=' + StoreCode,
      { responseType: 'text' }
    );
  }

  resetDiscountPromotion(isClearPromotion, isVoucher) {
    const basket = this.getCurrentBasket();

    this.authService.setOrderLog("Order", "Reset Discount", "", "");
    debugger;
    basket.clearPromotion = isClearPromotion;
    if (isVoucher !== true) {
      basket.promotionItems = null;

    }
    basket.promotionApplyTemp = null;
    var a = Object.assign({}, basket);
    if (isClearPromotion == true) {
      basket.discountTypeTemp = 'Discount Percent';
      basket.discountValueTemp = 0;
      // basket.discountType = '';
      // basket.discountValue = 0;
      basket.voucherApply = [];
      basket.voucherApplyTemp = [];
    }
    else {

      if (isVoucher === true) {
        basket.discountTypeTemp = a.discountTypeTemp;
        basket.discountValueTemp = a.discountValueTemp;
      }
      else {
        basket.discountTypeTemp = a.discountType;
        basket.discountValueTemp = a.discountValue;
      }
    }



    debugger;
    // this.setBasket(basket);
    this.addPromotionList(isVoucher);
    // this.calculateBasket();
    this.discountCalculateBasket(basket.discountTypeTemp, basket.discountValueTemp);
  }

  discountCalculateBasket(type: string, amount: number = 0) {
    const basket = this.getCurrentBasket();
    const ship = 0;
    let billRoundingOff = 0;
    //
    if (basket.items !== null && basket.items !== undefined) {
      let total = basket.promotionItems.reduce(
        (a, b) => b.price * b.quantity + a,
        0);// subtotal + ship;
      // // debugger;
      let subtotal = 0;
      let billTotal = 0;
      // // debugger;
      // if(basket.clearPromotion===true)
      // {
      //   // let promotionLineTotal= b.promotionLineTotal;
      //   subtotal = basket.promotionItems.reduce((a, b) =>  b.lineTotal  + a, 0);


      //   //b.price * b.quantity
      //     billTotal = basket.promotionItems.reduce(
      //     (a, b) => b.price * b.quantity + a,
      //     0
      //   );
      // }
      // else
      // {

      // }
      // let promotionLineTotal= b.promotionLineTotal;
      //  if(basket.clearPromotion===true)
      //  {

      //  }
      subtotal = basket.promotionItems.reduce((a, b) => b.promotionLineTotal + a, 0);


      //b.price * b.quantity
      billTotal = basket.promotionItems.reduce(
        (a, b) => b.promotionLineTotal + a,
        0
      );

      let phutroi = total - billTotal;
      const RemainBill = billTotal - (billTotal - subtotal);
      //basket.payments.reduce((a, b) => (total- b.paymentCharged ) + a, 0);
      let discountTotal: number = 0;
      // const totalAmount = basket.payments.reduce((a, b) => (b.paymentTotal) + a, 0);
      // // debugger;
      const discountType = type;
      const discountBillValue = amount;

      if (discountType === 'percent' || discountType === 'Discount Percent') {
        discountTotal = RemainBill - (RemainBill - (amount * RemainBill) / 100);
      }
      if (discountType === 'amount' || discountType === 'Discount Amount') {
        discountTotal = RemainBill - (RemainBill - amount);
      }
      debugger;
      if (discountTotal > 0 || RemainBill > 0) {
        let value = Math.abs(billTotal - subtotal + discountTotal);

        if (value == phutroi) {
          discountTotal = value;
        }
        else {
          if (phutroi < 0) {
            discountTotal = 0
          }
          else {

          }
          discountTotal = Math.abs(total - subtotal + discountTotal);
        }


        // discountTotal = Math.abs(total - subtotal + discountTotal);
      }
      if (RemainBill <= 0) {
        discountTotal = total - subtotal;
      }
      let storeCurrency = this.authService.getStoreCurrency();
      // let typeRounding: MStoreCurrency;
      // if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {
      //   typeRounding = storeCurrency.find(x => x.currency === this.authService.storeSelected().currencyCode);

      // }
      let typeRounding;
      let store = this.authService.storeSelected();
      if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {

        typeRounding = storeCurrency.find(x => x.currency === this.authService.storeSelected().currencyCode);
      }
      else {
        if (store.currencyCode !== null && store.currencyCode !== undefined && store.currencyCode !== '') {
          typeRounding = this.getCurrency(store.currencyCode);
          typeRounding.roundingMethod = typeRounding?.rounding;
        }

      }
      debugger;
      let totalAfRound = this.authService.roundingValue(subtotal, typeRounding?.roundingMethod);
      billRoundingOff += this.authService.roundingAmount(subtotal - totalAfRound);
      subtotal = totalAfRound;
      // console.log(basket.promotionItems);
      discountTotal = this.authService.roundingValue(discountTotal, "RoundUp", 2);
      this.basketTotalDiscount.next({
        ship,
        subtotal,
        total,
        billTotal,
        discountTotal,
        discountBillValue,
        discountType,
        billRoundingOff
      });
    }

  }
  public calculateCurrencyBasket(currency, rate) {
    // console.log("Tính toán theo currency");
    let basket = this.getCurrentBasket();
    let ship = 0;

    if (basket.items !== null && basket.items !== undefined) {
      // debugger;
      if (currency !== null && currency !== undefined && currency !== '') {
        let totalQty = basket.items.reduce((a, b) => b.quantity + a, 0);
        let subtotal = basket.items.reduce((a, b) => b.promotionLineTotal + a, 0);
        let total = subtotal + ship;
        // // debugger;
        // const billTotalPromotion = basket.promoItemApply.reduce(
        //   (a, b) => b.price * b.quantity + a,
        //   0
        // );
        let billTotal = basket.items.reduce(
          (a, b) => b.price * b.quantity + a,
          0
        );
        //b.price * b.quantity
        //b.promotionLineTotal
        let RemainBill = billTotal - (billTotal - subtotal);


        //basket.payments.reduce((a, b) => (total- b.paymentCharged ) + a, 0);
        let discountTotal: number = 0;

        let discountBillValue: number = 0;
        // const totalAmount = basket.payments.reduce((a, b) => (b.paymentTotal) + a, 0);
        // // debugger;
        if (basket.discountType !== null) {
          const discountType = basket.discountType;
          const discountValue = basket.discountValue;
          if (discountType === 'percent' || discountType === 'Discount Percent') {

            discountTotal = RemainBill - (RemainBill - (discountValue * RemainBill) / 100);
          }
          if (discountType === 'amount' || discountType === 'Discount Amount') {
            discountTotal = RemainBill - (RemainBill - discountValue);
          }
          // // debugger;
          if (discountTotal > 0 || RemainBill > 0) {
            discountBillValue = billTotal - subtotal + discountTotal;

          }
          else {
            if (basket.salesType !== 'Exchange') {
              discountBillValue = billTotal;
            }
            else {
              discountBillValue = - (Math.abs(billTotal) - Math.abs(subtotal));
            }

          }
          // if(basket.salesType === 'Exchange')
          // {
          //   discountBillValue = Math.abs(billTotal)  - Math.abs(subtotal) + Math.abs(discountBillValue);
          // }
        }
        // // debugger;
        if (discountBillValue < 0 && billTotal > 0) {
          billTotal = billTotal + -discountBillValue;
          discountBillValue = 0
        }
        else {
          total = billTotal - discountBillValue;
        }

        // if(basket.salesType === 'Exchange')
        // {
        //   total = billTotal;
        //   discountBillValue=0;
        // }
        // debugger;
        let totalAmount = basket.payments.reduce((a, b) => b.paymentTotal * (b.rate ?? 1) + a, 0);

        // const amountLeft = total;
        let charged = total - basket.payments.reduce((a, b) => b.paymentDiscount + a, 0); // basket.payments.reduce((a, b) => (b.paymentCharged) + a, 0);

        let changed = basket.payments.reduce((a, b) => -(b.roundingOff ?? 0) + a, 0); // basket.payments.reduce((a, b) => (b.paymentCharged) + a, 0);

        let calChange = 0;
        let calLeft = total - totalAmount + changed;
        if (calLeft <= 0) {
          // calLeft = total - charged;
          calLeft = 0;
        }

        let amountLeft = calLeft; // total - charged;// basket.payments.reduce((a, b) => totalAmount -  b.paymentCharged + a, 0);

        if (total - totalAmount < 0) {
          calChange = -(total - totalAmount + changed);
        } else {
          calChange = 0;
        }
        let changeAmount = calChange; //total - charged;
        totalAmount = totalAmount - changed;

        //Exchange rate
        ship = ship / rate;
        subtotal = subtotal / rate;
        total = total / rate;
        billTotal = billTotal / rate;
        discountTotal = discountTotal / rate;
        totalAmount = totalAmount / rate;
        changeAmount = changeAmount / rate;
        amountLeft = amountLeft / rate;
        charged = charged / rate;
        discountBillValue = discountBillValue / rate;

        this.basketCurrencyTotal.next({
          currency,
          rate,
          ship,
          subtotal,
          total,
          totalQty,
          billTotal,
          discountTotal,
          totalAmount,
          changeAmount,
          amountLeft,
          charged,
          discountBillValue,
        });
      }
      else {
        let subtotal = 0;
        let total = 0;
        let billTotal = 0;
        let discountTotal = 0;
        let totalAmount = 0;
        let changeAmount = 0;
        let amountLeft = 0;
        let charged = 0;
        let discountBillValue = 0;
        let totalQty = 0;
        this.basketCurrencyTotal.next({
          currency,
          rate,
          ship,
          subtotal,
          total,
          totalQty,
          billTotal,
          discountTotal,
          totalAmount,
          changeAmount,
          amountLeft,
          charged,
          discountBillValue,
        });
      }
    }

  }
  checkCompleted = false;
  checkItemTaxCodeisNull(basket: IBasket) {
    let itemTaxNull = basket.items.filter(x => x.salesTaxCode === null || x.salesTaxCode === undefined || x.salesTaxCode === '')
    let store = this.authService.storeSelected();
    if (itemTaxNull !== null && itemTaxNull !== undefined && itemTaxNull?.length > 0) {
      let itemNum = 0;
      // debugger;
      itemTaxNull.forEach(async item => {
        await this.itemService.getItemFilter(store.companyCode, store.storeId, item.id, item.uom, item.barcode,
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', basket.customer.customerGrpId, '', '', '', '').subscribe(async (response: any) => {
            // debugger;
            itemNum++;
            console.log('response barcode', response);
            if (response.success) {

              let itemX = response.data[0];
              if (itemX !== undefined && itemX !== null) {
                item.salesTaxCode = itemX?.salesTaxCode;
                item.salesTaxRate = itemX?.salesTaxRate;
                item.priceListId = itemX?.priceListId;
                item.productId = itemX?.productId;
                item.productName = itemX?.itemName;
                if (item.discountType === "" || item.discountType === undefined || item.discountType === null) {
                  item.discountType = "Discount Percent";
                }
                if (item.discountValue === undefined || item.discountValue === null) {
                  item.discountValue = 0;
                }

              }
              else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Data item ' + item.barcode + '  not found',
                  text: response.message
                });
              }

            }
            else {
              Swal.fire({
                icon: 'warning',
                title: 'Data item ' + item.barcode + '  not found',
                text: response.message
              });
            }

            if (itemNum >= itemTaxNull?.length) {
              this.calculateBasketAction();
            }
          })
      });
    }
    else {
      this.calculateBasketAction();
    }
  }

  public orderToBasket(order, excludePaidPayment, onlyPayment, typeOfBasket, employees, barcodeSetup, isLoadPayment, isChecked) {

    let basket = this.getCurrentBasket();
    // debugger;
    if (basket !== undefined && basket !== null) {
      this.deleteBasket(basket);
    }

    setTimeout(() => {
      let defCustomer = this.authService.getDefaultCustomer();
      if (order?.customer !== null && order?.customer !== undefined) {
        this.changeCustomer(order.customer, typeOfBasket ?? "Retail", false).subscribe(() => {

        });

      }
      else {
        this.changeCustomer(defCustomer, typeOfBasket ?? "Retail", false).subscribe(() => {

        });
      }

      if (onlyPayment !== true) {
        let defEmployee = this.authService.getCurrentInfor()?.defEmployee;
        if (defEmployee !== null && defEmployee !== undefined && defEmployee !== '') {
          // debugger;
          let employee = employees.find(x => x.employeeId === defEmployee);
          if (employee !== null && employee !== undefined) {
            order.salesPerson = defEmployee;
            this.changeEmployee(employee);
          }
          else {
            if (employees.length > 0) {
              order.salesPerson = employees[0].employeeId;
            }

          }
        }
      }



      if (order?.lines !== null && order?.lines !== undefined && order?.lines.length > 0) {
        this.setItemToBasket(order, excludePaidPayment, order.lines, barcodeSetup, isLoadPayment, isChecked);
      }

    });


  }
  mapPaymentOrderToPaymentBasket(payment: TSalesPayment, paymentCharged, isPaid, transId, paymentLineNum?): IBasketPayment {
    // // debugger;
    return {
      id: payment.paymentCode,
      refNum: payment.refNumber,
      paymentDiscount: payment.paymentDiscount,
      paymentTotal: payment.totalAmt,
      paymentCharged,
      lineNum: (paymentLineNum !== null && paymentLineNum !== undefined) ? paymentLineNum : parseInt(payment.lineId),
      isRequireRefNum: null,
      mainBalance: payment.mainBalance,
      subBalance: payment.subBalance,
      cardNo: payment.cardNo,
      cardType: payment.cardType,
      cardHolderName: payment.cardHolderName,
      canEdit: null,
      currency: payment.currency,
      voucherSerial: payment.voucherSerial,
      rate: payment.rate,
      fcAmount: payment.fcAmount,
      paidAmt: payment.paidAmt,
      paymentMode: payment.paymentMode,
      paymentType: null,
      shortName: payment.paymentCode,
      roundingOff: payment.roundingOff,
      fcRoundingOff: payment.fcRoundingOff,
      forfeitCode: payment.forfeitCode,
      forfeit: payment.forfeit,
      customF1: payment.customF1,
      customF2: payment.customF2,
      customF3: payment.customF3,
      customF4: payment.customF4,
      customF5: payment.customF5,
      isCloseModal: null,
      apiUrl: null,
      bankPaymentType: null,
      isPaid: isPaid,
      transId: transId,
      lines: null
    };
  }
  // mapPaymentOrderToPaymentBasket(salePayment: TSalesPayment ): IBasketPayment
  // {
  //    return {
  //       id : salePayment.paymentCode ,
  //       refNum =  salePayment.refNumber ,
  //       lineNum = parseInt(salePayment.lineId) ,

  //       cardNo = salePayment.cardNo ,
  //       cardHolderName = salePayment.cardHolderName ,
  //       cardType = salePayment.cardType ,
  //       paymentMode = salePayment.paymentMode ,
  //       paymentCharged =  salePayment.chargableAmount,// = (isNegative === true  || hasItemSalesNegative ===true) ? - = paymentline.paymentCharged,
  //       paymentDiscount = salePayment.paymentDiscount,// = (isNegative === true  || hasItemSalesNegative ===true) ? - paymentline.paymentDiscount = paymentline.paymentDiscount,
  //       paymentTotal = salePayment.collectedAmount ,//= (isNegative === true  || hasItemSalesNegative ===true) ? - paymentline.paymentTotal = paymentline.paymentTotal,
  //       // payment.createdBy = order.createdBy,
  //       roundingOff = salePayment.roundingOff ,
  //       fcRoundingOff = salePayment.fcRoundingOff  ,
  //       forfeit = salePayment.forfeit ,
  //       forfeitCode = salePayment.forfeitCode ,
  //       customF1 = salePayment.customF1,
  //       customF2 = salePayment.customF2,
  //       customF3 = salePayment.customF3  ,
  //       customF4 = salePayment.customF4  ,
  //       customF5 = salePayment.customF5  , 
  //       rate = salePayment.rate , 
  //       paymentCharged  = salePayment.collectedAmount,
  //       currency = salePayment.currency, 
  //       paidAmt = salePayment.paidAmt,
  //       fcAmount =  salePayment.fcAmount
  //    }

  //     return basketPayment;
  //     // basketPayment.changeAmt = salePayment.changeAmt;


  // }
  async setItemToBasket(order, excludePaidPayment, lines: TSalesLine[], barcodeSetup, isLoadPayment, isChecked) {

    // xxxxxx
    // let Lines = [];
    console.log('order', order);
    console.log('lines', lines);
    // debugger;
    let itemNum = 0;
    let oldItem = [];
    var newArray = [];
    lines.forEach(val => newArray.push(Object.assign({}, val)));
    newArray = newArray.filter(x => x?.promotionIsPromo !== '1');
    let storeSelected = this.authService.storeSelected();
    newArray.forEach(async item => {
      // debugger;
      console.log('await barcode', item);

      this.changeBasketResponseStatus(false);
      let PLU = "";
      let canGetData = true;
      if (item?.weightScaleBarcode !== null && item?.weightScaleBarcode !== undefined && item?.weightScaleBarcode !== '') {
        item.barCode = "";
        // debugger;
        if (barcodeSetup[0] !== null && barcodeSetup[0] !== undefined) {
          let value = item.weightScaleBarcode;
          let barcode = this.barcodeService.splitBarcode(value, barcodeSetup[0]);

          if (barcode.prefix === barcodeSetup[0].prefix) {
            if (barcode.barCodeLength === value.length) {
              if (this.barcodeService.barcodeCheck(value)) {
                PLU = barcode.pluStr;
              }
              else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Item',
                  text: value + " Check digit failed"
                });
                canGetData = false;
                this.changeBasketResponseStatus(true);
              }
            }
            else {
              // this.alertify.warning('Invalid barcode length.');
              Swal.fire({
                icon: 'warning',
                title: 'Item',
                text: value + " Invalid barcode length"
              });
              canGetData = false;
              this.changeBasketResponseStatus(true);
              // console.log("Invalid barcode length");
            }


          }
        }

      }

      if (canGetData) {
        //item.barCode

        await this.itemService.getItemFilter(order.companyCode, order.storeId, item.itemCode, item.uomCode, '',
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', order.cusGrpId, '', PLU, '', '').subscribe(async (response: any) => {

            itemNum++;
            console.log('response barcode', response);
            if (response.success) {
              let itemX = response.data[0];
              if (itemX !== undefined && itemX !== null) {
                console.log('response.responseTime', response.responseTime);
                itemX.responseTime = response.responseTime;
                if (item.slocId !== undefined && item.slocId !== null) {
                  itemX.slocId = item.slocId;
                }
                else {
                  itemX.slocId = storeSelected.whsCode;
                }

                let itembasket = this.mapProductItemtoBasket(itemX, 1);
                itembasket.weightScaleBarcode = item.weightScaleBarcode;
                if (itembasket.productName === null || itembasket.productName === undefined) {
                  itembasket.productName = itemX.itemDescription;
                }
                itembasket.lineItems = [];
                let BOMLine = item.lines;

                if (BOMLine !== null && BOMLine !== undefined) {
                  BOMLine.forEach(line => {
                    let bomLine = new IBasketItem();
                    bomLine.id = line.itemCode;
                    bomLine.productName = line.itemName;
                    bomLine.quantity = line.quantity;
                    bomLine.uom = line.uomCode;
                    bomLine.price = line.price;
                    bomLine.lineTotal = line.lineTotal;
                    itembasket.lineItems.push(bomLine);
                  });
                }



                itembasket.quantity = item.openQty;
                itembasket.openQty = item.openQty;
                if (itembasket.isCapacity) {
                  itembasket.appointmentDate = item.appointmentDate.toString();
                  itembasket.timeFrameId = item.timeFrameId.toString();
                  itembasket.storeAreaId = item.storeAreaId.toString();
                  itembasket.quantity = item.openQty;
                  itembasket.note = item.remark;

                }
                debugger;
                if (isChecked) {

                  itembasket.oriQty = item.quantity;
                  itembasket.quantity = item?.checkedQty;
                }

                itembasket.prepaidCardNo = item.prepaidCardNo;

                itembasket.isSerial = item.isSerial;
                itembasket.isVoucher = item.isVoucher;
                itembasket.memberDate = item.memberDate;
                itembasket.memberValue = item.memberValue;
                itembasket.startDate = item.startDate;
                itembasket.endDate = item.endDate;
                itembasket.itemType = item.itemType;
                itembasket.promotionPromoCode = item?.promoId;
                debugger;
                if (item.lineTotalBefDis === null || item.lineTotalBefDis === undefined) {
                  item.lineTotalBefDis = item.quantity * item.price;
                  if (isChecked) {
                    if (itembasket.quantity !== null && itembasket.quantity !== undefined && itembasket.quantity !== 0) {
                      item.lineTotalBefDis = itembasket.quantity * item.price;
                    }

                  }
                }
                item.lineTotalDisIncludeHeader = null;
                if (item.lineTotalDisIncludeHeader === null || item.lineTotalDisIncludeHeader === undefined) {
                  if (order.discountAmount !== null && order.discountAmount !== undefined && order.discountAmount !== 0) {


                    if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                      let discountVl = (item.lineTotal * order.discountRate / 100);
                      item.lineTotalDisIncludeHeader = item.lineTotal - this.authService.roundingValue(discountVl, "RoundUp", 2);
                    }


                  }
                  else {
                    item.lineTotalDisIncludeHeader = item.lineTotalBefDis - item.discountAmt;
                    if (isChecked) {
                      if (item.checkedQty !== null && item.checkedQty !== undefined && item.checkedQty !== 0) {
                        item.lineTotalDisIncludeHeader = ((item.lineTotalBefDis / item.checkedQty) * item.quantity) - item.discountAmt;
                      }

                    }
                  }

                  item.lineTotal = item.lineTotalDisIncludeHeader;
                }
                debugger;
                let lineTotal = item.lineTotal;// item.quantity * item.price;
                // if(isChecked)
                // {  
                //   lineTotal = itembasket.price * itembasket.quantity; 
                // }
                let discountAmountLine = item.discountAmt ? item.discountAmt : 0;



                if (discountAmountLine > 0) {

                  let xRs = lineTotal;// - discountAmountLine;
                  let resultLine = xRs / item.quantity; // (xRs - (xRs * discountTongBill / 100)) 
                  itembasket.price = resultLine;//item.price;
                  itembasket.promotionPriceAfDis = resultLine;
                  itembasket.promotionLineTotal = 1 * resultLine;
                }
                else {
                  let resultLine = lineTotal / item.quantity; // (lineTotal - (lineTotal * discountTongBill / 100))
                  itembasket.price = item.price;
                  itembasket.promotionPriceAfDis = resultLine;
                  itembasket.promotionLineTotal = 1 * resultLine;
                }
                itembasket.price = item.price;

                itembasket.promotionLineTotal = itembasket.promotionPriceAfDis * itembasket.quantity;
                // debugger;
                // if(item.lineTotal < (item.lineTotal - item.discountAmt) )
                // {

                //   itembasket.promotionPriceAfDis =(item.lineTotal - item.discountAmt ) / item.quantity; // item.lineTotalDisIncludeHeader  / item.quantity
                //   itembasket.promotionLineTotal = item.lineTotal - item.discountAmt; // item.lineTotalDisIncludeHeader / item.quantity

                // }
                // else
                // {
                //   itembasket.promotionPriceAfDis = item.lineTotal  / item.quantity; // item.lineTotalDisIncludeHeader  / item.quantity
                //   itembasket.promotionLineTotal = item.lineTotal ; // item.lineTotalDisIncludeHeader / item.quantity

                // }
                // if(isChecked)
                // { 


                // }
                itembasket.discountType = item.discountType === null || item.discountType === undefined ? "" : item.discountType;

                if (itembasket.discountType === null || itembasket.discountType === undefined || itembasket.discountType === "") {
                  itembasket.discountType = 'Discount Percent'
                }
                if (itembasket.discountType === 'Discount Percent') {
                  itembasket.discountValue = item.discountRate;
                }
                // if (itembasket.discountType === 'Discount Amount') {
                //   itembasket.discountValue = item.discountAmt/item.quantity;
                // }
                if (itembasket.discountType === 'Fixed Quantity') {
                  itembasket.discountValue = item.discountAmt / item.quantity;
                }
                if (itembasket.discountType === 'Fixed Price') {
                  itembasket.discountValue = item.discountAmt / item.quantity;
                }
                itembasket.promotionDisAmt = item.discountAmt / item.quantity;

                if (itembasket.discountType === 'Discount Amount') {
                  itembasket.discountValue = item.discountAmt;
                  itembasket.promotionDisAmt = item.discountAmt;
                }

                itembasket.promotionDisPrcnt = item.discountRate;
                itembasket.promotionDiscountPercent = item.discountRate;

                itembasket.promotionIsPromo = item.isPromo;
                itembasket.salesTaxCode = item.taxCode;
                itembasket.salesTaxRate = item.taxRate;
                itembasket.taxAmt = item.taxAmt;
                itembasket.promotionType = item.promoType;
                itembasket.baseLine = item.lineId;
                itembasket.baseTransId = item.transId;
                itembasket.weightScaleBarcode = item.weightScaleBarcode;
                if (itembasket?.weightScaleBarcode?.length > 0) {
                  itembasket.isWeightScaleItem = true;
                }

                oldItem.push(itembasket);

              }
              else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Data item ' + item.description + '  not found',
                  text: response.message
                });
              }

            }
            else {
              Swal.fire({
                icon: 'warning',
                title: 'Data item ' + item.description + '  not found',
                text: response.message
              });
            }

            if (itemNum >= newArray.length) {

              // debugger;
              console.log('oldItem', oldItem)
              this.addItemListBasketToBasket(oldItem, false);

              // Lệnh ngu ngốc
              if (excludePaidPayment && order?.contractPayments?.length > 0) {
                let basket = this.getCurrentBasket();
                basket.paidPayments = [];// order.contractPayments; 
                order.contractPayments.forEach(async payment => {
                  debugger;
                  let basketPayment = this.mapPaymentOrderToPaymentBasket(payment, payment.collectedAmount, true, payment?.transId);
                  basketPayment.paymentTotal = payment?.collectedAmount ?? 0;
                  basketPayment.refNum = payment?.refNum ?? '';
                  basket.paidPayments.push(basketPayment);
                  // this.addPaymentBasketToBasket(basketPayment, payment.collectedAmount);
                  // // this.addPaymentToBasket(payment, payment.collectedAmount);
                })
                this.setBasket(basket);
              }

              // this.applyPromotion(basket);
              this.calculateBasket();
              debugger;
              if (isLoadPayment) {

                if (order.payments?.length > 0) {
                  var newPayment = [];

                  order.payments.forEach(val => newPayment.push(Object.assign({}, val)));

                  let paymentNo = 0;
                  // let storeSelected = this.authService.storeSelected();
                  newPayment.forEach(async payment => {
                    debugger;
                    paymentNo++;

                    // this.payment = new TSalesPayment(); 

                    // this.payment.paymentCode = paymentId;
                    // this.payment.refNumber = result.value.toString();
                    // this.payment.paymentDiscount = 0;
                    // // this.payment.collectedAmount = result.value.toString();
                    // this.payment.totalAmt = 0 ;
                    // this.payment.chargableAmount =  amountLeft;//this.basketService.getAmountLeft();
                    // this.payment.receivedAmt = 0 ;
                    // this.payment.mainBalance = response.data.mainBalance===null || response.data.mainBalance===undefined ? 0 : response.data.mainBalance ;
                    // this.payment.subBalance = response.data.subBalance===null || response.data.subBalance===undefined ? 0 : response.data.subBalance;
                    // // this.payment.paymentCharged = 0;// this.basketService.getAmountLeft();

                    // let linenum = this.order.payments.length + 1;
                    // this.payment.lineId= linenum.toString() ;
                    let basketPayment = this.mapPaymentOrderToPaymentBasket(payment, payment.collectedAmount, true, order?.transId, paymentNo);
                    this.addPaymentBasketToBasket(basketPayment, payment.collectedAmount);
                    // this.addPaymentToBasket(payment, payment.collectedAmount);
                  })
                }

              }
              // this.calculateBasket();
              this.changeBasketResponseStatus(true);
              // console.log("Set data");
            }
          })
      }


    });

  }
  QtyWScaleToOne = false;
  public calculateBasketAction() {
    // debugger;
    const basket = this.getCurrentBasket();
    let format = this.authService.loadFormat();
    let decimalPlacesFormat = 6;
    let percentPlacesFormat = 6;

    if (format !== null && format !== undefined) {
      let checkFm = format.decimalPlacesFormat;
      if (checkFm !== null && checkFm !== undefined && checkFm !== '') {
        decimalPlacesFormat = parseInt(checkFm);
      }
      let checkPercentFm = format.perDecimalPlacesFormat;
      if (checkPercentFm !== null && checkPercentFm !== undefined && checkPercentFm !== '') {
        percentPlacesFormat = parseInt(checkPercentFm);
      }
    }


    let ship = 0;
    let negative = basket.negativeOrder ?? false;
    // // debugger;
    // const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    // const total = subtotal + ship;
    // const billTotal = total;
    // // debugger;
    // console.log(basket.items);
    // const subtotalPromotion = basket.promoItemApply.reduce((a, b) =>  b.promotionLineTotal + a, 0);
    let storeCurrency = this.authService.getStoreCurrency();
    // let type=  storeCurrency.find(x=>x.currency = this.authService.storeSelected().currencyCode);
    //  debugger;
    let subtotal = 0;
    let billRoundingOff = 0;
    let total = 0;
    let RemainBill = 0;
    debugger;
    subtotal = basket.items.reduce((a, b) => (b.isNegative ? - b.promotionLineTotal : b.promotionLineTotal) + a, 0);
    if (this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
      // subtotal = basket.items.reduce((a, b) => (b.isNegative ? - b.promotionLineTotal : b.promotionLineTotal) + a, 0);
      subtotal = basket.items.reduce((a, b) =>
        //Nếu item này là item return thì đổi dấu thành trừ k thì giữ nguyên
        //Nếu là wieght Scale Item thì rounding lineTotal, Price 
        (b.isNegative ? -1 : 1) * (b?.weightScaleBarcode?.length > 0 ? this.authService.roundingAmount(b.promotionLineTotal) : (b.promotionLineTotal)) + a, 0
      );

    }
    total = subtotal + ship;
    // - parseFloat(b.quantity.toString()
    let totalQty = basket.items.reduce((a, b) => (b.isNegative ? 0 : parseFloat(b.quantity.toString())) + a, 0);
    if (this.QtyWScaleToOne === true) {
      totalQty = basket.items.reduce((a, b) => (b.isNegative ? 0 : (b.weightScaleBarcode?.length > 0 ? 1 : parseFloat(b.quantity.toString()))) + a, 0);
    }

    // const billTotalPromotion = basket.promoItemApply.reduce(
    //   (a, b) => b.price * b.quantity + a,
    //   0
    // );

    // let testAmount = 0;
    // basket.items.forEach(item => {
    //   let checkAmt = ( (item.isNegative ? -1 : 1) * (item.price * item.quantity));
    //   testAmount += checkAmt;

    //   console.log(checkAmt);

    // });
    // console.log('testAmount' , testAmount);
    debugger

    let billTotal = 0;
    billTotal = basket.items.reduce((a, b) =>
      // (b.isNegative ? -b.lineTotal : b.lineTotal) + a, 0
      // xxxx

      (b.isNegative ? (-1 * (b.price * b.quantity)) : (b.price * b.quantity)) + a, 0
    );
    if (this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
      billTotal = basket.items.reduce((a, b) =>
        //Nếu item này là item return thì đổi dấu thành trừ k thì giữ nguyên
        //Nếu là wieght Scale Item thì rounding lineTotal, Price 
        // (b.isNegative?-1:1) * (b?.weightScaleBarcode?.length>0? this.authService.roundingAmount((this.authService.roundingAmount(b.price) * b.quantity)):(b.price * b.quantity))   + a,  0
        //2023-06-26 sửa lại rounding đối với wsc
        (b.isNegative ? -1 : 1) * (b?.weightScaleBarcode?.length > 0 ? this.authService.roundingValue((this.authService.roundingValue(b.price, "RoundToTenHundredth", decimalPlacesFormat) * b.quantity), "RoundToTenHundredth", decimalPlacesFormat) : (b.price * b.quantity)) + a, 0

      );

    }

    // foreach(let item of basket.items)
    // {

    // }
    let currency = this.authService.storeSelected().currencyCode;
    if (currency === undefined || currency === null || currency === "") {
      currency = "VND";
    }
    debugger;
    if (storeCurrency === null || storeCurrency === undefined || storeCurrency?.length <= 0 || currency === "VND") {
      billTotal = this.authService.roundingAmount(billTotal);
      total = this.authService.roundingAmount(total);
      subtotal = this.authService.roundingAmount(subtotal);
    }
    //2023-02-01: Lập thêm vào rounding luôn cho những đơn vị tiền tệ khác 








    //b.price * b.quantity
    //b.promotionLineTotal
    RemainBill = billTotal - (billTotal - subtotal);
    if (billTotal < 0) {
      //  if(Math.abs(billTotal) > Math.abs(subtotal)) 
      //  {

      //  }
      //  RemainBill = billTotal;
      // subtotal = billTotal;
    }
    // if(basket.salesType === 'Exchange')
    // {
    //   if(subtotal > billTotal) 
    //   {
    //     billTotal = subtotal;

    //     // RemainBill = billTotal;
    //   }
    // }
    //basket.payments.reduce((a, b) => (total- b.paymentCharged ) + a, 0);
    let discountTotal: number = 0;
    // // debugger;
    let discountBillValue: number = 0;
    // debugger;
    // const totalAmount = basket.payments.reduce((a, b) => (b.paymentTotal) + a, 0);
    // debugger;
    //  debugger;
    if (basket.discountType !== null) {
      const discountType = basket.discountType;
      const discountValue = basket.discountValue;
      if (discountType === 'percent' || discountType === 'Discount Percent') {

        discountTotal = RemainBill - (RemainBill - (discountValue * RemainBill) / 100);
      }
      if (discountType === 'amount' || discountType === 'Discount Amount') {
        discountTotal = RemainBill - (RemainBill - discountValue);
      }
      // // debugger;
      if (discountTotal > 0 || RemainBill > 0) {
        // -
        discountBillValue = billTotal - Math.abs(billRoundingOff) - subtotal + discountTotal;

      }
      else {
        if (basket.salesType !== 'Exchange') {
          let salesNegativeList = basket.items.filter(x => x?.allowSalesNegative === true);
          if (billTotal < 0 && salesNegativeList?.length > 0) {
            discountBillValue = - billRoundingOff;
          }
          else {
            discountBillValue = billTotal - billRoundingOff;
          }

        }
        else {
          // discountBillValue = - (Math.abs(billTotal - billRoundingOff) - Math.abs(subtotal));
          discountBillValue = (Math.abs(billTotal - billRoundingOff) - Math.abs(subtotal));
        }

      }
      // if(basket.salesType === 'Exchange')
      // {
      //   discountBillValue = Math.abs(billTotal)  - Math.abs(subtotal) + Math.abs(discountBillValue);
      // }
    }
    // if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {
    //   let type = storeCurrency.find(x => x.currency === this.authService.storeSelected().currencyCode);
    //   let discountBillAfRound = this.authService.roundingValue(discountBillValue, type?.roundingMethod);
    //   billRoundingOff += this.authService.roundingAmount(discountBillValue - discountBillAfRound); 
    //   discountBillValue = discountBillAfRound;


    // }
    //  debugger;
    // if(basket.salesType === 'Exchange')
    // {
    //   if(discountBillValue < 0) 
    //   {
    //     discountBillValue = Math.abs(discountBillValue);

    //   }
    // }
    // discountBillValue < 0 && billTotal > 0
    if (basket.salesType === 'Exchange') {


      let billTotalCal = basket.items.reduce((a, b) => ((b.isNegative ? -b.quantity : b.quantity) * b.price) + a, 0);// (billTotal - billRoundingOff + -discountBillValue); // + Math.abs(discountBillValue) ;

      // if(subtotal < 0)
      // {
      //   billTotal = -billTotalCal;
      // }
      // else
      // {
      //   billTotal = billTotalCal;
      // }
      billTotal = billTotalCal;
      // discountBillValue = 0;
    }
    else {
      if (billTotal < 0) {
        billTotal = basket.items.reduce((a, b) => Math.abs(b.quantity * b.price) + a, 0);
        if (discountBillValue > 0) {

          if (basket.salesType === 'Exchange') {
            // if(Math.abs(subtotal) > Math.abs(billTotal)) 
            // {
            //   billTotal = subtotal;
            // }
            total = Math.abs(total) - billRoundingOff;//- discountBillValue; 
          }
          else {
            total = Math.abs(billTotal) - billRoundingOff - discountBillValue;
          }

        }
        else {
          if (subtotal > billTotal) {
            total = total - billRoundingOff;
            billTotal = subtotal;
          }
          else {
            total = Math.abs(billTotal) - billRoundingOff - discountBillValue;
          }

        }

      }
      else {
        total = billTotal - billRoundingOff - discountBillValue;
      }

    }

    let typePayment;
    let store = this.authService.storeSelected();
    if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {

      typePayment = storeCurrency.find(x => x.currency === this.authService.storeSelected().currencyCode);
    }
    else {
      if (store.currencyCode !== null && store.currencyCode !== undefined && store.currencyCode !== '') {
        typePayment = this.getCurrency(store.currencyCode);
        typePayment.roundingMethod = typePayment?.rounding;
      }

    }
    //  debugger;
    let totalAfRound = this.authService.roundingValue(total, typePayment?.roundingMethod);
    billRoundingOff += this.authService.roundingAmount(total - totalAfRound);

    total = totalAfRound;
    if (basket.salesType === 'Exchange') {
      if (total <= 0) {
        billRoundingOff = -billRoundingOff;
      }
    }
    // if(basket.salesType === 'Exchange')
    // {
    //   total = billTotal;
    //   discountBillValue=0;
    // }0

    //- (b.roundingOff ?? 0)
    // let totalAmount = 0;
    // let charged = 0;
    // let changed = 0;

    let totalAmount = basket.payments.reduce((a, b) => (b.paymentTotal * (b.rate ?? 1)) + a, 0);
    // // debugger;
    // const amountLeft = total;
    let paymentDiscount = basket.payments.reduce((a, b) => b.paymentDiscount + a, 0); // basket.payments.reduce((a, b) => (b.paymentCharged) + a, 0);
    let charged = total - 0;
    let changed = basket.payments.reduce((a, b) => -(b.roundingOff ?? 0) + a, 0); // basket.payments.reduce((a, b) => (b.paymentCharged) + a, 0);
    let actualAmount = basket.payments.reduce((a, b) => (b.undefinedAmount ?? 0) + a, 0);
    // (b.paymentTotal - (b.undefinedAmount??0) - b.paymentDiscount) + a, 0) ;

    // Số change Amount trên từng payment sau khi chạy Promotion Payment
    // let undefinedAmountSum = basket.payments.reduce((a, b) => -(b.undefinedAmount??0) + a, 0) ; 

    // if(basket?.excludePaidPayment)
    // {
    //   totalAmount = basket.payments.filter(x=> (x.isPaid??false)!== true).reduce((a, b) =>  (b.paymentTotal * (b.rate ?? 1)) + a, 0); 
    //   charged = total - basket.payments.filter(x=> (x.isPaid??false)!== true).reduce((a, b) => b.paymentDiscount + a, 0);  
    //   changed = basket.payments.filter(x=> (x.isPaid??false)!== true).reduce((a, b) => -(b.roundingOff ?? 0) + a, 0);  
    // }
    // else
    // {

    // }



    if (negative) {
      ship = Math.abs(ship);
      subtotal = Math.abs(subtotal);
      total = Math.abs(total);
      totalAmount = Math.abs(totalAmount);
      billTotal = Math.abs(billTotal);
      charged = Math.abs(charged);
    }
    let calChange = 0;
    let calLeft = total - totalAmount + changed;
    if (calLeft <= 0) {
      // calLeft = total - charged;
      calLeft = 0;
    }

    let amountLeft = calLeft; // total - charged;// basket.payments.reduce((a, b) => totalAmount -  b.paymentCharged + a, 0);
    debugger;
    if (total - totalAmount < 0) {
      calChange = -(total - totalAmount + changed);
    } else {
      calChange = 0;
    }

    //undefinedAmount  Chưa được sử dụng
    // let undefinedAmount = basket.undefinedAmount;
    // if(undefinedAmount!==null && undefinedAmount!==undefined && undefinedAmount!==0)
    // {
    //   undefinedAmount =  basket.undefinedAmount;
    // }
    // else
    // {
    //   undefinedAmount = 0;
    // }
    let changeAmount = calChange + paymentDiscount; //+ undefinedAmount - paymentDiscount; //total - charged;
    totalAmount = totalAmount - changed;


    // // debugger;
    // if(negative)
    // {
    //   ship =  Math.abs(ship);
    //   subtotal=  Math.abs(subtotal);
    //   total=  Math.abs(total);
    //   totalQty=  Math.abs(totalQty);
    //   billTotal=  Math.abs(billTotal);
    //   discountTotal=  Math.abs(discountTotal);
    //   let tmpAmountLeft =  amountLeft;
    //   totalAmount=  Math.abs(totalAmount);
    //   amountLeft= Math.abs(tmpAmountLeft); 
    //   changeAmount=   Math.abs(tmpAmountLeft); 
    //   charged=  Math.abs(charged);
    //   discountBillValue=  Math.abs(discountBillValue);
    //   billRoundingOff=  Math.abs(billRoundingOff)
    // } 
    // console.log('Test tính toán ');
    // this.changeBasketResponseStatus('Tính toán');

    this.changeBasketResponseStatus(true);
    // console.log("Tính toán");
    // // debugger;
    discountBillValue = this.authService.roundingValue(discountBillValue, "RoundUp", 2);
    this.basketTotal.next({
      ship,
      subtotal,
      total,
      totalQty,
      billTotal,
      discountTotal,
      totalAmount,
      changeAmount,
      amountLeft,
      charged,
      discountBillValue,
      billRoundingOff,
      paymentDiscount,
      actualAmount
    });

  }
  public calculateBasket() {

    const basket = this.getCurrentBasket();
    let ship = 0;
    let negative = basket?.negativeOrder ?? false;

    if (basket?.items !== null && basket?.items !== undefined && basket?.items?.length > 0) {
      this.checkItemTaxCodeisNull(basket);
    }
    else {
      let ship = 0;
      let subtotal = 0;
      let total = 0;
      let totalQty = 0;
      let billTotal = 0;
      let discountTotal = 0;
      let totalAmount = 0;
      let changeAmount = 0;
      let amountLeft = 0;
      let charged = 0;
      let discountBillValue = 0;
      let billRoundingOff = 0;
      let paymentDiscount = 0;
      let actualAmount = 0;
      this.basketTotal.next({
        ship,
        subtotal,
        total,
        totalQty,
        billTotal,
        discountTotal,
        totalAmount,
        changeAmount,
        amountLeft,
        charged,
        discountBillValue,
        billRoundingOff,
        paymentDiscount,
        actualAmount
      });
    }
  }

  // basket: IBasket=null;
  getBasket(id: string) {
    //Local
    const basket = JSON.parse(localStorage.getItem("basket"));
    if (basket !== null && basket !== undefined) {
      this.basketSource.next(basket);
      this.calculateBasket();
    }
    //End Local

    // return this.http.get(this.baseUrl + 'basket/GetBasketId?id=' + id).pipe(
    //   map((response: IBasket) => {

    //     if (response) {

    //       this.basketSource.next(response);
    //       this.calculateBasket();

    //     }
    //   })
    // );
  }
  updateRemark(item: IBasketItem) {
    // debugger;
    const basket = this.getCurrentBasket();
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.uom && x?.lineNum === item?.lineNum && x.isNegative === item.isNegative && x.promotionPromoCode === item.promotionPromoCode);
    if (foundItemIndex !== -1) {
      basket.items[foundItemIndex].note = item.note;
      this.authService.setOrderLog("Order", "Update Remark Item", "", item.id + ' remark' + item.note);
    }

    // // debugger;
    this.setBasket(basket);
  }
  updateItemQty(item: IBasketItem) {
    // debugger;
    const basket = this.getCurrentBasket();
    this.changeBasketResponseStatus(false);
    this.changeDiscountValue(basket, 0);
    let aX = Object.assign({}, item);
    let itemX: IBasketItem = new IBasketItem();
    itemX.id = aX.id;
    itemX.quantity = aX.quantity;
    itemX.productName = aX.productName;
    itemX.price = aX.price;
    itemX.type = "Edit";
    basket.lastedItem = itemX;

    this.authService.setOrderLog("Order", "Update Item Qty", "Success", item.id + ' ' + item.quantity);
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.barcode && x?.lineNum === item?.lineNum && x.isNegative === item.isNegative);
    if (item.quantity === 0) {
      if (item.canRemove === false) {
        basket.items[foundItemIndex].quantity = item.quantity;
        basket.items[foundItemIndex].lineTotal = item.quantity * item.price;
        if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
          basket.items[foundItemIndex].promotionLineTotal = item.quantity * item.price;
        }
        let itemfound = basket.items[foundItemIndex];
        if (itemfound.isBOM === true) {
          itemfound.lineItems.forEach((item) => {
            item.lineTotal = item.quantity * itemfound.quantity;
          })
        }
        if (itemfound.customField1 !== null && itemfound?.customField1 !== undefined && (itemfound?.customField1.toLowerCase() !== "tp" && itemfound?.customField1.toLowerCase() !== "bp" && itemfound?.customField1.toLowerCase() !== "pn")) {
          this.applyPromotion(basket);
        }
        else {
          basket.items[foundItemIndex].promotionLineTotal = item.quantity * item.price;
        }
      }
      else {
        this.removeItem(item);
        // // debugger;
        this.setBasket(basket);
      }

    }
    else {
      basket.items[foundItemIndex].quantity = item.quantity;
      basket.items[foundItemIndex].lineTotal = item.quantity * item.price;
      if (basket.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex") {
        basket.items[foundItemIndex].promotionLineTotal = item.quantity * item.price;
      }
      let itemfound = basket.items[foundItemIndex];
      if (itemfound.isBOM === true) {
        itemfound.lineItems.forEach((item) => {
          item.lineTotal = item.quantity * itemfound.quantity;
        })
      }
      // debugger;
      if (itemfound.customField1 !== null && itemfound?.customField1 !== undefined && itemfound?.customField1.toLowerCase() !== "tp" && itemfound?.customField1.toLowerCase() !== "bp" && itemfound?.customField1.toLowerCase() !== "pn") {
        this.applyPromotion(basket);
      }
      else {
        // debugger;
        basket.items[foundItemIndex].promotionLineTotal = item.quantity * item.price;
        this.setBasket(basket);
      }
      // this.applyPromotion(basket);
    }

  }
  updateItemQtyWPromotion(item: IBasketItem) {

    const basket = this.getCurrentBasket();
    this.authService.setOrderLog("Order", "Update Item Qty Without Promotion", "Success", item.id + ' ' + item.quantity);
    // this.changeDiscountValue(basket,0);
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.barcode && x?.lineNum === item?.lineNum && x.isNegative === item.isNegative);
    if (item.quantity === 0) {
      if (item.canRemove === false) {
        basket.items[foundItemIndex].quantity = item.quantity;
        basket.items[foundItemIndex].lineTotal = item.quantity * item.price;
        basket.items[foundItemIndex].promotionLineTotal = item.quantity * item.promotionPriceAfDis;
        let itemfound = basket.items[foundItemIndex];
        if (itemfound.isBOM === true) {
          itemfound.lineItems.forEach((item) => {
            // debugger;
            item.lineTotal = item.quantity * itemfound.quantity;
          })
        }

        // this.applyPromotion(basket);
      }
      else {
        this.removeItem(item);
        // // debugger;
        this.setBasket(basket);
      }

    }
    else {
      basket.items[foundItemIndex].quantity = item.quantity;
      basket.items[foundItemIndex].lineTotal = item.quantity * item.price;
      basket.items[foundItemIndex].promotionLineTotal = item.quantity * item.promotionPriceAfDis;
      let itemfound = basket.items[foundItemIndex];
      if (itemfound.isBOM === true) {
        itemfound.lineItems.forEach((item) => {
          // debugger;
          item.lineTotal = item.quantity * itemfound.quantity;
        })
      }

      // this.applyPromotion(basket);
    }
    this.calculateBasket();
  }
  removeItemWiththoutPromotion(item: IBasketItem) {
    // debugger;
    const basket = this.getCurrentBasket();

    let approvalStr = "";
    if (basket.userApproval?.length > 0) {
      approvalStr = "Approval by " + basket.userApproval;
    }
    let noteStr = '';
    if (basket.note?.length > 0) {
      noteStr = "note: " + basket.note;
    }
    let showString = '';
    if (approvalStr?.length > 0) {
      showString = approvalStr;
    }
    if (noteStr?.length > 0 && showString?.length > 0) {
      showString = showString + ", " + noteStr;
    }
    else {
      if (noteStr?.length > 0 && showString?.length <= 0) {
        showString = noteStr;
      }

    }


    if (item.canRemove !== null && item.canRemove !== undefined && item.canRemove === false) {
      this.alertify.warning("Can't remove item");
    }
    else {
      debugger;
      if (basket.items.some((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.barcode && x.isNegative === (item.isNegative ?? false))) {
        const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.barcode && x?.lineNum === item?.lineNum && x.isNegative === (item.isNegative ?? false));

        // delete basket.items[foundItemIndex];
        // console.log(basket.items); 
        if (foundItemIndex > -1) {
          basket.items.splice(foundItemIndex, 1);
          this.authService.setOrderLog("RemoveItem", "Remove Item", "", showString, item?.id, item?.uom ?? "", item?.barcode ?? "", item?.price?.toString() ?? "", item?.lineTotal?.toString() ?? "", item?.quantity?.toString());
        }
        this.setBasket(basket);

        // console.log(basket.items);
        // basket.items =  basket.items.slice(foundItemIndex , 1);

        // basket.items = basket.items.filter((i) => i.id !== item.id && i.uom !== item.uom);
        // if (basket.items.length > 0) {

        //   this.applyPromotion(basket);
        // }
        //  else{
        //   // // debugger;

        //  }
      }
      else {
        // debugger;
        this.setBasket(basket);
      }
    }


  }
  removeCapacityLineWiththoutPromotion(item: IBasketItem) {
    // // debugger;
    const basket = this.getCurrentBasket();
    this.authService.setOrderLog("Order", "Remove capacity Item Qty", "Success", item.id + '' + item?.quantity?.toString());
    if (basket.items.some((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.barcode && x.isNegative === item.isNegative)) {
      let foundItemIndex = -1;
      let stt = 0;
      basket.items.forEach(itemX => {
        if (itemX.customField1 === "Card") {
          if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && itemX.isNegative === item.isNegative && itemX.prepaidCardNo === item.prepaidCardNo) {
            foundItemIndex = stt;
          }
        }
        if (itemX.customField1 === "Member" || itemX.customField1 === "Class") {
          if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode) {
            foundItemIndex = stt;
          }
        }
        else {
          if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode) {
            foundItemIndex = stt;
          }
        }
        stt++;
      });
      if (foundItemIndex >= 0) {
        // const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x.uom === item.uom);

        let itemRemove = basket.items[foundItemIndex];
        itemRemove.quantity = 0;
        let newVl = [];
        itemRemove.lineItems.forEach(itemX => {
          // // debugger;
          if (itemX.isCapacity === true) {
            if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && itemX.storeAreaId === item.storeAreaId && itemX.timeFrameId === item.timeFrameId && itemX.appointmentDate === item.appointmentDate) {

            }
            else {
              itemRemove.quantity += itemX.quantity;
              newVl.push(itemX);
            }
          }
          if (itemX.customField1?.toString().toLocaleLowerCase() === "member" || itemX.customField1?.toString().toLocaleLowerCase() === "class") {
            // && (moment(itemX.memberDate)).format('DD-MM-YYYY') === (moment(item.memberDate)).format('DD-MM-YYYY')
            if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && itemX.memberDate === item.memberDate) {

            }
            else {
              itemRemove.quantity += itemX.quantity;
              newVl.push(itemX);
            }
          }
          if (itemX.customField1?.toString().toLocaleLowerCase() === "card") {
            if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && itemX.prepaidCardNo === item.prepaidCardNo) {

            }
            else {
              itemRemove.quantity += itemX.quantity;
              newVl.push(itemX);
            }
          }
        });
        itemRemove.lineItems = []
        itemRemove.lineItems = newVl;

        if (itemRemove.lineItems.length > 0) {
          // // debugger;
          this.setBasket(basket);
        }
        else {
          this.removeItemWiththoutPromotion(itemRemove);
        }
      }


    }

  }
  incrementItemQty(item: IBasketItem) {

    const basket = this.getCurrentBasket();
    this.changeDiscountValue(basket, 0);
    this.authService.setOrderLog("Order", "Increment Item Qty", "Success", item.id + '' + item.quantity);
    // const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.barcode && x.isNegative === item.isNegative);
    const foundItemIndex = basket.items.findIndex((x) => x.barcode === item.barcode && x?.lineNum === item?.lineNum && x.isNegative === item.isNegative);
    let isReturn = basket.returnMode;
    // let quantity =  Math.abs(basket.items[foundItemIndex].quantity);
    if (isReturn) {
      basket.items[foundItemIndex].quantity--;
      basket.items[foundItemIndex].lineTotal = -item.quantity * item.price;
      let itemfound = basket.items[foundItemIndex];
      // // debugger;
      if (itemfound.isBOM === true) {
        // // debugger;
        itemfound.lineItems.forEach((item) => {
          item.lineTotal = -item.quantity * itemfound.quantity;
        })
      }

      this.setBasket(basket);
    }
    else {
      // debugger;
      basket.items[foundItemIndex].quantity++;
      basket.items[foundItemIndex].lineTotal = item.quantity * item.price;
      let itemfound = basket.items[foundItemIndex];
      // // debugger;
      if (itemfound.isBOM === true) {
        // // debugger;
        itemfound.lineItems.forEach((item) => {
          item.lineTotal = item.quantity * itemfound.quantity;
        })
      }

      this.applyPromotion(basket);
    }


  }
  decrementItemQty(item: IBasketItem) {

    const basket = this.getCurrentBasket();
    this.changeDiscountValue(basket, 0);
    this.changeBasketResponseStatus(false);
    this.authService.setOrderLog("Order", "Decrement Item Qty", "Success", item.id + '' + item.quantity);
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x?.lineNum === item?.lineNum && x.uom === item.uom && x.barcode === item.barcode && x.isNegative === item.isNegative);
    let isReturn = basket.returnMode;
    let quantity = Math.abs(basket.items[foundItemIndex].quantity);
    if (quantity > 1) {
      if (isReturn) {
        basket.items[foundItemIndex].quantity++;
        basket.items[foundItemIndex].lineTotal = -quantity * item.price;
        let itemfound = basket.items[foundItemIndex];
        // // debugger;
        if (itemfound.isBOM === true) {
          // // debugger;
          itemfound.lineItems.forEach((item) => {
            item.lineTotal = -item.quantity * itemfound.quantity;
          })
        }
        this.setBasket(basket);
      }
      else {
        basket.items[foundItemIndex].quantity--;
        basket.items[foundItemIndex].lineTotal = item.quantity * item.price;
        let itemfound = basket.items[foundItemIndex];
        // // debugger;
        if (itemfound.isBOM === true) {
          // // debugger;
          itemfound.lineItems.forEach((item) => {
            item.lineTotal = item.quantity * itemfound.quantity;
          })
        }

        this.applyPromotion(basket);

      }

    } else {
      this.removeItem(item);
      // this.calculateBasket();
    }


  }
  removeItem(item: IBasketItem) {
    debugger;
    const basket = this.getCurrentBasket();
    this.changeDiscountValue(basket, 0);
    // this.authService.setOrderLog("Order", "remove Item Qty", "Success",   item.id + '' + item.quantity);
    let approvalStr = "";
    if (basket.userApproval?.length > 0) {
      approvalStr = "Approval by " + basket.userApproval;
    }
    let noteStr = '';
    if (basket.note?.length > 0) {
      noteStr = "note: " + basket.note;
    }
    let showString = '';
    if (approvalStr?.length > 0) {
      showString = approvalStr;
    }
    if (noteStr?.length > 0 && showString?.length > 0) {
      showString = showString + ", " + noteStr;
    }
    else {
      if (noteStr?.length > 0 && showString?.length <= 0) {
        showString = noteStr;
      }

    }
    // "Line No: " +item?.lineNum+ ", Item Code:" + item?.id + ", Item Name:" + item?.productName +', qty ' + item?.quantity
    if (item.canRemove !== null && item.canRemove !== undefined && item.canRemove === false) {
      this.alertify.warning("Can't remove item");
    }
    else {
      if (basket.items.some((x) => x?.lineNum === item?.lineNum && x.id === item.id && x.uom === item.uom && x.barcode === item.barcode
        && (x?.bookletNo ?? '') === (item?.bookletNo ?? '') && x.isNegative === item.isNegative)) {

        const foundItemIndex = basket.items.findIndex((x) => x?.lineNum === item?.lineNum && x.id === item.id && x.uom === item.uom && x.isNegative === item.isNegative
          && x.barcode === item.barcode && (x?.bookletNo ?? '') === (item?.bookletNo ?? ''));
        debugger;
        // delete basket.items[foundItemIndex];
        // console.log(basket.items);
        if (foundItemIndex > -1) {
          basket.items.splice(foundItemIndex, 1);
        }
        const foundItemIndexpromo = basket.items.findIndex((x) => x?.lineNum === item?.lineNum && x.id === item.id && x.uom === item.uom && x.isNegative === item.isNegative && (x?.bookletNo ?? '') === (item?.bookletNo ?? '') && x.barcode === item.barcode);
        if (foundItemIndexpromo > -1) {
          basket.items.splice(foundItemIndexpromo, 1);
        }
        // xxx
        // this.writeLogRemoveItem("XX", item);
        let aX = Object.assign({}, item);
        let itemX: IBasketItem = new IBasketItem();
        itemX.id = aX.id;
        itemX.quantity = aX.quantity;
        itemX.productName = aX.productName;
        itemX.price = aX.price;
        itemX.type = "Remove";
        basket.lastedItem = itemX;


        this.authService.setOrderLog("RemoveItem", "Remove Item", "", showString, item?.id, item?.uom ?? "", item?.barcode ?? "", item?.price?.toString() ?? "", item?.lineTotal?.toString() ?? "", item?.quantity?.toString());
        // console.log(basket.items);
        // basket.items =  basket.items.slice(foundItemIndex , 1);

        // basket.items = basket.items.filter((i) => i.id !== item.id && i.uom !== item.uom);
        if (basket.items.length > 0) {
          let ManualRunPromotion = "false";
          let ManualRunPromotionRS = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ManualRunPromotion');
          if (ManualRunPromotionRS !== null && ManualRunPromotionRS !== undefined) {
            ManualRunPromotion = ManualRunPromotionRS.settingValue;
          }
          if (ManualRunPromotion === "true") {
            basket.isApplyPromotion = false;
            this.setBasket(basket);
          }
          else {

            this.applyPromotion(basket);
          }
        }
        else {
          // // debugger;
          this.setBasket(basket);
        }
      }
      else {
        // debugger;
        this.setBasket(basket);
      }
    }


  }
  removeCapacityLine(item: IBasketItem) {

    const basket = this.getCurrentBasket();
    this.authService.setOrderLog("RemoveItem", "Remove Item Qty", "Success", item.id + '' + item.quantity);
    // console.log('remove item', item);
    // console.log('basket.items', basket.items);

    if (basket.items.some((x) => x.id === item.id && x.uom === item.uom && x.barcode === item.barcode && x.isNegative === (item.isNegative ?? false))) {
      let foundItemIndex = -1;
      let stt = 0;
      basket.items.forEach(itemX => {
        if (itemX.customField1 === "Card") {
          if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && itemX.isNegative === (item.isNegative ?? false) && itemX.prepaidCardNo === item.prepaidCardNo) {
            foundItemIndex = stt;
          }
        }
        if (itemX.customField1 === "Member" || itemX.customField1 === "Class") {
          if (itemX.id === item.id && itemX.uom === item.uom && itemX.isNegative === (item.isNegative ?? false) && itemX.barcode === item.barcode) {
            foundItemIndex = stt;
          }
        }
        else {
          if (itemX.id === item.id && itemX.uom === item.uom && itemX.isNegative === (item.isNegative ?? false) && itemX.barcode === item.barcode) {
            foundItemIndex = stt;
          }
        }
        stt++;
      });
      if (foundItemIndex >= 0) {
        // const foundItemIndex = basket.items.findIndex((x) => x.id === item.id && x.uom === item.uom);

        let itemRemove = basket.items[foundItemIndex];
        itemRemove.quantity = 0;
        let newVl = [];
        // debugger;
        itemRemove.lineItems.forEach(itemX => {
          // debugger;
          debugger;
          if (itemX.isCapacity === true) {
            if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && (itemX.isNegative ?? false) === (item.isNegative ?? false) && itemX.storeAreaId === item.storeAreaId && itemX.timeFrameId === item.timeFrameId && itemX.appointmentDate === item.appointmentDate) {

            }
            else {
              itemRemove.quantity += itemX.quantity;
              newVl.push(itemX);
            }
          }
          if (itemX.customField1?.toString().toLocaleLowerCase() === "member" || itemX.customField1?.toString().toLocaleLowerCase() === "class") {
            // debugger;
            // && (moment(itemX.memberDate)).format('DD-MM-YYYY') === (moment(item.memberDate)).format('DD-MM-YYYY')
            if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && (itemX.isNegative ?? false) === (item.isNegative ?? false) && itemX.memberDate === item.memberDate && itemX.serialNum === item.serialNum) {

            }
            else {
              itemRemove.quantity += itemX.quantity;
              newVl.push(itemX);
            }
          }
          if (itemX.customField1?.toString().toLocaleLowerCase() === "card") {
            if (itemX.id === item.id && itemX.uom === item.uom && itemX.barcode === item.barcode && (itemX.isNegative ?? false) === (item.isNegative ?? false) && itemX.prepaidCardNo === item.prepaidCardNo) {

            }
            else {
              itemRemove.quantity += itemX.quantity;
              newVl.push(itemX);
            }
          }
        });
        debugger;
        itemRemove.lineItems = []
        itemRemove.lineItems = newVl;

        if (itemRemove.lineItems.length > 0) {
          // // debugger;
          this.setBasket(basket);
        }
        else {
          this.removeItem(itemRemove);
        }
      }


    }
    // this.setBasket(basket);
    this.applyPromotion(basket);
  }

  deleteBasket(basket: IBasket, transId?) {
    let subject = new Subject();
    if (basket !== null && basket !== undefined && basket.id !== null && basket.id !== undefined) {
      debugger;
      this.authService.setOrderLog("Order", "Delete Basket", "Success", basket?.id);
      if (transId !== null && transId !== undefined && transId !== '' && transId?.length > 0) {
        this.writeLogRemove(transId);
      }
      //  setTimeout(() => {
      //   localStorage.setItem('basket', null);
      //   localStorage.removeItem('basket');
      //   localStorage.removeItem('basket_id');
      //   this.basketSource.next(null);
      //  }, 10); 
    }
    else {

      // Swal.fire({
      //   icon: 'error',
      //   title: 'Remove Basket',
      //   text: "Failed to connect System, Please try again or contact to support team."
      // });
    }
    localStorage.setItem('basket', null);
    localStorage.removeItem('basket');
    localStorage.removeItem('basket_id');
    this.basketSource.next(null);
    //  subject.next(null);
    //Local

    //End Local
    // if(basket!==null && basket!== undefined && basket.id !== null && basket.id!== undefined)
    // {
    //   this.http
    //     .delete(this.baseUrl + 'basket/DeleteBasket?id=' + basket.id)
    //     .subscribe( (response: IBasket) => {
    //         this.basketSource.next(null);
    //         localStorage.removeItem('basket_id');
    //         subject.next();
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     );
    // }

    return subject;
    //this.basketSource.asObservable();
  }
  deleteBasketLocal() {
    let subject = new Subject();
    localStorage.setItem('basket', null);
    localStorage.removeItem('basket');
    localStorage.removeItem('basket_id');
    this.authService.setOrderLog("Order", "Delete Basket", "Success", "");
    this.basketSource.next(null);
    subject.next();
    return subject;
  }
  setBasketInLocal(basket: IBasket) {
    if (basket !== null && basket !== undefined) {
      let subject = new Subject();
      this.basketSource.next(basket);
      this.calculateBasket();
      localStorage.setItem('basket', JSON.stringify(basket));
      this.authService.setOrderLog("Order", "Delete Basket", "Success", basket.id);
      return subject;
    }
  }
  getBasketLocal() {
    // // debugger;

    const basket = JSON.parse(localStorage.getItem("basket"));
    if (basket !== null && basket !== undefined) {
      this.basketSource.next(basket);

    }
    return basket;
  }
  setBasketNotRunPromotion(basket) {

    let subject = new Subject();
    if (basket === null || basket === undefined) {
      basket = this.getCurrentBasket();
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketSource.next(basket);
    this.calculateBasket();
    return subject;

  }
  setBasket(basket: IBasket) {

    //Local
    // debugger;

    let subject = new Subject();
    let ManualRunPromotion = "false";
    let ManualRunPromotionRS = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ManualRunPromotion');
    if (ManualRunPromotionRS !== null && ManualRunPromotionRS !== undefined) {
      ManualRunPromotion = ManualRunPromotionRS.settingValue;
    }
    let decimalPlacesFormat = 6;
    let percentPlacesFormat = 6;
    if (ManualRunPromotion?.toLowerCase() === "true") {
      let format = this.authService.loadFormat();

      if (format !== null && format !== undefined) {
        let checkFm = format.decimalPlacesFormat;
        if (checkFm !== null && checkFm !== undefined && checkFm !== '') {
          decimalPlacesFormat = parseInt(checkFm);
        }
        let checkPercentFm = format.perDecimalPlacesFormat;
        if (checkPercentFm !== null && checkPercentFm !== undefined && checkPercentFm !== '') {
          percentPlacesFormat = parseInt(checkPercentFm);
        }
      }

    }
    let lineNumber = 1;
    basket.items.forEach(line => {
      line.lineNum = lineNumber;
      line.lineTotal = line.lineTotal;
      line.promotionLineTotal = line.promotionLineTotal;

      if (ManualRunPromotion?.toLowerCase() === "true" && basket.isApplyPromotion === false) {

        line.lineTotal = line.price * line.quantity;
        line.promotionDisAmt = 0;
        line.promotionDisPrcnt = 0;
        line.promotionDiscountPercent = 0;
        line.promotionLineTotal = line.price * line.quantity;
        line.promotionPriceAfDis = line.price;
        line.discountType = "Discount Percent";
        line.discountValue = 0;
        if (line?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
          let price = this.authService.roundingAmount(parseFloat(line.price.toString()));
          line.price = price;
          line.lineTotal = this.authService.roundingValue((line.quantity * line.price), 'RoundUp', decimalPlacesFormat);
          line.promotionLineTotal = this.authService.roundingAmount(line.quantity * line.price);
          line.promotionPriceAfDis = price;
        }
      }
      if (line.discountType === null || line.discountType === undefined || line.discountType === "") {
        line.discountType = "Discount Percent";
        line.discountValue = 0;
      }
      lineNumber++;
    });
    // debugger;
    basket.items = basket.items.sort(x => x.isNegative ? -1 : 1)
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketSource.next(basket);
    // console.log('isApplyPromotion', basket.isApplyPromotion);
    setTimeout(() => {
      this.calculateBasket();
    }, 50)



    return subject;
    //End Local

    // if(basket!==null && basket!==undefined)
    // {
    //   let subject = new Subject();

    //   const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
    //   this.http.post(this.baseUrl + 'basket/UpdateBasket', basket, { headers: reqHeader } )
    //     .subscribe(
    //       (response: IBasket) => {
    //         // // debugger;
    //         this.basketSource.next(response);
    //         console.log("After Update Basket");
    //         console.log(response);
    //         this.calculateBasket();
    //         subject.next();
    //         // this.refreshPayment(basket.payments); 2020/12/08
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     );
    //   return subject;
    // }

  }
  applyPromotionAction(basket, document: PromotionDocument, isPayment) {

    var items = [];
    if (basket.items !== null && basket.items !== undefined && basket.items?.length > 0) {
      basket.items.forEach(val => items.push(Object.assign({}, val)));
    }


    this.authService.setOrderLog("Order", "Apply Promotion", "Success", "");
    // console.log('promo',basket)
    // var itemsX = Object.assign({}, items);
    // sai chổ này 220117
    items.forEach((item, i) => {
      // && item.promotionIsPromo === '1' && item.isVoucher!==true
      if (item.promotionType === "Fixed Quantity") {
        // debugger
        item.lineItems.forEach(element => {
          // debugger
          let promo = items.filter(x => x.id === item.id && x.uom === item.uom && x.barCode === (item?.barCode === null || item?.barCode === undefined ? item.barcode : item.barCode) && x.promotionType !== 'Fixed Quantity');
          if (promo !== null && promo !== undefined && promo?.length > 0) {
            var Replace = promo[0].lineItems.filter(x => x.id == element.id && x.uom === element.uom && x.barcode === element.barcode
              && x.storeAreaId === element.storeAreaId && x.timeFrameId === element.timeFrameId && x.appointmentDate === element.appointmentDate)
            if (Replace.length > 0) {
              Replace[0].quantity += element.quantity;
            }
            else {
              promo[0].lineItems.push(element);
            }
          }


        });
        items.splice(i, 1);
      }

    });
    var newArray = [];
    // debugger;
    items.forEach(val => newArray.push(Object.assign({}, val)));
    let NotRunPromo = newArray.filter(x => x.quantity <= 0 || x.isNegative === true);
    let FormatDigit = 2;
    let formatConfig = this.authService.loadFormat();

    if (formatConfig?.decimalPlacesFormat !== null && formatConfig?.decimalPlacesFormat !== undefined && formatConfig?.decimalPlacesFormat !== '') {
      FormatDigit = parseInt(formatConfig?.decimalPlacesFormat);
    }
    document.roundingDigit = FormatDigit;
    document.documentLines = document.documentLines.filter(x => x.quantity > 0 && x.isNegative !== true);

    // debugger;

    console.log('documentLines', document.documentLines);
    if (isPayment) {
      this.promotionService.applyPaymentPromotion(document).subscribe(

        (response: any) => {

          if (response.success) {

            if (response?.data?.salesPayments !== null && response?.data?.salesPayments !== undefined && response?.data?.salesPayments?.length > 0) {
              let source = basket.payments;
              let paymentPromotions = response?.data?.salesPayments;

              if (source !== null && source !== undefined && paymentPromotions !== null && paymentPromotions !== undefined) {

                console.log('paymentPromotions', paymentPromotions)
                if (paymentPromotions.length > 0) {
                  paymentPromotions.forEach(item => {

                    // let sourceFind = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode && (x?.bookletNo ??'') === (item?.bookletNo ?? '' ) && (x.isNegative ?? false) ===  (item.isNegative ?? false)  && x.promotionIsPromo === item.uIsPromo);

                    // && (x?.currency??"") === (item?.currency??"") 
                    if (source.some(x => x.id === item.paymentCode && x.lineNum.toString() === item.lineId)) {

                      //x.lineNum === item.lineNum && && (x?.currency??"") === (item?.currency??"") 
                      let paymentFind = source.find(x => x.id === item.paymentCode && x.lineNum.toString() === item.lineId);
                      // debugger;
                      paymentFind.paymentDiscount = item.paymentDiscount;
                      paymentFind.promoId = item.promoId;
                      paymentFind.undefinedAmount = 0;
                      // let un = (paymentFind.paymentTotal??0) - (paymentFind.paymentCharged??0); 
                      let un = 0;
                      if ((paymentFind.paymentTotal ?? 0) >= (paymentFind.paymentCharged ?? 0)) {
                        un = (paymentFind.paymentCharged ?? 0) - (paymentFind.paymentDiscount ?? 0);
                      }
                      else {
                        un = (paymentFind.paymentTotal ?? 0) - (paymentFind.paymentDiscount ?? 0);
                      }
                      debugger;
                      paymentFind.undefinedAmount = un;
                    }
                  });
                  // source.forEach(paymentInbasket => {
                  //   paymentInbasket.canEdit = false;
                  // });
                  let promotionApply = response.data.promotionApply;
                  debugger;
                  if (basket?.promotionApply !== null && basket?.promotionApply !== undefined && basket.promotionApply?.length > 0) {
                    if (promotionApply !== null && promotionApply !== undefined && promotionApply?.length > 0) {
                      debugger;
                      promotionApply.forEach(promotion => {
                        debugger;
                        let finX = basket.promotionApply.filter(x => x.promoId === promotion.promoId)
                        if (finX === null || finX === undefined || finX?.length <= 0) {
                          basket.promotionApply.push(promotion);
                        }

                      });
                    }
                  }
                  else {
                    basket.promotionApply = [];
                    if (promotionApply !== null && promotionApply !== undefined && promotionApply?.length > 0) {
                      debugger;
                      promotionApply.forEach(promotion => {
                        debugger;
                        let finX = basket.promotionApply.filter(x => x.promoId === promotion.promoId)
                        if (finX === null || finX === undefined || finX?.length <= 0) {
                          basket.promotionApply.push(promotion);
                        }

                      });
                    }

                  }
                  this.setBasket(basket);
                }


              }

            }



          }
          else {
            basket.isApplyPromotion = true;
            // console.log('isApplyPromotion 5' );
            this.setBasket(basket);
            this.alertify.error("Apply promotion failed. " + response.message);
            this.changeBasketResponseStatus(true);
            console.log("Apply promotion failed");
          }

        },
        (error) => {
          // // debugger;
          basket.isApplyPromotion = true;
          // console.log('isApplyPromotion 6' );
          this.setBasket(basket);

          this.alertify.error("Apply promotion failed. Please refresh page or contact to support team");
          this.changeBasketResponseStatus(true);
          console.log("Apply promotion error");
          console.log(error);
        }
      );
    }
    else {
      this.promotionService.applyPromotion(document).subscribe(

        (response: any) => {
          // debugger;
          if (response.success) {
            // console.log('Prmotion data');
            // console.log(response.data);


            if (this.getCurrentBasket().discountType !== null && this.getCurrentBasket().discountType !== undefined && this.getCurrentBasket().discountType !== "") {
              this.getCurrentBasket().discountType = this.getCurrentBasket().discountType;
              this.getCurrentBasket().discountTypeTemp = this.getCurrentBasket().discountTypeTemp;
            }
            else {
              this.getCurrentBasket().discountType = "Discount Percent";
              this.getCurrentBasket().discountTypeTemp = "Discount Percent";
            }
            // let promotionHeader =  response.data.promotionApply.filter(x=>x.promoType === 4);

            let promotionArr = response.data?.promotionId ?? "";//   promotionHeader.map(t=>t.promoId).join(", "); 
            basket.promotionId = promotionArr;
            basket.isManualDiscount = false;
            this.getCurrentBasket().promotionId = promotionArr;// response.data?.promotionId;
            if (response.data?.discountPercent !== null && response.data?.discountPercent !== undefined) {
              this.getCurrentBasket().discountType = "Discount Percent";
              this.getCurrentBasket().discountTypeTemp = "Discount Percent";

              this.getCurrentBasket().discountValue = response.data.discountPercent;
              this.getCurrentBasket().discountValueTemp = response.data.discountPercent;
            }
            // Check Discount Percent = null thì set 0 
            // else
            // {
            //   this.getCurrentBasket().discountType = "Discount Percent";
            //   this.getCurrentBasket().discountTypeTemp = "Discount Percent";

            //   this.getCurrentBasket().discountValue = 0;
            //   this.getCurrentBasket().discountValueTemp = 0;
            // }
            // debugger;
            // basket.promotionApply = [];
            basket.promotionApply = response.data.promotionApply;

            if (basket.promotionApply !== null && basket.promotionApply !== undefined && basket.promotionApply?.length > 0) {
              let promotionLst = "";
              basket.promotionApply.forEach(element => {
                promotionLst += element.promoId + ",";
              });
              this.authService.setOrderLog("Order", "Promotion Apply", "Success", promotionLst);
            }
            debugger;
            basket.items = this.mapItemtoPromotionItem(basket.items, response.data.documentLines, false);
            debugger;

            // var itemsX = [...basket.items]
            //     basket.items.forEach(itemx => {     
            //       let PromoX = itemsX.filter(x => x.promotionType !== "Fixed Quantity"  && x.id === itemx.id &&  x.uom === itemx.uom && x.barCode === itemx.barCode);
            //       if(itemx.promotionType === "Fixed Quantity")
            //       {
            //           let n = 0;
            //           let itemnew = [];
            //           PromoX.forEach(item => {
            //             // debugger;
            //             item.lineItems.forEach((e,i) => {
            //             n = n +e.quantity;

            //             if(n >itemx.quantity)
            //             {
            //               if(n <itemx.quantity+e.quantity)
            //               {
            //                 // e.quantity = itemx.quantity+e.quantity-n;

            //                 // itemnew.push(e);
            //                 itemnew.push(Object.assign({}, e)); 
            //                 itemnew[i].quantity = itemx.quantity+e.quantity-n;
            //               }
            //             }
            //             else{
            //               // e.quantity = item.quantity+e.quantity-n;

            //               itemnew.push(e);
            //             }

            //           });

            //         })
            //           itemx.lineItems = [];
            //           itemx.lineItems =itemnew;
            //           //  debugger
            //             let notpromoX =basket.items.filter(x => x.promotionType !== "Fixed Quantity"
            //             && x.id === itemx.id &&  x.uom === itemx.uom && x.barCode === itemx.barCode);
            //             if(notpromoX !==null && notpromoX !==undefined && notpromoX !==[])
            //             {

            //               let m = 0;
            //               let k =[];
            //               // notpromoX[0].lineItems.sort((a, b) => parseFloat(a.quantity) - parseFloat(b.quantity));
            //               notpromoX[0].lineItems.forEach((element,i) => {
            //                 debugger
            //                 m = m +  element.quantity;
            //                 if(m >itemx.quantity)
            //                 {
            //                   if(m <itemx.quantity +element.quantity)
            //                   {
            //                   element.quantity = m-itemx.quantity;
            //                   }
            //                 }
            //                 else{
            //                   // notpromoX[0].lineItems.splice(i-k,1);
            //                   // k++;
            //                   k.push(i);
            //                 }
            //                 element.lineTotal = element.quantity*element.Price;
            //               });
            //               for(let i =k.length;i>0;i--)
            //               {
            //                 debugger;
            //                 notpromoX[0].lineItems.splice(k[i-1],1);
            //               }
            //             }
            //       }

            //     });
            var itemsX = [...basket.items]
            basket.items.forEach(itemx => {
              debugger;
              let PromoX = itemsX.filter(x => x.id === itemx.id && x.uom === itemx.uom && x.barcode === (itemx?.barCode === null || itemx?.barCode === undefined ? itemx.barcode : itemx.barCode));

              if (PromoX.length > 1) {

                PromoX.forEach(item => {
                  debugger;
                  let n = 0;
                  let itemnew = [];
                  // chia item BOM làm logic riêng
                  // khi có bom thì nhân lại số lượng bom quantity
                  if (item?.isBOM) {
                    let quantityBOMHeader = item.quantity;
                    item.lineItems.forEach((e, i) => {
                      debugger;
                      itemnew.push(Object.assign({}, e));
                      itemnew[i].lineTotal = quantityBOMHeader * e.quantity;

                    });
                    item.lineItems = [];
                    console.log('itemnew', itemnew);
                    item.lineItems = itemnew;
                  }
                  else {
                    item.lineItems.forEach((e, i) => {
                      debugger;
                      n = n + e.quantity;
                      console.log('item e', e);
                      if (n > item.quantity) {
                        console.log('1', e);
                        if (n < item.quantity + e.quantity) {
                          console.log('1.1', e);
                          // e.quantity = itemx.quantity+e.quantity-n;

                          // itemnew.push(e);
                          itemnew.push(Object.assign({}, e));
                          itemnew[i].quantity = item.quantity + e.quantity - n;
                        }
                      }
                      else {
                        // e.quantity = item.quantity+e.quantity-n;
                        // console.log('2', e);
                        itemnew.push(e);
                      }

                    });
                    item.lineItems = [];
                    // console.log('itemnew', itemnew);
                    item.lineItems = itemnew;
                  }

                })



                // //  debugger
                //   let notpromoX =basket.items.filter(x => x.promotionPromoCode !== null && x.promotionCode !== undefined
                //   && x.id === itemx.id &&  x.uom === itemx.uom && x.barCode === itemx.barCode);
                //   if(notpromoX !==null && notpromoX !==undefined && notpromoX !==[])
                //   {

                //     let m = 0;
                //     let k =[];
                //     // notpromoX[0].lineItems.sort((a, b) => parseFloat(a.quantity) - parseFloat(b.quantity));
                //     notpromoX[0].lineItems.forEach((element,i) => {
                //       debugger
                //       m = m +  element.quantity;
                //       if(m >itemx.quantity)
                //       {
                //         if(m <itemx.quantity +element.quantity)
                //         {
                //         element.quantity = m-itemx.quantity;
                //         }
                //       }
                //       else{
                //         // notpromoX[0].lineItems.splice(i-k,1);
                //         // k++;
                //         k.push(i);
                //       }
                //       element.lineTotal = element.quantity*element.Price;
                //     });
                //     for(let i =k.length;i>0;i--)
                //     {
                //       debugger;
                //       notpromoX[0].lineItems.splice(k[i-1],1);
                //     }
                //   }
              }

            });
            debugger;
            NotRunPromo.forEach(itemBasket => {
              basket.items.push(itemBasket);
            });

            // console.log('basket.items.', basket.items);
            // }
            basket.isApplyPromotion = true;
            // console.log('isApplyPromotion 4' );
            // basket.items.forEach(item => {
            //   item.discountAmt = item.lineTotal - 

            // });
            // basket.promoItemApply = this.mapItemtoPromotionItem(basket.items,response.data.documentLines, true);
            // // debugger;
            this.setBasket(basket);
            // console.log(basket.items);
            // console.log(basket.promoItemApply);
            // this.calculateBasket();
            // if(promotion.valueType ;
          }
          else {
            basket.isApplyPromotion = true;
            // console.log('isApplyPromotion 5' );
            this.setBasket(basket);
            this.alertify.error("Apply promotion failed. " + response.message);
            this.changeBasketResponseStatus(true);
            console.log("Apply promotion failed");
          }

        },
        (error) => {
          // // debugger;
          basket.isApplyPromotion = true;
          // console.log('isApplyPromotion 6' );
          this.setBasket(basket);

          this.alertify.error("Apply promotion failed. Please refresh page or contact to support team");
          this.changeBasketResponseStatus(true);
          console.log("Apply promotion error");
          console.log(error);
        }
      );
    }

  }
  addPromotionItemToSimulation(promoItem: IBasketItem) {
    let basket = this.getCurrentBasket();
    basket.promotionItems.push(promoItem);
    this.setBasket(basket);
  }
  applyPromotionActionSimulation(basket, document, voucher, itemCancelPromotion, discountPromotion, discountSchema) {
    // // debugger;
    console.log(document);
    // let subject = new Subject();
    // this.resetDiscountPromotion(true, false);
    this.authService.setOrderLog("Order", "Apply Promotion Simulation", "Success", "");
    let FormatDigit = 2;
    let formatConfig = this.authService.loadFormat();

    if (formatConfig?.decimalPlacesFormat !== null && formatConfig?.decimalPlacesFormat !== undefined && formatConfig?.decimalPlacesFormat !== '') {
      FormatDigit = parseInt(formatConfig?.decimalPlacesFormat);
    }

    document.roundingDigit = FormatDigit;
    if (voucher !== null && voucher !== undefined) {
      this.promotionService.applyPromotionManual(document, document.promotionCode).subscribe(
        (response: any) => {
          debugger;
          if (response.data.voucherIsApply === true) {
            if (voucher !== null && voucher !== undefined) {
              if (basket.voucherApplyTemp == null || basket.voucherApplyTemp == undefined) {
                basket.voucherApplyTemp = [];
              }
              basket.voucherApplyTemp.push(voucher);
            }


            // console.log(response.data);
            // this.getCurrentBasket().discountType = "Discount Percent";
            if (response.data.discountPercent !== null && response.data.discountPercent !== undefined) {
              // this.getCurrentBasket().discountValue = response.data.discountPercent;
              basket.discountTypeTemp = "Discount Percent";
              basket.discountValueTemp = response.data.discountPercent;
            }

            // basket.promotionItems

            let nextItem = this.mapItemtoPromotionItem(basket.promotionItems, response.data.documentLines, false);
            // debugger;
            // console.log(nextItem);
            basket.promotionItems = itemCancelPromotion;
            nextItem.forEach(element => {
              basket.promotionItems.push(element);
            });
            // basket.promotionItems.join(nextItem);
            // if(document.promotionApply.some(x=>x.))
            setTimeout(() => {
              basket.promotionApplyTemp = response.data.promotionApply;
              basket.isSimulate = false;
              this.setBasket(basket);
              console.log('basket X', basket);
              setTimeout(() => {
                this.discountCalculateBasket(basket.discountTypeTemp, basket.discountValueTemp);
              }, 100);
            }, 50);


            // this.setBasket(basket).subscribe((response: any)=>{
            //   console.log("Update Promo");
            //   // console.log(basket.promotionItems);
            //   this.resetDiscountPromotion(false, true);
            // });
          }
          else {
            this.setSimulateToFalse();
            this.alertify.warning("Can't apply voucher. Please check your voucher details.");
            this.changeBasketResponseStatus(true);
            console.log("Can't apply voucher");
          }

        },
        (error) => {

          this.setSimulateToFalse();
          console.log(error);
        }
      );
    }
    if (discountPromotion !== null && discountPromotion !== undefined) {

      // // debugger;
      this.promotionService.applyPromotionManual(document, discountPromotion.promoId).subscribe(
        (response: any) => {
          // // debugger;
          if (discountPromotion !== null && discountPromotion !== undefined) {
            basket.discountPromotion = discountPromotion;
          }
          basket.promotionId = response.data.promotionId;
          // console.log(response.data);
          // // debugger;
          this.getCurrentBasket().discountTypeTemp = "Discount Percent";

          if (response.data.discountPercent !== null && response.data.discountPercent !== undefined) {
            this.getCurrentBasket().discountValueTemp = response.data.discountPercent;
            basket.discountTypeTemp = "Discount Percent";
            basket.discountValueTemp = response.data.discountPercent;
          }
          // basket.promotionItems
          debugger;

          let nextItem = this.mapItemtoPromotionItem(basket.promotionItems, response.data.documentLines, false);
          // console.log(nextItem);
          basket.promotionItems = [];
          nextItem.forEach(element => {
            basket.promotionItems.push(element);
          });
          // basket.promotionItems.join(nextItem);
          // if(document.promotionApply.some(x=>x.))
          basket.promotionApplyTemp = response.data.promotionApply;
          basket.isSimulate = false;
          setTimeout(() => {
            this.setBasket(basket);
            console.log('basket X', basket);
            setTimeout(() => {
              this.discountCalculateBasket(basket.discountTypeTemp, basket.discountValueTemp);

            }, 100);
          }, 50);


          // this.calculateBasket();
          // this.setBasket(basket).subscribe((response: any)=>{
          //   console.log("Update Promo");
          //   // console.log(basket.promotionItems);
          //   this.resetDiscountPromotion(false, true);
          // });

        },
        (error) => {
          // basket.isSimulate = false;
          this.setSimulateToFalse();
          console.log(error);
        }
      );
    }

    if (discountSchema !== null && discountSchema !== undefined) {
      this.promotionService.applySchema(document, discountSchema.schemaId).subscribe(
        (response: any) => {
          // // debugger;
          if (discountPromotion !== null && discountPromotion !== undefined) {
            basket.discountPromotion = discountPromotion;
          }
          basket.promotionId = response.data.promotionId;
          // console.log(response.data);
          this.getCurrentBasket().discountType = "Discount Percent";
          if (response.data.discountPercent !== null && response.data.discountPercent !== undefined) {
            this.getCurrentBasket().discountValue = response.data.discountPercent;
          }
          // basket.promotionItems
          // // debugger;
          let nextItem = this.mapItemtoPromotionItem(basket.promotionItems, response.data.documentLines, false);
          // console.log(nextItem);
          basket.promotionItems = [];
          nextItem.forEach(element => {
            basket.promotionItems.push(element);
          });
          // basket.promotionItems.join(nextItem);
          // if(document.promotionApply.some(x=>x.))
          basket.promotionApplyTemp = response.data.promotionApply;
          basket.isSimulate = false;
          this.setBasket(basket);
          this.discountCalculateBasket(basket.discountTypeTemp, basket.discountValueTemp);


        },
        (error) => {

          this.setSimulateToFalse();
          console.log(error);
        }
      );
    }

    // return subject;
  }

  applyPromotionSimulation(basket: IBasket, VoucherPromotion?, discountPromotion?, discountSchema?) {
    let subject = new Subject();
    let source = this.authService.getCRMSource();
    let storeSelected = this.authService.storeSelected();
    debugger;
    // basket.voucherApply=[];
    if (basket.promotionItems.length > 0 && basket.salesType !== "Exchange") {
      let document = new PromotionDocument();
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
      document.customerRank = basket.customer?.customerRank;
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

        // // 
        if ((discountPromotion !== null && discountPromotion !== undefined) || (discountSchema !== null && discountSchema !== undefined)) {
          if (item?.promotionIsPromo !== "1") //if(item.promotionIsPromo!=="1" )
          {
            item.discountType = '';
            item.discountValue = 0;
            // // debugger;
            let itemLine = lines.find(x => x.itemCode === item.id && x.uoMCode === item.uom && x.barCode === item.barcode);
            if (itemLine !== null && itemLine !== undefined) {
              itemLine.quantity += item.quantity;
              itemLine.lineTotal += this.authService.roundingAmount(item.lineTotal);
            }
            else {
              let docLine = new PromotionDocumentLine();
              docLine.lineNum = item.lineNum;
              docLine.itemCode = item.id;
              docLine.isNegative = item.isNegative;
              docLine.quantity = item.quantity;
              docLine.currency = storeSelected.currencyCode;
              if (docLine.lineTotal === 0 && item.isVoucher) {
                docLine.uIsPromo = '1';

              }
              // docLine.vatGroup= '';
              docLine.unitPrice = item.price;
              docLine.uoMCode = item.uom;
              docLine.barCode = item.barcode;

              if (VoucherPromotion !== null && VoucherPromotion !== undefined && VoucherPromotion.discount_code !== null && VoucherPromotion.discount_code !== undefined) {
                docLine.discountPercent = item.promotionDisPrcnt ?? 0;
                docLine.uDisPrcnt = item.promotionDisPrcnt ?? 0;
                docLine.uDisAmt = item.promotionDisAmt ?? 0;
              }
              // // debugger;
              docLine.lineTotal = this.authService.roundingAmount(item.lineTotal);
              let group = '';
              if (item.mcid !== (null || undefined || "")) {
                group = item.mcid;

              }
              if (item.itemGroupId !== (null || undefined || '') && group === "") {
                group = item.itemGroupId;
              }
              docLine.itemGroup = group;
              docLine.uCollection = item.itemCategory_1;
              docLine.bookletNo = item.bookletNo;
              lines.push(docLine);
            }

          }
        }
        else {
          // && item.promotionPromoCode === null
          if (item?.promotionIsPromo !== "1") //if(item.promotionIsPromo!=="1" )
          {
            debugger;
            item.discountType = '';
            item.discountValue = 0;
            let itemLine = lines.find(x => x.itemCode === item.id && x.uoMCode === item.uom && x.barCode === item.barcode);
            // // debugger;
            if (itemLine !== null && itemLine !== undefined) {
              itemLine.quantity += item.quantity;
              itemLine.lineTotal += this.authService.roundingAmount(item.lineTotal);
            }
            else {
              let docLine = new PromotionDocumentLine();
              docLine.lineNum = item.lineNum;
              docLine.itemCode = item.id;
              docLine.isNegative = item.isNegative;
              // docLine.itemGroup = item.
              docLine.quantity = item.quantity;
              docLine.currency = storeSelected.currencyCode;
              docLine.unitPrice = item.price;
              if (VoucherPromotion !== null && VoucherPromotion !== undefined && VoucherPromotion.discount_code !== null && VoucherPromotion.discount_code !== undefined) {
                docLine.discountPercent = item.promotionDisPrcnt ?? 0;
                docLine.uDisPrcnt = item.promotionDisPrcnt ?? 0;
                docLine.uDisAmt = item.promotionDisAmt ?? 0;
              }


              docLine.uoMCode = item.uom;
              docLine.barCode = item.barcode;
              docLine.lineTotal = item.lineTotal;
              if (docLine.lineTotal === 0 && item.isVoucher) {
                docLine.uIsPromo = '1';

              }
              let group = '';
              if (item.mcid !== (null || undefined || "")) {
                group = item.mcid;

              }
              if (item.itemGroupId !== (null || undefined || '') && group === "") {
                group = item.itemGroupId;
              }

              docLine.itemGroup = group;
              docLine.uCollection = item.itemCategory_1;
              docLine.bookletNo = item.bookletNo;
              lines.push(docLine);
            }
          }
          else {
            itemCancelPromotion.push(item);

          }

        }


      });
      basket.isSimulate = true;
      document.documentLines = lines;
      console.log(document.documentLines);
      if (VoucherPromotion !== null && VoucherPromotion !== undefined && VoucherPromotion.discount_code !== null && VoucherPromotion.discount_code !== undefined) {
        document.promotionCode = VoucherPromotion.discount_code;
        debugger;
        this.promotionService.checkVoucherPromotion(document).subscribe((response: any) => {
          debugger;
          if (response.success) {

            this.applyPromotionActionSimulation(basket, document, VoucherPromotion, itemCancelPromotion, null, null);
          }
          else {


            Swal.fire({
              icon: 'warning',
              title: 'Voucher Promotion',
              text: response.message
            }).then(() => {
              this.setSimulateToFalse();
            });
            // this.alertify.warning(response.message);
          }
        }, error => {

          this.setSimulateToFalse();
        });
      }

      if (discountPromotion !== null && discountPromotion !== undefined) {
        // document.promotionCode= discountPromotion.promoId;
        this.applyPromotionActionSimulation(basket, document, null, null, discountPromotion, null);

      }
      if (discountSchema !== null && discountSchema !== undefined) {
        // document.promotionCode= discountPromotion.promoId;
        this.applyPromotionActionSimulation(basket, document, null, null, null, discountSchema);

      }
      // else
      // {
      //   this.applyPromotionActionSimulation(basket, document);

      // }

    }
    else {
      basket.promoItemApply = [];
      // // debugger;
      this.setBasket(basket);
    }
    basket.promotionId = null;
    basket.promotionApply = [];
    this.basketSource.next(basket);
    subject.next();
    return subject;

  }
  setSimulateToFalse() {
    let basket = this.getCurrentBasket();
    basket.isSimulate = false;
    this.setBasket(basket);
  }
  repaintItemBasket(basket) {
    basket.items.forEach(item => {
      item.lineTotal = item.quantity * item.price;
      if (item?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
        item.price = this.authService.roundingAmount(item.price);
        item.lineTotal = this.authService.roundingAmount(item.quantity * item.price);
      }
    });
    return basket.items;
  }


  applyPromotion(basket: IBasket, VoucherPromotionCode?, isRunManual?, isPayment?) {
    // console.log("basket", basket); 
    if (this.commonService.getOffline()) {
      Swal.fire({
        icon: 'warning',
        title: 'System',
        text: "You are offline!. Promotion not apply/"
      });
    }
    else {
      debugger;
      let ManualRunPromotion = "false";
      let ManualRunPromotionRS = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ManualRunPromotion');
      if (ManualRunPromotionRS !== null && ManualRunPromotionRS !== undefined) {
        ManualRunPromotion = ManualRunPromotionRS.settingValue;
      }

      let OverrideManualDiscount = "false";
      let OverrideManualDiscountRS = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OverrideManualDiscount');
      if (OverrideManualDiscountRS !== null && OverrideManualDiscountRS !== undefined) {
        OverrideManualDiscount = OverrideManualDiscountRS.settingValue;
      }

      // OverrideManualDiscount
      if (ManualRunPromotion === "false" || isRunManual) {
        let check = basket.items.some(x => x.customField1?.toLowerCase() === 'pn' || x.customField1?.toLowerCase() === 'tp' || x.customField1?.toLowerCase() === 'bp');
        if (check || basket.salesType?.toLowerCase() === 'return') {
          basket.promoItemApply = [];
          this.setBasket(basket);
          basket.isApplyPromotion = true;
          // console.log('isApplyPromotion 7' );
        }
        else {
          let source = this.authService.getCRMSource();
          let storeSelected = this.authService.storeSelected();
          // // debugger;  && basket.salesType !== "Exchange"
          // console.log('basket.items', basket.items);
          if (basket.items.length > 0) {
            let document = new PromotionDocument();
            let now = new Date();
            document.docDate = now;
            // // debugger;
            if (basket.customer.mobile !== null && basket.customer.mobile !== undefined && source === 'Capi') {
              document.cardCode = basket.customer.mobile;
            }
            else {
              document.cardCode = basket.customer.customerId;
            }
            document.storeId = storeSelected.storeId;
            document.cardGroup = basket.customer.customerGrpId;
            document.customerRank = basket.customer?.customerRank;
            // currencyCode: string="";
            // storeType: string="";
            // listType: string="";
            // formatConfigId: string="";
            // whsCode: string="";
            document.docCurrency = storeSelected.currencyCode;
            document.uCompanyCode = storeSelected.companyCode;
            document.u_CompanyCode = storeSelected.companyCode;
            let lines: PromotionDocumentLine[] = [];
            // debugger;
            basket.items.forEach(item => {
              // debugger;

              if (item.isNegative !== true) {
                item.discountType = '';
                item.discountValue = 0;
              }

              if ((item.promotionIsPromo !== "1" && (item.allowSalesNegative ?? false) !== true)) {

                // xxxxxx &&  item.isNegative !== true
                if (item.isWeightScaleItem === true) {
                  let docLine = new PromotionDocumentLine();
                  docLine.lineNum = item.lineNum;
                  docLine.itemCode = item.id;
                  docLine.isNegative = item.isNegative;
                  // docLine.itemGroup = item.
                  docLine.quantity = item.quantity;
                  docLine.currency = storeSelected.currencyCode;
                  // docLine.vatGroup= '';
                  docLine.unitPrice = item.price;
                  docLine.uoMCode = item.uom;
                  docLine.barCode = item.barcode;
                  docLine.lineTotal = item.lineTotal;
                  docLine.weighScaleBarcode = item.weightScaleBarcode;

                  if (docLine.lineTotal === 0 && item.isVoucher) {
                    docLine.uIsPromo = '1';

                  }
                  // // debugger;
                  let group = '';
                  if (item.mcid !== (null || undefined || "")) {
                    group = item.mcid;

                  }
                  if (item.itemGroupId !== (null || undefined || '') && group === "") {
                    group = item.itemGroupId;
                  }
                  docLine.itemGroup = group;
                  docLine.uCollection = item.itemCategory_1;
                  docLine.bookletNo = item.bookletNo;
                  item.promotionIsPromo = null;

                  lines.push(docLine);
                }
                else {
                  let itemLine = lines.find(x => x.itemCode === item.id && x.uoMCode === item.uom && x.barCode === item.barcode && x.isNegative === item.isNegative && (x?.bookletNo ?? '') === (item?.bookletNo ?? ''));
                  // // debugger;
                  if (itemLine !== null && itemLine !== undefined) {
                    itemLine.quantity += item.quantity;
                    itemLine.lineTotal += this.authService.roundingAmount(item.lineTotal);
                  }
                  else {
                    let docLine = new PromotionDocumentLine();
                    docLine.lineNum = item.lineNum;
                    docLine.itemCode = item.id;
                    docLine.isNegative = item.isNegative;
                    // docLine.itemGroup = item.
                    docLine.quantity = item.quantity;
                    docLine.currency = storeSelected.currencyCode;
                    // docLine.vatGroup= '';
                    docLine.unitPrice = item.price;
                    docLine.uoMCode = item.uom;
                    docLine.barCode = item.barcode;
                    docLine.lineTotal = item.lineTotal;
                    if (docLine.lineTotal === 0 && item.isVoucher) {
                      docLine.uIsPromo = '1';

                    }
                    // // debugger;
                    let group = '';
                    if (item.mcid !== (null || undefined || "")) {
                      group = item.mcid;

                    }
                    if (item.itemGroupId !== (null || undefined || '') && group === "") {
                      group = item.itemGroupId;
                    }
                    docLine.itemGroup = group;
                    docLine.uCollection = item.itemCategory_1;
                    docLine.bookletNo = item.bookletNo;
                    item.promotionIsPromo = null;
                    lines.push(docLine);
                  }
                }


              }
            });
            if (isPayment !== null && isPayment !== undefined && isPayment === true) {
              var payments = basket.payments;
              let paymentList = [];
              if (payments !== null && payments !== undefined && payments.length > 0) {
                // let undefinedAmount= 0;
                payments.forEach((paymentline) => {
                  debugger;
                  const payment = new TSalesPayment();

                  payment.paymentCode = paymentline.id;
                  payment.companyCode = this.authService.getCurrentInfor().companyCode;
                  payment.refNumber = paymentline.refNum;
                  payment.lineId = paymentline.lineNum.toString();
                  payment.dataSource = 'POS';
                  payment.cardNo = paymentline.cardNo;
                  payment.cardHolderName = paymentline.cardHolderName;
                  payment.cardType = paymentline.cardType;
                  payment.paymentMode = paymentline.paymentMode;
                  payment.chargableAmount = paymentline.paymentCharged;
                  payment.paymentDiscount = 0;// paymentline.paymentDiscount;
                  payment.promoId = "";
                  let collectedAmount = paymentline.paymentTotal;
                  if (collectedAmount > payment.chargableAmount) {
                    collectedAmount = payment.chargableAmount;
                    // let difAmt = paymentline.paymentTotal - payment.chargableAmount;
                    // undefinedAmount += difAmt;
                  }
                  payment.collectedAmount = collectedAmount;

                  payment.roundingOff = paymentline.roundingOff;
                  payment.fcRoundingOff = paymentline.fcRoundingOff;
                  payment.forfeit = paymentline.forfeit;
                  payment.forfeitCode = paymentline.forfeitCode;
                  payment.customF1 = paymentline.customF1;
                  payment.customF2 = paymentline.customF2;
                  payment.customF3 = paymentline.customF3;
                  payment.customF4 = paymentline.customF4;
                  payment.customF5 = paymentline.customF5;
                  if (paymentline.currency !== null && paymentline.currency !== undefined && paymentline.currency !== '') {
                    payment.rate = paymentline.rate;
                    payment.fcAmount = paymentline.paymentTotal;
                    payment.collectedAmount = payment.fcAmount * payment.rate;
                    payment.currency = paymentline.currency;

                    payment.paidAmt = paymentline.paidAmt;
                  }
                  else {
                    payment.rate = 1;
                    payment.currency = this.authService.storeSelected().currencyCode;

                  }
                  if (Math.abs(payment.collectedAmount) - Math.abs(payment.chargableAmount) > 0) {
                    payment.changeAmt = Math.abs(payment.collectedAmount) - Math.abs(payment.chargableAmount);
                  }
                  paymentList.push(payment);
                });

                // if(undefinedAmount!= null && undefinedAmount!==undefined && undefinedAmount!==0)
                // {
                //   basket.undefinedAmount = undefinedAmount;
                // }
              }
              document.salesPayments = paymentList;
            }
            document.documentLines = lines;
            // document.promotionApply = basket.promotionApply;
            // debugger;
            if (VoucherPromotionCode !== null && VoucherPromotionCode !== undefined) {
              document.promotionCode = VoucherPromotionCode;
              this.promotionService.checkVoucherPromotion(document).subscribe((response: any) => {
                if (response.success) {

                  this.applyPromotionAction(basket, document, isPayment);
                }
                else {
                  this.alertify.warning(response.message);
                  basket.isApplyPromotion = true;
                  // console.log('isApplyPromotion 2' );
                }
              });
            }
            else {
              this.applyPromotionAction(basket, document, isPayment);

            }

            // }
            // else {
            //   basket.promoItemApply = [];
            //   // // debugger;
            //   this.setBasket(basket);
            // }
          }





        }
      }
      else {
        debugger;
        this.setBasket(basket);
      }
    }

  }
  findItem(source: IBasketItem[], item: PromotionDocumentLine) {
    // // debugger;
    if (source.some(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode)) {
      let item = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode);
      return item;
    }
    return null;
  }
  mapCardItemtoPromotionItem(source: IBasketItem[], promotion: PromotionDocumentLine[], isPromotion = false): IBasketItem[] {
    // // debugger;
    let format = this.authService.loadFormat();
    let decimalPlacesFormat = 6;
    let percentPlacesFormat = 6;

    if (format !== null && format !== undefined) {
      let checkFm = format.decimalPlacesFormat;
      if (checkFm !== null && checkFm !== undefined && checkFm !== '') {
        decimalPlacesFormat = parseInt(checkFm);
      }
      let checkPercentFm = format.perDecimalPlacesFormat;
      if (checkPercentFm !== null && checkPercentFm !== undefined && checkPercentFm !== '') {
        percentPlacesFormat = parseInt(checkPercentFm);
      }
    }

    if ((promotion !== null || promotion !== undefined)) {
      let tmpSource = [];
      let promotionItemList = promotion;
      if (promotionItemList.length > 0) {
        promotionItemList.forEach(item => {

          if (source.some(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode)) {
            // // debugger;
            let itemFind = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode);
            const itemnew = this.mapPrmotionItemtoBasket(itemFind, item);

            if (itemnew.promotionType === "Bonus Amount") {
              itemnew.discountType = "Bonus Amount";
              itemnew.discountValue = itemnew.promotionDisAmt;
            }
            if (itemnew.promotionType === "Bonus Percent") {
              itemnew.discountType = "Bonus Percent";
              itemnew.discountValue = itemnew.promotionDisPrcnt;
            }
            // const itemLineNew= [];
            itemnew.lineItems.forEach(itemline => {
              itemline.promotionDisPrcnt = itemnew.promotionDisPrcnt;
              itemline.promotionDisAmt = itemline.quantity * item.unitPrice * itemline.promotionDisPrcnt / 100;
            });
            itemnew.lineTotal = itemnew.quantity * itemnew.price;
            if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
              // itemnew.price = this.authService.roundingAmount(itemnew.price);
              // itemnew.lineTotal = this.authService.roundingAmount(item.quantity * itemnew.price) ;

              //2023-06-23 sửa lại rounding Up theo Decimal
              itemnew.price = this.authService.roundingValue(itemnew.price, "RoundUp", decimalPlacesFormat);
              let newLineTotal = itemnew.quantity * itemnew.price;
              itemnew.lineTotal = this.authService.roundingValue(newLineTotal, "RoundUp", decimalPlacesFormat);
            }
            tmpSource.push(itemnew);

          }

        });

      }
      // // debugger;
      source = tmpSource;
      return source;

    }
    if (source !== null && (promotion !== null || promotion !== undefined)) {

      // // debugger;
      let tmpSource = [];
      let promotionItemList = promotion;
      if (promotionItemList.length > 0) {
        promotionItemList.forEach(item => {

          if (source.some(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode)) {
            // // debugger;
            let itemFind = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode);
            const itemnew = this.mapPrmotionItemtoBasket(itemFind, item);

            if (itemnew.promotionType === "Bonus Amount") {
              itemnew.discountType = "Bonus Amount";
              itemnew.discountValue = itemnew.promotionDisAmt;
            }
            if (itemnew.promotionType === "Bonus Percent") {
              itemnew.discountType = "Bonus Percent";
              itemnew.discountValue = itemnew.promotionDisPrcnt;
            }
            // const itemLineNew= [];
            itemnew.lineItems.forEach(itemline => {
              itemline.promotionDisPrcnt = itemnew.promotionDisPrcnt;
              itemline.promotionDisAmt = itemline.quantity * item.unitPrice * itemline.promotionDisPrcnt / 100;
            });
            itemnew.lineTotal = itemnew.quantity * itemnew.price;
            if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
              // itemnew.price = this.authService.roundingAmount(itemnew.price);
              // itemnew.lineTotal = this.authService.roundingAmount(item.quantity * itemnew.price) ;

              //2023-06-23 sửa lại rounding Up theo Decimal
              itemnew.price = this.authService.roundingValue(itemnew.price, "RoundUp", decimalPlacesFormat);
              let newLineTotal = itemnew.quantity * itemnew.price;
              itemnew.lineTotal = this.authService.roundingValue(newLineTotal, "RoundUp", decimalPlacesFormat);
            }
            tmpSource.push(itemnew);

          }
          // else
          // {
          //   const itemnew = this.mapPrmotionItemtoBasket(null, item);

          //   if(itemnew.promotionType === "Bonus Amount")
          //   {
          //     itemnew.discountType="Bonus Amount";
          //     itemnew.discountValue = itemnew.promotionDisAmt;
          //   }
          //   if(itemnew.promotionType === "Bonus Percent")
          //   {
          //     itemnew.discountType="Bonus Percent";
          //     itemnew.discountValue = itemnew.promotionDisPrcnt;
          //   }

          //   itemnew.lineTotal = itemnew.quantity * itemnew.price;
          //   tmpSource.push(itemnew);
          // }

        });

      }
      // // debugger;
      source = tmpSource;
      return source;

    }

  }


  mapItemtoPromotionItem(source: IBasketItem[], promotion: PromotionDocumentLine[], isPromotion = false): IBasketItem[] {
    // debugger;
    if (source !== null && (promotion !== null || promotion !== undefined)) {
      console.log('Begin mapping item to promotion Item', new Date().getMilliseconds());
      let tmpSource = [];
      let promotionItemList = promotion;
      // console.log('promotionItemList', promotionItemList)
      let format = this.authService.loadFormat();
      let decimalPlacesFormat = 6;
      let percentPlacesFormat = 6;

      if (format !== null && format !== undefined) {
        let checkFm = format.decimalPlacesFormat;
        if (checkFm !== null && checkFm !== undefined && checkFm !== '') {
          decimalPlacesFormat = parseInt(checkFm);
        }
        let checkPercentFm = format.perDecimalPlacesFormat;
        if (checkPercentFm !== null && checkPercentFm !== undefined && checkPercentFm !== '') {
          percentPlacesFormat = parseInt(checkPercentFm);
        }
      }

      if (promotionItemList.length > 0) {
        promotionItemList.forEach(item => {

          // let sourceFind = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode && (x?.bookletNo ??'') === (item?.bookletNo ?? '' ) && (x.isNegative ?? false) ===  (item.isNegative ?? false)  && x.promotionIsPromo === item.uIsPromo);

          if (source.some(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode && (x?.bookletNo ?? '') === (item?.bookletNo ?? '') && (x.isNegative ?? false) === (item.isNegative ?? false) && (x.promotionIsPromo ?? '') === (item.uIsPromo ?? ''))) {
            // debugger;
            //x.lineNum === item.lineNum &&
            let itemFind = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode && (x?.bookletNo ?? '') === (item?.bookletNo ?? '') && (x.isNegative ?? false) === (item.isNegative ?? false) && (x.promotionIsPromo ?? '') === (item.uIsPromo ?? ''));
            // debugger;
            const itemnew = this.mapPrmotionItemtoBasket(itemFind, item);
            // // debugger;

            if (itemFind?.customField1 === "Card") {
              if (itemnew?.promotionType === "Bonus Amount") {
                itemnew.discountType = "Bonus Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              if (itemnew?.promotionType === "Bonus Percent") {
                itemnew.discountType = "Bonus Percent";
                itemnew.discountValue = itemnew.promotionDisPrcnt;
              }
              itemnew.lineItems.forEach(itemline => {
                // debugger;
                itemline.promotionDisPrcnt = itemnew.promotionDisPrcnt;
                itemline.promotionDisAmt = itemline.quantity * item.unitPrice * itemline.promotionDisPrcnt / 100;
              });
              // debugger;
              itemnew.lineTotal = itemnew.quantity * itemnew.price;
              if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                debugger;
                // itemnew.price = this.authService.roundingAmount(itemnew.price);
                // itemnew.lineTotal = this.authService.roundingAmount( itemnew.quantity *  itemnew.price) ;

                //2023-06-23 sửa lại rounding Up theo Decimal
                itemnew.price = this.authService.roundingValue(itemnew.price, "RoundToTenHundredth", decimalPlacesFormat);
                let newLineTotal = itemnew.quantity * itemnew.price;
                itemnew.lineTotal = this.authService.roundingValue(newLineTotal, "RoundToTenHundredth", decimalPlacesFormat);
              }
              tmpSource.push(itemnew);
            }
            else {
              // const itemnew = this.mapPrmotionItemtoBasket(itemFind, item);

              if (itemnew?.promotionType === "Discount Percent") {
                itemnew.discountType = "Discount Percent";
                itemnew.discountValue = itemnew.promotionDisPrcnt;
              }
              if (itemnew?.promotionType === "Discount Amount") {
                itemnew.discountType = "Discount Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              if (itemnew?.promotionType === "Fixed Price") {
                itemnew.discountType = "Discount Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              if (itemnew?.promotionType === "Bonus Amount") {
                itemnew.discountType = "Bonus Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              // if (itemnew?.promotionType === "Fixed Quantity") {
              // }

              if (itemnew?.promotionType === null || itemnew?.promotionType === undefined || itemnew?.promotionType === "") {
                itemnew.discountType = "Discount Percent";
              }
              if (itemnew?.discountValue === null || itemnew?.discountValue === undefined) {

                itemnew.discountValue = 0;
              }
              // itemnew.lineTotal =  itemnew.quantity * itemnew.price;
              itemnew.lineTotal = itemnew.quantity * itemnew.price;
              if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                debugger;

                // itemnew.price = this.authService.roundingAmount(itemnew.price);
                // itemnew.lineTotal = this.authService.roundingAmount( itemnew.quantity *  itemnew.price) ; 
                //2023-06-23 sửa lại rounding Up theo Decimal
                itemnew.price = this.authService.roundingValue(itemnew.price, "RoundToTenHundredth", decimalPlacesFormat);
                let newLineTotal = itemnew.quantity * itemnew.price;
                itemnew.lineTotal = this.authService.roundingValue(newLineTotal, "RoundToTenHundredth", decimalPlacesFormat);

              }
              tmpSource.push(itemnew);
            }

          }
          else {
            // // debugger;
            let basket = this.getCurrentBasket();

            const itemnew = this.mapPrmotionItemtoBasket(null, item);

            if (itemnew.customField8 !== null && itemnew.customField8 !== undefined && itemnew.customField8 !== '') {
              itemnew.isCapacity = true;
              itemnew.capacityValue = parseInt(itemnew.customField8);
              let itemFind = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode);
              itemnew.storeAreaId = itemFind.storeAreaId;
              itemnew.timeFrameId = itemFind.timeFrameId;
              itemnew.note = itemFind.note;
              itemnew.appointmentDate = itemFind.appointmentDate;
              this.addOrupdateItemOnlyPromotion(basket.items, itemnew, itemnew.quantity);
            }

            // console.log("Map to promotion item" + itemnew.id);
            // console.log(itemnew);
            // console.log(itemFind);
            // console.log(item);
            if (itemnew?.promotionType === "Discount Percent") {
              itemnew.discountType = "Discount Percent";
              itemnew.discountValue = itemnew.promotionDisPrcnt;
            }
            if (itemnew?.promotionType === "Discount Amount") {
              itemnew.discountType = "Discount Amount";
              itemnew.discountValue = itemnew.promotionDisAmt;
            }
            if (itemnew?.promotionType === "Fixed Price") {
              itemnew.discountType = "Discount Amount";
              itemnew.discountValue = itemnew.promotionDisAmt;
            }
            // itemnew.lineTotal = itemnew.quantity * itemnew.price;
            itemnew.lineTotal = itemnew.quantity * itemnew.price;
            if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
              debugger;
              // itemnew.lineTotal = this.authService.roundingAmount( itemnew.quantity * this.authService.roundingAmount(itemnew.price)) ;
              // itemnew.price = this.authService.roundingAmount(itemnew.price);
              // itemnew.lineTotal = this.authService.roundingAmount(itemnew.quantity *  itemnew.price) ;

              //2023-06-23 sửa lại rounding Up theo Decimal
              itemnew.price = this.authService.roundingValue(itemnew.price, "RoundToTenHundredth", decimalPlacesFormat);
              let newLineTotal = itemnew.quantity * itemnew.price;
              itemnew.lineTotal = this.authService.roundingValue(newLineTotal, "RoundToTenHundredth", decimalPlacesFormat);



            }
            tmpSource.push(itemnew);
          }

        });

      }
      // // debugger;
      source = tmpSource;
      console.log('End mapping item to promotion Item', new Date().getMilliseconds());
      console.log('source return', source);

      return source;

    }

  }
  mapItemtoPromotionItemResetAll(source: IBasketItem[], promotion: PromotionDocumentLine[], isPromotion = false): IBasketItem[] {
    // let storeCurrency = this.authService.getStoreCurrency();
    // let type = "";
    // if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {
    //   let currency = this.authService.storeSelected().currencyCode;
    //    type = storeCurrency.find(x => x.currency === currency);

    // }
    if (source !== null && (promotion !== null || promotion !== undefined)) {

      let tmpSource = [];
      let promotionItemList = promotion;
      // console.log("Source");
      // console.log(source);
      if (promotionItemList.length > 0) {

        promotionItemList.forEach(item => {

          if (source.some(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode)) {
            //
            let itemFind = source.find(x => x.id === item.itemCode && x.uom === item.uoMCode && x.barcode === item.barCode);
            // // debugger;
            const itemnew = this.mapPrmotionItemtoBasket(itemFind, item);

            if (itemFind.customField1 === "Card") {
              if (itemnew.promotionType === "Bonus Amount") {
                itemnew.discountType = "Bonus Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              if (itemnew.promotionType === "Bonus Percent") {
                itemnew.discountType = "Bonus Percent";
                itemnew.discountValue = itemnew.promotionDisPrcnt;
              }

              itemnew.lineTotal = itemnew.quantity * itemnew.price;
              if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                itemnew.price = this.authService.roundingAmount(itemnew.price);
                itemnew.lineTotal = this.authService.roundingAmount(itemnew.quantity * itemnew.price);
                // itemnew.lineTotal = this.authService.roundingAmount( itemnew.quantity * this.authService.roundingAmount(itemnew.price)) ;
              }
              tmpSource.push(itemnew);
            }
            else {
              // const itemnew = this.mapPrmotionItemtoBasket(itemFind, item);

              if (itemnew.promotionType === "Discount Percent") {
                itemnew.discountType = "Discount Percent";
                itemnew.discountValue = itemnew.promotionDisPrcnt;
              }
              if (itemnew.promotionType === "Discount Amount") {
                itemnew.discountType = "Discount Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              if (itemnew.promotionType === "Fixed Price") {
                itemnew.discountType = "Discount Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              if (itemnew.promotionType === "Bonus Amount") {
                itemnew.discountType = "Bonus Amount";
                itemnew.discountValue = itemnew.promotionDisAmt;
              }
              if (itemnew.promotionType === "Bonus Percent") {
                itemnew.discountType = "Bonus Percent";
                itemnew.discountValue = itemnew.promotionDisPrcnt;
              }
              if (itemnew.promotionType === null || itemnew.promotionType === undefined || itemnew.promotionType === "") {
                itemnew.discountType = "Discount Percent";
              }
              if (itemnew.discountValue === null || itemnew.discountValue === undefined) {

                itemnew.discountValue = 0;
              }
              itemnew.lineTotal = itemnew.quantity * itemnew.price;
              if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                itemnew.price = this.authService.roundingAmount(itemnew.price);
                itemnew.lineTotal = this.authService.roundingAmount(itemnew.quantity * itemnew.price);
                // itemnew.lineTotal = this.authService.roundingAmount( itemnew.quantity * this.authService.roundingAmount(itemnew.price)) ;
              }
              tmpSource.push(itemnew);
            }




          }
          else {

            const itemnew = this.mapPrmotionItemtoBasket(null, item);
            // console.log("Map to promotion item" + itemnew.id);
            // console.log(itemnew);
            // console.log(itemFind);
            // console.log(item);
            if (itemnew.promotionType === "Discount Percent") {
              itemnew.discountType = "Discount Percent";
              itemnew.discountValue = itemnew.promotionDisPrcnt;
            }
            if (itemnew.promotionType === "Discount Amount") {
              itemnew.discountType = "Discount Amount";
              itemnew.discountValue = itemnew.promotionDisAmt;
            }
            if (itemnew.promotionType === "Fixed Price") {
              itemnew.discountType = "Discount Amount";
              itemnew.discountValue = itemnew.promotionDisAmt;
            }
            itemnew.lineTotal = itemnew.quantity * itemnew.price;
            if (itemnew?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
              itemnew.price = this.authService.roundingAmount(itemnew.price);
              itemnew.lineTotal = this.authService.roundingAmount(itemnew.quantity * itemnew.price);
              // itemnew.lineTotal = this.authService.roundingAmount( itemnew.quantity * this.authService.roundingAmount(itemnew.price)) ;
            }
            tmpSource.push(itemnew);
          }

        });

      }
      // // debugger;
      source = tmpSource;
      return source;

    }

  }

  getTotalBasket() {
    // // debugger;
    return this.basketTotal.value;
  }
  getCurrentEmployeeList() {
    // // debugger;
    return this.employeeList.value;
  }
  getCurrentIsNewGenOrderNo() {
    // // debugger;
    return this.isGenOrderNo.value;
  }
  getCurrentBasket() {
    // // debugger;
    return this.basketSource.value;
  }
  getCurrentBasketpromo() {
    // // debugger;
    return this.basketSourcepromo.value;
  }

  // tslint:disable-next-line: align
  addItemtoBasket(item: ItemViewModel, quantity = 1, bomModel?: BOMViewModel, serialList?: MItemSerial[]) {
    // console.log("item", item);
    // debugger;



    let storeSelected = this.authService.storeSelected();
    const itemAdd: IBasketItem = this.mapProductItemtoBasket(item, quantity);
    if (item.slocId === null || item.slocId === undefined) {
      item.slocId = storeSelected.whsCode;
    }
    // // debugger;
    if (bomModel !== null && bomModel !== undefined) {
      bomModel.lines.forEach(item => {
        const itemBOM: IBasketItem = this.mapProductBOMItemtoBasket(item, quantity);
        itemAdd.lineItems.push(itemBOM);
      });
    }
    if (serialList !== null && serialList !== undefined) {
      itemAdd.lineItems = [];
      serialList.forEach(serial => {
        const itemSerial = new IBasketItem();
        itemSerial.serialNum = serial.serialNum;
        itemSerial.quantity = 1;
        itemSerial.lineItems = [];
        itemAdd.lineItems.push(itemSerial);
      });
    }
    // console.log();
    let basket = this.getCurrentBasket();
    if (basket === null) {
      basket = this.createBasket(null);
    }



    basket.items = this.addOrupdateItem(basket.items, itemAdd, quantity);

    let aX = Object.assign({}, itemAdd);
    let itemX: IBasketItem = new IBasketItem();
    itemX.productName = aX.productName;
    itemX.price = aX.price;
    itemX.id = aX.id;
    itemX.lineNum = aX.lineNum;
    debugger;
    let itemXA = basket.items.find(x => x.id === itemAdd.id && x?.barcode === itemAdd?.barcode);
    let quantityX = 1;
    if (itemXA !== null && itemXA !== undefined) {
      quantityX = itemXA.quantity ?? 1;
    }
    itemX.quantity = quantityX;
    itemX.type = "Add";
    basket.lastedItem = itemX;

    // debugger;
    // // debugger;
    // console.log('isApplyPromotion 1' );

    this.applyPromotion(basket);



  }

  addItemListBasketToBasket(items: IBasketItem[], runPromotion = true) {

    console.log("items to basket", items);
    debugger;
    let subject = new Subject();
    let basket = this.getCurrentBasket();
    if (basket === null) {
      basket = this.createBasket(null);
    }

    items.forEach(item => {
      const itemAdd: IBasketItem = item;
      // // debugger;
      // if(bomModel!==null && bomModel !== undefined)
      // {
      //   bomModel.lines.forEach(item=>{
      //     const itemBOM: IBasketItem = this.mapProductBOMItemtoBasket(item, quantity);
      //     itemAdd.lineItems.push(itemBOM);
      // });
      // }

      basket.items = this.addOrupdateItem(basket.items, itemAdd, itemAdd.quantity);
    });

    if (runPromotion === true) {
      this.applyPromotion(basket);
    }
    else {
      this.setBasket(basket);
    }
    subject.next();
    return subject;
  }

  addItemListBasketToTmpItemsBasket(items: IBasketItem[]) {
    let subject = new Subject();
    let basket = this.getCurrentBasket();
    if (basket === null) {
      basket = this.createBasket(null);
    }
    items.forEach(item => {
      const itemAdd: IBasketItem = item;

      basket.tmpItems = this.addOrupdateItem(basket.tmpItems, itemAdd, itemAdd.quantity);
    });

    subject.next();
    return subject;
  }


  addItemBasketToBasketNoPromotion(item: IBasketItem, quantity = 1, bomModel?: BOMViewModel, isApplyPromotion?) {
    const itemAdd: IBasketItem = item;
    // // debugger;
    if (bomModel !== null && bomModel !== undefined) {
      bomModel.lines.forEach(item => {
        const itemBOM: IBasketItem = this.mapProductBOMItemtoBasket(item, quantity);
        itemAdd.lineItems.push(itemBOM);
      });
    }

    let basket = this.getCurrentBasket();
    if (basket === null) {
      basket = this.createBasket(null);
    }
    // debugger;
    basket.items = this.addOrupdateItem(basket.items, itemAdd, quantity);
    if (isApplyPromotion !== null && isApplyPromotion !== undefined && isApplyPromotion === true) {
      basket.isApplyPromotion = true;
      console.log('isApplyPromotion 3');
    }
    this.setBasket(basket);
    return basket.items;
  }


  addItemBasketToBasket(item: IBasketItem, quantity = 1, bomModel?: BOMViewModel) {
    const itemAdd: IBasketItem = item;
    // debugger;
    if (bomModel !== null && bomModel !== undefined) {
      bomModel.lines.forEach(item => {
        const itemBOM: IBasketItem = this.mapProductBOMItemtoBasket(item, quantity);
        itemAdd.lineItems.push(itemBOM);
      });
    }
    let basket = this.getCurrentBasket();
    // var basketromo = this.getCurrentBasketpromo();
    if (basket === null) {
      basket = this.createBasket(null);
    }
    // if (basketromo === null) {
    //   basketromo = JSON.parse(JSON.stringify(basket));
    //   this.basketSourcepromo.next(basketromo);
    // }
    basket.items = this.addOrupdateItem(basket.items, itemAdd, quantity);
    // basketromo.items = this.addOrupdateItempromo(basketromo.items, itemAdd, quantity);
    // console.log(basket.items);
    debugger;
    // this.setBasket(basket);
    // this.setBasketpromo(basketromo);
    if (basket.salesType?.toLowerCase() !== "exchange" && basket.salesType?.toLowerCase() !== "ex" && basket.salesType?.toLowerCase() !== "receive") {
      this.applyPromotion(basket);
    }
    else {
      this.setBasket(basket);
    }
  }
  addOrupdateItemPromotion(itemtoUpdate: IBasketItem, DiscountValue: number) {
    let basket = this.getCurrentBasket();
    const index = basket.items.findIndex((i) => i.id === itemtoUpdate.id && i?.lineNum === itemtoUpdate?.lineNum);
    if (index === -1) {
      // itemtoAdd.quantity = quantity;
      // items.push(itemtoAdd);
    } else {
      basket.items[index].discountValue = DiscountValue;
      basket.items[index].discountType = itemtoUpdate.discountType;
    }
    //  return basket.items;
    // // debugger;
    this.setBasket(basket);
  }
  mapItemAddToItemSerial(itemtoAdd: IBasketItem) {
    let itemSerial;

    return itemSerial;
  }
  public SetQuantityItemBasket(
    itemtoAdd: IBasketItem,
    quantity: number

  ): IBasketItem[] {
    // // debugger;
    // console.log(items);
    // debugger;
    this.changeBasketResponseStatus(false);
    let basket = this.getCurrentBasket();
    let items = basket.items;
    const index = items.findIndex((i) => i.id === itemtoAdd.id && i.uom === itemtoAdd.uom && i.barcode === itemtoAdd.barcode && i?.custom1 === itemtoAdd?.custom1 && i.promotionIsPromo !== '1' && i.isWeightScaleItem !== true);
    if (index !== -1) {

      if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && itemtoAdd?.customField1?.toLowerCase() === "card") {
        let a = Object.assign({}, itemtoAdd);
        let isReplace = false;
        // // debugger;
        items[index].lineItems.forEach(itemX => {
          // // debugger;
          if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.prepaidCardNo === itemtoAdd.prepaidCardNo) {
            itemX.quantity = parseFloat(itemtoAdd.quantity.toString());

            // items[index].quantity+=itemX.quantity;
            isReplace = true;
          }

        });
        if (isReplace === false) {

          items[index].lineItems.push(a);
        }
        items[index].quantity = 0;
        items[index].lineTotal = 0;
        items[index].lineItems.forEach(itemX => {
          // // debugger;
          items[index].quantity += parseFloat(itemX.quantity.toString());
          // items[index].quantity = parseFloat(items[index].quantity.toString()) + parseFloat(itemX.quantity.toString());
        });
        items[index].lineTotal = parseFloat(items[index].quantity.toString()) * parseFloat(items[index].price.toString());
        if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
          items[index].price = this.authService.roundingAmount(items[index].price);
          items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
        }
        if (basket.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex") {
          items[index].promotionLineTotal = items[index].lineTotal;

        }
      }
      else {

        if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1?.toLowerCase() === "member" || itemtoAdd?.customField1?.toLowerCase() === "class")) {
          let a = Object.assign({}, itemtoAdd);
          let isReplace = false;
          // debugger;
          items[index].lineItems.forEach(itemX => {

            let itemCheck = itemtoAdd.lineItems.find(y => y.serialNum === itemX.serialNum);
            if (itemCheck !== null && itemCheck !== undefined) {
              if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.serialNum === itemCheck.serialNum && (moment(itemX.memberDate)).format('DD-MM-YYYY') === (moment(itemtoAdd.memberDate)).format('DD-MM-YYYY')) {
                itemX.quantity = quantity;
                itemX.phone = itemCheck.phone;
                itemX.name = itemCheck.name;
                // itemX.memberValue= itemtoAdd.quantity ;
                // items[index].quantity+=itemX.quantity;
                isReplace = true;
              }
              else {

              }
            }


          });
          if (isReplace === false) {
            // a.quantity = quantity;
            // items[index].lineItems.push(a);
            a.lineItems.forEach(itemMember => {
              // debugger;
              itemMember.id = itemtoAdd.id;
              itemMember.uom = itemtoAdd.uom;
              itemMember.price = itemtoAdd.price;
              itemMember.barcode = itemtoAdd.barcode;
              itemMember.slocId = itemtoAdd.slocId;
              itemMember.customField1 = itemtoAdd.customField1;
              itemMember.customField2 = itemtoAdd.customField2;
              if (itemtoAdd.customField2 !== null && itemtoAdd.customField2 !== undefined) {
                itemMember.memberValue = itemtoAdd.customField2 == null ? 1 : parseFloat(itemtoAdd.customField2);
              }

              itemMember.quantity = 1;
              itemMember.startDate = itemtoAdd.memberDate;
              itemMember.memberDate = itemtoAdd.memberDate;
              itemMember.phone = itemMember.phone;
              itemMember.name = itemMember.name;
              var date = new Date(new Date(itemMember.startDate).setMonth(new Date(itemMember.startDate).getMonth() + (itemMember.memberValue * parseInt(itemMember.quantity.toString()))));
              itemMember.endDate = date;
              items[index].lineItems.push(itemMember);
            });
          }
          items[index].quantity = 0;
          items[index].lineTotal = 0;
          // debugger;
          items[index].lineItems.forEach(itemX => {
            // debugger;
            // itemMember.id = itemtoAdd.id;
            // itemMember.uom = itemtoAdd.uom;
            // itemMember.price = itemtoAdd.price;
            // itemMember.barcode = itemtoAdd.barcode;
            // itemMember.slocId = itemtoAdd.slocId;
            // itemMember.customField1 = itemtoAdd.customField1;
            // itemMember.customField2 = itemtoAdd.customField2;


            itemX.quantity = itemX.quantity;//* itemCapa.capacityValue;
            itemX.startDate = itemX.memberDate;
            if (itemX.customField2 !== null && itemX.customField2 !== undefined) {
              itemX.memberValue = itemX.customField2 == null ? 1 : parseFloat(itemX.customField2);
            }
            itemX.phone = itemX.phone;
            itemX.name = itemX.name;
            var date = new Date(new Date(itemX.startDate).setMonth(new Date(itemX.startDate).getMonth() + (itemX.memberValue * parseInt(itemX.quantity.toString()))));
            itemX.endDate = date;
            items[index].quantity += parseFloat(itemX.quantity.toString());
            // if(itemX.memberValue!==undefined && itemX.memberValue!==null)
            // {

            // }

          });

          items[index].lineTotal = items[index].quantity * items[index].price;
          if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
            items[index].price = this.authService.roundingAmount(items[index].price);
            items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
          }
          if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
            items[index].promotionLineTotal = items[index].lineTotal;

          }


          // itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
          // // debugger;

        }
        else {


          if (itemtoAdd.isSerial !== null && itemtoAdd.isSerial !== undefined && itemtoAdd.isSerial.toString() === 'true') {
            itemtoAdd.isSerial = true;
          }
          else {
            itemtoAdd.isSerial = false;
          }
          if (itemtoAdd.isVoucher !== null && itemtoAdd.isVoucher !== undefined && itemtoAdd.isVoucher.toString() === 'true') {
            itemtoAdd.isVoucher = true;
          }
          else {
            itemtoAdd.isVoucher = false;
          }
          if (itemtoAdd.isBOM !== null && itemtoAdd.isBOM !== undefined && itemtoAdd.isBOM.toString() === 'true') {
            itemtoAdd.isBOM = true;
          }
          else {
            itemtoAdd.isBOM = false;
          }

          if (items[index].isSerial === true || items[index].isVoucher === true) {
            items[index].quantity = quantity;

          }
          else {

            items[index].quantity = quantity;
            if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1.toLowerCase() === "tp" || itemtoAdd?.customField1.toLowerCase() === "bp" || itemtoAdd?.customField1.toLowerCase() === "pn")) {
              items[index].quantity = quantity;
              items[index].lineTotal = items[index].quantity * items[index].price;
              items[index].promotionLineTotal = items[index].lineTotal;
              items[index].promotionUnitPrice = items[index].price;
            }
            // debugger;
            if (basket.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex" || basket.salesType.toLowerCase() === "return") {
              // items[index].promotionPriceAfDis = itemtoAdd.promotionPriceAfDis;
              // items[index].lineTotal =  items[index].quantity * items[index].price;//itemtoAdd.price;
              // items[index].promotionLineTotal =  items[index].quantity * items[index].promotionPriceAfDis;//itemtoAdd.price;

              items[index].promotionPriceAfDis = itemtoAdd.promotionPriceAfDis;
              let tempDis = itemtoAdd.price - itemtoAdd.promotionPriceAfDis;
              if (itemtoAdd.discountType === "Discount Amount") {
                items[index].discountValue = tempDis * items[index].quantity;
              }
              items[index].promotionDisAmt = tempDis * items[index].quantity;
              items[index].lineTotal = items[index].quantity * itemtoAdd.price;
              if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                items[index].price = this.authService.roundingAmount(items[index].price);
                items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
              }
              items[index].promotionLineTotal = items[index].quantity * itemtoAdd.promotionPriceAfDis;//itemtoAdd.price;
            }


            if (items[index].isBOM) {
              items[index].lineItems.forEach((item) => {
                item.quantity = quantity;
              })
            }

          }
          items[index].lineTotal = items[index].quantity * items[index].price;
          if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
            items[index].price = this.authService.roundingAmount(items[index].price);
            items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
          }
          items[index].promotionLineTotal = items[index].quantity * (items[index].promotionPriceAfDis ?? items[index].price);
          if (itemtoAdd.isCapacity === true) {
            let a = Object.assign({}, itemtoAdd);
            let isReplace = false;
            items[index].lineItems.forEach(itemX => {

              if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.storeAreaId === itemtoAdd.storeAreaId && itemX.timeFrameId === itemtoAdd.timeFrameId && itemX.appointmentDate === itemtoAdd.appointmentDate) {
                itemX.quantity = itemtoAdd.quantity * itemtoAdd.capacityValue;
                // items[index].quantity+=itemX.quantity;
                isReplace = true;
              }

            });
            if (isReplace === false) {
              items[index].lineItems.push(a);
            }
            items[index].quantity = 0;
            items[index].lineTotal = 0;
            items[index].lineItems.forEach(itemX => {
              // // debugger;
              items[index].quantity = parseInt(items[index].quantity.toString()) + parseInt(itemX.quantity.toString());


            });
            items[index].lineTotal = items[index].quantity * items[index].price;
            if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
              items[index].price = this.authService.roundingAmount(items[index].price);
              items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
            }
            if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
              items[index].promotionLineTotal = items[index].lineTotal;

            }


            // itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
            // // debugger;
            // // debugger;
          }
        }
      }
    }


    this.setBasket(basket);

    return items;

  }
  removePromotion() {

    let basket = this.getCurrentBasket();
    basket.items = basket.orginalItems;
    this.setBasket(basket);
  }
  private addOrupdateItem(
    items: IBasketItem[],
    itemtoAdd: IBasketItem,
    quantity: number

  ): IBasketItem[] {
    // // debugger;
    console.log(items);
    // debugger;

    let basket = this.getCurrentBasket();

    // let ManualRunPromotion = "false";
    // let ManualRunPromotionRS = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ManualRunPromotion');
    // if (ManualRunPromotionRS !== null && ManualRunPromotionRS !== undefined) {
    //   ManualRunPromotion = ManualRunPromotionRS.settingValue;
    // }
    // debugger;
    // if(ManualRunPromotion?.toLowerCase() === "true" && basket.isApplyPromotion === true) 
    // {
    //   // basket.items = 
    //   basket.isApplyPromotion = false;
    //   basket.items = basket.orginalItems;
    //   this.setBasket(basket); 

    // }
    // basket = this.getCurrentBasket();



    if (basket.omsSource !== null && basket.omsSource !== undefined && basket.omsSource !== '' && (basket.omsId === null || basket.omsId === undefined || basket.omsId === '')) {
      this.alertify.warning("Please Input omsId");
      this.changeBasketResponseStatus(true);
      console.log("Please Input omsId");
      return basket.items;
    }
    else {
      // debugger;

      quantity = itemtoAdd.allowSalesNegative ? -quantity : quantity;
      if (this.poleDisplay === 'true') {
        // this.
        // let poleValue = this.getPole();
        // let basketInfor= this.basketService.getTotalBasket(); 
        let storeSelected = this.authService.storeSelected();
        if (this.poleDisplayType?.toLowerCase() === 'serialport') {
          this.commonService.WritePoleValue(storeSelected.companyCode, storeSelected.storeId, null, this.poleDisplayType,
            // "(" + storeSelected?.currencyCode + ") " 
            itemtoAdd?.productName, quantity + ' X ' + this.authService.formatCurrentcy(itemtoAdd?.price), false);
        }
        // await this.WriteValue("     WELCOME TO", this.authService.getCompanyInfor().companyName, false);
      }
      const index = items.findIndex((i) => i.id === itemtoAdd.id && i.uom === itemtoAdd.uom && i?.bookletNo === itemtoAdd?.bookletNo && i.barcode === itemtoAdd.barcode
        && i?.isNegative === itemtoAdd?.isNegative && i?.custom1 === itemtoAdd?.custom1 && i?.baseLine === itemtoAdd?.baseLine
        && ((i.promotionIsPromo !== '1' && i.promotionType !== 'Fixed Quantity') || (i.promotionIsPromo === '1' && i.isVoucher && i.isVoucher === itemtoAdd.isVoucher))
        && i.isWeightScaleItem !== true);

      const indexpromo = items.findIndex((i) => i.id === itemtoAdd.id && i.uom === itemtoAdd.uom && i?.bookletNo === itemtoAdd?.bookletNo && i.barcode === itemtoAdd.barcode && i?.isNegative === itemtoAdd?.isNegative && i?.custom1 === itemtoAdd?.custom1 && i?.baseLine === itemtoAdd?.baseLine
        && i.promotionIsPromo !== '1' && i.isWeightScaleItem !== true && i.promotionType === 'Fixed Quantity');
      if (index === -1) {

        if (itemtoAdd.isFixedQty !== null && itemtoAdd.isFixedQty !== undefined && itemtoAdd.isFixedQty === true
          && itemtoAdd?.defaultFixedQty !== null && itemtoAdd?.defaultFixedQty !== undefined && itemtoAdd?.defaultFixedQty !== 0) {
          quantity = itemtoAdd.allowSalesNegative ? -(itemtoAdd?.defaultFixedQty ?? 1) : (itemtoAdd?.defaultFixedQty ?? 1);
        }
        itemtoAdd.quantity = quantity;
        // itemtoAdd.promotion = itemtoAdd.price
        // if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1.toLowerCase() === "tp" || itemtoAdd?.customField1.toLowerCase() === "pb" || itemtoAdd?.customField1.toLowerCase() === "pn"))
        // {

        //   itemtoAdd.lineTotal = quantity * itemtoAdd.price;
        //   itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
        //   itemtoAdd.promotionUnitPrice = itemtoAdd.price;
        // }
        let lineTotalCal = quantity * itemtoAdd.price;
        // let typeRounding = this.getRoundingTypeStore();
        // if(typeRounding!==null && typeRounding!==undefined)
        // {
        //   if(typeRounding?.roundingMethod!==null && typeRounding?.roundingMethod!==undefined && typeRounding?.roundingMethod!=='')
        //   {
        //     lineTotalCal = this.authService.roundingValue(quantity * itemtoAdd.price, typeRounding?.roundingMethod);
        //   }
        // } 
        itemtoAdd.lineTotal = lineTotalCal;//quantity * itemtoAdd.price;

        if ((itemtoAdd.allowSalesNegative ?? false) === true) {
          itemtoAdd.promotionPriceAfDis = itemtoAdd.price;
          itemtoAdd.promotionLineTotal = quantity * itemtoAdd.promotionPriceAfDis;
        }
        if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex" || basket.salesType?.toLowerCase() === "return") {
          // debugger;
          // itemtoAdd.promotionDisAmt =  itemtoAdd.promotionDisAmt * itemtoAdd.quantity; 
          itemtoAdd.promotionPriceAfDis = itemtoAdd.promotionPriceAfDis ?? itemtoAdd.price;
          itemtoAdd.promotionLineTotal = quantity * itemtoAdd.promotionPriceAfDis;//itemtoAdd.price;
        }


        if (itemtoAdd.isSerial !== null && itemtoAdd.isSerial !== undefined && itemtoAdd.isSerial.toString() === 'true' && itemtoAdd?.customField1?.toString() === 'Retail') {
          itemtoAdd.isSerial = true;
        }
        else {
          itemtoAdd.isSerial = false;
        }
        if (itemtoAdd.isVoucher !== null && itemtoAdd.isVoucher !== undefined && itemtoAdd.isVoucher.toString() === 'true') {
          itemtoAdd.isVoucher = true;
        }
        else {
          itemtoAdd.isVoucher = false;
        }

        if (itemtoAdd.isBOM !== null && itemtoAdd.isBOM !== undefined && itemtoAdd.isBOM.toString() === 'true') {
          itemtoAdd.isBOM = true;
        }
        else {
          itemtoAdd.isBOM = false;
        }
        if (itemtoAdd.isCapacity === true) {

          itemtoAdd.lineItems.push(itemtoAdd);
          var newArray = [];
          itemtoAdd.lineItems.forEach(val => { let a = val; a.lineItems = []; newArray.push(Object.assign({}, a)) });
          itemtoAdd.lineItems = [];
          itemtoAdd.lineItems = newArray;
          itemtoAdd.lineItems.forEach(itemCapa => {
            if (itemCapa.capacityValue === null || itemCapa.capacityValue === undefined) {
              itemCapa.capacityValue = 1;
            }
            itemCapa.quantity = itemCapa.quantity * itemCapa.capacityValue;
          });

        }
        if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1?.toLowerCase() === "member" || itemtoAdd?.customField1?.toLowerCase() === "class")) {
          itemtoAdd.quantity = quantity;
          // itemtoAdd.lineItems.push(itemtoAdd);
          var newArray = [];
          itemtoAdd.lineItems.forEach(val => { let a = val; a.lineItems = []; newArray.push(Object.assign({}, a)) });
          itemtoAdd.lineItems = [];
          itemtoAdd.lineItems = newArray;
          itemtoAdd.lineItems.forEach(itemMember => {
            // // debugger;
            itemMember.id = itemtoAdd.id;
            itemMember.uom = itemtoAdd.uom;
            itemMember.price = itemtoAdd.price;
            itemMember.barcode = itemtoAdd.barcode;
            itemMember.slocId = itemtoAdd.slocId;
            itemMember.customField1 = itemtoAdd.customField1;
            itemMember.customField2 = itemtoAdd.customField2;
            if (itemtoAdd.customField2 !== null && itemtoAdd.customField2 !== undefined) {
              itemMember.memberValue = itemtoAdd.customField2 == null ? 1 : parseFloat(itemtoAdd.customField2);
            }
            // // debugger;
            itemMember.quantity = 1;// itemtoAdd.quantity ;//* itemCapa.capacityValue;
            itemMember.startDate = itemtoAdd.memberDate;
            itemMember.memberDate = itemtoAdd.memberDate;
            itemMember.phone = itemMember.phone;
            itemMember.name = itemMember.name;
            var date = new Date(new Date(itemMember.startDate).setMonth(new Date(itemMember.startDate).getMonth() + (itemMember.memberValue * parseInt(itemMember.quantity.toString()))));
            itemMember.endDate = date;
          });
        }
        if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && itemtoAdd?.customField1?.toLowerCase() === "card") {

          itemtoAdd.lineItems.push(itemtoAdd);
          var newArray = [];
          itemtoAdd.lineItems.forEach(val => { let a = val; a.lineItems = []; newArray.push(Object.assign({}, a)) });
          itemtoAdd.lineItems = [];
          itemtoAdd.lineItems = newArray;
          itemtoAdd.quantity = quantity;
          // itemtoAdd.lineItems.forEach(itemCapa => {
          //   // if(itemCapa.quantity===null || itemCapa.quantity===undefined)
          //   // {
          //   //   itemCapa.quantity=1;
          //   // }
          //   itemCapa.quantity = itemCapa.quantity * itemCapa.capacityValue;
          // });
        }
        // // debugger;
        // let newItem=Object.assign({}, itemtoAdd);
        items.push(itemtoAdd);

      } else {
        // debugger;

        if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && itemtoAdd?.customField1?.toLowerCase() === "card") {
          let a = Object.assign({}, itemtoAdd);
          let isReplace = false;
          // // debugger;
          items[index].lineItems.forEach(itemX => {
            // // debugger;
            if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.prepaidCardNo === itemtoAdd.prepaidCardNo) {
              itemX.quantity = parseFloat(itemtoAdd.quantity.toString());

              // items[index].quantity+=itemX.quantity;
              isReplace = true;
            }

          });
          if (isReplace === false) {

            items[index].lineItems.push(a);
          }
          items[index].quantity = 0;
          items[index].lineTotal = 0;
          items[index].lineItems.forEach(itemX => {
            // // debugger;
            items[index].quantity += parseFloat(itemX.quantity.toString());
            // items[index].quantity = parseFloat(items[index].quantity.toString()) + parseFloat(itemX.quantity.toString());
          });
          // items[index].lineTotal = parseFloat(items[index].quantity.toString()) * parseFloat(items[index].price.toString());
          let lineTotalCal = parseFloat(items[index].quantity.toString()) * parseFloat(items[index].price.toString());
          items[index].lineTotal = lineTotalCal;
          if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {

            items[index].lineTotal = this.authService.roundingAmount(parseFloat(items[index].quantity.toString()) * parseFloat(items[index].price.toString()));
          }
          // let typeRounding = this.getRoundingTypeStore();
          // if(typeRounding!==null && typeRounding!==undefined)
          // {
          //   if(typeRounding?.roundingMethod!==null && typeRounding?.roundingMethod!==undefined && typeRounding?.roundingMethod!=='')
          //   {
          //     lineTotalCal = this.authService.roundingValue(lineTotalCal, typeRounding?.roundingMethod);
          //   }
          // } 

          if (basket.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex") {
            items[index].promotionLineTotal = items[index].lineTotal;

          }

        }
        else {
          debugger;
          // 2000800013758 
          let canUpdate = true;
          if (itemtoAdd.isFixedQty !== null && itemtoAdd.isFixedQty !== undefined && itemtoAdd.isFixedQty === true
            && itemtoAdd?.defaultFixedQty !== null && itemtoAdd?.defaultFixedQty !== undefined && itemtoAdd?.defaultFixedQty !== 0) {
            let itemUpdate = items.find((i) => i.id === itemtoAdd.id && i.uom === itemtoAdd.uom && i?.bookletNo === itemtoAdd?.bookletNo && i.barcode === itemtoAdd.barcode
              && i?.isNegative === itemtoAdd?.isNegative && i?.custom1 === itemtoAdd?.custom1 && i?.baseLine === itemtoAdd?.baseLine
              && ((i.promotionIsPromo !== '1' && i.promotionType !== 'Fixed Quantity') || (i.promotionIsPromo === '1' && i.isVoucher && i.isVoucher === itemtoAdd.isVoucher))
              && i.isWeightScaleItem !== true);
            if (itemUpdate !== null && itemUpdate !== undefined) {
              if (itemtoAdd?.defaultFixedQty === itemUpdate.quantity) {
                canUpdate = false;
                this.alertify.warning("Fixed item can't update quantity.");
              }
            }

          }
          if (canUpdate) {
            if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1?.toLowerCase() === "member" || itemtoAdd?.customField1?.toLowerCase() === "class")) {
              let a = Object.assign({}, itemtoAdd);
              let isReplace = false;
              // debugger;
              items[index].lineItems.forEach(itemX => {

                let itemCheck = itemtoAdd.lineItems.find(y => y.serialNum === itemX.serialNum);
                if (itemCheck !== null && itemCheck !== undefined) {
                  if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.serialNum === itemCheck.serialNum && (moment(itemX.memberDate)).format('DD-MM-YYYY') === (moment(itemtoAdd.memberDate)).format('DD-MM-YYYY')) {
                    itemX.quantity = quantity;
                    itemX.phone = itemCheck.phone;
                    itemX.name = itemCheck.name;

                    isReplace = true;
                  }
                  else {

                  }
                }


              });
              if (isReplace === false) {

                a.lineItems.forEach(itemMember => {
                  // debugger;
                  itemMember.id = itemtoAdd.id;
                  itemMember.uom = itemtoAdd.uom;
                  itemMember.price = itemtoAdd.price;
                  itemMember.barcode = itemtoAdd.barcode;
                  itemMember.slocId = itemtoAdd.slocId;
                  itemMember.customField1 = itemtoAdd.customField1;
                  itemMember.customField2 = itemtoAdd.customField2;
                  if (itemtoAdd.customField2 !== null && itemtoAdd.customField2 !== undefined) {
                    itemMember.memberValue = itemtoAdd.customField2 == null ? 1 : parseFloat(itemtoAdd.customField2);
                  }

                  itemMember.quantity = 1;
                  itemMember.startDate = itemtoAdd.memberDate;
                  itemMember.memberDate = itemtoAdd.memberDate;
                  itemMember.phone = itemMember.phone;
                  itemMember.name = itemMember.name;
                  var date = new Date(new Date(itemMember.startDate).setMonth(new Date(itemMember.startDate).getMonth() + (itemMember.memberValue * parseInt(itemMember.quantity.toString()))));
                  itemMember.endDate = date;
                  items[index].lineItems.push(itemMember);
                });
              }
              items[index].quantity = 0;
              items[index].lineTotal = 0;
              // debugger;
              items[index].lineItems.forEach(itemX => {
                // debugger;

                itemX.quantity = itemX.quantity;//* itemCapa.capacityValue;
                itemX.startDate = itemX.memberDate;
                if (itemX.customField2 !== null && itemX.customField2 !== undefined) {
                  itemX.memberValue = itemX.customField2 == null ? 1 : parseFloat(itemX.customField2);
                }
                itemX.phone = itemX.phone;
                itemX.name = itemX.name;
                var date = new Date(new Date(itemX.startDate).setMonth(new Date(itemX.startDate).getMonth() + (itemX.memberValue * parseInt(itemX.quantity.toString()))));
                itemX.endDate = date;
                items[index].quantity += parseFloat(itemX.quantity.toString());
                // if(itemX.memberValue!==undefined && itemX.memberValue!==null)
                // {

                // }

              });

              // items[index].lineTotal = items[index].quantity * items[index].price;
              let lineTotalCal = parseFloat(items[index].quantity.toString()) * parseFloat(items[index].price.toString());

              // let typeRounding = this.getRoundingTypeStore();
              // if(typeRounding!==null && typeRounding!==undefined)
              // {
              //   if(typeRounding?.roundingMethod!==null && typeRounding?.roundingMethod!==undefined && typeRounding?.roundingMethod!=='')
              //   {
              //     lineTotalCal = this.authService.roundingValue(lineTotalCal, typeRounding?.roundingMethod);
              //   }
              // } 
              items[index].lineTotal = lineTotalCal;
              if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                items[index].price = this.authService.roundingAmount(items[index].price);
                items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
              }
              if (basket.salesType.toLowerCase() === "exchange" || basket.salesType.toLowerCase() === "ex") {
                items[index].promotionLineTotal = items[index].lineTotal;

              }


              // itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
              // // debugger;

            }
            else {


              if (itemtoAdd.isSerial !== null && itemtoAdd.isSerial !== undefined && itemtoAdd.isSerial.toString() === 'true') {
                itemtoAdd.isSerial = true;
              }
              else {
                itemtoAdd.isSerial = false;
              }
              if (itemtoAdd.isVoucher !== null && itemtoAdd.isVoucher !== undefined && itemtoAdd.isVoucher.toString() === 'true') {
                itemtoAdd.isVoucher = true;
              }
              else {
                itemtoAdd.isVoucher = false;
              }
              if (itemtoAdd.isBOM !== null && itemtoAdd.isBOM !== undefined && itemtoAdd.isBOM.toString() === 'true') {
                itemtoAdd.isBOM = true;
              }
              else {
                itemtoAdd.isBOM = false;
              }

              if (items[index].isSerial === true || items[index].isVoucher === true) {
                items[index].quantity = quantity;
              }
              else {

                items[index].quantity += quantity;
                if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1?.toLowerCase() === "tp" || itemtoAdd?.customField1?.toLowerCase() === "bp" || itemtoAdd?.customField1.toLowerCase() === "pn")) {
                  // items[index].quantity += quantity;
                  // items[index].lineTotal =items[index].quantity * items[index].price ;
                  let lineTotalCal = parseFloat(items[index].quantity.toString()) * parseFloat(items[index].price.toString());
                  // let typeRounding = this.getRoundingTypeStore();
                  // if(typeRounding!==null && typeRounding!==undefined)
                  // {
                  //   if(typeRounding?.roundingMethod!==null && typeRounding?.roundingMethod!==undefined && typeRounding?.roundingMethod!=='')
                  //   {
                  //     lineTotalCal = this.authService.roundingValue(lineTotalCal, typeRounding?.roundingMethod);
                  //   }
                  // } 
                  items[index].lineTotal = lineTotalCal;
                  if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                    items[index].price = this.authService.roundingAmount(items[index].price);
                    items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
                  }
                  items[index].promotionLineTotal = items[index].lineTotal;
                  items[index].promotionUnitPrice = items[index].price;
                }
                if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex" || basket.salesType?.toLowerCase() === "return") {
                  items[index].promotionPriceAfDis = itemtoAdd.promotionPriceAfDis;
                  // items[index].promotionDisAmt =  itemtoAdd.discountValue * items[index].quantity;
                  let tempDis = itemtoAdd.price - itemtoAdd.promotionPriceAfDis;
                  if (itemtoAdd.discountType === "Discount Amount") {
                    items[index].discountValue = tempDis * items[index].quantity;
                  }
                  items[index].promotionDisAmt = tempDis * items[index].quantity;

                  // items[index].lineTotal =  items[index].quantity * itemtoAdd.price;
                  let lineTotalCal = parseFloat(items[index].quantity.toString()) * parseFloat(itemtoAdd.price.toString());

                  // let typeRounding = this.getRoundingTypeStore();
                  // if(typeRounding!==null && typeRounding!==undefined)
                  // {
                  //   if(typeRounding?.roundingMethod!==null && typeRounding?.roundingMethod!==undefined && typeRounding?.roundingMethod!=='')
                  //   {
                  //     lineTotalCal = this.authService.roundingValue(lineTotalCal, typeRounding?.roundingMethod);
                  //   }
                  // } 
                  items[index].lineTotal = lineTotalCal;
                  if (items[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                    items[index].price = this.authService.roundingAmount(items[index].price);
                    items[index].lineTotal = this.authService.roundingAmount(items[index].quantity * items[index].price);
                  }
                  items[index].promotionLineTotal = items[index].quantity * itemtoAdd.promotionPriceAfDis;//itemtoAdd.price;
                }

                debugger;

                if (items[index].isBOM) {
                  items[index].lineItems.forEach((item) => {
                    // item.quantity += quantity; 

                    item.lineTotal = item.quantity * items[index].quantity;
                  })
                }

              }
              if (itemtoAdd.isCapacity === true) {
                let a = Object.assign({}, itemtoAdd);
                let isReplace = false;
                items[index].lineItems.forEach(itemX => {
                  debugger

                  if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.storeAreaId === itemtoAdd.storeAreaId && itemX.timeFrameId === itemtoAdd.timeFrameId && itemX.appointmentDate === itemtoAdd.appointmentDate) {
                    itemX.quantity = itemtoAdd.quantity * itemtoAdd.capacityValue;
                    // items[index].quantity+=itemX.quantity;
                    isReplace = true;
                  }

                });
                if (isReplace === false) {
                  items[index].lineItems.push(a);
                }
                if (isReplace) {
                  if (indexpromo !== -1) {
                    items[indexpromo].lineItems.forEach((itemX, i) => {
                      // debugger
                      if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.storeAreaId === itemtoAdd.storeAreaId && itemX.timeFrameId === itemtoAdd.timeFrameId && itemX.appointmentDate === itemtoAdd.appointmentDate) {
                        items[indexpromo].lineItems.splice(i, 1)
                      }
                    })
                    items[indexpromo].quantity = 0;
                    items[indexpromo].lineTotal = 0;
                    items[indexpromo].lineItems.forEach(itemX => {
                      // // debugger;
                      items[indexpromo].quantity = parseInt(items[indexpromo].quantity.toString()) + parseInt(itemX.quantity.toString());


                    });

                    items[index].lineTotal = items[index].quantity * items[index].price;

                  }
                }
                items[index].quantity = 0;
                items[index].lineTotal = 0;
                items[index].lineItems.forEach(itemX => {
                  // // debugger;
                  items[index].quantity = parseInt(items[index].quantity.toString()) + parseInt(itemX.quantity.toString());


                });

                items[index].lineTotal = items[index].quantity * items[index].price;
                if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
                  items[index].promotionLineTotal = items[index].lineTotal;

                }


                // itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
                // // debugger;
                // // debugger;
              }
            }
          }

        }

      }
      // // debugger;
      let LineNumber = 1;
      items.forEach(item => {
        item.lineNum = LineNumber;
        LineNumber++;
      });

      if (basket.items?.length === 1) {
        // basket.startTime = ;
        this.changeDateTime(new Date());
      }
      console.log('items', items);
      return items;
    }

  }
  private addOrupdateItemOnlyPromotion(
    items: IBasketItem[],
    itemtoAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    // // debugger;
    // console.log(items);
    // // debugger;
    let basket = this.getCurrentBasket();
    const index = items.findIndex((i) => i.id === itemtoAdd.id && i.uom === itemtoAdd.uom && i.barcode === itemtoAdd.barcode && i.promotionIsPromo === '1');
    if (index === -1) {

      itemtoAdd.quantity = quantity;
      // itemtoAdd.promotion = itemtoAdd.price

      if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
        itemtoAdd.promotionPriceAfDis = itemtoAdd.price;
        itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
      }

      itemtoAdd.lineTotal = quantity * itemtoAdd.price;

      if (itemtoAdd.isSerial !== null && itemtoAdd.isSerial !== undefined && itemtoAdd.isSerial.toString() === 'true') {
        itemtoAdd.isSerial = true;
      }
      else {
        itemtoAdd.isSerial = false;
      }
      if (itemtoAdd.isVoucher !== null && itemtoAdd.isVoucher !== undefined && itemtoAdd.isVoucher.toString() === 'true') {
        itemtoAdd.isVoucher = true;
      }
      else {
        itemtoAdd.isVoucher = false;
      }

      if (itemtoAdd.isBOM !== null && itemtoAdd.isBOM !== undefined && itemtoAdd.isBOM.toString() === 'true') {
        itemtoAdd.isBOM = true;
      }
      else {
        itemtoAdd.isBOM = false;
      }
      if (itemtoAdd.isCapacity === true) {

        itemtoAdd.lineItems.push(itemtoAdd);
        var newArray = [];
        itemtoAdd.lineItems.forEach(val => { let a = val; a.lineItems = []; newArray.push(Object.assign({}, a)) });
        itemtoAdd.lineItems = [];
        itemtoAdd.lineItems = newArray;
        itemtoAdd.lineItems.forEach(itemCapa => {
          if (itemCapa.capacityValue === null || itemCapa.capacityValue === undefined) {
            itemCapa.capacityValue = 1;
          }
          itemCapa.quantity = itemCapa.quantity * itemCapa.capacityValue;
        });

      }
      if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1?.toLowerCase() === "member" || itemtoAdd?.customField1?.toLowerCase() === "class")) {
        itemtoAdd.quantity = quantity;
        itemtoAdd.lineItems.push(itemtoAdd);
        var newArray = [];
        itemtoAdd.lineItems.forEach(val => { let a = val; a.lineItems = []; newArray.push(Object.assign({}, a)) });
        itemtoAdd.lineItems = [];
        itemtoAdd.lineItems = newArray;
        itemtoAdd.lineItems.forEach(itemMember => {
          if (itemMember.customField2 !== null && itemMember.customField2 !== undefined) {
            itemMember.memberValue = itemMember.customField2 == null ? 1 : parseFloat(itemMember.customField2);
          }
          // // debugger;
          itemMember.quantity = itemMember.quantity;//* itemCapa.capacityValue;
          itemMember.startDate = itemMember.memberDate;
          var date = new Date(new Date(itemMember.startDate).setMonth(new Date(itemMember.startDate).getMonth() + (itemMember.memberValue * parseInt(itemMember.quantity.toString()))));
          itemMember.endDate = date;
        });
      }
      if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && itemtoAdd?.customField1?.toLowerCase() === "card") {

        itemtoAdd.lineItems.push(itemtoAdd);
        var newArray = [];
        itemtoAdd.lineItems.forEach(val => { let a = val; a.lineItems = []; newArray.push(Object.assign({}, a)) });
        itemtoAdd.lineItems = [];
        itemtoAdd.lineItems = newArray;
        itemtoAdd.quantity = quantity;
        // itemtoAdd.lineItems.forEach(itemCapa => {
        //   // if(itemCapa.quantity===null || itemCapa.quantity===undefined)
        //   // {
        //   //   itemCapa.quantity=1;
        //   // }
        //   itemCapa.quantity = itemCapa.quantity * itemCapa.capacityValue;
        // });
      }
      // // debugger;
      // let newItem=Object.assign({}, itemtoAdd);
      items.push(itemtoAdd);

    } else {
      if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && itemtoAdd?.customField1?.toLowerCase() === "card") {
        let a = Object.assign({}, itemtoAdd);
        let isReplace = false;
        // // debugger;
        items[index].lineItems.forEach(itemX => {
          // // debugger;
          if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.prepaidCardNo === itemtoAdd.prepaidCardNo) {
            itemX.quantity = parseFloat(itemtoAdd.quantity.toString());

            // items[index].quantity+=itemX.quantity;
            isReplace = true;
          }

        });
        if (isReplace === false) {
          items[index].lineItems.push(a);
        }
        items[index].quantity = 0;
        items[index].lineTotal = 0;
        items[index].lineItems.forEach(itemX => {
          // // debugger;
          items[index].quantity += parseFloat(itemX.quantity.toString());
          // items[index].quantity = parseFloat(items[index].quantity.toString()) + parseFloat(itemX.quantity.toString());
        });
        items[index].lineTotal = parseFloat(items[index].quantity.toString()) * parseFloat(items[index].price.toString());

        if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
          items[index].promotionLineTotal = items[index].lineTotal;

        }
      }
      else {
        if (itemtoAdd.customField1 !== null && itemtoAdd?.customField1 !== undefined && (itemtoAdd?.customField1?.toLowerCase() === "member" || itemtoAdd?.customField1?.toLowerCase() === "class")) {
          let a = Object.assign({}, itemtoAdd);
          let isReplace = false;
          items[index].lineItems.forEach(itemX => {
            // // debugger;
            if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && (moment(itemX.memberDate)).format('DD-MM-YYYY') === (moment(itemtoAdd.memberDate)).format('DD-MM-YYYY')) {
              itemX.quantity = quantity;
              // itemX.memberValue= itemtoAdd.quantity ;
              // items[index].quantity+=itemX.quantity;
              isReplace = true;
            }
            else {
              {

              }
            }

          });
          if (isReplace === false) {
            // a.quantity = quantity;
            items[index].lineItems.push(a);

          }
          items[index].quantity = 0;
          items[index].lineTotal = 0;
          items[index].lineItems.forEach(itemX => {
            // debugger;
            itemX.quantity = itemX.quantity;//* itemCapa.capacityValue;
            itemX.startDate = itemX.memberDate;
            if (itemX.customField2 !== null && itemX.customField2 !== undefined) {
              itemX.memberValue = itemX.customField2 == null ? 1 : parseFloat(itemX.customField2);
            }
            var date = new Date(new Date(itemX.startDate).setMonth(new Date(itemX.startDate).getMonth() + (itemX.memberValue * parseInt(itemX.quantity.toString()))));
            itemX.endDate = date;
            items[index].quantity += parseFloat(itemX.quantity.toString());
            // if(itemX.memberValue!==undefined && itemX.memberValue!==null)
            // {

            // }

          });

          items[index].lineTotal = items[index].quantity * items[index].price;

          if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
            items[index].promotionLineTotal = items[index].lineTotal;

          }


          // itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
          // // debugger;

        }
        else {
          if (itemtoAdd.isSerial !== null && itemtoAdd.isSerial !== undefined && itemtoAdd.isSerial.toString() === 'true') {
            itemtoAdd.isSerial = true;
          }
          else {
            itemtoAdd.isSerial = false;
          }
          if (itemtoAdd.isVoucher !== null && itemtoAdd.isVoucher !== undefined && itemtoAdd.isVoucher.toString() === 'true') {
            itemtoAdd.isVoucher = true;
          }
          else {
            itemtoAdd.isVoucher = false;
          }
          if (itemtoAdd.isBOM !== null && itemtoAdd.isBOM !== undefined && itemtoAdd.isBOM.toString() === 'true') {
            itemtoAdd.isBOM = true;
          }
          else {
            itemtoAdd.isBOM = false;
          }

          if (items[index].isSerial === true || items[index].isVoucher === true) {
            items[index].quantity = quantity;
          }
          else {

            items[index].quantity += quantity;
            if (items[index].isBOM) {
              items[index].lineItems.forEach((item) => {
                item.quantity += quantity;
              })
            }

          }
          if (itemtoAdd.isCapacity === true) {
            let a = Object.assign({}, itemtoAdd);
            let isReplace = false;
            items[index].lineItems.forEach(itemX => {

              if (itemX.id === itemtoAdd.id && itemX.uom === itemtoAdd.uom && itemX.barcode === itemtoAdd.barcode && itemX.storeAreaId === itemtoAdd.storeAreaId && itemX.timeFrameId === itemtoAdd.timeFrameId && itemX.appointmentDate === itemtoAdd.appointmentDate) {
                itemX.quantity = itemtoAdd.quantity * itemtoAdd.capacityValue;
                // items[index].quantity+=itemX.quantity;
                isReplace = true;
              }

            });
            if (isReplace === false) {
              items[index].lineItems.push(a);
            }
            items[index].quantity = 0;
            items[index].lineTotal = 0;
            items[index].lineItems.forEach(itemX => {
              // // debugger;
              items[index].quantity = parseInt(items[index].quantity.toString()) + parseInt(itemX.quantity.toString());


            });
            items[index].lineTotal = items[index].quantity * items[index].price;
            if (basket.salesType?.toLowerCase() === "exchange" || basket.salesType?.toLowerCase() === "ex") {
              items[index].promotionLineTotal = items[index].lineTotal;

            }


            // itemtoAdd.promotionLineTotal = quantity * itemtoAdd.price;
            // // debugger;
            // // debugger;
          }
        }
      }



    }
    return items;
  }
  addVoucherToBasket(voucher) {
    // // debugger;
    let basket = this.getCurrentBasket();
    if (basket.voucherApply !== null && basket.voucherApply !== undefined && basket.voucherApply.length > 0) {
      basket.voucherApply.push(voucher);
    }
    else {
      basket.voucherApply = [];
      basket.voucherApply.push(voucher);
    }
    this.setBasket(basket);
  }
  addPaymentToBasket(payment: Payment, paymentCharged = 0, voucher?, toFirst?) {
    //  // debugger;
    const paymentAdd: IBasketPayment = this.mapPaymenttoBasket(
      payment,
      paymentCharged
    );

    let basket = this.getCurrentBasket();

    // debugger;
    if (paymentAdd.id !== null) {
      basket.payments = this.addOrUpdatePayment(
        basket.payments,
        paymentAdd,
        paymentCharged,
        toFirst
      );
      // // debugger;
      this.refreshPayment(basket.payments); //2020/12/08
      // // debugger;
      // this.setBasket(basket);
      if (voucher !== null && voucher !== undefined) {
        if (basket.voucherApply !== null && basket.voucherApply !== undefined && basket.voucherApply.length > 0) {
          let voucherpartner = voucher?.voucherPartner;
          if (voucherpartner !== null && voucherpartner !== undefined && voucherpartner?.length > 0) {
            if (voucherpartner?.toLowerCase() === 'tera') {
              let voucherInApply = basket.voucherApply.filter(x => x.code === voucher.code);
              if (voucherInApply !== null && voucherInApply !== undefined) {
                basket.voucherApply.push(voucher);
              }
            }

          }
          else {
            let voucherInApply = basket.voucherApply.filter(x => x.discount_code === voucher.discount_code);
            if (voucherInApply !== null && voucherInApply !== undefined) {
              basket.voucherApply.push(voucher);
            }
          }

        }
        else {
          basket.voucherApply = [];

          basket.voucherApply.push(voucher);
        }
      }
      this.setBasket(basket);
      if (payment.currency !== null && payment.currency !== null && payment.currency !== '') {
        this.calculateCurrencyBasket(payment.currency, payment.rate);

      }

    }
    // this.calculateBasket();

    // console.log(basket.payments);
  }
  addPaymentBasketToBasket(paymentAdd: IBasketPayment, paymentCharged = 0, voucher?) {
    //  // debugger;
    // const paymentAdd: IBasketPayment = this.mapPaymenttoBasket(
    //   payment,
    //   paymentCharged
    // );

    let basket = this.getCurrentBasket();

    // debugger;
    if (paymentAdd.id !== null) {
      basket.payments = this.addOrUpdatePayment(
        basket.payments,
        paymentAdd,
        paymentCharged
      );
      // // debugger;
      this.refreshPayment(basket.payments); //2020/12/08
      // // debugger;
      // this.setBasket(basket);
      if (voucher !== null && voucher !== undefined) {
        if (basket.voucherApply !== null && basket.voucherApply !== undefined && basket.voucherApply.length > 0) {
          let voucherInApply = basket.voucherApply.filter(x => x.discount_code === voucher.discount_code);
          if (voucherInApply !== null && voucherInApply !== undefined) {
            basket.voucherApply.push(voucher);
          }

        }
        else {
          basket.voucherApply = [];
          basket.voucherApply.push(voucher);
        }
      }
      this.setBasket(basket);
      if (paymentAdd.currency !== null && paymentAdd.currency !== null && paymentAdd.currency !== '') {
        this.calculateCurrencyBasket(paymentAdd.currency, paymentAdd.rate);
      }

    }
    // this.calculateBasket();

    // console.log(basket.payments);
  }

  addOrUpdatePayment(
    payments: IBasketPayment[],
    paymenttoAdd: IBasketPayment,
    paymentTotal: number,
    toFirst?: boolean
  ): IBasketPayment[] {

    // console.log(payments);
    debugger;
    this.authService.setOrderLog("Order", "Add Or Update Payment", "", paymenttoAdd?.id?.toString() ?? '',
      paymenttoAdd?.refNum ?? '', paymenttoAdd?.customF1 ?? '', paymenttoAdd?.cardHolderName?.toString() ?? '', paymenttoAdd?.cardNo?.toString() ?? '', paymenttoAdd?.forfeitCode?.toString() ?? '', paymenttoAdd?.paymentTotal?.toString() ?? '', paymenttoAdd?.paymentCharged?.toString() ?? '', paymenttoAdd?.shortName?.toString() ?? '', paymentTotal?.toString() ?? '');
    const totalBasket = this.basketTotal.value;
    let basket = this.getCurrentBasket();
    let storeCurrency = this.authService.getStoreCurrency();
    let defCurrncy = this.authService.storeSelected().currencyCode;
    // && i.paymentType?.toString() === paymenttoAdd.paymentType?.toString()
    const index = payments.findIndex((i) => i.id === paymenttoAdd.id && i.lineNum === paymenttoAdd.lineNum && i.currency === paymenttoAdd.currency);
    // debugger;
    if (index === -1) {
      // debugger;
      paymenttoAdd.paymentTotal = paymentTotal;

      if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {
        let type = storeCurrency.find(x => x.currency === paymenttoAdd.currency);
        paymenttoAdd.paymentCharged = totalBasket.total - totalBasket.totalAmount - this.authService.roundingValue(paymenttoAdd.paymentTotal * (paymenttoAdd.rate ?? 1), type?.roundingMethod);
      }
      else {
        paymenttoAdd.paymentCharged = totalBasket.total - totalBasket.totalAmount;
      }

      // paymenttoAdd.paymentMode = basket.paymentMode;

      if (toFirst === true) {
        payments.unshift(paymenttoAdd);
        this.refreshPayment(payments);
      }
      else {
        payments.push(paymenttoAdd);
      }
    } else {
      // debugger;
      payments[index].paymentTotal = paymentTotal;
      // Tạm đóng lại để chạy Grabpay
      if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {
        let type = storeCurrency.find(x => x.currency === paymenttoAdd.currency);

        if (payments[index].currency === null || payments[index].currency === undefined || payments[index].currency === '') {
          payments[index].currency = defCurrncy;
        }
        if (payments[index].paymentTotal != totalBasket.total && payments[index]?.currency !== defCurrncy) {
          payments[index].paymentCharged = totalBasket.total - this.authService.roundingValue(payments[index].paymentTotal * (paymenttoAdd.rate ?? 1), type?.roundingMethod);

        }
      }

      // // debugger;
      // if(totalBasket.amountLeft - paymentTotal > 0)
      // {
      //   payments[index].paymentCharged = paymentTotal;
      // }
      // else{
      //   payments[index].paymentCharged = totalBasket.amountLeft;
      // }
    }

    return payments;
  }

  public refreshPayment(
    payments: IBasketPayment[],
  ): IBasketPayment[] {
    // // debugger;
    // console.log(payments);
    const totalBasket = this.basketTotal.getValue();
    let reduce = 0;
    // const index = payments.findIndex((i) => i.id === paymenttoAdd.id);
    let sttNum = 0;
    let storeCurrency = this.authService.getStoreCurrency()
    payments.forEach(payment => {
      sttNum++;
      // // debugger;
      payment.lineNum = sttNum;
      payment.paymentTotal = payment.paymentTotal;
      payment.paymentCharged = totalBasket.total - reduce;
      payment.rate = payment.rate ?? 1;
      if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {
        let type = storeCurrency.find(x => x.currency === payment.currency);
        // this.authService.roundingValue(, type?.roundingMethod)
        reduce += payment.paymentTotal * (payment.rate ?? 1);
      }
      else {
        reduce += payment.paymentTotal;
      }

    });

    return payments;
  }

  removePayment(payment: IBasketPayment) {
    debugger;
    const basket = this.getCurrentBasket();

    if (basket.payments.some((x) => x.id === payment.id && x.lineNum === payment.lineNum)) {
      let newPM = basket.payments.find(x => x.id === payment.id && x.lineNum === payment.lineNum);
      debugger;
      if (newPM !== null && newPM !== undefined && (newPM?.id === 'TapTap' || newPM?.paymentType?.toLowerCase() === 'v')) {
        basket.voucherApply = basket.voucherApply.filter(x => x.voucher_code !== newPM.refNum);
      }
      basket.payments = basket.payments.filter(x => x.lineNum !== payment.lineNum); //x.id !== payment.id &&
      // let paymentCurrent = basket.payments;
      // basket.payments = null;
      // this.setBasket(basket);
      if (basket.payments.length > 0) {
        // // debugger;
        this.setBasket(basket);
      }
      // // debugger;
      this.refreshPayment(basket.payments);
      // paymentCurrent.forEach(async payment => {
      //   await this.addOrUpdatePayment(
      //     basket.payments,
      //     payment,
      //     payment.paymentCharged
      //   );
      // });
      // this.setBasket(basket);


      //  else{
      //     this.deleteBasket(basket);
      //  }
    }
    this.setBasket(basket);
    this.calculateBasket();

    if (payment.currency !== null && payment.currency !== null && payment.currency !== '') {
      this.calculateCurrencyBasket(payment.currency, payment.rate);
      this.calculateCurrencyBasket('', 1);
    }

  }

  updateDiscountItemLine(itemsToUpdate: IBasketItem, type: string,
    amount: number, AllBilType: string, AllBillValue: number, isKeyup): ResultModel {

    this.result = new ResultModel();
    const basket = this.getCurrentBasket();
    debugger;
    this.authService.setOrderLog("Order", "Update Discount Item ", "", "Item code: " + itemsToUpdate?.id + ' value: ' + amount);
    const index = basket.promotionItems.findIndex(
      (i) => i.id === itemsToUpdate.id && i.uom === itemsToUpdate.uom && i.lineNum === itemsToUpdate.lineNum && i.barcode === itemsToUpdate.barcode && i.promotionPromoCode === itemsToUpdate.promotionPromoCode
    );
    if (index === -1) {
      // paymenttoAdd.paymentTotal = paymentTotal;
      // paymenttoAdd.paymentCharged = 0;
      // payments.push(paymenttoAdd);
    }
    else {
      // // debugger;

      // var history=  Object.assign({}, basket.promotionItems[index]);

      // history.historyNo = basket.promotionItems[index].discountHistory.length ++;
      if (amount != basket.promotionItems[index].discountValue) {
        basket.promotionItems[index].promotionPriceAfDis = basket.promotionItems[index].price;
      }
      let linetotal = basket.promotionItems[index].quantity * basket.promotionItems[index].price;
      if (basket.promotionItems[index]?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
        let price = this.authService.roundingAmount(parseFloat(basket.promotionItems[index].price.toString()));
        basket.promotionItems[index].lineTotal = this.authService.roundingAmount(parseFloat(basket.promotionItems[index].quantity.toString()) * price);
      }
      let promotionPriceAfDis = basket.promotionItems[index].promotionPriceAfDis;
      let price = promotionPriceAfDis === null || promotionPriceAfDis === undefined ? basket.promotionItems[index].price : promotionPriceAfDis;
      let promotionlinetotal = basket.promotionItems[index].quantity * price;



      if (type === null) {
        type = 'Discount Percent';
      }
      // debugger;
      if (type === 'Discount Percent') {

        if (linetotal - (amount * linetotal) / 100 >= 0) {
          basket.promotionItems[index].lineTotal = linetotal;//linetotal - (amount * linetotal) / 100;

          if (basket.clearPromotion === true) {

          }
          else {

          }
          basket.promotionItems[index].discountValue = amount;
          basket.promotionItems[index].discountType = type;
          basket.promotionItems[index].type = type;


          basket.promotionItems[index].promotionType = null;
          basket.promotionItems[index].promotionPromoCode = null;
          basket.promotionItems[index].promotionDiscountPercent = null;
          basket.promotionItems[index].promotionPriceAfDis = null;
          basket.promotionItems[index].promotionDisAmt = null;
          basket.promotionItems[index].promotionDisPrcnt = null;

          let promDisAmount = (amount * linetotal) / 100;
          basket.promotionItems[index].promotionDisAmt = this.authService.roundingAmount(promDisAmount);//  this.authService.roundingValue( (amount * linetotal) / 100, "RoundUp" , 2); ;// basket.promotionItems[index].lineTotal -  basket.promotionItems[index].promotionLineTotal; 
          basket.promotionItems[index].promotionLineTotal = linetotal - basket.promotionItems[index].promotionDisAmt;
          basket.promotionItems[index].promotionDisPrcnt = amount;
          // basket.promotionItems[index].promoType = type;

          // line.promoPercent= itemCapacity.promotionDiscountPercent;
          // line.promoPrice = itemCapacity.promotionPriceAfDis;
          // line.promoLineTotal = itemCapacity.promotionLineTotal;

          // line.promoDisAmt = itemCapacity.promotionDisAmt;
          // line.discountRate = itemCapacity.promotionDiscountPercent;
          // line.discountAmt = itemCapacity.promotionDisAmt;
          // line.discountType = line.promoType;
        }
        else {
          this.result.isSuccess = false;
          this.result.errorMessage = 'discount value  more than value of line';
          return this.result;
        }
      }
      if (type === 'Discount Amount') {

        // discountTotal = billTotal -(billTotal -  amount)  ; - amount
        if (linetotal - amount >= 0) {

          basket.promotionItems[index].lineTotal = linetotal;
          basket.promotionItems[index].promotionLineTotal = linetotal - amount;
          basket.promotionItems[index].discountValue = amount;
          basket.promotionItems[index].discountType = type;
          basket.promotionItems[index].type = type;

          basket.promotionItems[index].promotionType = null;
          basket.promotionItems[index].promotionPromoCode = null;
          basket.promotionItems[index].promotionDiscountPercent = null;
          basket.promotionItems[index].promotionPriceAfDis = null;
          basket.promotionItems[index].promotionDisAmt = null;
          basket.promotionItems[index].promotionDisPrcnt = null;

          basket.promotionItems[index].promotionDisAmt = amount;
          basket.promotionItems[index].promotionDisPrcnt = amount * 100 / basket.promotionItems[index].lineTotal;


        } else {
          // basket.promotionItems[index].discountValue =  basket.promotionItems[index].discountValue ;

          this.result.isSuccess = false;
          this.result.errorMessage = 'Discount Value more than value of line';
          return this.result;
        }

      }
    }
    // // debugger;

    if (AllBillValue == null || AllBillValue == undefined || AllBillValue.toString() == "" || AllBillValue.toString() == "NaN" || AllBillValue.toString() == "undefined") {
      AllBillValue = 0;
    }
    // // debugger;
    this.discountCalculateBasket(AllBilType, AllBillValue);
    this.result.isSuccess = true;
    return this.result;
    //  return payments;
  }
  //
  // private logger = new Observable<boolean>((observer: Subscriber<IBasket>) => {
  //   const basket = JSON.parse(localStorage.getItem("basket"));
  //   observer.next(basket);
  // });
  // private basket = new Subject<IBasket>();
  getBasketById(id): Observable<IBasket> {
    //  // debugger;
    // let subject = new Subject();


    // const basket = JSON.parse(localStorage.getItem("basket"));
    // if(basket!==null && basket !== undefined)
    // {
    //   this.basketSource.next(basket);
    //   this.calculateBasket();

    // }
    // return this.basketSource.asObservable();
    // return basket;
    // subject.next(IBasket);
    // return subject;
    return this.http.get<IBasket>(this.baseUrl + 'basket/GetBasketId?id=' + id);
  }

  createBasket(customer: MCustomer): IBasket {
    // // debugger;
    const basket = new Basket();

    localStorage.setItem('basket_id', basket.id);
    this.authService.setOrderLog("Order", "Create Basket", "Success", basket?.id);
    if (customer != null) {
      basket.customer = customer;// this.customer.getValue();
      this.authService.setOrderLog("Order", "Create Basket With Customer", "Success", customer?.customerId);
    }
    return basket;
  }
  replaceQuantityItemtoBasket(item: IBasketItem, quantity: number): IBasketItem {
    let newItem = item;
    newItem.quantity = quantity;
    newItem.lineTotal = newItem.price * quantity;
    newItem.promotionLineTotal = newItem.price * quantity;
    if (newItem?.weightScaleBarcode?.length > 0 && this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
      let price = this.authService.roundingAmount(parseFloat(newItem.price.toString()));
      newItem.lineTotal = this.authService.roundingAmount(quantity * price);
      newItem.promotionLineTotal = this.authService.roundingAmount(quantity * price);

    }
    return newItem;
  }
  mapProductItemtoBasket(item: ItemViewModel, quantity: number): IBasketItem {
    return {

      id: item.itemCode,
      isNegative: false,
      allowSalesNegative: item.allowSalesNegative,
      responseTime: item.responseTime,
      isLock: false,
      productName: item.itemName,
      price: item.defaultPrice,
      pictureUrl: item.imageUrl,
      bookletNo: '',
      quantity,
      uom: item.uomCode,
      barcode: item.barCode,
      brand: item.mcid,
      isFixedQty: item.isFixedQty ?? false,
      defaultFixedQty: item.defaultFixedQty ?? null,
      type: '',
      lineTotal: item.defaultPrice * quantity,
      promotionLineTotal: item.defaultPrice * quantity,
      promotionUnitPrice: item.defaultPrice,
      promotionDisAmt: 0,
      promotionDiscountPercent: 0,
      promotionDisPrcnt: 0,
      discountValue: 0,
      discountType: '',
      note: '',
      slocId: item.slocId,
      isBOMLine: false,
      isBOM: item.isBom,
      isVoucher: item.isVoucher,
      isSerial: item.isSerial,
      expDate: null,
      serialNum: '',
      isCapacity: item.capacityValue > 0 ? true : false,
      capacityValue: item.capacityValue,
      storeAreaId: '',
      timeFrameId: '',
      appointmentDate: null,
      applyType: '',
      refTransId: '',
      currency: '',
      productId: item.productId,
      isPriceTime: item.isPriceTime,
      itemCategory_1: item.itemCategory_1,
      itemCategory_2: item.itemCategory_2,
      itemCategory_3: item.itemCategory_3,
      customField1: item.customField1,
      customField2: item.customField2,
      customField3: item.customField3,
      customField4: item.customField4,
      customField5: item.customField5,
      customField6: item.customField6,
      customField7: item.customField7,
      customField8: item.customField8,
      customField9: item.customField9,
      customField10: item.customField10,
      custom1: item.custom1,
      custom2: item.custom2,
      custom3: item.custom3,
      custom4: item.custom4,
      custom5: item.custom5,
      rejectPayType: item.rejectPayType,
      isWeightScaleItem: item.isWeightScaleItem,
      weightScaleBarcode: item.weightScaleBarcode,
      taxAmt: item?.taxAmt,
      salesTaxCode: item?.salesTaxCode,
      salesTaxRate: item?.salesTaxRate,
      purchaseTaxCode: item?.purchaseTaxCode,
      purchaseTaxRate: item?.purchaseTaxRate,
      baseLine: item?.baseLine,
      baseTransId: item?.baseTransId,
      mcid: item?.mcid,
      itemGroupId: item?.itemGroupId,
      prefix: item?.prefix,
      name: item?.name,
      phone: item?.phone,
      priceListId: item?.priceListId,
      mappingCode: item?.mappingCode,
      lineItems: [],
      discountHistory: [],
      staffs: [],
      isManualDiscount: null,
      priceListName: item?.priceListName,
      isHighLight: item?.isHighLight,
    };
  }
  mapPrmotionItemtoBasket(sourceItem: IBasketItem, promotionItem: PromotionDocumentLine): IBasketItem {
    // debugger;
    let storeCurrency = this.authService.getStoreCurrency();
    let type = "";
    if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {
      let currency = this.authService.storeSelected().currencyCode;
      type = storeCurrency.find(x => x.currency === currency)?.roundingMethod;

    }
    if (sourceItem !== null && sourceItem !== undefined) {

      // if(promotionItem.promoType =='Fixed Quantity')
      // {
      //   // let n = 0;
      //   // let itemnew = [];
      //   // sourceItem.lineItems.forEach(e => {
      //   //   debugger;
      //   //   n = n +e.quantity;

      //   //   if(n >promotionItem.quantity)
      //   //   {
      //   //     if(n <promotionItem.quantity+e.quantity)
      //   //     {
      //   //       e.quantity = promotionItem.quantity+e.quantity-n;

      //   //       itemnew.push(Object.assign({}, 2));
      //   //     }
      //   //   }
      //   //   else{
      //   //     // e.quantity = item.quantity+e.quantity-n;

      //   //     itemnew.push(e);
      //   //   }
      //   // });
      //   return {
      //     // lineNum: sourceItem.lineNum,
      //     id: promotionItem.itemCode,
      //     isNegative: sourceItem.isNegative,
      //     isLock: sourceItem.isLock,
      //     productName: sourceItem.productName,
      //     price: promotionItem.unitPrice,
      //     pictureUrl: '',
      //     quantity: promotionItem.quantity,
      //     uom: promotionItem.uoMCode,
      //     barcode: promotionItem.barCode,
      //     brand: promotionItem.itemGroup,
      //     type: '',
      //     slocId: sourceItem.slocId,
      //     lineTotal: promotionItem.promotionUnitPrice * promotionItem.quantity,
      //     discountValue: 0,
      //     expDate: sourceItem?.expDate,
      //     discountType: '',
      //     note: sourceItem.note,
      //     productId: sourceItem.productId,
      //     isBOMLine: sourceItem.isBOMLine,
      //     isPriceTime: sourceItem.isPriceTime,
      //     isWeightScaleItem: sourceItem.isWeightScaleItem,
      //     weightScaleBarcode: sourceItem?.weightScaleBarcode,
      //     applyType: sourceItem.applyType,
      //     refTransId: sourceItem.refTransId,
      //     baseLine: sourceItem?.baseLine,
      //     baseTransId: sourceItem?.baseTransId,
      //     prepaidCardNo: sourceItem?.prepaidCardNo,
      //     isBOM: sourceItem.isBOM,
      //     isVoucher: sourceItem.isVoucher,
      //     isSerial: sourceItem.isSerial,
      //     serialNum: sourceItem.serialNum,//promotionItem,
      //     isCapacity: sourceItem.isCapacity,
      //     capacityValue: sourceItem.capacityValue,
      //     storeAreaId: sourceItem.storeAreaId,
      //     timeFrameId: sourceItem.timeFrameId,
      //     customField1: sourceItem.customField1,
      //     customField2: sourceItem.customField2,
      //     customField3: sourceItem.customField3,
      //     customField4: sourceItem.customField4,
      //     customField5: sourceItem.customField5,
      //     customField6: sourceItem.customField6,
      //     customField7: sourceItem.customField7,
      //     customField8: sourceItem.customField8,
      //     customField9: sourceItem.customField9,
      //     customField10: sourceItem.customField10,
      //     itemCategory_1: sourceItem.itemCategory_1,
      //     itemCategory_2: sourceItem.itemCategory_2,
      //     itemCategory_3: sourceItem.itemCategory_3,
      //     custom1: sourceItem.custom1,
      //     custom2: sourceItem.custom2,
      //     custom3: sourceItem.custom3,
      //     custom4: sourceItem.custom4,
      //     custom5: sourceItem.custom5,
      //     rejectPayType: sourceItem.rejectPayType,
      //     oriQty: sourceItem?.oriQty,
      //     startDate: sourceItem?.startDate,
      //     mcid: sourceItem?.mcid,
      //     itemGroupId: sourceItem?.itemGroupId,
      //     endDate: sourceItem?.endDate,
      //     openQty: sourceItem?.openQty,
      //     canRemove: sourceItem?.canRemove,
      //     appointmentDate: sourceItem.appointmentDate,
      //     currency: promotionItem.currency,
      //     taxAmt: sourceItem?.taxAmt,
      //     salesTaxCode: sourceItem?.salesTaxCode,
      //     salesTaxRate: sourceItem?.salesTaxRate,
      //     prefix: sourceItem?.prefix,
      //     name: sourceItem?.name,
      //     phone: sourceItem?.phone,
      //     priceListId: sourceItem?.priceListId,
      //     purchaseTaxCode: sourceItem?.purchaseTaxCode,
      //     purchaseTaxRate: sourceItem?.purchaseTaxRate,
      //     promotionType: promotionItem.promoType,
      //     promotionCollection: promotionItem.uCollection,
      //     promotionDisAmt: type === '' ?  promotionItem.uDisAmt : this.authService.roundingAmount(promotionItem.uDisAmt),// this.authService.roundingValue(promotionItem.uDisAmt, type),
      //     promotionDisPrcnt: this.authService.roundingAmount(promotionItem.uDisPrcnt),// promotionItem.uDisPrcnt,
      //     promotionDiscountPercent: this.authService.roundingAmount(promotionItem.discountPercent),//promotionItem.discountPercent,
      //     promotionIsPromo: promotionItem.uIsPromo,
      //     //  promotionItemGroup: promotionItem.
      //     promotionLineTotal: type === '' ?  promotionItem.lineTotal : promotionItem.lineTotal,//this.authService.roundingValue(promotionItem.lineTotal, type),
      //     promotionPriceAfDis: type === '' ? promotionItem.uPriceAfDis:  promotionItem.uPriceAfDis,//this.authService.roundingValue(promotionItem.uPriceAfDis, type),
      //     promotionPriceAfDisAndVat:  type === '' ? promotionItem.priceAfDisAndVat:  promotionItem.priceAfDisAndVat,//this.authService.roundingValue(promotionItem.priceAfDisAndVat, type),
      //     promotionPromoCode: promotionItem.uPromoCode,
      //     promotionPromoName: promotionItem.uPromoName,
      //     promotionRate: promotionItem.rate,
      //     promotionSchemaCode: promotionItem.uSchemaCode,
      //     promotionSchemaName: promotionItem.uSchemaName,
      //     promotionTotalAfDis:  type === '' ? promotionItem.uTotalAfDis:  promotionItem.uTotalAfDis,//this.authService.roundingValue(promotionItem.uTotalAfDis, type),
      //     promotionUnitPrice:  type === '' ? promotionItem.unitPrice:  promotionItem.unitPrice,//this.authService.roundingValue(promotionItem.unitPrice, type),
      //     promotionUoMCode: promotionItem.uoMCode,
      //     promotionUoMEntry: promotionItem.uoMEntry,
      //     promotionVatGroup: promotionItem.vatGroup,
      //     promotionVatPerPriceAfDis:  type === '' ? promotionItem.vatPerPriceAfDis: promotionItem.vatPerPriceAfDis,//this.authService.roundingValue(promotionItem.vatPerPriceAfDis, type),

      //     lineItems: [],
      //     discountHistory: []
      //   };
      // };
      // // debugger;
      return {
        // lineNum: sourceItem.lineNum,
        id: promotionItem.itemCode,
        isNegative: sourceItem.isNegative,
        allowSalesNegative: sourceItem.allowSalesNegative,
        responseTime: sourceItem.responseTime,
        isLock: sourceItem.isLock,
        productName: sourceItem.productName,
        price: promotionItem.unitPrice,
        bookletNo: sourceItem.bookletNo,
        pictureUrl: '',
        quantity: promotionItem.quantity,
        uom: promotionItem.uoMCode,
        barcode: promotionItem.barCode,
        brand: promotionItem.itemGroup,
        isFixedQty: sourceItem.isFixedQty ?? false,
        defaultFixedQty: sourceItem.defaultFixedQty ?? null,
        type: '',
        slocId: sourceItem.slocId,
        lineTotal: promotionItem.promotionUnitPrice * promotionItem.quantity,
        discountValue: 0,
        expDate: sourceItem?.expDate,
        discountType: '',
        note: sourceItem.note,
        productId: sourceItem.productId,
        isBOMLine: sourceItem.isBOMLine,
        isPriceTime: sourceItem.isPriceTime,
        isWeightScaleItem: sourceItem.isWeightScaleItem,
        weightScaleBarcode: sourceItem?.weightScaleBarcode,
        applyType: sourceItem.applyType,
        refTransId: sourceItem.refTransId,
        baseLine: sourceItem?.baseLine,
        baseTransId: sourceItem?.baseTransId,
        prepaidCardNo: sourceItem?.prepaidCardNo,
        isBOM: sourceItem.isBOM,
        isVoucher: sourceItem.isVoucher,
        isSerial: sourceItem.isSerial,
        serialNum: sourceItem.serialNum,//promotionItem,
        isCapacity: sourceItem.isCapacity,
        capacityValue: sourceItem.capacityValue,
        storeAreaId: sourceItem.storeAreaId,
        timeFrameId: sourceItem.timeFrameId,
        customField1: sourceItem.customField1,
        customField2: sourceItem.customField2,
        customField3: sourceItem.customField3,
        customField4: sourceItem.customField4,
        customField5: sourceItem.customField5,
        customField6: sourceItem.customField6,
        customField7: sourceItem.customField7,
        customField8: sourceItem.customField8,
        customField9: sourceItem.customField9,
        customField10: sourceItem.customField10,
        itemCategory_1: sourceItem.itemCategory_1,
        itemCategory_2: sourceItem.itemCategory_2,
        itemCategory_3: sourceItem.itemCategory_3,
        custom1: sourceItem.custom1,
        custom2: sourceItem.custom2,
        custom3: sourceItem.custom3,
        custom4: sourceItem.custom4,
        custom5: sourceItem.custom5,
        rejectPayType: sourceItem.rejectPayType,
        oriQty: sourceItem?.oriQty,
        startDate: sourceItem?.startDate,
        mcid: sourceItem?.mcid,
        itemGroupId: sourceItem?.itemGroupId,
        endDate: sourceItem?.endDate,
        openQty: sourceItem?.openQty,
        canRemove: sourceItem?.canRemove,
        appointmentDate: sourceItem.appointmentDate,
        currency: promotionItem.currency,
        taxAmt: sourceItem?.taxAmt,
        salesTaxCode: sourceItem?.salesTaxCode,
        salesTaxRate: sourceItem?.salesTaxRate,
        prefix: sourceItem?.prefix,
        name: sourceItem?.name,
        phone: sourceItem?.phone,
        priceListId: sourceItem?.priceListId,
        purchaseTaxCode: sourceItem?.purchaseTaxCode,
        purchaseTaxRate: sourceItem?.purchaseTaxRate,
        // promotionType: sourceItem?.promotionType,


        promotionType: promotionItem.promoType,
        promotionCollection: promotionItem.uCollection,
        promotionDisAmt: type === '' ? promotionItem.uDisAmt : this.authService.roundingAmount(promotionItem.uDisAmt),// this.authService.roundingValue(promotionItem.uDisAmt, type),
        promotionDisPrcnt: promotionItem.uDisPrcnt, // this.authService.roundingAmount(promotionItem.uDisPrcnt),
        promotionDiscountPercent: promotionItem.discountPercent,//this.authService.roundingAmount(promotionItem.discountPercent),
        promotionIsPromo: promotionItem.uIsPromo,
        //  promotionItemGroup: promotionItem.
        promotionLineTotal: type === '' ? promotionItem.lineTotal : promotionItem.lineTotal,//this.authService.roundingValue(promotionItem.lineTotal, type),
        promotionPriceAfDis: type === '' ? promotionItem.uPriceAfDis : promotionItem.uPriceAfDis,//this.authService.roundingValue(promotionItem.uPriceAfDis, type),
        promotionPriceAfDisAndVat: type === '' ? promotionItem.priceAfDisAndVat : promotionItem.priceAfDisAndVat,//this.authService.roundingValue(promotionItem.priceAfDisAndVat, type),
        promotionPromoCode: promotionItem.uPromoCode,
        promotionPromoName: promotionItem.uPromoName,
        promotionRate: promotionItem.rate,
        promotionSchemaCode: promotionItem.uSchemaCode,
        promotionSchemaName: promotionItem.uSchemaName,
        promotionTotalAfDis: type === '' ? promotionItem.uTotalAfDis : promotionItem.uTotalAfDis,//this.authService.roundingValue(promotionItem.uTotalAfDis, type),
        promotionUnitPrice: type === '' ? promotionItem.unitPrice : promotionItem.unitPrice,//this.authService.roundingValue(promotionItem.unitPrice, type),
        promotionUoMCode: promotionItem.uoMCode,
        promotionUoMEntry: promotionItem.uoMEntry,
        promotionVatGroup: promotionItem.vatGroup,
        promotionVatPerPriceAfDis: type === '' ? promotionItem.vatPerPriceAfDis : promotionItem.vatPerPriceAfDis,//this.authService.roundingValue(promotionItem.vatPerPriceAfDis, type),
        mappingCode: sourceItem?.mappingCode,
        lineItems: sourceItem.lineItems,
        discountHistory: [],
        staffs: sourceItem.staffs,
        isManualDiscount: sourceItem?.isManualDiscount,
        priceListName: sourceItem?.priceListName,
        isHighLight: sourceItem?.isHighLight,
      };
    }
    else {
      // debugger;

      return {
        // lineNum: promotionItem.lineNum,
        id: promotionItem.itemCode,
        isNegative: false,
        allowSalesNegative: false,
        isLock: false,
        responseTime: new Date(),
        productName: promotionItem.itemDescription,
        price: promotionItem.unitPrice,
        bookletNo: '',
        pictureUrl: '',
        quantity: promotionItem.quantity,
        uom: promotionItem.uoMCode,
        barcode: promotionItem.barCode,
        brand: promotionItem.itemGroup,
        isFixedQty: promotionItem?.isFixedQty ?? false,
        defaultFixedQty: promotionItem?.defaultFixedQty ?? null,
        type: '',
        lineTotal: promotionItem.promotionUnitPrice * promotionItem.quantity,
        discountValue: 0,
        discountType: '',
        note: '',
        expDate: sourceItem?.expDate,
        applyType: promotionItem?.applyType,
        refTransId: promotionItem?.refTransId,
        baseLine: promotionItem?.baseLine,
        baseTransId: promotionItem?.baseTransId,
        slocId: sourceItem?.slocId,
        prefix: sourceItem?.prefix,
        name: sourceItem?.name,
        phone: sourceItem?.phone,
        weightScaleBarcode: sourceItem?.weightScaleBarcode,
        isWeightScaleItem: sourceItem?.isWeightScaleItem,
        isPriceTime: sourceItem?.isPriceTime,
        isBOMLine: false,
        productId: promotionItem?.productId,
        isBOM: false,
        isSerial: promotionItem?.isSerial ?? false,
        serialNum: '',//promotionItem,
        isCapacity: false,
        isVoucher: promotionItem?.isVoucher ?? false,
        capacityValue: 0,
        storeAreaId: '',
        timeFrameId: '',
        appointmentDate: null,
        startDate: null,
        endDate: null,
        prepaidCardNo: '',
        mcid: null,
        priceListId: promotionItem?.priceListId,
        itemGroupId: promotionItem?.itemGroup,
        currency: promotionItem.currency,
        itemCategory_1: promotionItem?.itemCategory1,
        itemCategory_2: promotionItem?.itemCategory2,
        itemCategory_3: promotionItem?.itemCategory3,
        customField1: promotionItem?.customField1,
        customField2: promotionItem?.customField2,
        customField3: promotionItem?.customField3,
        customField4: promotionItem?.customField4,
        customField5: promotionItem?.customField5,
        customField6: promotionItem?.customField6,
        customField7: promotionItem?.customField7,
        customField8: promotionItem?.customField8,
        customField9: promotionItem?.customField9,
        customField10: promotionItem?.customField10,
        custom1: sourceItem?.custom1,
        custom2: sourceItem?.custom2,
        custom3: sourceItem?.custom3,
        custom4: sourceItem?.custom4,
        custom5: sourceItem?.custom5,
        rejectPayType: promotionItem?.rejectPayType,
        oriQty: promotionItem?.oriQty,
        openQty: promotionItem?.openQty,
        canRemove: promotionItem?.canRemove,
        salesTaxCode: promotionItem?.salesTaxCode,
        salesTaxRate: promotionItem?.salesTaxRate,
        purchaseTaxCode: promotionItem?.purchaseTaxCode,
        purchaseTaxRate: promotionItem?.purchaseTaxRate,
        taxAmt: sourceItem?.taxAmt,
        promotionType: promotionItem.promoType,
        promotionCollection: promotionItem.uCollection,
        promotionDisAmt: type === '' ? promotionItem.uDisAmt : this.authService.roundingAmount(promotionItem.uDisAmt),// this.authService.roundingValue(promotionItem.uDisAmt, type), 
        // this.authService.roundingAmount(promotionItem.uDisAmt),
        promotionDisPrcnt: promotionItem.uDisPrcnt,//this.authService.roundingAmount(promotionItem.uDisPrcnt),
        promotionDiscountPercent: promotionItem.discountPercent,//this.authService.roundingAmount(promotionItem.discountPercent),
        promotionIsPromo: promotionItem.uIsPromo,
        //  promotionItemGroup: promotionItem.
        promotionLineTotal: type === '' ? promotionItem.lineTotal : promotionItem.lineTotal,// this.authService.roundingValue(promotionItem.lineTotal, type), //this.authService.roundingAmount(promotionItem.lineTotal),
        promotionPriceAfDis: type === '' ? promotionItem.uPriceAfDis : promotionItem.uPriceAfDis,// //this.authService.roundingAmount(promotionItem.uPriceAfDis),
        promotionPriceAfDisAndVat: type === '' ? promotionItem.priceAfDisAndVat : promotionItem.priceAfDisAndVat,//this.authService.roundingValue(promotionItem.priceAfDisAndVat, type), //this.authService.roundingAmount(promotionItem.priceAfDisAndVat),
        promotionPromoCode: promotionItem.uPromoCode,
        promotionPromoName: promotionItem.uPromoName,
        promotionRate: promotionItem.rate,
        promotionSchemaCode: promotionItem.uSchemaCode,
        promotionSchemaName: promotionItem.uSchemaName,
        promotionTotalAfDis: type === '' ? promotionItem.uTotalAfDis : promotionItem.uTotalAfDis,// this.authService.roundingValue(promotionItem.uTotalAfDis, type), //this.authService.roundingAmount(promotionItem.uTotalAfDis),
        promotionUnitPrice: type === '' ? promotionItem.unitPrice : promotionItem.unitPrice,//this.authService.roundingValue(promotionItem.unitPrice, type), //this.authService.roundingAmount(promotionItem.unitPrice),
        promotionUoMCode: promotionItem.uoMCode,
        promotionUoMEntry: promotionItem.uoMEntry,
        promotionVatGroup: promotionItem.vatGroup,
        mappingCode: sourceItem?.mappingCode,
        promotionVatPerPriceAfDis: type === '' ? promotionItem.vatPerPriceAfDis : promotionItem.vatPerPriceAfDis,// this.authService.roundingValue(promotionItem.vatPerPriceAfDis, type), //this.authService.roundingAmount(promotionItem.vatPerPriceAfDis),
        lineItems: [],
        discountHistory: [],
        staffs: [],
        isManualDiscount: null,
        priceListName: '',
        isHighLight: null
      };
    }

  }

  mapProductBOMItemtoBasket(item: MBomline, quantity: number): IBasketItem {
    return {
      id: item.itemCode,
      isNegative: false,
      allowSalesNegative: false,
      isLock: false,
      responseTime: new Date(),
      productName: item.itemName,
      bookletNo: '',
      price: 0,
      pictureUrl: '',
      quantity: item.quantity * quantity,
      uom: item.uomCode,
      isFixedQty: false,
      defaultFixedQty: null,
      barcode: '',
      brand: '',
      type: '',
      slocId: '',
      lineTotal: item.quantity * quantity,
      isPriceTime: false,
      discountValue: 0,
      discountType: '',
      note: '',
      expDate: null,
      isBOMLine: true,
      isVoucher: false,
      productId: '',
      isBOM: false,
      isSerial: false,
      serialNum: '',
      applyType: '',
      refTransId: '',
      isCapacity: false,
      isWeightScaleItem: false,
      weightScaleBarcode: '',
      capacityValue: 0,
      storeAreaId: '',
      timeFrameId: '',
      appointmentDate: null,
      startDate: null,
      endDate: null,
      salesTaxCode: '',
      salesTaxRate: null,
      purchaseTaxCode: '',
      purchaseTaxRate: null,
      mcid: '',
      itemGroupId: '',
      itemCategory_1: '',
      itemCategory_2: '',
      itemCategory_3: '',
      prefix: '',
      name: '',
      phone: '',
      custom1: '',
      custom2: '',
      custom3: '',
      custom4: '',
      custom5: '',
      priceListId: '',
      taxAmt: null,
      lineItems: [],
      mappingCode: '',
      discountHistory: [],
      staffs: [],
      isManualDiscount: null,
      priceListName: '',
      isHighLight: null
    };
  }
  mapPaymenttoBasket(payment: Payment, paymentCharged: number): IBasketPayment {
    // // debugger;
    return {
      id: payment.id,
      refNum: payment.refNum,
      paymentDiscount: payment.paymentDiscount,
      paymentTotal: payment.paymentTotal,
      paymentCharged,
      lineNum: payment.lineNum,
      isRequireRefNum: payment.isRequireRefNum,
      mainBalance: payment.mainBalance,
      subBalance: payment.subBalance,
      cardNo: payment.cardNo,
      voucherSerial: payment.voucherSerial,
      cardType: payment.cardType,
      cardHolderName: payment.cardHolderName,
      canEdit: payment.canEdit,
      currency: payment.currency,
      rate: payment.rate,
      fcAmount: payment.fcAmount,
      paidAmt: payment.paidAmt,
      paymentMode: payment.paymentMode,
      paymentType: payment.paymentType,
      shortName: payment.shortName,
      roundingOff: payment.roundingOff,
      fcRoundingOff: payment.fcRoundingOff,
      forfeitCode: payment.forfeitCode,
      forfeit: payment.forfeit,
      customF1: payment.customF1,
      customF2: payment.customF2,
      customF3: payment.customF3,
      customF4: payment.customF4,
      customF5: payment.customF5,
      isCloseModal: payment.isCloseModal,
      apiUrl: payment.apiUrl,
      bankPaymentType: payment?.bankPaymentType,
      isPaid: null,
      transId: "",
      lines: payment.lines
    };
  }



  // Order
  mapBilltoBasket(bill: Order) {


  }

  checkCapacity() {
    let itemLines = this.getCurrentBasket().items;
    let capaCheck = itemLines.filter(x => x.capacityValue !== null && x.capacityValue !== undefined);
    if (capaCheck !== null && capaCheck !== undefined && capaCheck?.length > 0) {
      let noline = capaCheck.filter(x => x.lineItems === null || x.lineItems === undefined || x.lineItems?.length === 0);
      if (noline !== null && noline !== undefined && noline?.length > 0) {
        return false;
      }
    }
    return true;
  }
  checkSerialValidLine() {
    debugger;
    let itemLines = this.getCurrentBasket().items;
    let serialCheck = itemLines.filter(x => x.isSerial || x.isVoucher || x.customField1 === "Member");
    if (serialCheck !== null && serialCheck !== undefined && serialCheck?.length > 0) {
      let noline = serialCheck.filter(x => x.lineItems === null || x.lineItems === undefined || x.lineItems?.length === 0);
      if (noline !== null && noline !== undefined && noline?.length > 0) {
        return false;
      }
      let numLine = serialCheck.filter(x => x.lineItems?.length != x.quantity);
      if (numLine !== null && numLine !== undefined && numLine?.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Serial / Member lines not valid with item quantity  ',
          html: "Please Complete progress! <br /> (Input Serial/ Member Id...)"
        });
        return false;
      }

    }

    return true;
  }


  checkItemInValidLine() {

    let checkSales = "false";
    let SalesZero = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'SalesZeroValue');
    if (SalesZero !== null && SalesZero !== undefined) {
      checkSales = SalesZero.settingValue;
    }
    if (checkSales === "false") {
      let itemLines = this.getCurrentBasket().items;
      // debugger;
      let lineCheck = itemLines.filter(x => (x.price ?? 0) === 0 && x.promotionIsPromo !== '1');
      if (lineCheck !== null && lineCheck !== undefined && lineCheck?.length > 0) {

        return false;
      }
      return true;
    }
    else {
      return true;
    }

  }
  checkPaymentNew(payments) {
    let patmentCheck = payments.filter(x => (x.paymentType === 'B' || x.customF2 === 'B') && (x?.refNum === '' || x?.customF1 === ''));
    if (patmentCheck !== null && patmentCheck !== undefined && patmentCheck?.length > 0) {

      return false;
    }
    else {

      return true;
    }
  }
  checkPayment(payments) {

    let patmentCheck = payments.filter(x => (x.paymentType === 'B' || x.customF2 === 'B') && (x?.refNum === '' || x?.customF1 === ''));
    if (patmentCheck !== null && patmentCheck !== undefined && patmentCheck?.length > 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Payment',
        html: "Please Complete progress payment! <br /> (Input Amount/ Ref number...)"
      });
      this.changeIsCreateOrder(false);
      this.changeBasketResponseStatus(true);
      console.log("Please Complete progress payment");
      return false;
    }
    else {
      debugger;
      let patmentCheckZero = payments.filter(x => (x.paymentCharged ?? 0) === 0);

      if (patmentCheckZero !== null && patmentCheckZero !== undefined && patmentCheckZero?.length > 0) {

        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          html: "Please remove payment zero value " + patmentCheckZero[0].paymentCode
        });
        this.changeIsCreateOrder(false);
        this.changeBasketResponseStatus(true);
        console.log("Please Complete progress payment");
        return false;
      }
      else {
        return true;
      }

    }
  }
  private clickStream = new Subject();
  writeLogRemove(transId) {
    debugger;
    // let subject = new Subject();
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = transId;
    let basket = this.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      order.orderId = basket.id;
      let storeClient = this.authService.getStoreClient();
      if (storeClient !== null && storeClient !== undefined) {
        order.terminalId = this.authService.getStoreClient().publicIP;
      }
      else {
        order.terminalId = this.authService.getLocalIP();
      }
      order.storeId = this.authService.storeSelected().storeId;
      order.companyCode = this.authService.getCurrentInfor().companyCode;
      let approvalStr = "";
      if (basket.userApproval?.length > 0) {
        approvalStr = "Approval by " + basket.userApproval;
      }
      let noteStr = '';
      if (basket.note?.length > 0) {
        noteStr = "note: " + basket.note;
      }
      let showString = '';
      if (approvalStr?.length > 0) {
        showString = approvalStr;
      }
      if (noteStr?.length > 0 && showString?.length > 0) {
        showString = showString + ", " + noteStr;
      }
      else {
        if (noteStr?.length > 0 && showString?.length <= 0) {
          showString = noteStr;
        }

      }
      let userName = this.authService.getCurrentInfor()?.username;

      let log = new OrderLogModel();
      log.type = "RemoveBasket";
      log.action = "Request";
      log.time = new Date();
      log.result = "";
      log.value = showString;
      log.customF1 = transId;
      log.customF2 = basket?.id;
      log.customF7 = (basket?.userApproval ?? "").toString();
      log.customF8 = (basket?.note?.toString() ?? "").toString();
      log.createdBy = userName;
      order.logs.push(log);

      var items = basket.items;
      var newArray = [];
      order.createdBy = userName;
      items.forEach(val => newArray.push(Object.assign({}, val)));
      if (newArray !== null && newArray !== undefined && newArray?.length > 0) {
        newArray.forEach((item) => {
          // debugger;

          let logItem = new OrderLogModel();
          logItem.type = "RemoveBasket";
          logItem.action = "Remove Item";
          logItem.result = "";
          logItem.value = transId;
          logItem.customF1 = item?.id?.toString();
          logItem.customF2 = item?.uom?.toString();
          logItem.customF3 = (item?.barCode ?? item?.barcode) ?? "";
          logItem.customF4 = (item?.price?.toString() ?? "").toString();
          logItem.customF5 = (item?.lineTotal?.toString() ?? "").toString();
          logItem.customF6 = (item?.quantity?.toString() ?? "").toString();
          logItem.customF7 = (basket?.userApproval ?? "").toString();
          logItem.customF8 = (basket?.note?.toString() ?? "").toString();
          logItem.createdBy = userName;
          logItem.storeId = this.authService.storeSelected().storeId;
          logItem.companyCode = this.authService.getCurrentInfor().companyCode;

          logItem.time = new Date();
          order.logs.push(logItem);

        });
      }
      this.clickStream.pipe(debounceTime(500)).pipe(e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
        .subscribe(response => {
          // this.orderCached.next("");
          this.alertify.success("Successfully completed.");
        });
      // return this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order);
      // this.clickStream.pipe(debounceTime(500)).pipe( e => )
      // .subscribe(response=> {
      //   subject.next(response);

      // }, error =>{
      //   debugger;
      //   subject.next(null);

      //     console.log('Remove Item error', error); 

      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Remove Item',
      //       text: "Failed to connect System, Please try again or contact to support team"
      //     });
      //   // }
      // });
    }
    // else
    // {

    //   subject.next(null);
    // }

    // return subject; 


  }

  writeLogClearBill(transId) {
    debugger;
    // let subject = new Subject();
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = transId;
    let basket = this.getCurrentBasket();
    if (basket !== null && basket !== undefined) {
      order.orderId = basket.id;
      let storeClient = this.authService.getStoreClient();
      if (storeClient !== null && storeClient !== undefined) {
        order.terminalId = this.authService.getStoreClient().publicIP;
      }
      else {
        order.terminalId = this.authService.getLocalIP();
      }
      order.storeId = this.authService.storeSelected().storeId;
      order.companyCode = this.authService.getCurrentInfor().companyCode;
      let approvalStr = "";
      if (basket.userApproval?.length > 0) {
        approvalStr = "Approval by " + basket.userApproval;
      }
      let noteStr = '';
      if (basket.note?.length > 0) {
        noteStr = "note: " + basket.note;
      }
      let showString = '';
      if (approvalStr?.length > 0) {
        showString = approvalStr;
      }
      if (noteStr?.length > 0 && showString?.length > 0) {
        showString = showString + ", " + noteStr;
      }
      else {
        if (noteStr?.length > 0 && showString?.length <= 0) {
          showString = noteStr;
        }

      }


      let log = new OrderLogModel();
      log.type = "ClearBill";
      log.action = "Request (Btn)";
      log.time = new Date();
      log.result = "";
      log.value = showString;
      log.customF1 = transId?.toString();
      log.customF2 = basket?.id?.toString();
      log.customF3 = 'Click';
      log.customF7 = (basket?.userApproval ?? '').toString();
      log.customF8 = (basket?.note ?? '').toString();


      log.createdBy = this.authService.getCurrentInfor().username;
      order.logs.push(log);

      var items = basket.items;
      var newArray = [];
      order.createdBy = this.authService.getCurrentInfor().username;
      items.forEach(val => newArray.push(Object.assign({}, val)));
      if (newArray !== null && newArray !== undefined && newArray?.length > 0) {
        newArray.forEach((item) => {
          // debugger;

          let logItem = new OrderLogModel();
          logItem.type = "ClearBill";
          logItem.action = "Remove Item";
          logItem.result = "";
          logItem.value = transId;
          logItem.customF1 = item?.id?.toString();
          logItem.customF2 = item?.uom?.toString();
          logItem.customF3 = (item?.barCode ?? item?.barcode) ?? "";
          logItem.customF4 = (item?.price?.toString() ?? "").toString();
          logItem.customF5 = (item?.lineTotal?.toString() ?? "").toString();
          logItem.customF6 = (item?.quantity?.toString() ?? "").toString();
          logItem.customF7 = (basket?.userApproval ?? "").toString();
          logItem.customF8 = (basket?.note?.toString() ?? "").toString();
          logItem.createdBy = this.authService.getCurrentInfor().username;
          logItem.storeId = this.authService.storeSelected().storeId;
          logItem.companyCode = this.authService.getCurrentInfor().companyCode;

          logItem.time = new Date();
          order.logs.push(logItem);

        });
      }

      // this.clickStream.pipe(debounceTime(500)).pipe( e => )
      // .subscribe(response=> {
      //   // this.orderCached.next("");
      //   this.alertify.success("Successfully completed.");
      // });
      // return this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order);
      // this.clickStream.pipe(debounceTime(500)).pipe( e => )
      // .subscribe(response=> {
      //   subject.next(response);

      // }, error =>{
      //   debugger;
      //   subject.next(null);

      //     console.log('Remove Item error', error); 

      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Remove Item',
      //       text: "Failed to connect System, Please try again or contact to support team"
      //     });
      //   // }
      // });
    }
    return this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order);

  }

  writeLogRedeem(customerId, vouchercode, vouchername, storeId, result, message, cusPhone, cusName) {
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = uuidv4();
    // let basket = this.getCurrentBasket();
    order.orderId = uuidv4();
    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      order.terminalId = this.authService.getLocalIP();
    }
    order.storeId = this.authService.storeSelected().storeId;
    order.companyCode = this.authService.getCurrentInfor().companyCode;
    let approvalStr = "";
    // if(basket.userApproval?.length > 0)
    // {
    //   approvalStr =  "Approval by " + basket.userApproval;
    // }
    // let noteStr = '';
    // if(basket.note?.length > 0)
    // {
    //   noteStr =  "note: " + basket.note;
    // }
    // let showString = '';
    // if(approvalStr?.length > 0)
    // {
    //   showString = approvalStr;
    // }
    // if(noteStr?.length > 0 && showString?.length > 0)
    // {
    //   showString = showString + ", " +noteStr;
    // }
    // else
    // {
    //   if(noteStr?.length > 0 && showString?.length <= 0)
    //   { 
    //     showString = noteStr;
    //   }

    // }


    let log = new OrderLogModel();
    log.type = "RedeemVoucher";
    log.action = "Request";
    log.time = new Date();
    log.result = "";
    log.value = vouchercode?.toString();
    log.customF1 = storeId?.toString();
    log.createdBy = this.authService.getCurrentInfor().username;
    order.logs.push(log);


    let logItem = new OrderLogModel();
    logItem.type = "RedeemVoucher";
    logItem.action = "Redeem Member";
    logItem.result = result?.toString();
    logItem.value = vouchercode?.toString();
    logItem.customF1 = vouchername?.toString();
    logItem.customF2 = customerId?.toString();
    logItem.customF3 = storeId?.toString();
    logItem.customF4 = message?.toString();
    logItem.customF5 = cusPhone?.toString();
    logItem.customF6 = cusName?.toString();

    logItem.createdBy = this.authService.getCurrentInfor().username;
    logItem.storeId = this.authService.storeSelected().storeId;
    logItem.companyCode = this.authService.getCurrentInfor().companyCode;

    logItem.time = new Date();
    order.logs.push(logItem);

    this.clickStream.pipe(debounceTime(500)).pipe(e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
      .subscribe(response => {
        // this.orderCached.next("");
        this.alertify.success("Successfully completed.");
      }, error => {
        debugger;
        // , error =>{
        console.log('Redeem Voucher error', error);
        // Swal.fire('Remove Item', "Failed to connect System, Please try again or contact to support team", 'error');
        Swal.fire({
          icon: 'error',
          title: 'Redeem Voucher Log',
          text: "Please try again to write log or contact to support team after 3 times"
        }).then(() => {
          this.writeLogRedeem(customerId, vouchercode, vouchername, storeId, result, message, cusPhone, cusName);
        });
        // }
      });
  }

  writeLogRemoveItem(transId, item) {
    let subject = new Subject();
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = transId;
    let basket = this.getCurrentBasket();
    console.log('cur basket', basket);
    order.orderId = basket.id;
    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      order.terminalId = this.authService.getLocalIP();
    }
    order.storeId = this.authService.storeSelected().storeId;
    order.companyCode = this.authService.getCurrentInfor().companyCode;
    let approvalStr = "";
    if (basket.userApproval?.length > 0) {
      approvalStr = "Approval by " + basket.userApproval;
    }
    let noteStr = '';
    if (basket.note?.length > 0) {
      noteStr = "note: " + basket.note;
    }
    let showString = '';
    if (approvalStr?.length > 0) {
      showString = approvalStr;
    }
    if (noteStr?.length > 0 && showString?.length > 0) {
      showString = showString + ", " + noteStr;
    }
    else {
      if (noteStr?.length > 0 && showString?.length <= 0) {
        showString = noteStr;
      }

    }
    let userName = this.authService.getCurrentInfor().username;

    let log = new OrderLogModel();
    log.type = "RemoveItem";
    log.action = "Request";
    log.time = new Date();
    log.result = "";
    log.value = showString;
    log.customF1 = transId;
    log.customF2 = basket?.id;
    log.createdBy = userName;
    order.logs.push(log);


    order.createdBy = userName;

    let logItem = new OrderLogModel();
    logItem.type = "RemoveItem";
    logItem.action = "Remove Item";
    logItem.result = "success";
    logItem.value = "";
    logItem.customF1 = item?.id?.toString();
    logItem.customF2 = item?.uom?.toString();
    logItem.customF3 = (item?.barCode ?? item?.barcode) ?? "";
    logItem.customF4 = (item?.price?.toString() ?? "").toString();
    logItem.customF5 = (item?.lineTotal?.toString() ?? "").toString();
    logItem.customF6 = (item?.quantity?.toString() ?? "").toString();
    logItem.customF7 = (basket?.userApproval ?? "").toString();
    logItem.customF8 = (basket?.note?.toString() ?? "").toString();



    logItem.createdBy = userName;
    logItem.storeId = this.authService.storeSelected().storeId;
    logItem.companyCode = this.authService.getCurrentInfor().companyCode;

    logItem.time = new Date();
    order.logs.push(logItem);
    this.clickStream.pipe(debounceTime(500)).pipe(e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
      .subscribe(response => {
        debugger;
        subject.next(response);
        // this.alertify.success("Successfully completed.");
      }, error => {
        debugger;
        subject.next(null);
        // , error =>{
        console.log('Remove Item error', error);
        // Swal.fire('Remove Item', "Failed to connect System, Please try again or contact to support team", 'error');
        Swal.fire({
          icon: 'error',
          title: 'Remove Item',
          text: "Failed to connect System, Please try again or contact to support team"
        });
        // }
      });
    return subject;// = new Subject();;

  }
  getRoundingTypeStore() {
    let typeRounding;
    let store = this.authService.storeSelected();
    let storeCurrency = this.authService.getStoreCurrency();

    if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) {

      typeRounding = storeCurrency.find(x => x.currency === this.authService.storeSelected().currencyCode);
    }
    else {
      if (store.currencyCode !== null && store.currencyCode !== undefined && store.currencyCode !== '') {
        typeRounding = this.getCurrency(store.currencyCode);
        typeRounding.roundingMethod = typeRounding?.rounding;
      }

    }
    return typeRounding;
  }
  addOrder(TransId, Type: string) {
    // debugger;
    const order = new Order();
    this.changeBasketResponseStatus(false);

    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      order.terminalId = this.authService.getLocalIP();
    }

    if (order.terminalId !== null && order.terminalId !== undefined && order.terminalId !== '') {
      if (this.checkSerialValidLine()) {
        let store = this.authService.storeSelected();
        let cancel = 'N';
        let isNegative = false;
        // debugger;
        if (Type === "") {
          Type = "SALES";
        }

        if (Type === "Cancel") {
          cancel = 'C';
          isNegative = true;
        }

        if (Type === "RETURN") {
          isNegative = true;
        }


        if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) {
          this.changeIsCreateOrder(false);
          this.changeBasketResponseStatus(true);
          console.log("You are not on the shift");
          this.alertify.warning("You are not on the shift. Please create your shift.");

        }
        else {
          const basket = this.basketSource;
          const basketTotal = this.basketTotal;
          debugger;
          if (this.checkPayment(basket.getValue().payments)) {
            let hasItemSalesNegative = false;
            if (basket.getValue().negativeOrder) {
              if (Type !== "SALES") {
                isNegative = true;
              }
              else {
                hasItemSalesNegative = true;
              }
            }


            order.transId = TransId;


            // let sourceCRM="Local";
            let sourceCRM = this.authService.getCRMSource();
            // if(source!==null && source !== undefined)
            // {
            //   let sourceX = source.find(x=>x.settingId ==='CRMSystem');
            //   if(sourceX.settingValue ==="Capi")
            //   {
            //     sourceCRM = "Capi";
            //   }

            // }
            if (sourceCRM === 'Capi' && (basket.getValue().customer.mobile !== null && basket.getValue().customer.mobile !== undefined)) {
              order.cusId = basket.getValue().customer.id;
              order.phone = basket.getValue().customer.mobile;
              order.cusName = basket.getValue().customer.customerName;
              order.cusAddress = basket.getValue().customer.address;
              order.cusGrpId = basket.getValue().customer.customerGrpId ?? "";
            }
            else {
              order.cusId = basket.getValue().customer.customerId;
              order.phone = basket.getValue().customer.phone;
              order.cusName = basket.getValue().customer.customerName;
              order.cusAddress = basket.getValue().customer.address;
              order.cusGrpId = basket.getValue().customer.customerGrpId ?? "";
            }
            if (basket.getValue()?.customer?.rewardPoints !== null && basket.getValue()?.customer?.rewardPoints !== undefined) {
              order.rewardPoints = basket.getValue().customer?.rewardPoints;
              order.expiryDate = new Date(basket.getValue().customer?.expiryDate);
            }
            if (basket.getValue().startTime !== null && basket.getValue().startTime !== undefined) {
              order.startTime = basket.getValue().startTime;
              // order.startTime= moment(date).local().format('YYYY-MM-DD HH:mm:ss');
            }
            // this.changeBasketResponseStatus(false);
            // debugger;
            // let storeClient = this.authService.getStoreClient();
            // if (storeClient !== null && storeClient !== undefined) {
            //   order.terminalId = this.authService.getStoreClient().publicIP;
            // }
            // else {
            //   order.terminalId = this.authService.getLocalIP();
            // }
            order.storeName = store.storeName;
            order.companyCode = store.companyCode;
            order.contractNo = basket.getValue().contractNo;
            order.salesChanel = basket.getValue().saleschannel;

            if (basket.getValue()?.contractNo !== null && basket.getValue()?.contractNo !== undefined && basket.getValue()?.contractNo !== "" && Type !== 'Table') {
              order.posType = "E";
            }

            let format = this.authService.loadFormat();
            let decimalPlacesFormat = 2;
            let percentPlacesFormat = 6;

            if (format !== null && format !== undefined) {
              let checkFm = format.decimalPlacesFormat;
              if (checkFm !== null && checkFm !== undefined && checkFm !== '') {
                decimalPlacesFormat = parseInt(checkFm);
              }
              let checkPercentFm = format.perDecimalPlacesFormat;
              if (checkPercentFm !== null && checkPercentFm !== undefined && checkPercentFm !== '') {
                percentPlacesFormat = parseInt(checkPercentFm);
              }
            }


            order.shiftId = this.shiftService.getCurrentShip().shiftId;
            order.invoice = basket.getValue().invoice;
            order.delivery = basket.getValue().delivery;
            order.approvalId = basket.getValue().userApproval;
            // order.manualDiscount = '';
            if (basket.getValue().isManualDiscount !== null && basket.getValue().isManualDiscount !== undefined && basket.getValue().isManualDiscount === true) {
              order.manualDiscount = "Y";
            }
            else {
              order.manualDiscount = '';
            }
            order.refTransId = '';
            order.orderId = basket.getValue().id;
            order.reason = basket.getValue().reason;
            order.remarks = basket.getValue().note;

            debugger;
            if (Type === "RETURN" || Type === "Exchange" || Type === "EX") {
              order.transId = '';
              order.refTransId = TransId;
            }
            if (Type === "Receive") {
              Type = 'SALES';
              order.transId = '';
              order.refTransId = TransId;
            }
            order.tempTransId = TransId;
            // order.remarks = '';
            if (Type.toLowerCase() === "hold") {
              order.status = 'H';
              Type = 'SALES';
            }
            else {
              order.status = 'C';
            }

            order.salesMode = Type;//'HOLD''SALES';
            let employee = basket.getValue().employee;
            if (employee !== null && employee !== undefined) {
              order.salesPerson = employee.employeeId;
              order.salesPersonName = employee.employeeName;
            }
            else {
              order.salesPerson = this.authService.decodeToken?.unique_name;
              order.salesPersonName = this.authService.decodeToken?.unique_name;
            }
            order.createdBy = this.authService.decodeToken?.unique_name;
            order.chanel = this.authService.storeSelected().customField2;
            order.omsId = basket.getValue().omsId;
            order.storeId = store.storeId;
            order.isCanceled = cancel;
            if (Type === "Receive") {
              order.salesType = Type;
            }
            else {
              order.salesType = basket.getValue().salesType;
            }

            if (Type === 'Table') {
              order.status = 'H';
              order.transId = '';
              order.contractNo = basket.getValue().contractNo ?? '';
              order.customF1 = basket.getValue().placeId ?? '';
              order.salesType = "Table";
            }
            let placeId = basket.getValue().placeId;
            if (placeId !== null && placeId !== undefined && placeId?.length > 0) {
              order.customF1 = basket.getValue().placeId ?? '';
            }
            order.dataSource = 'POS';
            if (basket.getValue().dataSource?.length > 0) {
              order.dataSource = basket.getValue().dataSource;
            }

            order.discountType = basket.getValue().discountType;

            let storeCurrency = this.authService.getStoreCurrency();
            // debugger;
            if (storeCurrency !== null && storeCurrency !== undefined && storeCurrency.length > 0) {

              order.totalAmount = this.authService.roundingAmount((isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().billTotal : basketTotal.getValue().billTotal);
              order.totalDiscountAmt = this.authService.roundingAmount((isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().discountBillValue : basketTotal.getValue().discountBillValue);
              order.totalPayable = this.authService.roundingAmount((isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().total : basketTotal.getValue().total);
              order.totalReceipt = this.authService.roundingAmount((isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().totalAmount : basketTotal.getValue().totalAmount);

            }
            else {
              order.totalAmount = (isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().billTotal : basketTotal.getValue().billTotal;
              order.totalDiscountAmt = (isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().discountBillValue : basketTotal.getValue().discountBillValue;
              order.totalPayable = (isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().total : basketTotal.getValue().total;
              order.totalReceipt = (isNegative === true || hasItemSalesNegative === true) ? -basketTotal.getValue().totalAmount : basketTotal.getValue().totalAmount;
            }
            // debugger;
            // if(Math.abs(order.totalPayable) - Math.abs(order.totalAmount) - Math.abs(order.totalDiscountAmt) > 0)
            // {
            order.roundingOff = (isNegative === true || hasItemSalesNegative === true) ? basketTotal.getValue().billRoundingOff : -basketTotal.getValue().billRoundingOff;

            // }
            // else
            // {
            //   order.roundingOff =  isNegative === true ? -basketTotal.getValue().billRoundingOff : basketTotal.getValue().billRoundingOff;
            // }

            let paymentDiscount = basket.getValue().payments.reduce((a, b) => b.paymentDiscount + a, 0);// subtotal + ship;
            order.paymentDiscount = paymentDiscount;

            debugger;
            // -  order.paymentDiscount
            let amountChange = basketTotal.getValue().changeAmount;// (order.totalReceipt)  -(order.totalPayable );
            // order.amountChange = isNegative === true ?  -this.basketTotal.getValue().changeAmount : this.basketTotal.getValue().changeAmount;
            order.amountChange = isNegative === true ? -amountChange : amountChange;

            // order.paymentDiscount = 0 ;
            order.promoId = basket.getValue()?.promotionId;
            // debugger;
            if (basket.getValue().discountType === 'Discount Percent') {
              order.discountRate = basket.getValue().discountValue;
              order.discountAmount = basketTotal.getValue().discountTotal;
            }
            if (basket.getValue().discountType === 'Discount Amount') {

              order.discountAmount = basketTotal.getValue().discountTotal;
              let totalAmount = basketTotal.getValue().billTotal;
              order.discountRate = order.discountAmount / totalAmount * 100;

            }

            order.totalTax = 0;
            if (order?.promoId && order.discountType !== null && order.discountType !== undefined && order.discountType !== "" && order.discountRate > 0) {
              const promoLine = new TSalesPromo();
              promoLine.itemCode = '';
              promoLine.barCode = "";
              promoLine.value = order.discountAmount;
              promoLine.uomCode = "";
              promoLine.barCode = "";
              promoLine.refTransId = "";
              promoLine.applyType = "";
              promoLine.promoId = basket.getValue().promotionId;
              promoLine.itemGroupId = "";
              promoLine.createdBy = order.createdBy;
              promoLine.promoAmt = order.discountAmount;
              promoLine.promoPercent = order.discountRate;
              promoLine.promoType = order.discountType;
              // const value = 0;
              // let discountType= ;
              promoLine.status = "C";
              order.promoLines.push(promoLine);
            }

            var items = basket.getValue().items;
            console.log('items', items);
            this.changeBasketResponseStatus(false);

            // let typeRounding;
            // // let store = this.authService.storeSelected();
            // if (storeCurrency !== null && storeCurrency !== null && storeCurrency.length > 0) 
            // {

            //   typeRounding = storeCurrency.find(x => x.currency === this.authService.storeSelected().currencyCode); 
            // }
            // else
            // {
            //   if(store.currencyCode!== null && store.currencyCode!==undefined && store.currencyCode !=='')
            //   {
            //     typeRounding = this.getCurrency(store.currencyCode);
            //     typeRounding.roundingMethod = typeRounding?.rounding;
            //   }

            // }

            // var itemsX = Object.assign({}, items);
            var newArray = [];

            items.forEach(val => newArray.push(Object.assign({}, val)));
            newArray.forEach((item) => {
              if (item?.productId === "10089824") {
                debugger;
              }
              if ((!item.isVoucher && !item.isSerial && !item.isBOM || (item.isSerial && item.customField1 === "Card")) && item.isCapacity !== true) {
                //  debugger;

                item.quantity = item.isNegative === true ? -item.quantity : item.quantity;
                var lineItem = item.lineItems;
                lineItem.forEach((itemLine) => {
                  itemLine.quantity = itemLine.isNegative === true ? -itemLine.quantity : itemLine.quantity;
                  const line = new TSalesLine();
                  debugger;
                  let discountType = item.discountType;

                  if (item.customField1 === "Member" || item.customField1 === "Class") {
                    line.memberDate = itemLine.memberDate;

                    if ((basket.getValue().salesType.toLowerCase() === "ex" || basket.getValue().salesType.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {

                      line.quantity = isNegative === true ? itemLine.quantity : -itemLine.quantity;
                    }
                    else {
                      line.quantity = isNegative === true ? - itemLine.quantity : itemLine.quantity;
                    }
                    line.memberValue = itemLine.customField2 === null || itemLine.customField2 === undefined ? 1 : parseInt(itemLine.customField2);
                    line.startDate = itemLine.startDate;
                    line.endDate = itemLine.endDate;
                    line.serialNum = itemLine.serialNum;
                    line.phone = itemLine.phone;
                    line.name = itemLine.name;
                    line.custom1 = itemLine.custom1 ?? item.custom1;

                  }
                  else {
                    if ((basket.getValue().salesType.toLowerCase() === "ex" || basket.getValue().salesType.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                      line.quantity = isNegative === true ? itemLine.quantity : -itemLine.quantity;
                    }
                    else {
                      line.quantity = isNegative === true ? - itemLine.quantity : itemLine.quantity;
                    }
                    line.custom1 = item.custom1;
                  }
                  line.itemCode = itemLine.id;
                  line.price = itemLine.price;
                  line.lineTotal = line.price * line.quantity;
                  line.lineTotalAfRound = line.lineTotal = this.authService.roundingValue(line.lineTotal, "RoundToTenHundredth", decimalPlacesFormat);// this.authService.decimalTransformDisplay(line.lineTotal);
                  //this.authService.roundingValue(line.price * line.quantity, typeRounding?.roundingMethod);
                  if (item?.weightScaleBarcode !== null && item?.weightScaleBarcode !== undefined && item?.weightScaleBarcode?.length > 0) {
                    if (this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                      // xxxx 
                      line.lineTotal = this.authService.roundingValue(line.lineTotal, "RoundToTenHundredth", decimalPlacesFormat);// this.authService.roundingAmount(line.lineTotal);  
                    }
                  }
                  //line.price * line.quantity;
                  line.uomCode = itemLine.uom;
                  line.barCode = itemLine.barcode;
                  line.allowSalesNegative = line.allowSalesNegative;
                  // line.taxCode= item.
                  line.storeAreaId = itemLine.storeAreaId;
                  line.timeFrameId = itemLine.timeFrameId;
                  line.appointmentDate = itemLine.appointmentDate;
                  line.promoId = itemLine.promotionPromoCode;


                  line.isPromo = itemLine.promotionIsPromo;
                  line.isSerial = itemLine.isSerial;
                  line.isVoucher = itemLine.isVoucher;
                  line.itemType = itemLine.customField1;
                  line.openQty = line.quantity;
                  line.description = item.productName;
                  line.remark = itemLine.note;
                  // line.custom1 = item.custom1;
                  line.custom2 = item.custom2;
                  line.custom3 = item.custom3;
                  line.custom4 = item.custom4;
                  line.custom5 = item?.mappingCode ?? item.custom5;
                  line.productId = item.productId;
                  line.weightScaleBarcode = item.weightScaleBarcode;
                  line.allowSalesNegative = item.allowSalesNegative;
                  line.discountType = discountType;

                  if (item.promotionPromoCode !== null && item.promotionPromoCode !== undefined && item.promotionPromoCode !== "" && item.promotionPromoCode?.length > 0) {

                    line.promoType = item.promotionType;
                    line.promoPercent = item.promotionDiscountPercent;
                    line.promoPrice = item.promotionPriceAfDis;
                    line.promoLineTotal = (item.promotionLineTotal / item.quantity) * item.quantity;

                    line.promoDisAmt = (item.promotionDisAmt / item.quantity) * item.quantity;
                    line.discountRate = item.promotionDiscountPercent;
                    // line.discountAmt = (item.promotionLineTotal / item.quantity) * itemCapacity.quantity; item.promotionDisAmt;
                    line.discountType = line.promoType;

                    if (line.discountType === 'Discount Percent') {
                      item.discountValue = line.discountRate;
                    }
                    if (line.discountType === 'Discount Amount') {
                      item.discountValue = line.promoDisAmt;
                    }

                  }

                  const value = 0;
                  // debugger;

                  if (line.discountType === 'Discount Percent') {
                    line.discountRate = item.discountValue;
                    if (line.discountRate === 0 || line.discountRate === undefined || line.discountRate === null) {
                      line.discountAmt = 0;
                    }
                    else {
                      line.discountRate = this.authService.roundingValue(line.discountRate, "RoundUp", percentPlacesFormat);

                      line.discountAmt = (itemLine.quantity * itemLine.price) * line.discountRate / 100;
                      line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);;// this.authService.roundingAmount( line.discountAmt); 

                    }

                  }
                  if (line.discountType === 'Discount Amount') {
                    // line.discountRate = (itemLine.quantity * itemLine.price) *  (itemLine.quantity * itemLine.price)/ 100;
                    line.discountAmt = item.discountValue;
                    if (line.discountAmt === 0 || line.discountAmt === undefined || line.discountAmt === null) {
                      line.discountRate = 0;
                    }
                    else {
                      line.discountRate = line.discountAmt * 100 / (line.quantity * line.price);
                    }

                  }
                  if (line.discountType === 'Fixed Quantity') {
                    line.discountRate = 100;
                    line.discountAmt = line.lineTotal;// (itemLine.quantity * itemLine.price) * line.discountRate / 100;
                  }
                  if (line.discountType === 'Fixed Price') {
                    debugger;
                    // line.discountRate = item.discountValue;
                    // line.discountAmt = item.quantity * item.price * line.discountRate / 100;
                    if (item?.promotionDisAmt !== undefined && item?.promotionDisAmt !== null && item?.promotionDisAmt > 0) {
                      line.discountAmt = item.promotionDisAmt;
                      if (item?.promotionDiscountPercent !== undefined && item?.promotionDiscountPercent !== null) {
                        line.discountRate = item.promotionDiscountPercent;
                      }
                      else {
                        line.discountRate = line.discountAmt * 100 / (line.quantity * line.price);
                      }
                    }
                    else {
                      if (line.discountRate !== null && line.discountRate !== undefined) {
                        line.discountRate = this.authService.roundingValue(line.discountRate, "RoundUp", percentPlacesFormat);

                        line.discountAmt = line.quantity * line.price * line.discountRate / 100;
                        // line.discountAmt = this.authService.roundingAmount( line.discountAmt); 
                        line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);// this.authService.roundingAmount( line.discountAmt); 

                      }
                    }

                  }
                  // debugger;
                  if (line.discountAmt !== undefined && line.discountAmt !== null && Math.abs(line.discountAmt) > 0) {

                    line.lineTotalBefDis = line.lineTotal;
                    // line.lineTotal = line.lineTotal - (isNegative === true ? -line.discountAmt : line.discountAmt);

                    //2022/16/02 Sửa lại thông tin exchange return đơn hàng mới

                    let totalCalcul = Math.abs(line.lineTotal) - Math.abs(line.discountAmt);
                    totalCalcul = line.quantity < 0 ? -totalCalcul : totalCalcul;
                    line.lineTotal = totalCalcul;//(isNegative === true  ? -totalCalcul :  totalCalcul)   ;
                    line.discountAmt = line.quantity < 0 ? -Math.abs(line.discountAmt) : Math.abs(line.discountAmt); // dòng này thêm mới
                    if ((basket.getValue().salesType.toLowerCase() === "ex" || basket.getValue().salesType.toLowerCase() === "exchange") && line.quantity > 0) {
                      line.lineTotal = totalCalcul;
                    }
                    // let  discountAmtCal = (item.isNegative === true  ? -discountAmt : discountAmt);// 

                    // đóng cái cũ lại
                    // line.lineTotal = line.lineTotal - (isNegative === true ? -line.discountAmt : line.discountAmt);

                    if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                      let discountVl = (line.lineTotal * order.discountRate / 100);
                      line.lineTotalDisIncludeHeader = line.lineTotal - this.authService.roundingValue(discountVl, "RoundUp", decimalPlacesFormat);
                      // line.lineTotalDisIncludeHeader = this.authService.roundingAmount( line.lineTotalDisIncludeHeader); 
                    }
                    else {
                      line.lineTotalDisIncludeHeader = line.lineTotal;
                    }
                  }
                  else {
                    line.lineTotalBefDis = line.lineTotal;
                    if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                      let discountVl = (line.lineTotal * order.discountRate / 100);
                      line.lineTotalDisIncludeHeader = line.lineTotal - this.authService.roundingValue(discountVl, "RoundUp", decimalPlacesFormat);
                      // line.lineTotalDisIncludeHeader = line.lineTotal - (line.lineTotal * order.discountRate / 100);
                      // line.lineTotalDisIncludeHeader = this.authService.roundingAmount( line.lineTotalDisIncludeHeader); 
                    }
                    else {
                      line.lineTotalDisIncludeHeader = line.lineTotal;
                    }
                  }
                  // if (discountType == 'Bonus Amount') {
                  //   line.discountRate = (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
                  //   line.discountAmt = item.quantity * item.price - item.lineTotal;
                  // }
                  if (item.customField1 === "Card") {
                    line.prepaidCardNo = itemLine.prepaidCardNo;
                    if (line.discountType === 'Bonus Percent' || line.discountType === 'Bonus Amount') {
                      line.discountRate = item.promotionDisPrcnt;
                      line.discountAmt = item.promotionDisAmt;
                    }
                    // k phân biệt IsSerial hay không nữa 2021/12/24
                    // if (itemLine.isSerial === true) {
                    line.startDate = new Date();
                    let nextmonth = new Date((new Date()).setDate(line.startDate.getMonth() + 1));
                    if (item.customField2 !== null && item.customField2 !== undefined && item.customField2 !== "" && item.customField2 !== "0") {
                      let month = parseInt(item.customField2);
                      nextmonth = new Date((new Date()).setDate(line.startDate.getMonth() + month));
                    }


                    line.endDate = nextmonth;//line.startDate.setMonth(line.startDate.getMonth()+ 1);
                    // }

                    line.lineTotal = line.price * line.quantity;

                    line.lineTotalAfRound = line.lineTotal = this.authService.roundingValue(line.lineTotal, "RoundToTenHundredth", decimalPlacesFormat);// this.authService.decimalTransformDisplay(line.lineTotal);

                    // if()
                  }
                  // if(line.promoId !==null && line.promoId!==undefined)
                  // {
                  //   line.promoType= itemLine.promotionType;
                  //   line.promoPercent= itemLine.promotionDiscountPercent;
                  //   line.promoPrice = itemLine.promotionPriceAfDis;
                  //   line.promoLineTotal = itemLine.promotionLineTotal;

                  //   line.promoDisAmt = itemLine.promotionDisAmt;
                  //   line.discountRate = itemLine.promotionDiscountPercent;
                  //   line.discountAmt = itemLine.promotionDisAmt;
                  //   line.discountType = line.promoType;
                  // }
                  line.status = "C";
                  line.bookletNo = item.bookletNo;
                  // debugger;
                  line.baseLine = parseInt(itemLine.baseLine);
                  line.baseTransId = itemLine.baseTransId;
                  line.slocId = itemLine.slocId;
                  // line.taxCode = itemLine.salesTaxCode;
                  // line.taxRate = itemLine.salesTaxRate;
                  line.taxCode = item.salesTaxCode;
                  line.taxRate = item.salesTaxRate;
                  line.priceListId = item.priceListId;
                  // if(item.customField1==="Card")
                  // {
                  //   line.taxAmt =line.lineTotal * line.taxRate / 100;
                  // }
                  // else
                  // {

                  // }
                  line.taxAmt = line.lineTotal * line.taxRate / 100;
                  if (line.taxAmt === null || line.taxAmt === undefined) {
                    line.taxAmt = 0;
                  }
                  // debugger;
                  if (order.salesType.toLowerCase() === "table") {
                    line.itemTypeS4 = itemLine.itemGroupId ?? "";
                  }
                  else {
                    line.itemTypeS4 = itemLine.itemCategory_1;
                  }
                  line.priceListId = itemLine.priceListId;
                  order.totalTax += line.taxAmt;
                  order.lines.push(line);
                  // && item.customField1==='Retail')
                  if (itemLine.isSerial === true || itemLine.isVoucher === true) {
                    var serialLines = itemLine.lineItems;
                    if (serialLines !== null && serialLines.length > 0) {
                      serialLines.forEach((itemserial) => {
                        const serialline = new TSalesLineSerial();
                        serialline.itemCode = line.itemCode;
                        serialline.serialNum = itemserial.serialNum;
                        serialline.slocId = line.slocId;
                        serialline.uomCode = line.uomCode;
                        serialline.expDate = itemserial.expDate;
                        if (line?.bookletNo?.length > 0) {
                          serialline.customF1 = line?.bookletNo;
                        }

                        // debugger;
                        if (line.promoId !== null && line.promoId !== undefined && line.promoId !== '') {
                          let str: any = line.promoId.split(', ');
                          serialline.sapBonusBuyId = ""
                          let valueX = basket.getValue().promotionApply;
                          if (str?.length > 0) {
                            str.forEach(element => {
                              // debugger;
                              if (element !== null && element !== undefined && element !== '') {
                                let getSAP = valueX.find(x => x.promoId === element).sapBonusBuyId;
                                serialline.sapBonusBuyId += getSAP + ',';
                              }

                              // line.sapPromoId 
                            });
                          }
                        }
                        serialline.quantity = itemLine.isNegative === true ? -serialline.quantity : serialline.quantity;
                        // serialline.quantity = isNegative === true ? - itemserial.quantity : itemserial.quantity;
                        if ((basket.getValue().salesType.toLowerCase() === "ex" || basket.getValue().salesType.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                          serialline.quantity = isNegative === true ? itemserial.quantity : -itemserial.quantity;
                        }
                        else {
                          serialline.quantity = isNegative === true ? - itemserial.quantity : itemserial.quantity;
                        }
                        serialline.status = "C";
                        serialline.createdBy = order.createdBy;
                        serialline.phone = itemserial.phone;
                        serialline.name = itemserial.name;
                        serialline.price = itemserial.price ?? line.price;;
                        order.serialLines.push(serialline);
                      });
                    }

                  }
                  if (item.isBOM === true) {
                    var bomLines = item.lineItems;
                    if (bomLines !== null && bomLines.length > 0) {
                      bomLines.forEach((itemBom) => {
                        const BOMline = new TSalesLine();
                        BOMline.itemCode = itemBom.id;
                        BOMline.price = itemBom.price;
                        // BOMline.quantity = itemBom.quantity;
                        // BOMline.quantity = isNegative === true ? - itemBom.lineTotal : itemBom.lineTotal;
                        // BOMline.quantity = itemLine.isNegative === true ? -itemBom.quantity : itemBom.quantity;
                        if ((basket.getValue().salesType.toLowerCase() === "ex" || basket.getValue().salesType.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                          BOMline.quantity = isNegative === true ? itemBom.lineTotal : -itemBom.lineTotal;
                        }
                        else {
                          BOMline.quantity = isNegative === true ? - itemBom.lineTotal : itemBom.lineTotal;
                        }
                        BOMline.uomCode = itemBom.uom;
                        BOMline.storeAreaId = itemBom.storeAreaId;
                        BOMline.timeFrameId = itemBom.timeFrameId;
                        BOMline.appointmentDate = itemBom.appointmentDate;
                        // BOMline.lineTotal = line.price * line.quantity;
                        BOMline.lineTotal = isNegative === true ? - itemBom.lineTotal : itemBom.lineTotal;
                        const value = 0;
                        let discountType = itemBom.type;
                        BOMline.discountType = discountType;
                        if (discountType === 'percent' || discountType === 'Discount Percent') {
                          BOMline.discountRate = itemBom.discountValue;
                          BOMline.discountAmt = itemBom.quantity * itemBom.price * BOMline.discountRate / 100;
                          BOMline.discountAmt = this.authService.roundingValue(BOMline.discountAmt, "RoundUp", decimalPlacesFormat);//this.authService.roundingAmount(BOMline.discountAmt); 
                        }
                        if (discountType === 'amount' || discountType === 'Discount Amount') {
                          // BOMline.discountRate = (itemBom.quantity * itemBom.price - itemBom.lineTotal) *  (itemBom.quantity * itemBom.price)/ 100;
                          BOMline.discountAmt = itemBom.discountValue;
                          BOMline.discountRate = BOMline.discountAmt * 100 / (BOMline.quantity * BOMline.price);
                        }
                        if (BOMline.promoId !== null && BOMline.promoId !== undefined) {
                          BOMline.promoType = itemBom.promotionType;
                          BOMline.promoPercent = itemBom.promotionDiscountPercent;
                          BOMline.promoPrice = itemBom.promotionPriceAfDis;
                          BOMline.promoLineTotal = itemBom.promotionLineTotal;

                          BOMline.promoDisAmt = itemBom.promotionDisAmt;
                          BOMline.discountRate = itemBom.promotionDiscountPercent;
                          BOMline.discountAmt = itemBom.promotionDisAmt;
                          BOMline.discountType = BOMline.promoType;
                        }
                        BOMline.taxCode = itemBom.salesTaxCode;
                        BOMline.taxRate = itemBom.salesTaxRate;
                        BOMline.taxAmt = BOMline.price * BOMline.quantity * BOMline.discountAmt * BOMline.taxRate;
                        BOMline.status = "C";
                        BOMline.slocId = this.authService.storeSelected().whsCode;//"SL001";
                        BOMline.bomId = line.itemCode;
                        order.lines.push(BOMline);
                      });
                    }

                  }
                  // // debugger;
                  if (item.promotionPromoCode !== null && item.promotionPromoCode !== undefined && item.promotionPromoCode !== "") {

                    const promoLine = new TSalesPromo();
                    promoLine.itemCode = item.id;
                    promoLine.barCode = item.id + item.uom;
                    promoLine.value = isNegative === true ? - item.quantity : item.quantity;
                    // promoLine.value = item.quantity;
                    promoLine.uomCode = item.uom;
                    promoLine.barCode = item.barcode;
                    promoLine.refTransId = item.refTransId;
                    promoLine.applyType = item.applyType;
                    promoLine.promoId = item.promotionPromoCode;
                    promoLine.itemGroupId = item.promotionItemGroup;
                    promoLine.createdBy = order.createdBy;
                    promoLine.promoAmt = item.promotionDisAmt;
                    promoLine.promoPercent = item.promotionDiscountPercent;
                    promoLine.promoType = item.promotionType;
                    // const value = 0;
                    // let discountType= ;
                    promoLine.status = "C";
                    order.promoLines.push(promoLine);
                  }
                });
              }


            });
            newArray = [];

            items.forEach(val => newArray.push(Object.assign({}, val)));
            newArray.forEach((item) => {
              // Array.prototype.forEach.call(items, item => {
              let line = new TSalesLine();
              //2
              if (item?.productId === "10089824") {
                debugger;
              }

              if (item.customField1 !== "Class" && item.customField1 !== "Member" && item.customField1 !== 'Card') {
                // debugger;
                item.quantity = item.isNegative === true ? -item.quantity : item.quantity;
                let discountType = item.discountType;

                if (item.isCapacity) {
                  // console.log(item.lineItems);
                  item.lineItems.forEach(itemCapacity => {
                    line = new TSalesLine();


                    line.itemCode = itemCapacity.id;
                    line.price = itemCapacity.price;

                    // line.quantity = itemCapacity.quantity;
                    // line.quantity = isNegative === true ? - itemCapacity.quantity : itemCapacity.quantity;
                    itemCapacity.quantity = itemCapacity?.isNegative === true ? -itemCapacity.quantity : itemCapacity.quantity;
                    if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue()?.salesType?.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                      line.quantity = isNegative === true ? itemCapacity.quantity : -itemCapacity.quantity;
                    }
                    else {
                      line.quantity = isNegative === true ? - itemCapacity.quantity : itemCapacity.quantity;
                    }
                    // line.lineTotal = line.price * line.quantity;
                    line.lineTotal = line.price * line.quantity;
                    line.lineTotalAfRound = line.lineTotal = this.authService.roundingValue(line.lineTotal, "RoundToTenHundredth", decimalPlacesFormat);// this.authService.decimalTransformDisplay(line.lineTotal);

                    //this.authService.roundingValue(line.price * line.quantity, typeRounding?.roundingMethod);
                    // debugger;
                    line.uomCode = itemCapacity.uom;
                    line.barCode = itemCapacity.barcode;
                    line.description = itemCapacity.productName;
                    line.storeAreaId = itemCapacity.storeAreaId;
                    line.timeFrameId = itemCapacity.timeFrameId;
                    line.appointmentDate = itemCapacity.appointmentDate;
                    line.promoId = item?.promotionPromoCode ?? "";
                    line.remark = itemCapacity.note;
                    line.baseLine = parseInt(item.baseLine);
                    line.baseTransId = item.baseTransId;
                    // line.promoType= item.promotionType;
                    // line.promoPercent= item.promotionDiscountPercent;
                    // line.promoPrice = item.promotionPriceAfDis;
                    // line.promoLineTotal = item.promotionLineTotal;
                    // line.promoDisAmt = item.promotionDisAmt;
                    line.openQty = itemCapacity.quantity;
                    line.priceListId = itemCapacity.priceListId;
                    line.isPromo = itemCapacity.promotionIsPromo;
                    line.isSerial = itemCapacity.isSerial;
                    line.isVoucher = itemCapacity.isVoucher;
                    line.itemType = itemCapacity.customField1;
                    line.discountType = discountType;

                    if (item.promotionPromoCode !== null && item.promotionPromoCode !== undefined && item.promotionPromoCode !== "" && item.promotionPromoCode?.length > 0) {
                      line.promoType = item.promotionType;
                      line.promoPercent = item.promotionDiscountPercent;
                      line.promoPrice = item.promotionPriceAfDis;
                      line.promoLineTotal = (item.promotionLineTotal / item.quantity) * itemCapacity.quantity;

                      line.promoDisAmt = (item.promotionDisAmt / item.quantity) * itemCapacity.quantity;
                      line.discountRate = item.promotionDiscountPercent;
                      // line.discountAmt = (item.promotionLineTotal / item.quantity) * itemCapacity.quantity; item.promotionDisAmt;
                      line.discountType = line.promoType;
                      if (line.discountType === 'Discount Percent') {
                        item.discountValue = line.discountRate;
                      }
                      if (line.discountType === 'Discount Amount') {
                        item.discountValue = line.promoDisAmt;
                      }
                    }

                    const value = 0;
                    // line.discountType = discountType; //= line.discountType;

                    if (line.discountType === 'Discount Percent') {
                      // line.discountRate = itemCapacity.discountValue;
                      // line.discountAmt = itemCapacity.quantity * itemCapacity.price - itemCapacity.lineTotal;
                      line.discountRate = item.discountValue;

                      if (line.discountRate === 0 || line.discountRate === undefined || line.discountRate === null) {
                        line.discountAmt = 0;
                      }
                      else {
                        line.discountRate = this.authService.roundingValue(line.discountRate, "RoundUp", percentPlacesFormat);

                        line.discountAmt = itemCapacity.quantity * item.price * line.discountRate / 100;

                        line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);

                      }
                    }
                    if (line.discountType === 'Discount Amount') {
                      line.discountAmt = item.discountValue / item.quantity;
                      line.discountAmt = line.discountAmt * line.quantity;
                      if (line.discountAmt === 0 || line.discountAmt === undefined || line.discountAmt === null) {
                        line.discountRate = 0;

                      }
                      else {
                        // line.discountRate = line.discountAmt * 100 / (line.quantity * line.price);
                        line.discountRate = line.discountAmt * 100 / itemCapacity.lineTotal;// (item.quantity * item.price - item.lineTotal) *  (item.quantity * item.price)/ 100;
                      }
                    }
                    if (line.discountType === 'Fixed Quantity') {
                      line.discountRate = 100;
                      line.discountAmt = line.discountAmt = line.lineTotal;
                    }
                    if (line.discountType === 'Fixed Price') {
                      debugger;
                      // line.discountRate = item.discountValue;
                      // line.discountAmt = line.quantity * line.price * line.discountRate / 100;
                      if (item?.promotionDisAmt !== undefined && item?.promotionDisAmt !== null && item?.promotionDisAmt > 0) {
                        line.discountAmt = item.promotionDisAmt;
                        if (item?.promotionDiscountPercent !== undefined && item?.promotionDiscountPercent !== null) {
                          line.discountRate = item.promotionDiscountPercent;
                        }
                        else {
                          line.discountRate = line.discountAmt * 100 / (line.quantity * line.price);
                        }
                      }
                      else {
                        if (line.discountRate !== null && line.discountRate !== undefined) {
                          line.discountRate = this.authService.roundingValue(line.discountRate, "RoundUp", percentPlacesFormat);
                          line.discountAmt = line.quantity * line.price * line.discountRate / 100;
                          line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);//this.authService.roundingAmount(line.discountAmt); 

                        }
                      }

                    }
                    // debugger;
                    if (line.discountAmt !== undefined && line.discountAmt !== null && line.discountAmt > 0) {
                      line.lineTotalBefDis = line.lineTotal;
                      // line.lineTotal =  line.lineTotal - line.discountAmt;

                      //2022/16/02 Sửa lại thông tin exchange return đơn hàng mới
                      // line.discountAmt = Math.abs(line.discountAmt); // dòng này thêm mới
                      let totalCalcul = Math.abs(line.lineTotal) - Math.abs(line.discountAmt);
                      totalCalcul = line.quantity < 0 ? -totalCalcul : totalCalcul;
                      line.lineTotal = totalCalcul;//(isNegative === true  ? -totalCalcul :  totalCalcul)   ;
                      line.discountAmt = line.quantity < 0 ? -Math.abs(line.discountAmt) : Math.abs(line.discountAmt); // dòng này thêm mới
                      if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && line.quantity > 0) {
                        line.lineTotal = totalCalcul;
                      }

                      // let  discountAmtCal = (item.isNegative === true  ? -discountAmt : discountAmt);// 

                      // đóng cái cũ lại
                      // line.lineTotal = line.lineTotal - (isNegative === true ? -line.discountAmt : line.discountAmt);

                      if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                        let AmountVl = (line.lineTotal * order.discountRate / 100);
                        line.lineTotalDisIncludeHeader = line.lineTotal - this.authService.roundingValue(AmountVl, "RoundUp", decimalPlacesFormat);
                        // line.lineTotalDisIncludeHeader = this.authService.roundingAmount(line.lineTotalDisIncludeHeader); 
                      }
                      else {
                        line.lineTotalDisIncludeHeader = line.lineTotal;
                      }
                    }
                    else {
                      line.lineTotalBefDis = line.lineTotal;
                      if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                        // line.lineTotalDisIncludeHeader = line.lineTotal - (line.lineTotal * order.discountRate / 100);
                        // line.lineTotalDisIncludeHeader = this.authService.roundingAmount(line.lineTotalDisIncludeHeader); 
                        let AmountVl = (line.lineTotal * order.discountRate / 100);
                        line.lineTotalDisIncludeHeader = line.lineTotal - this.authService.roundingValue(AmountVl, "RoundUp", decimalPlacesFormat);
                      }
                      else {
                        line.lineTotalDisIncludeHeader = line.lineTotal;
                      }
                    }
                    line.status = "C";
                    line.slocId = itemCapacity.slocId;
                    line.prepaidCardNo = itemCapacity.prepaidCardNo;
                    line.memberDate = itemCapacity.memberDate;
                    line.memberValue = itemCapacity.memberValue;
                    line.taxCode = itemCapacity.salesTaxCode;
                    line.taxRate = itemCapacity.salesTaxRate;

                    // line.taxAmt = line.price * line.quantity * line.discountAmt * line.taxRate;
                    line.taxAmt = line.lineTotal * line.taxRate / 100;
                    if (line.taxAmt === null || line.taxAmt === undefined) {
                      line.taxAmt = 0;
                    }
                    order.totalTax += line.taxAmt;
                    order.lines.push(line);


                  });
                }
                else {
                  line.itemCode = item.id;


                  line.price = item.price;
                  line.bookletNo = item.bookletNo;
                  // line.quantity = item.quantity;
                  // line.quantity = isNegative === true ? - item.quantity : item.quantity;

                  if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                    line.quantity = isNegative === true ? item.quantity : -item.quantity;
                  }
                  else {
                    // if(item.allowSalesNegative)
                    // {
                    //   line.quantity = isNegative === true ? item.quantity : -item.quantity;
                    // }
                    // else
                    // {
                    // }
                    line.quantity = isNegative === true ? - item.quantity : item.quantity;

                  }
                  line.lineTotal = line.price * line.quantity;
                  line.lineTotalAfRound = line.lineTotal = this.authService.roundingValue(line.lineTotal, "RoundToTenHundredth", decimalPlacesFormat);// this.authService.decimalTransformDisplay(line.lineTotal);

                  if (item?.weightScaleBarcode !== null && item?.weightScaleBarcode !== undefined && item?.weightScaleBarcode?.length > 0) {
                    if (this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                      // line.lineTotal = this.authService.roundingAmount(line.lineTotal);  
                      line.lineTotal = this.authService.roundingValue(line.lineTotal, "RoundToTenHundredth", decimalPlacesFormat);// 
                    }
                  }
                  // line.lineTotal = this.authService.roundingValue(line.price * line.quantity, typeRounding?.roundingMethod);
                  line.uomCode = item.uom;
                  line.barCode = item.barcode;
                  line.description = item.productName;
                  line.storeAreaId = item.storeAreaId;
                  line.timeFrameId = item.timeFrameId;
                  line.appointmentDate = item.appointmentDate;
                  line.promoId = item.promotionPromoCode;
                  line.remark = item.note;
                  line.custom1 = item.custom1;
                  line.custom2 = item.custom2;
                  line.custom3 = item.custom3;
                  line.custom4 = item.custom4;
                  line.custom5 = item?.mappingCode ?? item.custom5; // item.custom5;
                  line.productId = item.productId;
                  line.weightScaleBarcode = item.weightScaleBarcode;
                  line.allowSalesNegative = item.allowSalesNegative;
                  // debugger;
                  line.baseLine = parseInt(item.baseLine);
                  line.baseTransId = item.baseTransId;
                  // line.promoType= item.promotionType;
                  // line.promoPercent= item.promotionDiscountPercent;
                  // line.promoPrice = item.promotionPriceAfDis;
                  // line.promoLineTotal = item.promotionLineTotal;
                  // line.promoDisAmt = item.promotionDisAmt;
                  line.openQty = item.quantity;

                  line.isPromo = item.promotionIsPromo;
                  line.isSerial = item.isSerial;
                  line.isVoucher = item.isVoucher;
                  line.itemType = item.customField1;

                  line.discountType = discountType;

                  if (line.promoId !== null && line.promoId !== undefined && line.promoId !== "" && line.promoId?.length > 0) {
                    line.promoType = item.promotionType;
                    line.promoPercent = item.promotionDiscountPercent;
                    line.promoPrice = item.promotionPriceAfDis;
                    line.promoLineTotal = item.promotionLineTotal;

                    line.promoDisAmt = item.promotionDisAmt;
                    line.discountRate = item.promotionDiscountPercent;
                    line.discountAmt = item.promotionDisAmt;
                    line.discountType = line.promoType;
                    if (line.discountType === 'Discount Percent') {
                      item.discountValue = line.discountRate;
                    }
                    if (line.discountType === 'Discount Amount') {
                      item.discountValue = line.promoDisAmt;
                    }
                  }
                  const value = 0;
                  // let discountType = line.discountType; //(item.type === null || item.type === undefined || item.type ==='') ? : item.type;
                  // debugger;
                  if (line.discountType === 'Discount Percent') {
                    line.discountRate = item.discountValue;
                    if (line.discountRate === 0 || line.discountRate === undefined || line.discountRate === null) {
                      line.discountAmt = 0;
                    }
                    else {
                      line.discountRate = this.authService.roundingValue(line.discountRate, "RoundUp", percentPlacesFormat);

                      line.discountAmt = item.quantity * item.price * line.discountRate / 100;
                      // line.discountAmt = this.authService.roundingAmount(line.discountAmt); 
                      // let AmountVl = (line.lineTotal * order.discountRate / 100);
                      line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);
                      if (item?.weightScaleBarcode !== null && item?.weightScaleBarcode !== undefined && item?.weightScaleBarcode?.length > 0) {
                        if (this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                          line.discountAmt = (line.lineTotal ?? this.authService.roundingAmount(item.quantity * item.price)) * line.discountRate / 100;
                          line.discountAmt = this.authService.roundingAmount(line.discountAmt);
                        }
                      }
                    }

                  }
                  if (line.discountType === 'Discount Amount') {
                    line.discountAmt = item.discountValue;

                    if (line.discountAmt === 0 || line.discountAmt === undefined || line.discountAmt === null) {
                      line.discountRate = 0;
                    }
                    else {
                      line.discountRate = line.discountAmt * 100 / (line.quantity * line.price);
                    }
                    // (item.quantity * item.price - item.lineTotal)
                  }
                  if (line.discountType === 'Fixed Quantity') {
                    line.discountRate = 100;
                    line.discountAmt = line.lineTotal;
                  }
                  if (line.discountType === 'Fixed Price') {
                    // line.discountRate = l.discountValue;
                    debugger;
                    if (item?.promotionDisAmt !== undefined && item?.promotionDisAmt !== null && item?.promotionDisAmt > 0) {
                      line.discountAmt = item.promotionDisAmt;
                      if (item?.promotionDiscountPercent !== undefined && item?.promotionDiscountPercent !== null) {
                        line.discountRate = item.promotionDiscountPercent;
                      }
                      else {
                        line.discountRate = line.discountAmt * 100 / (line.quantity * line.price);
                      }
                    }
                    else {
                      debugger;
                      line.discountRate = this.authService.roundingValue(line.discountRate, "RoundUp", percentPlacesFormat);
                      line.discountAmt = line.quantity * line.price * line.discountRate / 100;
                      // line.discountAmt = this.authService.roundingAmount(line.discountAmt); 
                      line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);
                      if (item?.weightScaleBarcode !== null && item?.weightScaleBarcode !== undefined && item?.weightScaleBarcode?.length > 0) {
                        if (this.priceWScaleWithCfg !== null && this.priceWScaleWithCfg !== undefined && this.priceWScaleWithCfg === 'true') {
                          line.discountAmt = (line.lineTotal ?? this.authService.roundingAmount(item.quantity * item.price)) * line.discountRate / 100;
                          line.discountAmt = this.authService.roundingAmount(line.discountAmt);
                        }
                      }
                    }

                    // if (line.discountRate !== null && line.discountRate !== undefined) {
                    //   debugger;
                    //   line.discountRate = this.authService.roundingValue(line.discountRate,"RoundUp", percentPlacesFormat); 
                    //   line.discountAmt =  line.quantity  * line.price * line.discountRate / 100;
                    //   // line.discountAmt = this.authService.roundingAmount(line.discountAmt); 
                    //   line.discountAmt =  this.authService.roundingValue(line.discountAmt, "RoundUp" , decimalPlacesFormat);
                    //   if(item?.weightScaleBarcode!== null && item?.weightScaleBarcode!==undefined && item?.weightScaleBarcode?.length>0)
                    //   {
                    //     if(this.priceWScaleWithCfg!==null && this.priceWScaleWithCfg!==undefined && this.priceWScaleWithCfg ==='true')
                    //     {
                    //       line.discountAmt = (line.lineTotal??this.authService.roundingAmount(item.quantity * item.price)) * line.discountRate / 100;
                    //       line.discountAmt = this.authService.roundingAmount(line.discountAmt);  
                    //     } 
                    //   }
                    // }
                  }

                  // debugger;
                  if (line.discountAmt !== undefined && line.discountAmt !== null && Math.abs(line.discountAmt) > 0) {
                    line.lineTotalBefDis = line.lineTotal;

                    // line.lineTotal =  line.lineTotal - line.discountAmt;

                    //2022/16/02 Sửa lại thông tin exchange return đơn hàng mới
                    // line.discountAmt = Math.abs(line.discountAmt); // dòng này thêm mới
                    let totalCalcul = Math.abs(line.lineTotal) - Math.abs(line.discountAmt);
                    totalCalcul = line.quantity < 0 ? -totalCalcul : totalCalcul;
                    line.lineTotal = totalCalcul;//(isNegative === true  ? -totalCalcul :  totalCalcul)   ;
                    line.discountAmt = line.quantity < 0 ? -Math.abs(line.discountAmt) : Math.abs(line.discountAmt); // dòng này thêm mới
                    if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && line.quantity > 0) {
                      line.lineTotal = totalCalcul;
                    }
                    // let  discountAmtCal = (item.isNegative === true  ? -discountAmt : discountAmt);// 

                    // đóng cái cũ lại
                    // line.lineTotal = line.lineTotal - (isNegative === true ? -line.discountAmt : line.discountAmt);

                    if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                      let AmountVl = (line.lineTotal * order.discountRate / 100);
                      line.lineTotalDisIncludeHeader = line.lineTotal - AmountVl;
                      line.lineTotalDisIncludeHeader = this.authService.roundingValue(line.lineTotalDisIncludeHeader, "RoundUp", decimalPlacesFormat);

                    }
                    else {
                      line.lineTotalDisIncludeHeader = line.lineTotal;
                    }
                  }
                  else {
                    line.lineTotalBefDis = line.lineTotal;
                    if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                      let AmountVl = (line.lineTotal * order.discountRate / 100);
                      line.lineTotalDisIncludeHeader = line.lineTotal - AmountVl;// (line.lineTotal * order.discountRate / 100);
                      line.lineTotalDisIncludeHeader = this.authService.roundingValue(line.lineTotalDisIncludeHeader, "RoundUp", decimalPlacesFormat);
                    }
                    else {
                      line.lineTotalDisIncludeHeader = line.lineTotal;
                    }
                  }
                  line.status = "C";
                  line.slocId = item.slocId;
                  line.prepaidCardNo = item.prepaidCardNo;
                  line.memberDate = item.memberDate;
                  line.memberValue = item.memberValue;
                  line.taxCode = item.salesTaxCode;
                  line.taxRate = item.salesTaxRate;
                  line.priceListId = item.priceListId;
                  // line.taxAmt = line.price * line.quantity * line.discountAmt * line.taxRate;
                  line.taxAmt = line.lineTotal * line.taxRate / 100;
                  if (line.taxAmt === null || line.taxAmt === undefined) {
                    line.taxAmt = 0;
                  }
                  order.totalTax += line.taxAmt;
                  if (order.salesType.toLowerCase() === "table") {
                    line.itemTypeS4 = item.itemGroupId ?? "";
                  }
                  // else
                  // {
                  //   line.itemTypeS4 = line.itemCategory_1;
                  // }

                  order.lines.push(line);
                  if (item.isSerial === true || item.isVoucher === true) {
                    var serialLines = item.lineItems;
                    if (serialLines !== null && serialLines.length > 0) {
                      serialLines.forEach((itemserial) => {
                        const serialline = new TSalesLineSerial();
                        serialline.itemCode = line.itemCode;
                        serialline.serialNum = itemserial.serialNum;
                        serialline.slocId = line.slocId;
                        serialline.uomCode = line.uomCode;
                        serialline.expDate = itemserial.expDate;
                        if (line?.bookletNo?.length > 0) {
                          serialline.customF1 = line?.bookletNo;
                        }

                        // debugger;
                        if (line.promoId !== null && line.promoId !== undefined && line.promoId !== '') {
                          let str: any = line.promoId.split(', ');
                          serialline.sapBonusBuyId = ""
                          let valueX = basket.getValue().promotionApply;
                          if (str?.length > 0) {
                            str.forEach(element => {
                              // debugger;
                              if (element !== null && element !== undefined && element !== '') {
                                let getSAP = valueX.find(x => x.promoId === element).sapBonusBuyId;
                                serialline.sapBonusBuyId += getSAP + ',';
                              }

                              // line.sapPromoId 
                            });
                          }
                        }
                        itemserial.quantity = itemserial?.isNegative === true ? -itemserial.quantity : itemserial.quantity;
                        // serialline.quantity = isNegative === true ? - itemserial.quantity : item.quantity;
                        if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                          itemserial.quantity = isNegative === true ? itemserial.quantity : -itemserial.quantity;
                        }
                        else {
                          itemserial.quantity = isNegative === true ? - itemserial.quantity : itemserial.quantity;
                        }
                        // serialline.quantity = item.quantity;
                        serialline.status = "C";
                        serialline.createdBy = order.createdBy;
                        serialline.price = itemserial.price ?? line.price;
                        order.serialLines.push(serialline);
                      });
                    }

                  }
                  if (item.isBOM === true) {
                    var bomLines = item.lineItems;
                    if (bomLines !== null && bomLines.length > 0) {
                      bomLines.forEach((item) => {
                        const BOMline = new TSalesLine();
                        BOMline.itemCode = item.id;
                        BOMline.price = item.price;
                        // BOMline.quantity = isNegative === true ? - item.lineTotal : item.lineTotal;
                        // BOMline.quantity = isNegative === true ? - item.lineTotal : item.lineTotal;
                        if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                          BOMline.quantity = isNegative === true ? item.lineTotal : - item.lineTotal;
                        }
                        else {
                          BOMline.quantity = isNegative === true ? -  item.lineTotal : item.lineTotal;
                        }
                        // BOMline.quantity = item.quantity;
                        BOMline.uomCode = item.uom;
                        BOMline.barCode = item.barcode;
                        BOMline.storeAreaId = item.storeAreaId;
                        BOMline.timeFrameId = item.timeFrameId;
                        BOMline.appointmentDate = item.appointmentDate;
                        // BOMline.lineTotal = line.price * line.quantity;
                        BOMline.lineTotal = isNegative === true ? - item.lineTotal : item.lineTotal;
                        const value = 0;

                        let discountType = line.discountType; //(item.type === null || item.type === undefined || item.type ==='') ? item.discountType : item.type;
                        BOMline.discountType = discountType;
                        if (discountType === 'percent' || discountType === 'Discount Percent') {
                          BOMline.discountRate = item.discountValue;
                          // BOMline.discountAmt = BOMline.quantity * BOMline.price - BOMline.lineTotal;
                          BOMline.discountAmt = item.quantity * item.price * line.discountRate / 100;
                          BOMline.discountAmt = this.authService.roundingValue(BOMline.discountAmt, "RoundUp", decimalPlacesFormat);
                          //this.authService.roundingAmount(BOMline.discountAmt); 
                        }
                        if (discountType === 'amount' || discountType === 'Discount Amount') {
                          // BOMline.discountRate = (BOMline.quantity * BOMline.price - BOMline.lineTotal) *  (BOMline.quantity * BOMline.price)/ 100;
                          BOMline.discountAmt = item.discountValue;
                          BOMline.discountRate = BOMline.discountAmt * 100 / (BOMline.quantity * BOMline.price);

                        }
                        if (BOMline.promoId !== null && BOMline.promoId !== undefined && BOMline.promoId !== "") {
                          BOMline.promoType = item.promotionType;
                          BOMline.promoPercent = item.promotionDiscountPercent;
                          BOMline.promoPrice = item.promotionPriceAfDis;
                          BOMline.promoLineTotal = item.promotionLineTotal;

                          BOMline.promoDisAmt = item.promotionDisAmt;
                          BOMline.discountRate = item.promotionDiscountPercent;
                          BOMline.discountAmt = item.promotionDisAmt;
                          BOMline.discountType = BOMline.promoType;
                        }
                        BOMline.status = "C";
                        BOMline.slocId = this.authService.storeSelected().whsCode;//"SL001";
                        BOMline.bomId = line.itemCode;
                        order.lines.push(BOMline);
                      });
                    }

                  }

                  if (item.promotionPromoCode !== null && item.promotionPromoCode !== undefined && item.promotionPromoCode !== "") {

                    const promoLine = new TSalesPromo();
                    promoLine.itemCode = item.id;
                    promoLine.barCode = item.id + item.uom;
                    // promoLine.value = item.quantity;
                    promoLine.value = isNegative === true ? - item.quantity : item.quantity;
                    promoLine.uomCode = item.uom;
                    promoLine.barCode = item.barcode;
                    promoLine.refTransId = item.refTransId;
                    promoLine.applyType = item.applyType;
                    promoLine.promoId = item.promotionPromoCode;
                    promoLine.itemGroupId = item.promotionItemGroup;
                    promoLine.createdBy = order.createdBy;
                    promoLine.promoAmt = item.promotionDisAmt;
                    promoLine.promoPercent = item.promotionDiscountPercent;
                    promoLine.promoType = item.promotionType;
                    // const value = 0;
                    // let discountType= ;
                    promoLine.status = "C";
                    order.promoLines.push(promoLine);
                  }
                }

              }
              //sss
              if (item.staffs !== null && item.staffs !== undefined && item.staffs?.length > 0) {
                line.staffs = [];
                item.staffs.forEach(staff => {
                  line.staffs.push(staff);
                });
              }

            });
            // debugger;
            if (basket.getValue().staffs !== null && basket.getValue().staffs !== undefined && basket.getValue().staffs?.length > 0) {
              order.staffs = [];
              basket.getValue().staffs.forEach(staff => {
                order.staffs.push(staff);
              });
            }

            this.changeBasketResponseStatus(false);
            order.promoId = basket.getValue().promotionId;
            debugger;
            if (basket.getValue().discountType === 'Discount Percent') {
              order.discountRate = basket.getValue().discountValue;
              order.discountAmount = basketTotal.getValue().discountTotal;
            }
            if (basket.getValue().discountType === 'Discount Amount') {

              order.discountAmount = basketTotal.getValue().discountTotal;
              let totalLine = order.lines.filter(x => x.bomId?.toString() === '').reduce((a, b) => b.lineTotal + a, 0);
              order.discountRate = order.discountAmount / totalLine * 100;

            }
            if (order?.lines !== null && order?.lines !== undefined && order?.lines?.length > 0) {
              order?.lines.forEach((line) => {

                if (line?.bomId === null || line?.bomId === undefined || line?.bomId === '') {
                  if (order.discountRate !== null && order.discountRate !== undefined && order.discountRate != 0) {
                    let AmountVl = (line.lineTotal * order.discountRate / 100);
                    line.lineTotalDisIncludeHeader = line.lineTotal - AmountVl;
                    line.lineTotalDisIncludeHeader = this.authService.roundingValue(line.lineTotalDisIncludeHeader, "RoundUp", decimalPlacesFormat);
                  }
                  else {
                    line.lineTotalDisIncludeHeader = line.lineTotal;
                  }
                }



              });

            }

            // debugger;
            var promoitems = basket.getValue().promoItemApply;
            if (promoitems !== null && promoitems !== undefined && promoitems.length > 0) {
              promoitems.forEach((item) => {
                const line = new TSalesLine();
                line.itemCode = item.id;
                line.price = item.price;
                // line.quantity = isNegative === true ? - item.quantity : item.quantity;
                if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                  line.quantity = isNegative === true ? item.quantity : -item.quantity;
                }
                else {
                  line.quantity = isNegative === true ? - item.quantity : item.quantity;
                }
                // line.quantity = item.quantity;
                line.lineTotal = line.price * line.quantity;
                line.lineTotalAfRound = item.lineTotal;
                line.uomCode = item.uom;
                line.barCode = item.barcode;
                line.storeAreaId = item.storeAreaId;
                line.timeFrameId = item.timeFrameId;
                line.appointmentDate = item.appointmentDate;
                line.baseLine = parseInt(item.baseLine);
                line.baseTransId = item.baseTransId;
                // line.price = item.promotionPriceAfDis;
                // line.lineTotal = item.promotionLineTotal;
                line.promoId = item.promotionPromoCode;
                line.promoType = item.promotionType;
                line.promoPercent = item.promotionDiscountPercent;
                line.itemType = item.customField1;

                line.isPromo = 'Y';
                const value = 0;
                let discountType = (item.type === null || item.type === undefined || item.type === '') ? item.discountType : item.type;

                line.discountType = discountType;
                if (discountType == 'Discount Percent') {
                  line.discountRate = item.discountValue;
                  line.discountAmt = item.quantity * item.price * line.discountRate / 100;
                  line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);
                }
                if (discountType == 'Discount Amount') {
                  line.discountRate = (line.quantity * line.price - line.lineTotal) * (line.quantity * line.price) / 100;
                  line.discountAmt = item.discountValue;
                }
                if (discountType === 'Fixed Quantity') {
                  line.discountRate = 100;
                  line.discountAmt = line.lineTotal;
                }
                if (discountType === 'Fixed Price') {
                  // line.discountRate = item.discountValue;
                  // line.discountAmt = item.quantity * item.price * line.discountRate / 100;
                  if (line.discountRate !== null && line.discountRate !== undefined) {
                    line.discountRate = this.authService.roundingValue(line.discountRate, "RoundUp", percentPlacesFormat);

                    line.discountAmt = line.quantity * line.price * line.discountRate / 100;
                    line.discountAmt = this.authService.roundingValue(line.discountAmt, "RoundUp", decimalPlacesFormat);
                  }
                }
                if (line.promoId !== null && line.promoId !== undefined && line.promoId !== "") {
                  line.promoType = item.promotionType;
                  line.promoPercent = item.promotionDiscountPercent;
                  line.promoPrice = item.promotionPriceAfDis;
                  line.promoLineTotal = item.promotionLineTotal;

                  line.promoDisAmt = item.promotionDisAmt;
                  line.discountRate = item.promotionDiscountPercent;
                  line.discountAmt = item.promotionDisAmt;
                  line.discountType = line.promoType;
                }

                line.status = "C";
                line.slocId = item.slocId;
                line.memberValue = item.memberValue;
                line.taxCode = item.salesTaxCode;
                line.taxRate = item.salesTaxRate;
                // line.taxAmt = line.price * line.quantity * line.discountAmt * line.taxRate;
                line.taxAmt = line.lineTotal * line.taxRate / 100;
                if (line.taxAmt === null || line.taxAmt === undefined) {
                  line.taxAmt = 0;
                }
                order.totalTax += line.taxAmt;
                order.lines.push(line);
                if (item.isSerial === true || item.isVoucher === true) {
                  var serialLines = item.lineItems;
                  if (serialLines !== null && serialLines.length > 0) {
                    serialLines.forEach((itemserial) => {
                      const serialline = new TSalesLineSerial();
                      serialline.itemCode = line.itemCode;
                      serialline.serialNum = itemserial.serialNum;
                      serialline.slocId = line.slocId;
                      serialline.uomCode = line.uomCode;
                      serialline.expDate = itemserial.expDate;
                      if (line?.bookletNo?.length > 0) {
                        serialline.customF1 = line?.bookletNo;
                      }

                      // debugger;
                      if (line.promoId !== null && line.promoId !== undefined && line.promoId !== '') {
                        let str: any = line.promoId.split(', ');
                        serialline.sapBonusBuyId = ""
                        let valueX = basket.getValue().promotionApply;
                        if (str?.length > 0) {
                          str.forEach(element => {
                            // debugger;
                            if (element !== null && element !== undefined && element !== '') {
                              let getSAP = valueX.find(x => x.promoId === element).sapBonusBuyId;
                              serialline.sapBonusBuyId += getSAP + ',';
                            }

                            // line.sapPromoId 
                          });
                        }
                      }


                      // serialline.quantity = item.quantity;
                      // serialline.quantity = isNegative === true ? - itemserial.quantity : itemserial.quantity;
                      if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                        serialline.quantity = isNegative === true ? serialline.quantity : -serialline.quantity;
                      }
                      else {
                        serialline.quantity = isNegative === true ? - serialline.quantity : serialline.quantity;
                      }
                      serialline.status = "C";
                      serialline.price = itemserial.price ?? line.price;;
                      serialline.createdBy = order.createdBy;
                      order.serialLines.push(serialline);
                    });
                  }

                }
                if (item.isBOM === true) {
                  var bomLines = item.lineItems;
                  if (bomLines !== null && bomLines.length > 0) {
                    bomLines.forEach((item) => {
                      debugger;
                      const BOMline = new TSalesLine();
                      BOMline.itemCode = item.id;
                      BOMline.price = item.price;
                      // BOMline.quantity = isNegative === true ? - item.lineTotal : item.lineTotal;
                      // BOMline.quantity = isNegative === true ? - item.lineTotal : item.lineTotal;
                      //BOM chỉ tính Qty nên set Line total vào quantity để trừ kho
                      if ((basket.getValue().salesType?.toLowerCase() === "ex" || basket.getValue().salesType?.toLowerCase() === "exchange") && basket.getValue().negativeOrder === true) {
                        BOMline.quantity = isNegative === true ? item.lineTotal : -item.lineTotal;
                      }
                      else {
                        BOMline.quantity = isNegative === true ? -item.lineTotal : item.lineTotal;
                      }
                      // BOMline.quantity = item.quantity;
                      BOMline.uomCode = item.uom;
                      BOMline.barCode = item.barcode;
                      BOMline.storeAreaId = item.storeAreaId;
                      BOMline.timeFrameId = item.timeFrameId;
                      BOMline.appointmentDate = item.appointmentDate;
                      BOMline.lineTotal = isNegative == true ? - item.lineTotal : item.lineTotal;
                      // BOMline.lineTotal = line.price * line.quantity;
                      const value = 0;
                      let discountType = line.discountType;// (item.type === null || item.type === undefined || item.type ==='') ? item.discountType : item.type;
                      BOMline.discountType = discountType;
                      if (discountType == 'percent') {
                        BOMline.discountRate = item.discountValue;
                        BOMline.discountAmt = item.quantity * item.price * BOMline.discountRate / 100;
                        BOMline.discountAmt = this.authService.roundingValue(BOMline.discountAmt, "RoundUp", decimalPlacesFormat);
                      }
                      if (discountType == 'amount') {
                        BOMline.discountRate = (item.quantity * item.price - item.lineTotal) * (item.quantity * item.price) / 100;
                        BOMline.discountAmt = item.discountValue;
                      }

                      if (BOMline.promoId !== null && BOMline.promoId !== undefined) {
                        BOMline.promoType = item.promotionType;
                        BOMline.promoPercent = item.promotionDiscountPercent;
                        BOMline.promoPrice = item.promotionPriceAfDis;
                        BOMline.promoLineTotal = item.promotionLineTotal;

                        BOMline.promoDisAmt = item.promotionDisAmt;
                        BOMline.discountRate = item.promotionDiscountPercent;
                        BOMline.discountAmt = item.promotionDisAmt;
                        BOMline.discountType = BOMline.promoType;
                      }
                      BOMline.memberValue = item.memberValue;
                      BOMline.taxCode = item.salesTaxCode;
                      BOMline.taxRate = item.salesTaxRate;
                      BOMline.taxAmt = BOMline.price * BOMline.quantity * BOMline.discountAmt * BOMline.taxRate;
                      BOMline.status = "C";
                      BOMline.slocId = this.authService.storeSelected().whsCode;//"SL001";
                      BOMline.bomId = line.itemCode;
                      order.lines.push(BOMline);
                    });
                  }

                }

                const promoLine = new TSalesPromo();
                promoLine.itemCode = item.id;
                promoLine.barCode = item.id + item.uom;
                promoLine.value = item.quantity;
                promoLine.uomCode = item.uom;
                promoLine.barCode = item.barcode;
                promoLine.promoId = item.promotionPromoCode;
                promoLine.itemGroupId = item.promotionItemGroup;
                promoLine.createdBy = order.createdBy;
                promoLine.promoAmt = item.promotionDisAmt;
                promoLine.promoPercent = item.promotionDiscountPercent;
                promoLine.promoType = item.promotionType;
                promoLine.refTransId = item.refTransId;
                promoLine.applyType = item.applyType;
                // const value = 0;
                // let discountType= ;
                promoLine.status = "C";
                order.promoLines.push(promoLine);
              });
            }
            this.changeBasketResponseStatus(false);
            order.totalTax = order.totalTax * order.discountRate;
            if (order.status !== "H") {
              var payments = basket.getValue().payments;
              if (payments !== null && payments !== undefined && payments.length > 0) {

                payments.forEach((paymentline) => {
                  const payment = new TSalesPayment();

                  payment.paymentCode = paymentline.id;
                  payment.companyCode = order.companyCode;
                  payment.refNumber = paymentline.refNum;
                  payment.lineId = paymentline.lineNum.toString();
                  payment.dataSource = 'POS';

                  payment.cardNo = paymentline.cardNo;
                  payment.cardHolderName = paymentline.cardHolderName;
                  payment.cardType = paymentline.cardType;
                  payment.paymentMode = paymentline.paymentMode;

                  payment.chargableAmount = (isNegative === true || hasItemSalesNegative === true) ? - paymentline.paymentCharged : paymentline.paymentCharged;
                  payment.paymentDiscount = paymentline.paymentDiscount;
                  payment.collectedAmount = (isNegative === true || hasItemSalesNegative === true) ? - paymentline.paymentTotal : paymentline.paymentTotal;
                  if (payment.paymentDiscount !== null && payment.paymentDiscount !== undefined) {
                    // payment.collectedAmount = (isNegative === true  || hasItemSalesNegative ===true) ? -(paymentline.paymentTotal - (paymentline.undefinedAmount??0) -payment.paymentDiscount)   : (paymentline.paymentTotal - (paymentline.undefinedAmount??0) - payment.paymentDiscount);
                    if (paymentline?.promoId !== null && paymentline?.promoId !== undefined && paymentline?.promoId?.length > 0) {
                      payment.voucherBarCode = paymentline.promoId;
                    }

                  }
                  payment.voucherSerial = paymentline?.voucherSerial ?? '';
                  payment.createdBy = order.createdBy;
                  payment.roundingOff = paymentline.roundingOff;
                  payment.fcRoundingOff = paymentline.fcRoundingOff;
                  payment.forfeit = paymentline.forfeit;
                  payment.forfeitCode = paymentline.forfeitCode;
                  payment.customF1 = paymentline.customF1;
                  payment.customF2 = paymentline.customF2;
                  payment.customF3 = paymentline.customF3;
                  payment.customF4 = paymentline.customF4;
                  payment.customF5 = paymentline.customF5;
                  if (paymentline.currency !== null && paymentline.currency !== undefined && paymentline.currency !== '') {
                    payment.rate = paymentline.rate;
                    payment.fcAmount = (isNegative === true || hasItemSalesNegative === true) ? - paymentline.paymentTotal : paymentline.paymentTotal;
                    payment.collectedAmount = payment.fcAmount * payment.rate;
                    payment.currency = paymentline.currency;

                    payment.paidAmt = paymentline.paidAmt;
                  }
                  else {
                    payment.rate = 1;
                    payment.currency = this.authService.storeSelected().currencyCode;

                  }
                  debugger;
                  if (payment.paymentDiscount !== null && payment.paymentDiscount !== undefined && payment.paymentDiscount !== 0) {
                    // if (Math.abs(payment.collectedAmount) - (Math.abs(payment.chargableAmount) - Math.abs(payment.paymentDiscount??0) )> 0) {
                    payment.changeAmt = Math.abs(payment.collectedAmount) - (paymentline.undefinedAmount ?? 0);
                    // } 
                  }
                  else {
                    if (Math.abs(payment.collectedAmount) - Math.abs(payment.chargableAmount) > 0) {
                      payment.changeAmt = Math.abs(payment.collectedAmount) - Math.abs(payment.chargableAmount);

                    }
                  }

                  if (payment.paymentDiscount !== null && payment.paymentDiscount !== undefined && payment.paymentDiscount !== 0) {
                    payment.receivedAmt = (paymentline.undefinedAmount ?? 0);
                  }
                  order.payments.push(payment);
                  debugger;
                  this.authService.setOrderLog("Order", "Payment", "", payment?.paymentCode?.toString(), payment?.chargableAmount?.toString(), payment?.collectedAmount?.toString(), payment?.changeAmt?.toString(),
                    payment?.refNumber?.toString() ?? '', payment?.customF1?.toString() ?? '', payment?.cardHolderName?.toString() ?? '', payment?.cardNo?.toString() ?? '', payment?.forfeitCode?.toString() ?? '', payment?.paymentType?.toString(), payment?.voucherSerial?.toString());
                });
              }
            }
            if (basket.getValue().voucherApply !== null && basket.getValue().voucherApply !== undefined && basket.getValue().voucherApply?.length > 0) {
              debugger;
              let applies: any = basket.getValue().voucherApply;
              applies.forEach(element => {
                debugger;
                let voucherPartner = element?.voucherPartner;
                if (voucherPartner?.toLocaleLowerCase() !== 'tera') {
                  element.discount_upto = (element?.discount_upto ?? '').toString();
                  element.discount_value = (element?.discount_value ?? '').toString();
                  element.discount_type = (element?.discount_type ?? '').toString();
                  element.discount_code = (element?.discount_code ?? '').toString();
                  element.min_bill_amount = (element?.min_bill_amount ?? '').toString();
                }

              });
            }
            let voucherList = basket.getValue().voucherApply;
            voucherList = voucherList.filter(x => x?.voucherPartner?.toLowerCase() !== 'tera');
            order.voucherApply = voucherList;//basket.getValue().voucherApply;
            // // debugger;
            let negateExchange = false;
            let itemExchange = false;
            // debugger;
            console.log(order.lines);
            if (Type === "Exchange" || Type === "EX") {

              order.lines.forEach(line => {
                if (line.quantity < 0) {
                  negateExchange = true;
                  return;
                }
              });

            }
            if (Type === "Exchange" || Type === "EX") {

              order.lines.forEach(line => {
                if (line.quantity > 0) {
                  itemExchange = true;
                  return;
                }
              });
            }
            if ((Type === "Exchange" || Type === "EX") && (negateExchange === false || itemExchange === false)) {
              this.changeIsCreateOrder(false);
              this.changeBasketResponseStatus(true);
              // console.log("Return item not found");
              if (negateExchange === false) {
                this.alertify.warning("Return item not found");
              }
              if (itemExchange === false) {
                this.alertify.warning("Sales item not found");
              }

            }
            else {

              // debugger;
              // this.changeBasketResponseStatus(false);
              // this.changeIsCreateOrder(false);
              // let basketProcess = localStorage.getItem("basketProcess");
              // if(basketProcess === null || basketProcess ===undefined || basketProcess === "")
              // {
              //   basketProcess = "";
              // }
              // let checkBasketProcess =order.terminalId + order.createdBy + order.orderId;
              // if(basketProcess !== checkBasketProcess)
              // {
              //   localStorage.setItem("basketProcess", checkBasketProcess);

              // }
              // else
              // {
              //   this.alertify.warning("Order processing");
              // }


              //Test ngày 2022/01/08
              // return switchMap(() =>  this.http.post(this.baseUrl + 'Sale/CreateSaleOrder', order))
              // var num = [7, 8 ];
              // num.forEach(function (value) {

              // });
              let logInsert = this.authService.getOrderLog();
              if (logInsert !== null && logInsert !== undefined) {
                order.logs = logInsert;
              }

              let canAdd = true;
              let orderCached = order.orderId;
              if (this.orderCached.value !== orderCached) {
                this.orderCached.next(orderCached);
              }
              else {
                canAdd = false;
              }
              if (canAdd) {
                let subject = new Subject();
                console.log("Order ", order);
                this.clickStream.pipe(debounceTime(500)).pipe(e => this.http.post(this.baseUrl + 'Sale/CreateSaleOrderByTableType', order))
                  .subscribe(response => {
                    this.orderCached.next("");
                    subject.next(response);
                  });


                return subject;
              }
              else {
                this.alertify.warning("Order " + orderCached + " Processing ");
                this.orderCached.next("");
              }

              //  return ;
            }
          }


        }


      }
      else {
        console.log("Please input serial");
        this.changeIsCreateOrder(false);
        this.changeBasketResponseStatus(true);
        this.alertify.warning("Please input serial number");
      }
    }
    else {
      console.log("Counter ID can't null ");
      this.changeIsCreateOrder(false);
      this.changeBasketResponseStatus(true);
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
    }

  }
  createBasketFromOrder(order: Order) {
    //this.customer.next(order.customer);
    let basket = this.createBasket(order.customer);
    basket.customer = order.customer;

    let listItem: ItemViewModel[] = [];
    var bar = new Promise((resolve, reject) => {
      order.lines.forEach((item, index, array) => {
        // console.log(item);
        // let IBasketItem
        // this.addItemtoBasket(data, item.quantity);
        this.itemService.getItem(item.itemCode).subscribe((response: any) => {
          // console.log(data);
          // this.addItemtoBasket(data, item.quantity);
          listItem.push(response.data);
        });
        if (index === array.length - 1) {

        }
        //resolve();
      });
    });

    bar.then(() => {
      console.log('All done!' + listItem);
      // this.route.navigate(["shop/order"]);
    });
    //

  }
  CreateOrderByOrder(order: Order) {
    let subject = new Subject();
    // this.setBasket(basket) pipe(debounceTime(500)).
    // this.clickStream.pipe(switchMap(e=> this.http.post(this.baseUrl + 'Sale/CreateSaleOrder', order))) 
    //   .subscribe(response=> {
    //     this.orderCached.next("");
    //     subject.next(response);
    //   });
    // CreateSaleOrderByTableType
    this.clickStream.pipe(debounceTime(500)).pipe(e => this.http.post(this.baseUrl + 'Sale/CreateSaleOrderByTableType', order))
      .subscribe(response => {
        this.orderCached.next("");
        subject.next(response);
      });
    // this.http.post(this.baseUrl + 'Sale/CreateSaleOrder', order).subscribe((response : any) => {
    //   this.orderCached.next("");
    //   subject.next(response);
    // });
    return subject;
  }
}
