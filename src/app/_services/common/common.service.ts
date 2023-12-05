import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { MArea } from 'src/app/_models/area';
import { MCountry } from 'src/app/_models/common/country';
import { ParramObject } from 'src/app/_models/common/parramObject';
import { SGeneralSetting } from 'src/app/_models/generalsetting';
import { MProvince } from 'src/app/_models/province';
import { MRegion } from 'src/app/_models/region';
import { SConfigType } from 'src/app/_models/sconfigType';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { AlertifyService } from '../system/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  host = environment.production === true ? this.env.host : environment.host;
  private isVirtualKey = new BehaviorSubject<boolean>(false);
  VirtualKey$ = this.isVirtualKey.asObservable();

  private isPrinted = new BehaviorSubject<boolean>(false);
  Printed$ = this.isPrinted.asObservable();
  private isOffline = new BehaviorSubject<boolean>(false);
  Offline$ = this.isOffline.asObservable();


  scannerProfile: any;

  private isNumbericVirtualKey = new BehaviorSubject<boolean>(false);
  NumbericVirtualKey$ = this.isNumbericVirtualKey.asObservable();

  private isResponseAPI = new BehaviorSubject<boolean>(true);
  ResponseAPI$ = this.isResponseAPI.asObservable();

  private isSystemCheck = new BehaviorSubject<boolean>(true);
  SystemCheck$ = this.isSystemCheck.asObservable();

  private mainShortcuts = new BehaviorSubject<ShortcutInput[]>(null);
  MainShortcuts$ = this.mainShortcuts.asObservable();

  private shortcuts = new BehaviorSubject<ShortcutInput[]>(null);
  Shortcuts$ = this.shortcuts.asObservable();

  private tempShortcuts = new BehaviorSubject<ShortcutInput[]>(null);
  TempShortcuts$ = this.tempShortcuts.asObservable();

  private tempShortcuts2 = new BehaviorSubject<ShortcutInput[]>(null);
  TempShortcuts2$ = this.tempShortcuts2.asObservable();

  private tempShortcuts3 = new BehaviorSubject<ShortcutInput[]>(null);
  TempShortcuts3$ = this.tempShortcuts3.asObservable();


  private noneShortcuts = new BehaviorSubject<ShortcutInput[]>(null);
  NoneShortcuts$ = this.noneShortcuts.asObservable();

  private isShowMenu = new BehaviorSubject<boolean>(false);
  ShowMenu$ = this.isShowMenu.asObservable();

  private billCount = new BehaviorSubject<number>(null);
  BillCount$ = this.billCount.asObservable();

  private discountNumberPad = new BehaviorSubject<string>('');
  DiscountNumberPad$ = this.discountNumberPad.asObservable();

  private displayMode = new BehaviorSubject<string>('slick');
  displayMode$ = this.displayMode.asObservable();
  download(doc: any): void {
    window.location.href = this.baseUrl+ 'common/Download?filename=' + doc ;
    //+'&token=' + localStorage.getItem('token');
    
  }
  setLocalStorageWithExpiry(key, value, ttl) {
    const now = new Date();
  
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item));
  }
  getLocalStorageWithExpiry(key) {
    // debugger;
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    if(item === null || item === undefined || item === '' || item === 'null')
    {
      localStorage.removeItem(key);
      return null;
    }
    if(item?.expiry!== null && item?.expiry!== undefined)
    {
      const now = new Date();
      // compare the expiry time of the item with the current time
      if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key);
        return null;
      }
    }
   
    return item.value;
  }

  changeMainShortcuts(value) {
    
    localStorage.setItem('shortcut',  JSON.stringify(value)); 
    localStorage.setItem('mainshortcut',  JSON.stringify(value)); 
    this.mainShortcuts.next(value);
  }
  changeTempShortcuts(value) {
    //  console.log('tmpvalue', value);
    this.tempShortcuts.next(value);
  }
  changeTempShortcuts2(value) {
    //  console.log('tmpvalue', value);
    this.tempShortcuts2.next(value);
  }
  changeTempShortcuts3(value) {
    //  console.log('tmpvalue', value);
    this.tempShortcuts3.next(value);
  }

  getTempShortcuts() {
    //  console.log('tmpvalue', value);
    return this.tempShortcuts.value;
  }
  getTempShortcuts2() {
    //  console.log('tmpvalue', value);
    return this.tempShortcuts2.value;
  }
  getTempShortcuts3() {
    //  console.log('tmpvalue', value);
    return this.tempShortcuts3.value;
  }
  getShortCuts(screen)
  {
     let menuShorcut = []
     let resultShortcut = [];
     
     return resultShortcut;
  }
  changeShortcuts(value, isClear?) {
    
    // debugger;
    // console.log(value);
    if(isClear)
    {
      localStorage.setItem('shortcut',  JSON.stringify(value));  
      this.shortcuts.next(value);
    }
    else
    {
      let currentVl = this.shortcuts.value;
      if(currentVl===undefined || currentVl===null)
      {
        currentVl = [];
      }
      if(value!==null && value!==undefined && value?.length > 0)
      {
        value.forEach(element => {
          // debugger;
          
          currentVl = currentVl.filter(x=>x.description!== element.description && x.key[0]!==element.key[0]);
           
          currentVl.push(element);
        });
      }
      
      localStorage.setItem('shortcut',  JSON.stringify(currentVl)); 
      this.shortcuts.next(currentVl);
    }
    
  }
  getShortcutsTonull(includeF)
  {
    let shortcuts:ShortcutInput[] = [];

    for(let i= 1; i<= 9; i++)
    {
       
      shortcuts.push(
        {
          key: ["cmd + " + i],
          label: "",
          description:"",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => { 
          },
          preventDefault: true
        }
      )
    }
    shortcuts.push(
      {
        key: ["cmd + tab","cmd + shift + tab","cmd + w","cmd + f4","cmd + shift + t","cmd + t","cmd + n","alt + f4" ,"alt + home" 
        ,"cmd + 0" ,"f11" ,"cmd + l" ,"alt + d" ,"f6" ,"cmd + enter" ,"cmd + k","cmd + e","alt + enter","cmd + f","cmd + g","shift + f3","cmd + shift + g"
        ,"cmd + h","cmd + j","cmd + d","cmd + shift + del","cmd + p","cmd + s","cmd + o","cmd + u","f12" ],
        label: "",
        description: "",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          console.log('XXXXX');
        },
        preventDefault: true
      },
       
    )
    if(includeF===true)
    {
      for(let i= 1; i<= 12; i++)
      {
         
        shortcuts.push(
          {
            key: ["f" + i],
            label: "",
            description:"",
            allowIn: [AllowIn.Textarea, AllowIn.Input],  
            command: (e) => { 
            },
            preventDefault: true
          }
        )
      }
       
    }
   
    return shortcuts;
  }
  uploadFile(fileToUpload, createdBy)
  {
    debugger;

    // if (files.length === 0) {
    //   return;
    // }
    // let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('formFile', fileToUpload, fileToUpload.name);
    // formData.append('CreatedBy', createdBy );
    return this.http.post(this.baseUrl + 'common/uploadlicense?CreatedBy=' + createdBy, formData, {reportProgress: true, observe: 'events'});

    //   .subscribe({
    //     next: (event) => {
    //     if (event.type === HttpEventType.UploadProgress)
    //       this.progress = Math.round(100 * event.loaded / event.total);
    //     else if (event.type === HttpEventType.Response) {
    //       this.message = 'Upload success.';
    //       this.onUploadFinished.emit(event.body);
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => console.log(err)
    // });
  }
  changeVirtualKey(value) {
    // debugger;
    localStorage.setItem('isVirtualKeyboard', value.toString());
    this.isVirtualKey.next(value);
  }
  changeNumbericVirtualKey(value) {
    // debugger;
    localStorage.setItem('isNumbericVirtualKeyboard', value.toString());
    this.isNumbericVirtualKey.next(value);
  }
  changeSystemCheck(value) {
    // debugger;
    localStorage.setItem('isSystemCheck', value.toString());
    this.isSystemCheck.next(value);
  }

  changePrinted(value) {
    // debugger;
    // localStorage.setItem('isSystemCheck', value.toString());
    this.isPrinted.next(value);
  }
  changeOffline(value) {
    // debugger;
    // localStorage.setItem('isSystemCheck', value.toString());
    this.isOffline.next(value);
  }
  getOffline() {
    // debugger;
    // localStorage.setItem('isShowMenu', value.toString());
    return this.isOffline.value;
  }

  port: any;
  ignorePoleDisplay=true;
  isSerialPortPoleOpen= false;
  async connectSerial() {
    debugger;
  
    if (navigator.permissions) {   // Typescript is happy now
       debugger;
       let ports = await navigator.serial.getPorts();
       console.log(ports);
      // // debugger;
      // navigator.serial.requestPort({ filters: usbVendorId: 1659}).then((port) => {
      //   // Connect to `port` or add it to the list of available ports.
      // }).catch((e) => {
      //   // The user didn't select a port.
      // });
      // let usbVendorId= 1659;
     
      // this.port = await navigator.serial.requestPort({
           
      // }) 
      let usbVendorIdX = this.getPoleDisplayValue();// localStorage.getItem('usbVendorId');
      // console.log('usbVendorIdX', usbVendorIdX);
      if (usbVendorIdX!==null && usbVendorIdX!==undefined && usbVendorIdX!=='' && usbVendorIdX!=="undefined"  && usbVendorIdX!=="null") {
        // const filter = { usbVendorId: usbVendorIdX };
        // const port = await navigator.serial.requestPort();
        // let port = await navigator.serial.requestPort({ filters: [filter] }) ;
        
        let ports = await navigator.serial.getPorts();
     
          if ((ports !== null) && (Array.isArray(ports)) && (ports?.length > 0)) {
             
            for (let i = 0; i < ports.length; i++) {
             
              let usbVendorId = ports[i].getInfo()?.usbVendorId?.toString();
              
              if(usbVendorId !==null && usbVendorId !== undefined && usbVendorId === usbVendorIdX.toString())
              {
              
                this.port = ports[i];
              } 
            } 
          }
          else
          {
            this.port = await navigator.serial.requestPort({
           
            }) 
          }
          // console.log(this.port.getInfo()) ;
      } else { 
        // debugger;
        this.port = await navigator.serial.requestPort({
           
        }) 
      }
      debugger;
      if(this.port===null || this.port===undefined)
      {
        this.port = await navigator.serial.requestPort({
           
        }) 
      }
      
      try {
        
         this.ignorePoleDisplay =false;
        //  if(this.port.getInfo().vendorId!==null && this.port.getInfo().vendorId!==undefined && this.port.getInfo().vendorId!=='')
        //  {
           
        //  }
        //  else
        //  {
          
        //  }
        // console.log(this.port.IsOpen)  ;
         await  this.port.open({
          baudRate: 9600,
          // dataBits: 8,
          // stopBits: 1,
          // parity: "none"
         }).then(async (err: any) => {
            if (err) return console.dir( 'Error' + err);
            console.log('serial port opened');
            // // console.dir( this.port);
            // console.log( this.port.getInfo());

            // console.log('serial port opened', this.port.getInfo());
            debugger;
            let id: any = this.port.getInfo().usbVendorId;
            if(id!== null && id!==undefined && id!=='null' && id!=='undefined' && id!=='')
            {
              this.isSerialPortPoleOpen = true;
              this.setPoleDisplayValue(id);
            }
          
            // await this.WriteValue("     WELCOME TO", this.authService.getCompanyInfor().companyName, false);
            // localStorage.setItem('usbVendorId', id  )
          });
          
      } catch (error) {
        debugger;
        console.log(error);
        if(this.port===null || this.port===undefined)
        {
          this.connectSerial();
        }
       
        // this.ignorePoleDisplay=true;
        // this.alertify.warning(error);
      }
        
    } 
  }
  myIntervalWelCome;
  async WritePoleValue(companyCode, storeId, poleValue, poleConnectType, string1, string2, tryConnect, isWelcome?) {
    // let poleValue = this.getPole();
    debugger;
    if(poleConnectType?.toLowerCase()==='serialport')
    {
      // clearInterval(this.myIntervalWelCome);
      if(this.port===null || this.port===undefined && this.ignorePoleDisplay===false)
      {
        await this.connectSerial();
      }
    
      try {
        await  this.port.open({
          baudRate: 9600,
          // dataBits: 8,
          // stopBits: 1,
          // parity: "none"
          }).then((err: any) => {
            if (err) return console.dir(err);
  
            console.log('serial port opened');
            console.dir( this.port);
            
          });
      } catch (error) {
        // this.alertify.warning(error);
      }
      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
      
      const writer = textEncoder.writable.getWriter(); 
      // await writer.writeLine();
      if(string1?.length > 20)
      {
        string1= string1.substring(0, 20);
      }
      let str="";
      if(string1?.length < 20)
      {
        let space = 20 - string1?.length ;
       
        if(space > 0)
        {
          for(let i=0; i< space ;i++)
          {
            str+=" ";
          }
        }
        string1= string1.substring(0, string1?.length) +  str;
      }
      
      if(string2?.length > 20)
      {
        string2= string2.substring(0, 20);
      }
      let str2="";
      if(string2?.length < 20)
      {
        let space = 20 - string2?.length ;
       
        if(space > 0)
        {
          for(let i=0; i< space ;i++)
          {
            str2+=" ";
          }
        }
        string2= string2.substring(0, string2?.length) +  str2;
      }
      await writer.write(string1);
      await writer.write(string2);
  

      // if(isWelcome===true)
      // {
      //   debugger;
      //   let lengstr= string2?.length;
      //   if(lengstr<=20)
      //   {
      //     let spaceNum= 20 - lengstr;
      //     // for(let i=0; i< spaceNum ;i++)
      //     // {
      //     //   string2+=" ";
      //     // }
      //     let firstChar = string2.charAt(0);
      //     string2+=firstChar;
      //     console.log('string2',string2);
      //     debugger;
      //     string2 = string2.substring(1);
      //     setTimeout(() => {
            
      //       this.WritePoleValue(companyCode, storeId, poleValue, poleConnectType, string1, string2, tryConnect, isWelcome);
      //     }, 200);
      //     // this.myIntervalWelCome = setInterval(async()=>{
      //     //   string2 = string2.substr(1, string2.length??0)
      //     //   console.log(string2);
      //     //   // await writer.write(string2);
      //     // }, 100);
      //   }
       
       
      // }
      // writer.releaseLock();
      await writer.close();
    }
    else
    {
      if(poleValue!==null && poleValue!==undefined )
      {
        if(poleValue?.poleName?.toString()!== '' && poleValue?.poleBaudRate?.toString()!== '' )
        {
          this.PoleShowMess(poleValue?.poleName?.toString(), poleValue?.poleBaudRate?.toString() , poleValue?.poleParity?.toString(), '', '', '', companyCode, storeId, poleValue.publicIP, string1, string2).subscribe((response: any)=>{
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
    
    // this.commonService.PoleShowMess()
    // if(this.ignorePoleDisplay)
    // {
      
    // }
   
  }
  getPrinted() {
    // debugger;
    // localStorage.setItem('isShowMenu', value.toString());
    return this.isPrinted.value;
  }
  changeResponseAPI(value) {
    // debugger;
    localStorage.setItem('isResponseAPI', value.toString());
    this.isResponseAPI.next(value);
  }
  changeDisplayMode(value) {
    // debugger;
    localStorage.setItem('displayMode', value.toString());
    this.displayMode.next(value);
  }
  changeDiscountNumberPad(value) {
 
    this.discountNumberPad.next(value);
  }
  getDiscountNumberPad() { 
    return this.discountNumberPad.value;
  }
  changeIsShowMenu(value) {
    // debugger;
    localStorage.setItem('isShowMenu', value.toString());
    this.isShowMenu.next(value);
  }
 
  changeBillCount(value) {
    // debugger;
    // localStorage.setItem('isShowMenu', value.toString());
    this.billCount.next(value);
  }
  getCurrentBillCount() {
    // debugger;
    // localStorage.setItem('isShowMenu', value.toString());
    return this.billCount.value ?? 0;
  }
  setPoleDisplayValue(value) {
    // debugger;
    localStorage.setItem('poleDisplayValue',  JSON.stringify(value));  
  }
  getPoleDisplayValue() {
    // debugger;
    let result;
    let vl = localStorage.getItem('poleDisplayValue');  
    if(vl!==null && vl!==undefined)
    {
      result= JSON.parse(vl);
    }
    else
    {
      result= null;
    }
    return result;
  }
  getCurrentShowMenu() {
    // debugger;
    let value = localStorage.getItem('isShowMenu');
    let rs: Boolean = false;
    if(value==="true")
    {
      rs= true;
    }
    return rs;
  }
  getResponseAPI() {
    // debugger;
    let value = localStorage.getItem('isResponseAPI');
    let rs: Boolean = true;
    if(value==="true")
    {
      rs= true;
    }
    else
    {
      rs= false;
    }
    return rs;
  }
  getSystemCheck() {
    // debugger;
    let value = localStorage.getItem('isSystemCheck');
    let rs: Boolean = true;
    if(value==="true")
    {
      rs= true;
    }
    else
    {
      rs= false;
    }
    return rs;
  }
  getCurrentDisplayMode() {
    // debugger;
    let value = localStorage.getItem('displayMode');
    let rs: string = 'slick';
    if(value!==null && value!==undefined && value!=='')
    {
      rs = value;
    }
    return rs;
  }
  
  getCurrentNumbericVirtualKey() {
    // debugger;
    let value = localStorage.getItem('isNumbericVirtualKeyboard');
    let rs: Boolean = false;
    if(value==="true")
    {
      rs= true;
    }
    return rs;
  }
  getCurrentVirtualKey() {
    // debugger;
    let value = localStorage.getItem('isVirtualKeyboard');
    let rs: Boolean = false;
    if(value==="true")
    {
      rs= true;
    }
    return rs;
  }
  getMainShortcutKey() {
    // debugger;
    let value = localStorage.getItem('mainshortcut');
    let rs: ShortcutInput[] = [];
    if(value!==null && value!==undefined)
    {
      rs= JSON.parse(value);
    }
    else
    {
      rs= null;
    }
    return rs;
  }
  getCurrentShortcutKey() {
    // debugger;
    let value = localStorage.getItem('shortcut');
    let rs: ShortcutInput[] = [];
 
    if(value!==null && value!==undefined)
    {

      rs= JSON.parse(value);
    }
    else
    {
      rs= null;
    }
    // rs.push(
    //   {
    //     key: ["alt"],
    //     label: "",
    //     description: "", 
    //     command: (e) => {
         
          
    //     },
    //     preventDefault: true
    //   },)
    return rs;
  }
  constructor(private http: HttpClient,  public env: EnvService ,   private alertify: AlertifyService, private _hotkeysService: HotkeysService,) {  
    this.changeVirtualKey(this.getCurrentVirtualKey()); 
    this.changeNumbericVirtualKey(this.getCurrentNumbericVirtualKey()); 
    this.changeIsShowMenu(this.getCurrentShowMenu()); 
    this.changeShortcuts(this.getCurrentShortcutKey()); 
    this.changeDisplayMode(this.getCurrentDisplayMode());
    this.changeResponseAPI(this.getResponseAPI());
    this.changeDiscountNumberPad('');
    this.changeSystemCheck(false);
    this.changePrinted(false);
    this.changeOffline(false);
  }
  setHotKeyEnter(callback)
  {
    
    this._hotkeysService.add(new Hotkey(['enter'], (event: KeyboardEvent): boolean => {
      console.log('Secret message enter');
        // callback();
      return false;
  }, undefined, 'Send a secret message to the console.'));
  }
  setHotKeyToNull()
  {
    // key: ["cmd + tab","cmd + shift + tab","cmd + w","cmd + f4","cmd + shift + t","cmd + t","cmd + n","alt + f4" ,"alt + home" 
    // ,"cmd + 0" ,"f11" ,"cmd + l" ,"alt + d" ,"f6" ,"cmd + enter" ,"cmd + k","cmd + e","alt + enter","cmd + f","cmd + g","shift + f3","cmd + shift + g"
    // ,"cmd + h","cmd + j","cmd + d","cmd + shift + del","cmd + p","cmd + s","cmd + o","cmd + u","f12" ],
    this._hotkeysService.add(new Hotkey(['shift', 'alt', 'ctrl', 'alt+tab', 'ctrl+f', 'ctrl+k', 'ctrl+e', 'ctrl+s', 'ctrl+l', 
    'ctrl+d',  'ctrl+h',  'ctrl+j',  'ctrl+d',  'ctrl+shift+del',  'ctrl+p',  'ctrl+o',  'ctrl+u',  'ctrl+shift+g',  'alt+home',
    'ctrl+t',  'ctrl+n', 'alt+f4', 
  
     ], (event: KeyboardEvent): boolean => {
      // console.log('Secret message');
      return false;
    }, undefined, 'Send a secret message to the console.'));
  }
  getMaxValueCurrency(currency): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'common/GetMaxValueCurrency?Currency='+ currency);
  }
  getCountries(area): Observable<MCountry[]> {
    return this.http.get<MCountry[]>(this.baseUrl + 'common/GetCountries?Area='+ area);
  }
  getDirectoryFiles(companyCode, storeId, uri , path): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/getDirectoryFiles?companyCode='+ companyCode + '&storeId='+ storeId
    + '&uri='+ uri +'&path='+ path);
  }
  getMediaByLink(link): Observable<any> {
    return this.http.get<any>(link);
  }
  checkOnline(companyCode, username )
  {
      return this.http.get(this.baseUrl + 'common/CheckUserStatus?companyCode=' + companyCode + '&username='+ username);
  }
  getAreaList(): Observable<MArea[]> {
    return this.http.get<MArea[]>(this.baseUrl + 'common/GetArea');
  } 
  getItemCustomList(type): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/GetItemCustomList?type='+ type);
  } 
  getDailyId(companyCode, storeId, date): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/getDailyId?companyCode='+ companyCode + '&storeId='+ storeId + '&date='+ date);
  } 
  getItemCollectionList(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/GetItemCollection');
  }
  // this.http.get(this.env.host + '/version.json?t=' + versionUpdate);
  getVersion(): Observable<any> {
    var versionUpdate = (new Date()).getTime();
    // 
    return this.http.get<any>( this.host +'/version.json?t=' + versionUpdate);
  }
  getIndexFile(): Observable<any> {
    // var versionUpdate = (new Date()).getTime();
    // 
    return this.http.get( this.host +'/index.html' );
  }
  GetLicenseInfor(companyCode, License): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/GetLicenseInfor?companyCode='+ companyCode + '&License='+ License );
  }

  getRegionList(): Observable<MRegion[]> {
    return this.http.get<MRegion[]>(this.baseUrl + 'common/GetRegion');
  }
  exportHtmlToPDF(name, data, docW, size?, unit?)
  {
    // let data = document.getElementById('htmltable');
    let result = false;
    debugger;
    if(size === null || size === undefined || size?.length <= 0)
    {
      size = 'a4';
    }
    if(unit === null || unit === undefined || unit?.length <= 0)
    {
      unit = 'mm';
    }
      html2canvas(data).then(canvas => { 
          let docWidth = docW;
          debugger;
          let docHeight = canvas.height * docWidth / canvas.width; 
          const contentDataURL = canvas.toDataURL('image/png');
          let doc = new jsPDF('p', unit, size);
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight);
          doc.save(name +'.pdf');
      }) 


  }

  getQuery(CompanyCode, FunctionId, Query, QueryExcute?, parram?): Observable<any> {
    let model= {
      CompanyCode: CompanyCode,
      FunctionId: FunctionId,
      Query: Query,
      QueryExcute: QueryExcute,
      ParramObjects: parram,
    }
    return this.http.post<any>(this.baseUrl + 'common/GetQuery', model);
  }
  InitDb(model): Observable<any> {
    
    return this.http.post<any>(this.baseUrl + 'common/InitDb', model);
  }
  getRoundingMethod() {
    return this.http.get<any[]>(this.baseUrl + 'common/GetRoundingMethod');
  }
  getCurencyList(){
    return this.http.get<any[]>(this.baseUrl + 'common/GetCurrencyList');
  }
  getDefaultStore(){
    return this.http.get<any[]>(this.baseUrl + 'common/GetDefaultStore');
  }
  getPOSOption(Type){
    return this.http.get<any[]>(this.baseUrl + 'common/GetPOSOption?Type=' + Type);
  }
  getPOSType(){
    return this.http.get<any[]>(this.baseUrl + 'common/GetPOSType');
  }
  adddItemToCartEffect(event){
    var cartElem: any =  document.getElementsByClassName("shopping-cart")[0];
    // console.log(cartElem);
    if(cartElem!==null && cartElem!==undefined)
    {
      var offsetTopCart = cartElem?.offsetTop;
      var offsetLeftCart = cartElem?.offsetLeft;
      var widthCart = cartElem?.offsetWidth;
      var heightCart = cartElem?.offsetHeight;
      debugger;
      var imgElem =event.target ?? event;//.parentNode.parentNode.childNodes[1];
      var parentElem = imgElem.parentNode.parentNode;
     
      var offsetLeft = imgElem?.offsetLeft;
      var offsetTop = imgElem?.offsetTop;
      var imgSrc = "http://cdn1.iconfinder.com/data/icons/jigsoar-icons/24/_cart.png";
      console.log(offsetLeft + ' ' + offsetTop + ' ' + imgSrc);
      var imgClone = document.getElementById('addImg');  //document.createElement('<img name="addImg" src="' + imgSrc + '"/>');
      // console.log(imgClone);
      debugger;
      imgClone.classList.remove('hideElement'); 
      imgClone.classList.add('showElement');  
      imgClone.style.height = '50px',
      imgClone.style.position = 'absolute',
      imgClone.style.top = offsetTop + 'px',
      imgClone.style.left =  offsetLeft + 'px',
      imgClone.style.opacity = '0.5'; 
      imgClone.style.zIndex = '1100'; 
      imgClone.classList.add('itemaddedanimate');
      parentElem.append(imgClone);
      setTimeout(function () {
  
        imgClone.style.height = '25px', 
        imgClone.style.top = (offsetTopCart+heightCart/2) +'px',
        imgClone.style.left =   (offsetLeftCart+widthCart/2) - widthCart +'px',
        imgClone.style.opacity = '0.5';  
       
      }, 200);
      setTimeout(function () {
        imgClone.style.height = '0px',  
        imgClone.style.opacity = '0.5';  
        cartElem.classList.add('shake');
        imgClone.classList.remove('showElement'); 
        imgClone.classList.add('hideElement'); 
      }, 1000);
      setTimeout(function () {
        // cartElem.classList.add('shake');
        cartElem.classList.remove('shake');
      
      }, 1100);
    }
   
  };

  getProvinces(): MProvince[] {
    let provincelist: MProvince[] = JSON.parse(localStorage.getItem("provincelist"));
    if(provincelist === null || provincelist === undefined)
    {
      this.http.get<MProvince[]>(this.baseUrl + 'common/GetProvinceList').subscribe((response: any) => {
        if(response.success)
        {
          localStorage.setItem("provincelist", JSON.stringify(response.data));
        }
        else
        {
          this.alertify.error(response.message);
        }
 
     });
    }
    return provincelist;
    
    
   
  }
  doesFileExist(urlToFile): any
  {
    fetch(urlToFile, { method: 'HEAD' })
    .then(res => {
        if (res.ok) {
          return true;
        } else {
          return false;
        }
    }).catch(err => { 
      console.log('Error:', err);
      return false;
    });
  }
  getConfigType(): Observable<SConfigType[]> {
    return this.http.get<SConfigType[]>(this.baseUrl + 'common/GetConfigType') ;
  }
  
  PoleGetPortName(): Observable<any> {
  return this.http.get<any>(this.baseUrl + 'common/PoleGetPortName') ;
  }

  PoleGetPortNameParity(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/PoleGetPortNameParity') ;
  }
  OpenDrawer(name, bill): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/OpenDrawer?name=' + name+ "&BillNo="+ bill) ;
  }
  PrintByPDF(CompanyCode, StoreId, name, printName, PrintSize, PrintType): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/PrintByPDF?CompanyCode=' + CompanyCode+ '&StoreId='+ StoreId + '&pdfFileName=' + name+ "&PrintName="+ printName + "&PrintSize="+ PrintSize+ "&PrintType="+ PrintType) ;
  }
  ClearCache(Key, Prefix): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/ClearCache?Key=' + Key+ "&Prefix="+ Prefix) ;
  }
  PaperCut(isfull, name): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'common/PaperCut?name=' + name + "&isfull="+ isfull) ;
  }
  PoleShowMess(SerialPortName, SerialPortBaudRate, SerialPortParity, SerialPortDataBits, SerialPortStopBits,
    SerialPortHandshake, CompanyCode, StoreId, CounterId, Message, Message2): Observable<any> {
    let model = {
      SerialPortName: SerialPortName,
      SerialPortBaudRate: SerialPortBaudRate,
      SerialPortParity: SerialPortParity,
      SerialPortDataBits: SerialPortDataBits,
      SerialPortStopBits: SerialPortStopBits,
      SerialPortHandshake: SerialPortHandshake,
      CompanyCode: CompanyCode,
      StoreId: StoreId, CounterId: CounterId,
      Message: Message , Message2: Message2 
    }
    return this.http.post<any>(this.baseUrl + 'common/PoleShowMess', model) ;
  }
  

}
