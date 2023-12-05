import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, Type } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection } from '@aspnet/signalr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { interval, Observable, Subject } from 'rxjs';
import { debounceTime, elementAt, first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
 
import { MCustomer } from '../_models/customer';
import { MDenomination } from '../_models/denomination';
import { SGeneralSetting } from '../_models/generalsetting';
import { MPermission } from '../_models/mpermission';
import { SConfigType } from '../_models/sconfigType';
import { SFormatConfig } from '../_models/sformatconfig';
import { MStore } from '../_models/store';
import { MUser, User } from '../_models/user';
import { ShiftVM } from '../_models/viewmodel/shiftViewModel';
import { BasketService } from './common/basket.service';
import { CommonService } from './common/common.service';
import { CustomerService } from './data/customer.service';
import { DenominationService } from './data/denomination.service';
import { FormatconfigService } from './data/formatconfig.service';
import { MwiService } from './mwi/mwi.service';
import { AlertifyService } from './system/alertify.service'; 
import { LoadingProgressModel } from '../_models/common/LoadingProgressModel';
import { MStoreCurrency } from '../_models/storecurrency';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { ShortcutService } from './data/shortcut.service';
import { MCompany } from '../_models/company';
import { CompanyService } from './data/company.service';
import { VoidreturnsettingService } from './system/voidreturnsetting.service';
import { SVoidOrderSetting } from '../_models/voidordersetting';
import { GeneralsettingService } from './data/generalsetting.service';
import { StorecurrencyService } from './data/storecurrency.service';
import { StoreclientService } from './data/storeclient.service';
import { SStoreClient } from '../_models/storeclient';
import { EnvService } from '../env.service';
import { CookieService } from 'ngx-cookie';
// import { CookieService } from 'ngx-cookie-service';
import { OrderLogModel } from '../_models/orderlogModel';
import { SignalRService } from './common/signalR.service';
import { Order } from '../_models/viewmodel/order';
import { UomService } from './data/uom.service';
import { MUom } from '../_models/muom';
import Swal from 'sweetalert2';
import { ClientDisallowanceService } from './data/client-disallowance.service';
import { SClientDisallowance } from '../_models/clientDisallowance';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // baseUrl = environment.apiUrl + "";
  // baseUrl = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();
  decodeToken: any = {};
  currentUser: User;
  permissions: any = [];

  formatStore: SFormatConfig;
  shortcuts: ShortcutInput[] = [];  
  baseUrl = environment.production === true ? this.envService.apiUrl : environment.apiUrl;
  // constructor(private http: HttpClient ) { } 
  
  constructor(private cookieService: CookieService, private uomService: UomService , private clientDisallowanceService: ClientDisallowanceService ,   private denominationService: DenominationService , 
    private envService: EnvService , private storeClient: StoreclientService, private storeCurrencyService: StorecurrencyService,
    private generalsettingService: GeneralsettingService ,private voidreturnsettingService: VoidreturnsettingService , 
    private companyService: CompanyService , private shorcutService: ShortcutService ,  
    private commonService: CommonService, private mwiService: MwiService, private customerService: CustomerService, 
    private http: HttpClient, private route: Router, private formatService: FormatconfigService, private alertifyService: AlertifyService) { }
  
  getEnvInfor()
  {
    let envInfo = this.envService;
    return envInfo;
  }
 
  writeLog(transId,  userApproval, note, lines, callback?)
  {
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = transId; 
    // let basket = this.getCurrentBasket();
    order.orderId =  uuidv4();;
    let storeClient = this.getStoreClient();
    if(storeClient!==null && storeClient!==undefined)
    {
      order.terminalId = this.getStoreClient().publicIP;
    }
    else
    {
      order.terminalId = this.getLocalIP();
    } 
    order.storeId = this.storeSelected().storeId;
    order.companyCode = this.getCurrentInfor().companyCode;
    let approvalStr= "";
    if(userApproval?.length > 0)
    {
      approvalStr =  "Approval by " + userApproval;
    }
    let noteStr = '';
    if(note?.length > 0)
    {
      noteStr =  "note: " + note;
    }
    let showString = '';
    if(approvalStr?.length > 0)
    {
      showString = approvalStr;
    }
    if(noteStr?.length > 0 && showString?.length > 0)
    {
      showString = showString + ", " +noteStr;
    }
    else
    {
      if(noteStr?.length > 0 && showString?.length <= 0)
      { 
        showString = noteStr;
      }
     
    }


    // let log= new OrderLogModel();
    // log.type = "ClearBill";
    // log.action = "Request" ;
    // log.time = new Date();
    // log.result = "";
    // log.value = showString ; 
    // log.customF1 = transId ; 
    // log.customF2 = basket?.id;
    // order.logs.push(log);
    order.logs= lines;
    
    this.clickStream.pipe(debounceTime(500)).pipe( e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
    .subscribe(response=> {
      // this.orderCached.next("");
      // this.alertifyService.success("Successfully completed.");
      callback();
    });
  }
  SetLicenseForUser(CompanyCode, License, UserList) {

    let model: any = {};
    model.CompanyCode = CompanyCode;
    model.License = License; 
    model.Users = UserList;

    return this.http.post(this.baseUrl + 'auth/SetLicenseForUser', model);
  } 
  Get_TokenLicense(CompanyCode, License, User) {

    // let model: any = {};
    // model.CompanyCode = CompanyCode;
    // model.License = License; 
    // model.User = User;

    return this.http.get(this.baseUrl + 'auth/Get_TokenLicense?CompanyCode=' + CompanyCode + '&License=' + License + '&User=' + User );
  } 
  RemoveLicenseForUser(CompanyCode, License, UserList) {

    let model: any = {};
    model.CompanyCode = CompanyCode;
    model.License = License; 
    model.Users = UserList;

    return this.http.post(this.baseUrl + 'auth/RemoveLicenseForUser', model);
  } 
  formatStr = "#,##0.######";
  formatNumberByPattern() {
    let format = this.loadFormat();
    // debugger;
    let newFm = "";
    if (format !== null && format !== undefined) {

      if (format.thousandFormat?.length > 0) {
        newFm += "#" + format.thousandFormat + "##0";
      }
      if (format.decimalFormat?.length > 0) {
        newFm += format.decimalFormat + "######";
      }


    }
    if (newFm?.length > 0) {
      this.formatStr = newFm;
    }
    return this.formatStr;
  }
   
  formatNumberByPatternAllowNull() {
    let format = this.loadFormat();
    // debugger;
    let newFm = "";
    if (format !== null && format !== undefined) {

      if (format.thousandFormat?.length > 0) {
        newFm += "#" + format.thousandFormat + "###";
      }
      if (format.decimalFormat?.length > 0) {
        newFm += format.decimalFormat + "######";
      }


    }
    if (newFm?.length > 0) {
      this.formatStr = newFm;
    }
    return this.formatStr;
  }
  getOrderLog(): OrderLogModel[]
  {
    let result =[];
    // window.sessionStorage.getItem()
    // let x = this.cookieService.get('orderLog');
    let x =  window.sessionStorage.getItem('orderLog');
    if(x!==null && x!==undefined && x!=='')
    {
      result = JSON.parse(x);
      if(result!==null && result!==undefined && result?.length > 0)
      {
        result.forEach(line => {
           
          line.customF1= line.customF1?.toString()??'';
          line.customF2= line.customF2?.toString()??'';
          line.customF3= line.customF3?.toString()??'';
          line.customF4= line.customF4?.toString()??'';
          line.customF5= line.customF5?.toString()??'';
          line.customF6= line.customF6?.toString()??'';
          line.customF7= line.customF7?.toString()??'';
          line.customF8= line.customF8?.toString()??'';
          line.customF9= line.customF9?.toString()??'';
          line.customF10= line.customF10?.toString()??'';
          line.terminalId= line.terminalId?.toString()??'';
        });
      }
    }
    else
    { 
      result = null;
    }
    return result ;
  } 
  setOrderLog(type, action, result, value, customF1?, customF2?, customF3?, customF4?, customF5?, customF6?, customF7?, customF8?, customF9?, customF10? )
  {
    let log= new OrderLogModel();
    log.type = type;
    log.result = result;
    log.value = value;
    log.action = action;
    if(customF1!==null && customF1!==undefined && customF1?.toString().length > 0)
    {
      log.customF1 = customF1?.toString();
    }
    if(customF2!==null && customF2!==undefined && customF2?.toString()?.length > 0)
    {
      log.customF2 = customF2?.toString();
    }
    if(customF3!==null && customF3!==undefined && customF3?.toString()?.length > 0)
    {
      log.customF3 = customF3?.toString();
    }
    if(customF4!==null && customF4!==undefined && customF4?.toString()?.length > 0)
    {
      log.customF4 = customF4?.toString();
    }
    if(customF5!==null && customF5!==undefined && customF5?.toString()?.length > 0)
    {
      log.customF5 = customF5?.toString();
    }
    if(customF6!==null && customF6!==undefined && customF5?.toString()?.length > 0)
    {
      log.customF6 = customF6?.toString();
    }
    if(customF7!==null && customF7!==undefined && customF7?.toString()?.length > 0)
    {
      log.customF7 = customF7?.toString();
    }
    if(customF8!==null && customF8!==undefined && customF8?.toString()?.length > 0)
    {
      log.customF8 = customF8?.toString();
    }
    if(customF9!==null && customF9!==undefined && customF9?.toString()?.length > 0)
    {
      log.customF9 = customF9?.toString();
    }
    if(customF10!==null && customF10!==undefined && customF10?.toString()?.length > 0)
    {
      log.customF10 = customF10?.toString();
    }
    log.time = new Date();
    log.createdBy= this.getCurrentInfor().username;
    // debugger;
    // let x = this.cookieService.get('orderLog');
    let x =  window.sessionStorage.getItem('orderLog');
    if(x!==null && x!==undefined && x!=='')
    {
      let jsonvalue:OrderLogModel[]  = JSON.parse(x);
      jsonvalue.push(log);
      // this.cookieService.remove('orderLog');
      // this.cookieService.put('orderLog', JSON.stringify(jsonvalue));
      window.sessionStorage.removeItem('orderLog');
      window.sessionStorage.setItem('orderLog', JSON.stringify(jsonvalue));
    }
    else
    { 
      // this.cookieService.remove('orderLog');
      window.sessionStorage.removeItem('orderLog');
      let jsonvalue:OrderLogModel[]  = [];
      jsonvalue.push(log);
      window.sessionStorage.setItem('orderLog', JSON.stringify(jsonvalue));
    }
  }
  deleteOrderLog()
  {
    window.sessionStorage.removeItem('orderLog');
    // this.cookieService.remove('orderLog');
     
  } 
  login(model: any) {
    // 
   
     return this.http.post(this.baseUrl + 'auth/login', model).pipe(
      map((response: any) => {
        // debugger;
        if(response?.success===false)
        {
          Swal.fire('Login',response.message,'info').then(()=> window.location.reload())
        }
        else
        {
          const user = response;
        
          console.log('loginresponse',response);
          localStorage.removeItem('dbAPI');
          localStorage.setItem('basket', null);
          localStorage.removeItem('basket');
          localStorage.removeItem('basket_id');
          localStorage.setItem('storeSelected', null);
          localStorage.removeItem('storeSelected');
          localStorage.setItem('loadProgress', null);
          localStorage.removeItem('loadProgress');
          // localStorage.setItem('loadProgress', JSON.stringify(loadProgress));
          if (user) {
            debugger;
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user.data));
            localStorage.setItem('dbAPI',  user.message);
            this.decodeToken = this.jwtHelper.decodeToken(user.token);
            // console.log("this.decodeToken", this.decodeToken);
            this.currentUser = user.user.data;
            // console.log("this.currentUser", this.currentUser);
            
            // console.log(this.decodeToken);
            // console.log(this.currentUser);
  
           
            
            this.loadPermission(this.currentUser.username);
               
          }
        }
       
        // subject.next(response);
      })
    );
  let subject = new Subject();
   this.http.post(this.baseUrl + 'auth/login', model).subscribe((response: any) => {
        // debugger;
        const user = response;
     
        localStorage.setItem('basket', null);
        localStorage.removeItem('basket');
        localStorage.removeItem('basket_id');
        localStorage.setItem('storeSelected', null);
        localStorage.removeItem('storeSelected');
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user.data));
          this.decodeToken = this.jwtHelper.decodeToken(user.token);
          // console.log("this.decodeToken", this.decodeToken);
          this.currentUser = user.user.data;
          // console.log("this.currentUser", this.currentUser);

          // console.log(this.decodeToken);
          // console.log(this.currentUser);
          this.loadPermission(this.currentUser.username);
             
        }
        subject.next(response);
      })
    
    debugger; 
    return subject;


   
  }
  // .subscribe((response: any) => {
  //   // if(response)
  //   debugger;
  //   this.alertify.success("Logged in successfully");
  //   this.router.navigate(['/shop']);
  // }, error => {
  //   console.log('Failed to login');
  //   this.alertify.error(error);
  // });
  loginAuth(model: any) {
    // debugger; 
    return this.http.post(this.baseUrl + 'auth/login', model);
  }
  getWindowWidth() : number
  {
    let windowWidth =  localStorage.getItem('windowWidth');
    if(windowWidth===null || windowWidth === undefined || windowWidth === '')
    {
      windowWidth='1200';
    }
    return parseFloat(windowWidth) ;
  }
  getLocalIP() 
  {
    
    let localIp = localStorage.getItem('visitorId');//  sessionStorage.getItem('LOCAL_IP');
    if(localIp===null || localIp === undefined || localIp === '')
    {
      localIp='';
    }
    return localIp.toString();
  }
  
  getWindowHeight() : number
  {
    let height = localStorage.getItem('windowHeight');
    if(height===null || height === undefined || height === '')
    {
      height='860';
    }
    return parseFloat(height) ;
  }
  getDenomination(): MDenomination[] {
    // debugger;
    let denomination = localStorage.getItem("denomination");
    let result;
    if (denomination === null || denomination === 'null' || denomination === undefined) {
      let store = this.storeSelected();
      this.denominationService.getAll(store.currencyCode).subscribe((response: any) => {
        if(response.success)
        {
          localStorage.setItem('denomination', JSON.stringify(response.data));
          result = response.data;
        }
        else
        {
          result=null;
          this.alertifyService.warning(response.message);
        }
        
      })
    }
    else {
      result = JSON.parse(denomination);
    }
    return result;

  }
  loadDenomination(currencyCode): MDenomination[] {
    let denomination = localStorage.getItem("denomination");
    let result;
    if (denomination === null || denomination === 'null' || denomination === undefined) {
      this.denominationService.getAll(currencyCode).subscribe((response: any) => {
        if(response.success)
        {
          localStorage.setItem('denomination', JSON.stringify(response.data));
          result = response.data;
        }
        else
        {
          result=null;
          this.alertifyService.warning(response.message);
        }
        // localStorage.setItem('denomination', JSON.stringify(data));
        // result = data;
      })
    }
    else {
      result = JSON.parse(denomination);
    }
    return result;

  }

  getShortcutWindown(functionX, windownX)
  {
    this.shortcuts =[];
    let shortcuts = localStorage.getItem("shortcut" + functionX +windownX );
    let result;
   
    if (shortcuts === null || shortcuts === 'null' || shortcuts === undefined) {
      this.shorcutService.getByFunction(this.storeSelected().companyCode, functionX).toPromise().then((response: any)=>{
        if(response.success)
        {
         
           if(response.data!==null && response.data!==undefined && response.data.length>0)
           {
            debugger;
            this.shortcuts =[];
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
                   combokey +=" + "+  shortcut.key2;
                 }
                 if(shortcut.key3!==undefined && shortcut.key3!==null && shortcut.key3!=='' )
                 {
                   combokey +=" + "+  shortcut.key3;
                 }
                 if(shortcut.key4!==undefined && shortcut.key4!==null && shortcut.key4!=='' )
                 {
                   combokey += " + "+  shortcut.key4;
                 }
                 if(shortcut.key5!==undefined && shortcut.key5!==null && shortcut.key5!=='' )
                 {
                   combokey += " + "+  shortcut.key5;
                 }
                 
                 combokey =   "cmd + "+ shortcut.key2; 
                 this.shortcuts.push(
                   {
                     key: [combokey],
                     label: shortcut.name,
                     description: shortcut.description,
                     command: (e) => console.log("Test X mark clicked", { e }),
                     preventDefault: true
                   }
                 )
               
             });
             localStorage.setItem("shortcut" + functionX +windownX , JSON.stringify(this.shortcuts));
          
             result = response.data;
           }
        }
        else
        {
           this.alertifyService.warning(response.message);
        }
      });
     
    }
    else {
      result = JSON.parse(shortcuts);
    }
    console.log('this.shortcuts', result);
    return result;
   
    //  return this.shortcuts;

     
  }
  getCurrentInfor(): MUser {

    var userJson = localStorage.getItem("user");
    let user = JSON.parse(userJson);
    return user;
  }
  getStoreCurrency(): MStoreCurrency[] {

    // this.storeCurrencyService.getByStoreWExchangeRate(this.authService.getCurrentInfor().companyCode , this.authService.storeSelected().storeId).subscribe((response: any)=>{
    //   if(response.success)
    //   {
    //   }
    // });
    var data = localStorage.getItem("storeCurrency");
    // let dataJson = JSON.parse(data);
    let result;
    if (data === null || data === 'null' || data === undefined) {
      let currenInfor = this.getCurrentInfor();
      this.storeCurrencyService.getByStoreWExchangeRate(currenInfor.companyCode,this.storeSelected().storeId ).subscribe((response: any) => {
        debugger;
        localStorage.setItem('storeCurrency', JSON.stringify(response.data));
        result = response.data;
      });
    }
    else {
      result = JSON.parse(data);
    }
    return result;
  }

  getStoreClient() : SStoreClient
  {
    // let storeId = this.storeSelected().storeId;
    var data = localStorage.getItem("storeClient");
    let result = null;
    // debugger;
    if (data === null || data === 'null' || data === undefined) {
      result = null;
      // this.logout();
      // this.alertifyService.warning("Can't get counter id. Please try login again.");
      // this.storeClient.getById(this.getCurrentInfor().companyCode , this.storeSelected().storeId, '', this.getLocalIP() ,'').subscribe((response: any)=>{
      //   if(response.success)
      //   {
      //     debugger;
      //     result = response.data;
      //     if(result!== null && result!== undefined)
      //     {
      //       localStorage.setItem("storeClient", JSON.stringify(response.data));
      //     }
           
          
      //   }
      // });
    }
    else {
      result = JSON.parse(data);
    }
   
    // debugger;
    return result;
  }
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
  getCompanyInfor(): MCompany{

    var data = localStorage.getItem("companyInfor");
    let result;
    if (data === null || data === 'null' || data === undefined) {
      let currenInfor = this.getCurrentInfor();
      if(currenInfor!==null && currenInfor!==undefined && currenInfor?.companyCode?.length > 0)
      {
        this.companyService.getItem(currenInfor.companyCode).subscribe((response: any) => {
          localStorage.setItem('companyInfor', JSON.stringify(response.data));
          result = data;
        });
      }
     
    }
    else {
      result = JSON.parse(data);
    }
   
    return result;
  }
  setFormat() {
    let store = this.storeSelected();
    this.formatService.getByStore(store.companyCode, store.storeId).subscribe((response: any) => {
      localStorage.setItem('formatConfig', JSON.stringify(response.data));
    });

  }
  setConfigComplete(loadProgress) {
    localStorage.setItem('loadProgress', JSON.stringify(loadProgress));
  }
  getConfigComplete(): LoadingProgressModel {
    let x = JSON.parse(localStorage.getItem('loadProgress'));
    return x;
  }
  getVoidReturnSetting(): SVoidOrderSetting[] {
    
    let setting = localStorage.getItem("voidreturnSetting");
    let result;
    debugger;
    if (setting === null || setting === 'null' || setting === undefined) {
      let store = this.storeSelected();
      this.voidreturnsettingService.getAll().subscribe((response: any) => {
          debugger;
        if(response.success)
        {
          localStorage.setItem('voidreturnSetting', JSON.stringify(response.data));
          result = response.data;
        }
        else{
          this.alertifyService.warning(response.message);
        }
      
      });
    }
    else {
      result = JSON.parse(setting);
    }

    return result;
  }
  loadFormat(): SFormatConfig {
    // debugger;
    let format = localStorage.getItem("formatConfig");
    let result;
    if (format === null || format === 'null' || format === undefined) {
      let store = this.storeSelected();
      this.formatService.getByStore(store.companyCode, store.storeId).subscribe((response: any) => {
        localStorage.setItem('formatConfig', JSON.stringify(response.data));
        result = response.data;
      });
    }
    else {
      result = JSON.parse(format);
    }

    return result;
  }

  loadFormatUom(): MUom[] {
    // debugger;
    let format = localStorage.getItem("uomList");
    let result;
    if (format === null || format === 'null' || format === undefined) {
      let store = this.storeSelected();
      this.uomService.getAll(store.companyCode).subscribe((response: any) => {
        localStorage.setItem('uomList', JSON.stringify(response.data));
        result = response.data;
      });
    }
    else {
      result = JSON.parse(format);
    }

    return result;
  }
  ThousandFormat = ",";
  DecimalFormat = ".";
  DecimalPlacesFormat = 0;

  roundingValue(value, type, decimalNumber?, setByConfig?)
  {
    // console.log('in', value);
    // console.log('type', type);
    let format = this.loadFormat();

    let decimalLength;
    let chunkDelimiter;
    let decimalDelimiter;
    if (format === null || format === undefined) {
      decimalLength = parseInt(this.DecimalPlacesFormat.toString());// ;
      chunkDelimiter = this.ThousandFormat;
      decimalDelimiter = this.DecimalFormat;
    }
    else {
      decimalLength = parseInt(format.decimalPlacesFormat);// this.DecimalPlacesFormat;
      chunkDelimiter = format.thousandFormat;// this.ThousandFormat;
      decimalDelimiter = format.decimalFormat;// this.DecimalFormat;
    }
    value = parseFloat(value);
    
      if(type===null || type === undefined || type === '')
      {
        type = "NoRounding";
      }
     if(type === "NoRounding")
     {
       value = value;
       if(decimalNumber!==null && decimalNumber !==undefined)
       {
        let valueStr = value.toString();
        let strSplit = valueStr.split('.');
        let numStr = "";
        let result = "";
        if(strSplit !== null && strSplit !==undefined && strSplit?.length > 0)
        {
          result = strSplit[0];
          if( strSplit?.length > 1)
          {
            numStr = strSplit[1];
            numStr = numStr.substring(0, decimalNumber);
            result = result + '.' + numStr;
          }
         
        }
         
        value = parseFloat(result);
       }
     }
     if(type === "RoundUp")
     {
       value = value.toFixed(decimalLength + 1);
       value = this.RoundToOne(value, decimalNumber);
     }
     if(type === "RoundToFiveHundredth")
     {
      // debugger;
      // value = value; Math.round
      // value =  Math.round((value) * 100.0 / 5.0)  * 5.0 / 100.0;
      if(setByConfig!==null && setByConfig!==undefined && setByConfig)
      {
        decimalNumber = decimalLength;
      }  
      if(decimalNumber!==null && decimalNumber!==undefined)
      {
        // decimalNumber = decimalLength;
        value = ((value) * 100.0 / 5.0)  * 5.0 / 100.0;  
        value = this.RoundToOne(value, decimalNumber);
      }
      else
      {
        value =  Math.round((value) * 100.0 / 5.0)  * 5.0 / 100.0;  
      }
      
     }
     if(type === "RoundToTenHundredth")
     {
      
      if(setByConfig!==null && setByConfig!==undefined && setByConfig)
      {
        decimalNumber = decimalLength;
      }  
      if(decimalNumber!==null && decimalNumber!==undefined)
      {
        // decimalNumber = decimalLength;
        
        value =  ((value) * 100.0 / 10.0) * 10.0 / 100.0;  
        value = this.RoundToOne(value, decimalNumber);
      }
      else
      {
        value =  Math.round((value) * 100.0 / 10.0) * 10.0 / 100.0;  
      }
      
     }
     
     if(type === "RoundToOne")
     {
       if(decimalNumber===null || decimalNumber ===undefined)
       {
        decimalNumber = 0;
       }
       value = this.RoundToOne(value, decimalNumber);
     }
     if(type === "RoundToTen")
     {
     
      value = Math.ceil(value / 10) * 10 ;
     }
    //  debugger;
   
    
    //  console.log('out', value);
     return value;
  }
  private RoundToOne(value, precision) {
    let scale = Math.pow(10, precision);
    return Math.round(value * scale) / scale;
  }
 
  roundingAmount(value: number): number {
    let number = value;
    if (value !== null && value !== undefined) {
      // value /= 100;
      let format = this.loadFormat();

      let decimalLength;
      let chunkDelimiter;
      let decimalDelimiter;
      if (format === null || format === undefined) {
        decimalLength = parseInt(this.DecimalPlacesFormat.toString());// ;
        chunkDelimiter = this.ThousandFormat;
        decimalDelimiter = this.DecimalFormat;
      }
      else {
        decimalLength = parseInt(format.decimalPlacesFormat);// this.DecimalPlacesFormat;
        chunkDelimiter = format.thousandFormat;// this.ThousandFormat;
        decimalDelimiter = format.decimalFormat;// this.DecimalFormat;
      }
      let currencySign = 'đ ';

      let chunkLength = 3;
      let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
      // debugger;
      
      // debugger;
      let num = parseFloat(parseFloat(value.toString()).toFixed(Math.max(0, ~~decimalLength)));
      //+ currencySign
      number = num;//parseFloat((decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter)) ;

    }
    // console.log('roundingAmount', number);
    return number;
  }
  formatCurrentcy(value: number): string {
    if (value !== null && value !== undefined) {
      // value /= 100;
      let format = this.loadFormat();
      // debugger;
      let decimalLength;
      let chunkDelimiter;
      let decimalDelimiter;
      if (format === null || format === undefined) {
        decimalLength = parseInt(this.DecimalPlacesFormat.toString());// ;
        chunkDelimiter = this.ThousandFormat;
        decimalDelimiter = this.DecimalFormat;
      }
      else {
        decimalLength = parseInt(format.decimalPlacesFormat);// this.DecimalPlacesFormat;
        chunkDelimiter = format.thousandFormat;// this.ThousandFormat;
        decimalDelimiter = format.decimalFormat;// this.DecimalFormat;
      }
      let currencySign = 'đ ';

      let chunkLength = 3;
      let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
      // debugger;
      let num = parseFloat(value.toString()).toFixed(Math.max(0, ~~decimalLength));
      //+ currencySign
      let resultResponse = (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
       return resultResponse;
    }
    return "0";
  }
  formatDate(value: string) {
    let format = this.loadFormat();
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, format.dateFormat);
    return value;
  }
  defaultCustomer: MCustomer;
  mapWMiCustomer2Customer(customer: any): MCustomer {
    let newCus = new MCustomer();
    // debugger;
    newCus = customer;
    newCus.customerId = customer.id;
    newCus.mobile = customer.mobile;
    let fullname = "";
    if (customer.first_name !== null && customer.first_name !== undefined) {
      fullname = customer.first_name;
    }
    if (customer.last_name !== null && customer.last_name !== undefined) {
      fullname += " " + customer.last_name;
    }
    newCus.customerName = fullname;
    newCus.address = customer.address;

    return newCus;
    // newCus.email= customer.cu
  }
  getCRMSource(): string {
    let crmSource = localStorage.getItem("CRMSystem");
    if (crmSource === null || crmSource === undefined || crmSource === '') {
      let defSetting = this.getGeneralSettingStore(this.storeSelected().companyCode, this.storeSelected().storeId).find(x => x.settingId === "CRMSystem");
      if (defSetting !== null && defSetting !== undefined) {
        crmSource = defSetting.settingValue;
        localStorage.setItem("CRMSystem", crmSource);
      }
    }
    return crmSource;
  }
  setCRMSource(crmSource) {
    localStorage.setItem("CRMSystem", crmSource);
  }
  getDefaultCustomer(): MCustomer {

    let cus: MCustomer = JSON.parse(localStorage.getItem("defaultCustomer"));
    // debugger;
    if (cus === null || cus === undefined) {

      let store = this.storeSelected();
      let defaultCusId = store.defaultCusId;
      let crmSource = "";
      // let 
      if (defaultCusId === null || defaultCusId === undefined) {
        let defSetting = this.getGeneralSettingStore(this.storeSelected().companyCode, this.storeSelected().storeId).find(x => x.settingId === "CRMSystem");
        if (defSetting !== null && defSetting !== undefined) {
          crmSource = defSetting.settingValue;
          defaultCusId = defSetting.defaultValue;
        }
      }
      if (crmSource !== undefined && crmSource !== null) {
        if (defaultCusId !== null && defaultCusId !== undefined) {
          if (crmSource === 'Local') {
            this.customerService.getItem(this.storeSelected().companyCode, defaultCusId).subscribe((response: any) => {
              localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
              cus = response.data;
            });
          }
          if (crmSource === 'Capi') {
            let firstChar = defaultCusId.toString().substring(0, 1);
            if (firstChar === "0") {
              defaultCusId = "84" + defaultCusId.toString().substring(1, defaultCusId.length);
            }
            this.mwiService.getCustomerInformation(defaultCusId, this.storeSelected().storeId).subscribe((response: any) => {
              // debugger;
              if (response !== null && response !== undefined) {
                if (response.status === 1) {
                  cus = this.mapWMiCustomer2Customer(response.data);
                  localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
                  // cus = response;
                }
                else {
                  this.alertifyService.warning(response.msg);
                }
              }
              else {
                this.alertifyService.warning('Data not found');
              }

            });
          }

        }
        else {
          cus = null;
        }
      }
      else {
        cus = null;
      }

    }

    return cus;

    // return defaultCusId;
  }

  decimalTransformDisplay(value: number ): number {
    if(value!==null && value!==undefined)
    { 
        value= parseFloat(value.toString());
        let format = this.loadFormat();
        let decimalLength;
        let chunkDelimiter;
        let decimalDelimiter;
        if(format===null || format===undefined)
        {
            decimalLength = parseInt(this.DecimalPlacesFormat.toString()) ;// ;
            chunkDelimiter =  this.ThousandFormat;
            decimalDelimiter =  this.DecimalFormat;
        }
        else
        {
            decimalLength = parseInt(format.decimalPlacesFormat) ;// this.DecimalPlacesFormat;
            chunkDelimiter = format.thousandFormat;// this.ThousandFormat;
            decimalDelimiter = format.decimalFormat;// this.DecimalFormat;
        }
        let currencySign = 'đ ';
        decimalDelimiter = '.';
        let chunkLength = 3;
        let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
        let num = value.toFixed(Math.max(0, ~~decimalLength));
        //+ currencySign
        let rsStr =(decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter) ;
        return parseFloat(rsStr);
    }
    
   
  }
  checkClientDisallowance(storeClient, functionId: string, controlId: string, permission: string): boolean {
    // let storeClient = this.getStoreClient();
    let result = true;
    // let checkClient = 'false';
    // let settings =  this.getGeneralSettingStore(this.storeSelected().companyCode, this.storeSelected().storeId);
    // if(settings!==null && settings!==undefined && settings?.length > 0)
    // {
    //  let checksetting = settings.find(x=>x.settingId === 'ClientDisallowance');
    //  if(checksetting!==null && checksetting!==undefined)
    //  {
    //    checkClient = checksetting.settingValue;
    //  }
    // }
    // if(checkClient === 'true')
    // {
      if(storeClient!==null && storeClient!==undefined)
      {
         if(storeClient.disallowances!==null && storeClient.disallowances!==undefined && storeClient.disallowances?.length > 0)
         { 
           // Nếu có truyền vào control Id thì check trong store Client cả control Id
           if(controlId!==null && controlId!==undefined && controlId?.length > 0)
           { 
             let checkDis = storeClient.disallowances.filter(x=>x.functionId === functionId && x.controlId === controlId && x.permission === permission && x.status?.toLowerCase() === 'a');
             if(checkDis!==null && checkDis!==undefined  && checkDis.length > 0)
             {
               result = false;
             }
             else
             {
               result= true;
             }
           }
           // Ngược lại thì chỉ kiểm function Id thôi
           else
           {
             let checkDis = storeClient.disallowances.filter(x=>x.functionId === functionId && x.permission === permission && x.status?.toLowerCase() === 'a');
             if(checkDis!==null && checkDis!==undefined  && checkDis.length > 0)
             {
               result = false;
             }
             else
             {
               result= true;
             }
           }
           
         }
         else
         {
           result= true;
         }
      }
    // }
    // else
    // {
    //   result= true;
    // }
      // debugger;
     if(result === false)
     {
      let mes = "";
      if(functionId?.length > 0)
      {
        mes +=  "Function: " + functionId ;
      }
     
      if(controlId?.length > 0)
      {
        if(mes?.length> 0)
        {
          mes += ', Control: ' + controlId ;
        }
        else
        {
          mes = 'Control: ' + controlId ;
        }
        
      }
      //  Swal.fire('Client Disallowance', 'Permisison: ' + permission + ", " + mes + '. This machine is forbidden to access the function.', 'warning');
     }
     return result;
  }
  checkRole(functionId: string, controlId: string, permission: string): boolean {
    //  debugger;
    if(controlId ==="description" && functionId === "Adm_ChangeLog")
    {
      // debugger;
      let rs = this.permissions.filter(x => x.functionId === functionId);
    }
    // debugger;
    let rs = false;
    this.permissions = JSON.parse(localStorage.getItem("permissions"));
    if (controlId !== null && controlId !== '' && controlId !== undefined) {
      // debugger;
      if (this.permissions.some(x => x.functionId === functionId && x.ControlId === controlId)) {

        let value = this.permissions.find(x => x.functionId === functionId && x.ControlId === controlId);
        // console.log(controlId + ' - ' +value[permission]);
        if(value !== null && value!==undefined)
        {
         
          if(value['R'] >=1)
          {
            rs = false;
          }
          else
          {
            if (value[permission] >= 1) {
              rs = true;
            }
          }
        }
        if(rs===true)
        {
          let storeClient = this.getStoreClient();
          if(storeClient!==null && storeClient!==undefined)
          {
             if(storeClient.disallowances!==null && storeClient.disallowances!==undefined && storeClient.disallowances?.length > 0)
             { 
                rs = this.checkClientDisallowance(storeClient, functionId, controlId, permission);
             }
          }
          
        }
        return rs;
      }
      else {
        return false;
      }
    }
    else {
      // debugger;
      if (this.permissions.some(x => x.functionId === functionId)) {
        // debugger;
        // 
        
        let value = this.permissions.find(x => x.functionId === functionId && (x.ControlId === null || x.ControlId ===undefined || x.ControlId === ''));
        // console.log(controlId + ' - ' +value[permission]);
        if(value !== null && value!==undefined)
        {
          if(value['R'] >=1)
          {
            rs = false;
          }
          else
          {
            if (value[permission] >= 1) {
              rs = true;
            } 
          }
          
        }
        if(rs===true)
        {
          let storeClient = this.getStoreClient();
          if(storeClient!==null && storeClient!==undefined)
          {
             if(storeClient.disallowances!==null && storeClient.disallowances!==undefined && storeClient.disallowances?.length > 0)
             { 
               rs = this.checkClientDisallowance(storeClient, functionId, controlId, permission);
             }
          }
        }
        return rs;
      }
      else {
        return false;
      }

    }
    return false;
  }

  checkUrl(url): boolean {
    let rs = false;
    let permission: any[] = JSON.parse(localStorage.getItem("permissions"));
    if (permission.some(x => x.Url === url && x.V === 1)) {
      rs = true;
    }
    return rs;
  }
  getFunctionPermissionByUser(userName: string): Observable<any> {
    // console.log(this.currentUser);
    // debugger;
    // let userName = this.currentUser.username;
    return this.http.get<any>(this.baseUrl + 'permission/GetFunctionPermissionByUser?UserName=' + userName);
  }

  loadPermission(userName: string) {
    this.getFunctionPermissionByUser(userName).subscribe((repsonse: any) => {
      if (repsonse.success) {

        this.permissions = repsonse.data;
        localStorage.setItem('permissions', JSON.stringify(repsonse.data));
        // debugger;
      }
      else {
        this.alertifyService.warning(repsonse.message);
      }
    });

  }
  
  // getDisalowance(companyCode, storeId, counterId) 
  // {
  //   // debugger;
  //   let list: SClientDisallowance[] = JSON.parse(localStorage.getItem("DisalowanceList"));
  //   if (list === null || list === undefined || list.length === 0) {
  //     this.clientDisallowanceService.getAll(companyCode, storeId, '', counterId,'').subscribe((response: any) => {
  //       // debugger;
  //       if (response.success === false) {
  //         this.alertifyService.warning(response.message);

  //       }
  //       else {
  //         if(response.data!==null && response.data!==undefined && response.data?.length > 0)
  //         {
  //           list = response.data[0].generalSettings;
  //           localStorage.setItem("DisalowanceList", JSON.stringify(response.data));
  //           return list;
  //         }
  //         else
  //         {
  //           return null;
  //         }
         
  //       }

  //     });
  //   }
  //   return list;

  // }
  checkLengthFormatUom(number,   uom)
  {
    // debugger;
    let rs= true;
    
    let type = 'quantity';
     
    let uomList = this.loadFormatUom();
    if(uomList!==null && uomList!==undefined && uomList?.length > 0)
    {
      let formatUoM = uomList.find(x=>x.uomCode === uom);
      if(formatUoM!==null && formatUoM!==undefined && formatUoM.decimalPlacesFormat !==null && formatUoM.decimalPlacesFormat !== undefined && formatUoM.decimalPlacesFormat !== ""  )
      {
        let value = "";
         
          value =formatUoM.decimalPlacesFormat ;
       
         
        var str = number.toString();
        var decimalOnly = 0;
    
        if( str.indexOf('.') != -1 ){ //check if has decimal
            let decimalOnly: string = parseFloat(Math.abs(number).toString()).toString().split('.')[1];
            if(decimalOnly!==null && decimalOnly!==undefined)
            {
              let length = decimalOnly.toString()?.length;
              if(length > parseInt(value) )
              {
                rs= false;
              }
            }
        }
     
        return rs;
      }
      else 
      {
        return rs;
        // this.checkFormatNumber(number, type);
      }
      
    }
    else
    { 
      return rs;
      //  this.checkFormatNumber(number, type);
    }
   
  }
  clearCache()
  {
    localStorage.removeItem('storeSelected');
    localStorage.setItem('permissions' , null);
    localStorage.setItem('uomList' , null);
    localStorage.setItem("GetDisallowance", 'false'); 
    localStorage.setItem('DisallowanceList' , null);
    localStorage.removeItem('DisallowanceList');
    localStorage.setItem('GetDisallowance','false');
    localStorage.removeItem('permissions');
    localStorage.removeItem('token');
    localStorage.removeItem('uomList'); 
    localStorage.removeItem('user');
    localStorage.removeItem('formatConfig');
    localStorage.removeItem('basket_id');
    localStorage.removeItem('generalSetting');
    localStorage.removeItem('denomination');
    localStorage.removeItem('storeCurrency'); 
    localStorage.removeItem('maxValueCurrency');
    localStorage.removeItem('shopMode');
    localStorage.removeItem('invoice');
    localStorage.removeItem('CRMSystem');
    localStorage.removeItem('defaultCustomer');
    localStorage.removeItem('isShowMenu');
    localStorage.removeItem('displayMode');
    localStorage.removeItem('mainshortcut');
    localStorage.removeItem('basket');
    localStorage.removeItem('dbAPI');
    localStorage.removeItem('denomination');
    localStorage.removeItem('shift');
    localStorage.removeItem('loadProgress');
    localStorage.removeItem('voidreturnSetting');
    localStorage.removeItem('storeCurrency');
    localStorage.removeItem('maxValueCurrency');
    localStorage.removeItem("GetDisallowance");

    localStorage.removeItem('appTheme');
    localStorage.removeItem('visitorId');
    localStorage.removeItem('companyInfor'); 
    //Remove FnB Item
    sessionStorage.setItem('fnbItems', null);
    sessionStorage.removeItem("fnbItems");
    
    // localStorage.clear();
    this.decodeToken = null;
    this.currentUser = null;

  }
  private clickStream = new Subject();
  logout() {
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = "";
    
    // debugger;
    // let basket = this.getCurrentBasket();
    order.orderId =  uuidv4();
    let storeClient = this.getStoreClient();
    if(storeClient!==null && storeClient!==undefined)
    {
      order.terminalId = this.getStoreClient()?.publicIP??'';
    }
    else
    {
      order.terminalId = this.getLocalIP()??'';
    } 
    order.storeId = this.storeSelected()?.storeId??'';
    order.companyCode = this.getCurrentInfor().companyCode??'';
    order.createdBy = this.getCurrentInfor().username??'';

    let log= new OrderLogModel();
    log.type = "Logout";
    log.action = "Request" ;
    log.time = new Date();
    log.result = "";
    log.value = "" ; 
    log.customF1 = "" ; 
    log.customF2 = "";
    log.createdBy = this.getCurrentInfor().username??'';
    order.logs.push(log); 
    
   
    this.clickStream.pipe(debounceTime(500)).pipe( e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
    .subscribe(response=> {
      // this.orderCached.next("");
      this.clearCache(); 
      this.redirectTo('/login');
      // this.alertify.success("Successfully completed.");
    }, error => {
      this.alertifyService.success("Can't log action. ");
      this.clearCache(); 
      this.redirectTo('/login');
    });
    
  

  }
  redirectTo(uri: string) {
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>

      this.route.navigate([uri]).then(() => {
        // window.location.reload();
        window.location.href = window.location.href;
      }));
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'auth/register', model);
  }
  corePingIntervalSeconds = 1;
  private source = interval(this.corePingIntervalSeconds * 1000);
  setStoreSelected(store: MStore) {
    // debugger;
    localStorage.setItem('storeSelected', JSON.stringify(store));
    this.commonService.getMaxValueCurrency(store.currencyCode).subscribe((response: any) => {
      // debugger;
      localStorage.setItem('maxValueCurrency', response.data);
      this.formatService.getByStore(store.companyCode,  store.storeId).subscribe((response: any) => {
        localStorage.setItem('formatConfig', JSON.stringify(response.data));
        this.http.get(this.baseUrl + 'GeneralSetting/GetByStore?companyCode=' + store.companyCode + '&storeid=' + store.storeId).subscribe((response: any) => {
          // debugger;

          if (response.success === false) {
            this.alertifyService.error(response.message);
          }
          else {
            // debugger;
            localStorage.setItem("generalSetting", JSON.stringify(response));
            let crmSource = "";
            let defaultCusId = "";
            // let 


            if (defaultCusId === null || defaultCusId === undefined || defaultCusId === "") {
              let setting = response;
              // debugger;
              let defSetting = setting.find(x => x.settingId === "CRMSystem");
              if (defSetting !== null && defSetting !== undefined) {

                crmSource = defSetting.settingValue;
                defaultCusId = defSetting.defaultValue;
              }
            }
            if (crmSource !== undefined && crmSource !== null && crmSource !== "") {
              debugger;
              if (defaultCusId !== null && defaultCusId !== undefined) {


                if (crmSource === 'Local') {
                  defaultCusId = store.defaultCusId;
                  this.customerService.getItem(this.storeSelected().companyCode, defaultCusId).subscribe((response: any) => {
                    localStorage.setItem("defaultCustomer", JSON.stringify(response.data));

                  });
                }
                if (crmSource === 'Capi') {
                  let firstChar = defaultCusId.toString().substring(0, 1);
                  if (firstChar === "0") {
                    defaultCusId = "84" + defaultCusId.toString().substring(1, defaultCusId.length);
                  }
                  this.mwiService.getCustomerInformation(defaultCusId, this.storeSelected().storeId).subscribe((response: any) => {
                    debugger;
                    if (response !== null && response !== undefined) {
                      debugger;
                      if (response.status === 1) {
                        // debugger;
                        // localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
                        let cus = this.mapWMiCustomer2Customer(response.data);
                        localStorage.setItem("defaultCustomer", JSON.stringify(cus));
                      }
                      else {
                        // debugger;
                        this.alertifyService.warning(response.msg);
                        this.setCRMSource('Local');
                        defaultCusId = store.defaultCusId;
                        this.customerService.getItem(this.storeSelected().companyCode, defaultCusId).subscribe((response: any) => {
                          localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
                        });
                      }
                    }
                    else {
                      this.alertifyService.warning('Data not found');
                      this.setCRMSource('Local');
                      defaultCusId = store.defaultCusId;
                      this.customerService.getItem(this.storeSelected().companyCode, defaultCusId).subscribe((response: any) => {
                        localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
                      });
                    }

                  }, err => {


                    this.setCRMSource('Local');
                    defaultCusId = store.defaultCusId;
                    this.customerService.getItem(this.storeSelected().companyCode, defaultCusId).subscribe((response: any) => {
                      localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
                    });
                    console.log(err);
                  });
                }
                 
                this.loadDenomination(store.currencyCode);
                // this.setShopMode();
              }

            }

          }

        });
      });

    });



  }
  getmaxValueCurrency() {
    const value = localStorage.getItem("maxValueCurrency");
    return value;
  }
 
  checkFormatNumber(number, type, cusF1?)
  {
    // debugger;
    let rs= true;
    
    if(type===null || type === undefined)
    {
      type = 'number';
    }
    // value= parseFloat(value.toString());
    let format = this.loadFormat();
   
    let value = "";
    if(format===null || format===undefined)
    {
        
       value = "6" ;
        // decimalLength = DecimalPlacesFormat;
        // chunkDelimiter =  ThousandFormat;
        // decimalDelimiter =  DecimalFormat;
    }
    else
    {
        // decimalLength = parseInt(format.decimalPlacesFormat) ;// this.DecimalPlacesFormat;
        let number = 0;
        // col.custom2==='rate' || col.custom2==='quantity' || col.custom2==='number' || col.custom2==='amount'
        
        if(type === 'quantity')
        {
          value =format.qtyDecimalPlacesFormat ;
          let formatUomList = this.loadFormatUom();
          let inputWithoutConfig = 'true';
          let storeSelected = this.storeSelected();
          let InputWithoutConfig = this.getGeneralSettingStore(storeSelected.companyCode, storeSelected.storeId).find(x => x.settingId === 'InputWithoutConfig');
          if (InputWithoutConfig !== null && InputWithoutConfig !== undefined) {
        
            inputWithoutConfig = InputWithoutConfig.settingValue;
          }
          if(formatUomList!==null && formatUomList!==undefined && formatUomList?.length > 0)
          {
            let fm =  formatUomList.find(x=>x.uomCode === cusF1);
            if(fm!==null && fm!==undefined)
            {
              let checkDecimal = fm?.allowDecimal;
              if(checkDecimal!==null && checkDecimal!==undefined && checkDecimal !== true)
              {
                 // checkDecimal
                 value = "0";
                 
              }
              else
              {
                if(inputWithoutConfig === 'true')
                {
                  return true;
                }
                // else
                // {

                // }
              }
              // else
              // {
               
              // }
              // let valueX = fm.decimalPlacesFormat;
              // if(valueX!==null && valueX!==undefined && valueX?.length > 0)
              // {
              //   value = valueX;
              // } 
              
            }
           
          }
        }
        if(type === 'amount' )
        {
           value =format.decimalPlacesFormat ;
          
        }
        if(type === 'percent')
        {
           value =format.perDecimalPlacesFormat ;
         
        }
        if(type === 'rate')
        {
           value =format.rateDecimalPlacesFormat ;
         
        }
        if(value===undefined || value === null || value === '')
        {
          value = "6";
        }
       
    }
     
    var str = number.toString();
    var decimalOnly = 0;

    if( str.indexOf('.') != -1 ){ //check if has decimal
        let decimalOnly: string = parseFloat(Math.abs(number).toString()).toString().split('.')[1];
        if(decimalOnly!==null && decimalOnly!==undefined)
        {
          let length = decimalOnly.toString()?.length;
          if(length > parseInt(value) )
          {
            rs= false;
          }
        }
    }
    // let str ="";
    // if(type === 'number')
    // {
    //   str = '#' + chunkDelimiter + '##0' + decimalDelimiter + "######";
    // }
    // else
    // {
    //   let deciChar ='';
    //   for (let i = 0; i < decimalLength; i++) {
    //     deciChar+='0';
    //   }
    //   str = '#' + chunkDelimiter + '##0' + decimalDelimiter + deciChar;
    // }
   
    return rs;
  }

  numberFormat(type)
  {
    // debugger;
    let ThousandFormat=",";
    let DecimalFormat=".";
    let DecimalPlacesFormat=2;
    if(type===null || type === undefined)
    {
      type = 'number';
    }
    // value= parseFloat(value.toString());
    let format = this.loadFormat();
    let decimalLength;
    let chunkDelimiter;
    let decimalDelimiter;
    if(format===null || format===undefined)
    {
        
       
        decimalLength = DecimalPlacesFormat;
        chunkDelimiter =  ThousandFormat;
        decimalDelimiter =  DecimalFormat;
    }
    else
    {
        // decimalLength = parseInt(format.decimalPlacesFormat) ;// this.DecimalPlacesFormat;
        let number = 0;
        // col.custom2==='rate' || col.custom2==='quantity' || col.custom2==='number' || col.custom2==='amount'
        let value = "";
        if(type === 'quantity')
        {
         value =format.qtyDecimalPlacesFormat ;
          
        }
        if(type === 'amount' )
        {
           value =format.decimalPlacesFormat ;
          
        }
        if(type === 'percent')
        {
           value =format.perDecimalPlacesFormat ;
         
        }
        if(type === 'rate')
        {
           value =format.rateDecimalPlacesFormat ;
         
        }
        if(value===undefined || value === null || value === '')
        {
          value = DecimalPlacesFormat.toString();
        }
        number =  parseInt(value.toString()) ;// ;
        decimalLength = number;
        chunkDelimiter = format.thousandFormat;// this.ThousandFormat;
        decimalDelimiter = format.decimalFormat;// this.DecimalFormat;
    }
    let str ="";
    if(type === 'number')
    {
      str = '#' + chunkDelimiter + '##0' + decimalDelimiter + "######";
    }
    else
    {
      let deciChar ='';
      for (let i = 0; i < decimalLength; i++) {
        deciChar+='0';
      }
      str = '#' + chunkDelimiter + '##0' + decimalDelimiter + deciChar;
    }
   
    return str;
  }
  storeSelected(): MStore {
    // sessionStorage
    // 
    if (localStorage.getItem("storeSelected") === null || localStorage.getItem("storeSelected") === undefined || localStorage.getItem("storeSelected") === "undefined")
      return null;

    const store = JSON.parse(localStorage.getItem("storeSelected"));

    return store;
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  shopMode = "FnB";
  // setShopMode()
  // {
  //   let shopMode = this.getGeneralSettingStore(this.storeSelected().companyCode , this.storeSelected().storeId).find(x=>x.settingId === 'ShopMode');
  //   if(shopMode!==null&& shopMode!==undefined)
  //   {
  //     this.shopMode = shopMode.settingValue;
  //   }
  //   localStorage.setItem("shopMode", this.shopMode);
  // }
  getShopMode() {
    // debugger;
    let result = "FnB";
    let shopmode = localStorage.getItem("shopMode");
    if (shopmode !== null && shopmode !== undefined) {
      result = shopmode;
    }
    else {
      let list: SGeneralSetting[] = this.getGeneralSettingStore(this.storeSelected().companyCode, this.storeSelected().storeId);
      if (list !== null && list !== undefined) {
        let mode = list.find(x => x.settingId === 'ShopMode');
        if (mode !== null && mode !== undefined) {
          result = mode.settingValue;
          localStorage.setItem("shopMode", result);
        }
      }

    }
    // result = "Grocery";
    return result;

  }
  // getGenList(companyCode, storeId): Observable<SGeneralSetting[]> {
  //   return this.http.get<SGeneralSetting[]>(this.baseUrl + 'GeneralSetting/GetByStore?companyCode=' + companyCode + '&storeid=' + storeId)
  // }
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
}
