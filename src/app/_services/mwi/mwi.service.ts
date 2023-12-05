import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { RejectBillHRV } from 'src/app/shop/shop-bill-detail/shop-bill-detail.component';
import { SGeneralSetting } from 'src/app/_models/generalsetting';
import { MStore } from 'src/app/_models/store';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { isBuffer } from 'util';
import { AuthService } from '../auth.service';
import { BasketService } from '../common/basket.service';
import { GeneralsettingService } from '../data/generalsetting.service';
import { AlertifyService } from '../system/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class MwiService {

  // baseUrl = environment.apiMWIUrl;
  baseUrl = environment.production === true ? this.env.apiMWIUrl : environment.apiMWIUrl;
  token = environment.production === true ? this.env.mwiToken : environment.mwiToken; 
  MWIEpay:any;
  MWIGrab:any;
  MWISarawak:any;
  MWICRM:any;
  MWIVoucherCheck:any;
  MWIPayoo:any;
  header = {};
  // private authService: AuthService,
  constructor(private http: HttpClient,   private generalsettingService: GeneralsettingService, private alertifyService: AlertifyService, public env: EnvService) { 
    this.header = {
      headers: new HttpHeaders({
        'X-ABEO-SECRET': this.token
        //"23fa139ade41469db4f6517853b9fb2b"
      })
    }
    this.loadSetting();
  }

  getGeneralSettingStore(companyCode, storeId) {
    // debugger;
    let list: SGeneralSetting[] = JSON.parse(localStorage.getItem("generalSetting"));
    if (list === null || list === undefined || list.length === 0) {
      this.generalsettingService.GetGeneralSettingByStore(companyCode, storeId).subscribe((response: any) => {
        // debugger;
        if (response.success === false) {
          this.alertifyService.error(response.message);

        }
        else {
          if(response.data[0]!==null && response.data[0]!==undefined)
          {
            list = response.data[0].generalSettings;
            localStorage.setItem("generalSetting", JSON.stringify(response));
            return list;
          }
          else
          {
            return null;
          }
         
        }

      });
    }
    return list;

  }
  storeSelected(): MStore {
    // sessionStorage
    // 
    if (localStorage.getItem("storeSelected") === null || localStorage.getItem("storeSelected") === undefined || localStorage.getItem("storeSelected") === "undefined")
      return null;

    const store = JSON.parse(localStorage.getItem("storeSelected"));

    return store;
  }
  loadSetting() {
    let store = this.storeSelected();
    if(store!==null && store!==undefined && store?.storeId?.length > 0)
    {
      let generalSetting = this.getGeneralSettingStore(store.companyCode, store.storeId);
      if(generalSetting!==null && generalSetting!==undefined  && generalSetting?.length > 0)
      {

        let MWIEpay = generalSetting.find(x => x.settingId === 'MWIEpay');
        // debugger;
        if (MWIEpay !== null && MWIEpay !== undefined) {
          this.MWIEpay = MWIEpay;
        }
        let MWIGrab = generalSetting.find(x => x.settingId === 'MWIGrab');
        // debugger;
        if (MWIGrab !== null && MWIGrab !== undefined) {
          this.MWIGrab = MWIGrab;
        }
        let MWISarawak = generalSetting.find(x => x.settingId === 'MWISarawak');
        // debugger;
        if (MWISarawak !== null && MWISarawak !== undefined) {
          this.MWISarawak = MWISarawak;
        }
        let MWICRM = generalSetting.find(x => x.settingId === 'CRMSystem');
     
        if (MWICRM !== null && MWICRM !== undefined) {
          this.MWICRM = MWICRM;
        }
  
        let MWIVoucherCheck = generalSetting.find(x => x.settingId === 'SerialCheck');
     
        if (MWIVoucherCheck !== null && MWIVoucherCheck !== undefined) {
          this.MWIVoucherCheck = MWIVoucherCheck;
        }

        let MWIPayoo = generalSetting.find(x => x.settingId === 'Payoo');
        // debugger;
        if (MWIPayoo !== null && MWIPayoo !== undefined) {
          this.MWIPayoo = MWIPayoo;
        }
      }
     
    }
   
    
  }


  // const header = {
  //   headers: new HttpHeaders({
  //     'X-ABEO-SECRET': this.token
  //     //"23fa139ade41469db4f6517853b9fb2b"
  //   })
  // }
  item: any = {};
  getCustomerList(name, phoneNo, customerId, storeCode): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'JAMwi/Customers?name=' + name + "&phoneNo=" + phoneNo + "&customerId=" + customerId + "&storeCode=" + storeCode, this.header);
  }
  getTeraCustomerList(name, phoneNo, email): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'Customers/GetCustomers?customerName=' + name + "&email=" + email + "&phone=" + phoneNo,this.header);
  }
  getCustomerInformation(phone, storeCode): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'JAMwi/CustomerInfo?phoneNo=' + phone + '&storeCode=' + storeCode, this.header);
  }

  getVoucherListByCustomer(customerId, storeCode): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'JAMwi/Vouchers?customerId=' + customerId + "&page=" + 0 + "&size=" + 50 + "&storeCode=" + storeCode, this.header);
  }



  getMemberCard(serialNum): Observable<any[]> {
    
    // return this.http.get(this.baseUrl + 'S4Mwi/Voucher?serialNum=' + serialNum + '&planCode=' + planCode, header);
    return this.http.get<any[]>(this.baseUrl + 'JAMwi/MemberCard?cardId=' + serialNum, this.header);
  }



  createCustomer(mwiCustomer) {
    return this.http.post(this.baseUrl + 'JAMwi/CreateCustomer', mwiCustomer , this.header);
  }
  createTeraCustomer(mwiCustomer) {
    return this.http.post(this.baseUrl + 'Customers/InsCustomer', mwiCustomer );
  }
  updateCustomer(mwiCustomer) {
    return this.http.post(this.baseUrl + 'JAMwi/UpdateCustomer', mwiCustomer , this.header);
  }
  updateTeraCustomer(mwiCustomer) {
    return this.http.put(this.baseUrl + 'Customers/UpdCustomer/' + mwiCustomer.customerId, mwiCustomer );
  }
  sendOrderIdCancelOrder(orderId, model: RejectBillHRV) {
    return this.http.post(this.baseUrl + 'HaravanProduct/CancelOrder?orderId=' + orderId , model, this.header);
  }

  saveEntity(promotion) {
    return this.http.post(this.baseUrl + 'JAMwi/CreateUpdate', promotion, this.header);
  }

  saveSchema(schema) {
    return this.http.post(this.baseUrl + 'JAMwi/CreateUpdateSchema', schema, this.header);
  }
  //Voucher

  getVoucherDetail(customerid, voucherid, sourceID): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'JAMwi/VoucherDetail?customerid=' + customerid + '&voucherid=' + voucherid + '&sourceID=' + sourceID, this.header);
  }
  validateVoucher(customerid, voucherid, storeCode): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'JAMwi/ValidateVoucher?customerid=' + customerid + '&voucherid=' + voucherid + '&storeCode=' + storeCode, this.header);
  }

  //Voucher Tera
  validateVoucherTera(apiURL, voucherid): Observable<any[]> {
    if(apiURL!==null && apiURL!==undefined && apiURL!== '')
    {
      this.baseUrl = apiURL;
    }
    debugger;
    // let url = this.baseUrl + '/Voucher/GetVoucher?code=' + voucherid ;
    // if(url!==null && url!==undefined && url?.length > 0)
    // {
    //   url = url.replace('//','/');
    //   url = url.replace('//','/');

    // }
    return this.http.get<any[]>(this.baseUrl + '/Voucher/GetVoucher?code=' + voucherid  , this.header);
  }
  loginAuth(baseUrl?) {
    let user = {
      userName: "user_test", password: '1234'
    }
    let baseUrlX = this.baseUrl;
    if(baseUrl!== null && baseUrl!==undefined && baseUrl !== '')
    {
      baseUrlX = baseUrl;
    }
    return this.http.post( baseUrlX + 'Auth/Login', user);
  }

  holdVoucher(customerid, voucherid, storeCode, transactionId) {
    let model = { customerid: customerid, voucherid: voucherid, storeCode: storeCode, transactionId: transactionId }
    return this.http.post(this.baseUrl + 'JAMwi/HoldVoucher?customerid=' + customerid + '&voucherid=' + voucherid + '&storeCode=' + storeCode + '&transactionId=' + transactionId, model, this.header);
  }
  unholdVoucher(customerid, voucherid, storeCode, transactionId) {
    let model = { customerid: customerid, voucherid: voucherid, storeCode: storeCode, transactionId: transactionId }
    return this.http.post(this.baseUrl + 'JAMwi/UnholdVoucher?customerid=' + customerid + '&voucherid=' + voucherid + '&storeCode=' + storeCode + '&transactionId=' + transactionId, model, this.header);
  }
  redeemVoucher(customerid, voucherid, storeCode, transactionId, createdBy, voucherName, cusPhone, cusName) {
    let model = { customerid: customerid, voucherid: voucherid, storeCode: storeCode, transactionId: transactionId, createdBy: createdBy, voucherName: voucherName, cusPhone: cusPhone, cusName: cusName }
    return this.http.post(this.baseUrl + 'JAMwi/RedeemVoucher?customerid=' + customerid + '&voucherid=' + voucherid + '&storeCode=' + storeCode + '&transactionId=' + transactionId+ '&createdBy=' + createdBy+ '&voucherName=' + voucherName+ '&cusPhone=' + cusPhone+ '&cusName=' + cusName, model, this.header);
  }


  // Sarawak Pay
  sarawakPayCreateOrder(model) {
    let subject = new Subject();
    // this.setBasket(basket)
    let baseUrl = this.baseUrl; 
    if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
    {
      baseUrl = this.MWISarawak.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
      {
        baseUrl = this.MWISarawak.customField1;
      }
    }
    this.loginAuth(baseUrl).subscribe((response: any) => {
      debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        this.http.post(baseUrl + 'sarawakPay/CreateOrders', model, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Sarawak Pay',
            text:  "Can not connect to Sarawak Pay . Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;

  }
  
  sarawakPayQueryOrders(model) {
    let subject = new Subject();
    // this.setBasket(basket)
    let baseUrl = this.baseUrl; 
    if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
    {
      baseUrl = this.MWISarawak.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
      {
        baseUrl = this.MWISarawak.customField1;
      }
    }
    this.loginAuth(baseUrl).subscribe((response: any) => {
      // debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        this.http.post(baseUrl + 'sarawakPay/QueryOrders', model, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Sarawak Pay',
            text:  "Can not connect to Sarawak Pay . Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;
    // return this.http.post(this.baseUrl + 'sarawakPay/QueryOrders', model);
  }
  sarawakPayCreateOrderRefund(model) {
    let subject = new Subject();
    // this.setBasket(basket)
    let baseUrl = this.baseUrl; 
    if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
    {
      baseUrl = this.MWISarawak.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
      {
        baseUrl = this.MWISarawak.customField1;
      }
    }

    this.loginAuth(baseUrl).subscribe((response: any) => {
      // debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        this.http.post(baseUrl + 'sarawakPay/CreateOrderRefund', model, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Sarawak Pay',
            text:  "Can not connect to Sarawak Pay . Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;
    // return this.http.post(this.baseUrl + 'sarawakPay/CreateOrderRefund', model);
  }
  sarawakPayQueryRefund(model) {
    let subject = new Subject();
    // this.setBasket(basket)
    let baseUrl = this.baseUrl; 
    if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
    {
      baseUrl = this.MWISarawak.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
      {
        baseUrl = this.MWISarawak.customField1;
      }
    }
    this.loginAuth(baseUrl).subscribe((response: any) => {
      // debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        this.http.post(baseUrl + 'sarawakPay/QueryRefund', model, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Sarawak Pay',
            text:  "Can not connect to Sarawak Pay . Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;
    // return this.http.post(this.baseUrl + 'sarawakPay/QueryRefund', model);
  }
  sarawakPayCancelOrder(model) {
    let subject = new Subject();
    // this.setBasket(basket)

    let baseUrl = this.baseUrl; 
    if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
    {
      baseUrl = this.MWISarawak.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWISarawak!==null && this.MWISarawak!==undefined && this.MWISarawak?.customField1?.length > 0)
      {
        baseUrl = this.MWISarawak.customField1;
      }
    }
    this.loginAuth(baseUrl).subscribe((response: any) => {
      // debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        this.http.post( baseUrl + 'sarawakPay/CancelOrder', model, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Sarawak Pay',
            text:  "Can not connect to Sarawak Pay . Please try again"
          });

        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;
    // return this.http.post(this.baseUrl + 'sarawakPay/CancelOrder', model);
  }


  //CRM /api/CRM/MenberInformation
  crmGetMemberInformation(date) {
    let baseUrl = this.baseUrl; 
    if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
    {
      baseUrl = this.MWICRM.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
      {
        baseUrl = this.MWICRM.customField1;
      }
    }
    return this.http.get(baseUrl + 'CRM/MenberInformation?date=' + date);
  }
  crmMembervalidate(cardno) {
    debugger;
    let subject = new Subject();
    let baseUrl = this.baseUrl; 
    let ignoreAuth = false;
    
    if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
    {
      baseUrl = this.MWICRM.customField1;
      ignoreAuth = true;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
      {
        baseUrl = this.MWICRM.customField1;
      } 
    }
    if(environment.production === false )
    {
      baseUrl = environment.apiMWIUrl;
      ignoreAuth = false;
    }
    if(ignoreAuth)
    {
      this.http.get(baseUrl + 'CRM/MemberValidation?cardno=' + cardno).subscribe((response: any) => {
         
        subject.next(response);
      }, (error) =>
      {
        subject.error(error);
        // subject.next();
      });
      
    }
    else  
    {
      this.loginAuth(baseUrl).subscribe((authResponse: any) => {
        debugger;
        if (authResponse.token !== null && authResponse.token !== '' && authResponse.token !== undefined) {
  
          const header = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + authResponse.token,
              // 'X-ABEO-SECRET': this.token
            })
          }
          this.http.get(baseUrl + 'CRM/MemberValidation?cardno=' + cardno, header).subscribe((response: any) => {
            // debugger;
            subject.next(response);
          }, (error) =>
          {
            subject.error(error);
            // subject.next();
          });
        }
        else {
          this.alertifyService.warning(authResponse.message);
        }
      })
     
    }
   
    return subject;
    // return this.http.get(this.baseUrl + 'CRM/MemberValidation?cardno=' + cardno);
  }
  ///api/CRM/GetSales
  crmGetSales(date) {
    let baseUrl = this.baseUrl; 
    if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
    {
      baseUrl = this.MWICRM.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
      {
        baseUrl = this.MWICRM.customField1;
      }
    }
    return this.http.get(baseUrl + 'CRM/GetSales?date=' + date);
  }
  ///api/CRM/PushSalesServay
  crmPushSalesServay(model) {
    let baseUrl = this.baseUrl; 
    if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
    {
      baseUrl = this.MWICRM.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWICRM!==null && this.MWICRM!==undefined && this.MWICRM?.customField1?.length > 0)
      {
        baseUrl = this.MWICRM.customField1;
      }
    }
    return this.http.post(baseUrl + 'CRM/PushSalesServay', model);
  }

  //S4Mwi
  S4GetVoucher(serialNum, planCode) {
    let baseUrl = this.baseUrl; 
    if(this.MWIVoucherCheck!==null && this.MWIVoucherCheck!==undefined && this.MWIVoucherCheck?.customField1?.length > 0)
    {
      baseUrl = this.MWIVoucherCheck.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWIVoucherCheck!==null && this.MWIVoucherCheck!==undefined && this.MWIVoucherCheck?.customField1?.length > 0)
      {
        baseUrl = this.MWIVoucherCheck.customField1;
      }
    }
    const header = {
      headers: new HttpHeaders({
        'X-ABEO-SECRET': this.token,//"6f59e16f523e4525b4278b5dbd61c624"
      })
    }
    return this.http.get( baseUrl + 'S4Mwi/Voucher?serialNum=' + serialNum + '&planCode=' + planCode, header);
  }

  //S4Mwi
  S4GetBooklet(booketNo, planCode, itemCode) {
    let baseUrl = this.baseUrl; 
    if(this.MWIVoucherCheck!==null && this.MWIVoucherCheck!==undefined && this.MWIVoucherCheck?.customField1?.length > 0)
    {
      baseUrl = this.MWIVoucherCheck.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWIVoucherCheck!==null && this.MWIVoucherCheck!==undefined && this.MWIVoucherCheck?.customField1?.length > 0)
      {
        baseUrl = this.MWIVoucherCheck.customField1;
      }
    }
    const header = {
      headers: new HttpHeaders({
        'X-ABEO-SECRET': this.token,// "6f59e16f523e4525b4278b5dbd61c624"
      })
    }
    return this.http.get( baseUrl + 'S4Mwi/Booklet?bookNo=' + booketNo + '&planCode=' + planCode + '&itemCode=' + itemCode, header);
  }

  // /api/S4Mwi/UpdateVoucher
  S4UpdateVoucher(model) {
    const header = {
      headers: new HttpHeaders({
        'X-ABEO-SECRET': this.token,//"6f59e16f523e4525b4278b5dbd61c624"
      })
    }
    let baseUrl = this.baseUrl; 
    if(this.MWIVoucherCheck!==null && this.MWIVoucherCheck!==undefined && this.MWIVoucherCheck?.customField1?.length > 0)
    {
      baseUrl = this.MWIVoucherCheck.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWIVoucherCheck!==null && this.MWIVoucherCheck!==undefined && this.MWIVoucherCheck?.customField1?.length > 0)
      {
        baseUrl = this.MWIVoucherCheck.customField1;
      }
    }
    return this.http.put( baseUrl + 'S4Mwi/UpdateVoucher', model);
  }




  //S4Mwi
  EpayPayment(epayModel) {
    // debugger;
    // const header = {
    //   headers: new HttpHeaders({
    //     'X-ABEO-SECRET': "6f59e16f523e4525b4278b5dbd61c624"
    //   })
    // } 
    let baseUrl = this.baseUrl; 
    if(this.MWIEpay!==null && this.MWIEpay!==undefined && this.MWIEpay?.customField1?.length > 0)
    {
      baseUrl = this.MWIEpay.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWIEpay!==null && this.MWIEpay!==undefined && this.MWIEpay?.customField1?.length > 0)
      {
        baseUrl = this.MWIEpay.customField1;
      }
    }
    let subject = new Subject();
    this.loginAuth(baseUrl).subscribe((response: any) => {
      // debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        debugger;
        return this.http.post( baseUrl + 'Epay/PaymentProcessFlow', epayModel, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Payment Process',
            text:  "Can not connect to Payment. Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;
    // /api/Epay/PaymentProcessFlow
    // return this.http.post(this.baseUrl + 'Epay/PaymentProcessFlow', epayModel, header);
  }
  // /api/S4Mwi/UpdateVoucher
  EpayVoidPayment(epayModel) {
    let baseUrl = this.baseUrl; 
    if(this.MWIEpay!==null && this.MWIEpay!==undefined && this.MWIEpay?.customField1?.length > 0)
    {
      baseUrl = this.MWIEpay.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWIEpay!==null && this.MWIEpay!==undefined && this.MWIEpay?.customField1?.length > 0)
      {
        baseUrl = this.MWIEpay.customField1;
      }
    }
    let subject = new Subject();
    this.loginAuth(baseUrl).subscribe((response: any) => {
      // debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        debugger;
        return this.http.post( baseUrl + 'Epay/VoidPaymentProcessFlow', epayModel, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Void Payment Process',
            text:  "Can not connect to Void Payment. Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;
    // return this.http.post(this.baseUrl + 'Epay/VoidPaymentProcessFlow', epayModel, header);
  }
  // /api/Epay/RefundPaymentProcessFlow
  EpayRefundPaymentProcess(epayModel) {
    let baseUrl = this.baseUrl; 
    if(this.MWIEpay!==null && this.MWIEpay!==undefined && this.MWIEpay?.customField1?.length > 0)
    {
      baseUrl = this.MWIEpay.customField1;
    }
    else
    {
      this.loadSetting(); 
      if(this.MWIEpay!==null && this.MWIEpay!==undefined && this.MWIEpay?.customField1?.length > 0)
      {
        baseUrl = this.MWIEpay.customField1;
      }
    }
    let subject = new Subject();
    this.loginAuth(baseUrl).subscribe((response: any) => {
      // debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
        debugger;
        return this.http.post( baseUrl + 'Epay/RefundPaymentProcessFlow', epayModel, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Refund Payment Process',
            text:  "Can not connect to Refund Payment. Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;
    // return this.http.post(this.baseUrl + 'Epay/RefundPaymentProcessFlow', epayModel, header);
  }

  //  Payoo 
  payooCreateOrder(model) {
    let subject = new Subject();
    // this.setBasket(basket)
    let baseUrl = this.baseUrl; 
    if(this.MWIPayoo!==null && this.MWIPayoo!==undefined && this.MWIPayoo?.customField1?.length > 0)
    {
      baseUrl = this.MWIPayoo.customField1;
      
    }
    else
    {
      this.loadSetting(); 
      if(this.MWIPayoo!==null && this.MWIPayoo!==undefined && this.MWIPayoo?.customField1?.length > 0)
      {
        baseUrl = this.MWIPayoo.customField1;
      }
    }
    //gán lại link cho notify
    model.orderLinkNotify = baseUrl+'/Payoo/Notify';
    debugger;
    this.loginAuth(baseUrl).subscribe((response: any) => {
      debugger;
      if (response.token !== null && response.token !== '' && response.token !== undefined) {

        const header = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + response.token
          })
        }
       return this.http.post(baseUrl + 'Payoo/CreateOrder', model, header).subscribe((response: any) => {
          // debugger;
          subject.next(response);
        }, (error) => {
          // debugger;
          // this.alertifyService.error(error);
          console.log('error', error);
          Swal.fire({
            icon: 'error', 
            title: 'Payoo',
            text:  "Can not connect to Payoo. Please try again"
          });
        });
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
    return subject;

  }
  

}
