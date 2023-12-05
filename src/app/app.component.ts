import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild ,NgZone, Input, Output, Renderer2, Inject} from '@angular/core';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';
 
import { JwtHelperService } from '@auth0/angular-jwt';
import { HubConnection } from '@microsoft/signalr';
import { AllowIn, KeyboardShortcutsComponent, ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fromEvent, Observable, Subject, timer  } from 'rxjs';
import { delay, filter, map, take, timeout } from 'rxjs/operators'; 
import { ThemeService } from 'src/services/theme.service';
import Swal from 'sweetalert2'; 
import { AuthService } from './_services/auth.service';
import { BasketService } from './_services/common/basket.service'; 
import { CommonService } from './_services/common/common.service'; 
import { SignalRService } from './_services/common/signalR.service';
import {Title} from "@angular/platform-browser";
import { CompanyService } from './_services/data/company.service';
import { MCompany } from './_models/company'; 
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { StoreclientService } from './_services/data/storeclient.service';
import { SStoreClient } from './_models/storeclient'; 
import { EnvService } from './env.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { DatePipe, DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
// import {browser}   from 'browser';
import { KeyboardService } from './component/shared/virtual-keyboard/virtual-keyboard.service';
import { of } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations'; 
import { RunTimeFile } from 'src/runtime';
import { SClientDisallowance } from './_models/clientDisallowance';
import { ClientDisallowanceService } from './_services/data/client-disallowance.service';
 
 
declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
    getScreenDetails()
  }
  interface Screen  {
    isExtended: boolean;  
    onchange: () => void;
    // attribute EventHandler onchange;
  }
  interface ScreenDetailed  {
     availLeft: number | null;
      availTop: number | null;
       left: number | null;
       top: number | null;
       isPrimary: boolean | null;
       isInternal: boolean | null;
      devicePixelRatio: number | null;
      label: any ;
  }
  interface ScreenDetails   { 
     screens: any;
     currentScreen: ScreenDetails; 
     onscreenschange: () => void;   
     oncurrentscreenchange: () => void;   
  }
  interface FullscreenOptions {
     screen: ScreenDetailed;
  }
}
 
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('balloonEffect', [
      state('initial', style({
        backgroundColor: 'green',
        transform: 'scale(1)'
      })),
      state('final', style({
        backgroundColor: 'red',
        transform: 'scale(1.5)'
      })),
      transition('final=>initial', animate('1000ms')),
      transition('initial=>final', animate('1500ms'))
    ]),
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
    trigger('changeDivSize', [
      state('initial', style({
        backgroundColor: 'green',
        width: '10px',
        height: '10px'
      })),
      state('final', style({
        backgroundColor: 'red',
        width: '400px',
        height: '400px'
      })),
      transition('initial=>final', animate('450ms')),
      transition('final=>initial', animate('400ms'))
    ]),
  ]
})


export class AppComponent implements OnDestroy, AfterViewInit   {
  permissionStatus = null;
  port ;
  // async detectMultiMonitor() {
 
  
  //   if (navigator.permissions) {   // Typescript is happy now
  //     // debugger;
  //     // let ports = await navigator.serial.getPorts();
  //     // console.log(ports);
  //     // // debugger;
  //     // navigator.serial.requestPort({ filters: usbVendorId: 1659}).then((port) => {
  //     //   // Connect to `port` or add it to the list of available ports.
  //     // }).catch((e) => {
  //     //   // The user didn't select a port.
  //     // });
  //     // let usbVendorId= 1659;
     
  //     // this.port = await navigator.serial.requestPort({
           
  //     // }) 
  //     let usbVendorIdX = this.commonService.getPoleDisplayValue();// localStorage.getItem('usbVendorId');
  //     // console.log('usbVendorIdX', usbVendorIdX);
  //     if (usbVendorIdX!==null && usbVendorIdX!==undefined && usbVendorIdX!=='' && usbVendorIdX!=="undefined"  && usbVendorIdX!=="null") {
  //       // const filter = { usbVendorId: usbVendorIdX };
  //       // const port = await navigator.serial.requestPort();
  //       // let port = await navigator.serial.requestPort({ filters: [filter] }) ;
        
  //       let ports = await navigator.serial.getPorts();
     
  //         if ((ports !== null) && (Array.isArray(ports)) && (ports?.length > 0)) {
             
  //           for (let i = 0; i < ports.length; i++) {
             
  //             let usbVendorId = ports[i].getInfo()?.usbVendorId?.toString();
              
  //             if(usbVendorId !==null && usbVendorId !== undefined && usbVendorId === usbVendorIdX.toString())
  //             {
              
  //               this.port = ports[i];
  //             } 
  //           } 
  //         }
  //         else
  //         {
  //           this.port = await navigator.serial.requestPort({
           
  //           }) 
  //         }
  //         // console.log(this.port.getInfo()) ;
  //     } else { 
  //       // debugger;
  //       this.port = await navigator.serial.requestPort({
           
  //       }) 
  //     }
  //     debugger;
  //     if(this.port===null || this.port===undefined)
  //     {
  //       this.port = await navigator.serial.requestPort({
           
  //       }) 
  //     }
      
  //     try {
        
    
  //       // console.log(this.port.IsOpen)  ;
  //        await  this.port.open({
  //         baudRate: 9600,
  //         // dataBits: 8,
  //         // stopBits: 1,
  //         // parity: "none"
  //        }).then(async (err: any) => {
  //           if (err) return console.dir( 'Error' + err);
  //           console.log('serial port opened');
  //           // // console.dir( this.port);
  //           // console.log( this.port.getInfo());

  //           // console.log('serial port opened', this.port.getInfo());
  //           debugger;
  //           let id: any = this.port.getInfo().usbVendorId;
  //           if(id!== null && id!==undefined && id!=='null' && id!=='undefined' && id!=='')
  //           {
              
  //             this.commonService.setPoleDisplayValue(id);
  //           }
           
  //         });
          
  //     } catch (error) {
  //       debugger;
  //       console.log(error);
  //       if(this.port===null || this.port===undefined)
  //       {
  //         this.detectMultiMonitor();
  //       }
       
  //       // this.ignorePoleDisplay=true;
  //       // this.alertify.warning(error);
  //     }
       
      
      
      
      
  //   }
     
     
      
  // }

  title = 'GPOSX';
  jwtHelper = new JwtHelperService();
  source$: Observable<Event>;
  currentState = 'initial';
  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }

  public showLoadingIndicator: boolean = true;
  // @HostListener('window:beforeunload', ['$event']) 
  private hubConnection: HubConnection;
  doSomething($event) {
    // debugger;
     
    // this.authService.logout();
    // this.basketService.customer$ = null;
    // this.basketService.basket$ = null;
    // return $event.returnValue='Your changes will not be saved';
     
  }
  @HostListener('window:storage', ['$event'])
  onStorageChange(ev: StorageEvent) {
    // debugger;
    //  console.log(ev.key);
    //  console.log(ev.newValue);        
  }
  deviceInfo = null;
  // , private basketService: BasketService
  constructor( private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document , private clientDisallowanceService: ClientDisallowanceService , public env: EnvService, public datePipe: DatePipe, private storeClient: StoreclientService, private _hotkeysService: HotkeysService, private zone: NgZone, private deviceService: DeviceDetectorService, public commonService: CommonService, public authService: AuthService, private signalRService: SignalRService, 
    private basketService: BasketService, private _router: Router, private router: ActivatedRoute,  private themeService: ThemeService, 
    public keyboardService: KeyboardService){
    //   console.log(
    //     `\n%cBuild Info:\n\n` +
    //         `%c ❯ Environment: %c${environment.production ? "production 🏭" : "development 🚧"}\n` +
    //         `%c ❯ Build Version: ${buildInfo.version}\n` +
    //         ` ❯ Build Timestamp: ${buildInfo.timestamp}\n` + 
    //     "font-size: 14px; color: #7c7c7b;",
    //     "font-size: 12px; color: #7c7c7b",
    //     environment.production ? "font-size: 12px; color: #95c230;" : "font-size: 12px; color: #e26565;",
    //     "font-size: 12px; color: #7c7c7b",
    //     "font-size: 12px; color: #bdc6cf",
    // );
   
        if(RunTimeFile!==null && RunTimeFile!==undefined &&  RunTimeFile?.buildtime!==null && RunTimeFile?.buildtime!==undefined  )
        {
           
          this.buidTime =   this.datePipe.transform(RunTimeFile?.buildtime, 'yyMMdd|HHmmss'); 
        }
    // environmentHost
    // this._router.events.subscribe((routerEvent: RouterEvent) => {
    //   debugger;
    //   if (routerEvent instanceof RouteConfigLoadStart) {
    //     this.showLoadingIndicator = true;
    //   }

    //   if (routerEvent instanceof RouteConfigLoadEnd ) {
    //     // this.showLoadingIndicator = false;
    //   }
    // });
    window.addEventListener('beforeunload', (event: BeforeUnloadEvent) => {
      // debugger;
      // if (this.generatedBarcodeIndex) {
      //  event.preventDefault(); // for Firefox
      //  event.returnValue = ''; // for Chrome
      //  return '';
      // }
      return false;
     });
    //  this.epicFunction();

    this._hotkeysService.add(new Hotkey(['shift', 'alt', 'ctrl', 'command'], (event: KeyboardEvent): boolean => {
      // console.log('Secret message');
          return false;
      }, undefined, 'Send a secret message to the console.'));

      
  }
  epicFunction() {
    console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    console.log(this.deviceInfo);
    console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }
  shortcuts$: Observable<ShortcutInput[]>;
  // localIp ='';// sessionStorage.getItem('LOCAL_IP');

  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);

  private determineLocalIp() {
    //  this.getRTCPeerConnection();
    this.getRTCPeerConnection();
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('rct');
    pc.createOffer().then(pc.setLocalDescription.bind(pc));

    pc.onicecandidate = (ice) => {
      this.zone.run(() => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          return;
        }

        let localIp = this.ipRegex.exec(ice.candidate.candidate)[1];
        sessionStorage.setItem('LOCAL_IP', localIp);
        console.log('local IP', localIp);
        pc.onicecandidate = () => {};
        pc.close();
      });
    };
  }

  private getRTCPeerConnection() {
    return window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
  }

  @HostListener("window:resize", [])
  public onResize() {
    this.detectScreenSize();
  }
  
 
  height= 0;
  width= 0;
  private detectScreenSize() {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
      localStorage.setItem('windowWidth', this.width.toString());
      localStorage.setItem('windowHeight', this.height.toString());
     
       
  }

  // @Input() scaleFactor: number = 0.08;
  // @Input() zoomThreshold: number = 9;
  // @Input() initialZoom: number = 5;
  // @Input() debounceTime: number = 100; // in ms
  // scale: number;
  // @Output() onPinch$: Subject<number> = new Subject<number>();
  mainShortcuts$: Observable<ShortcutInput[]>;
  VirtualKey$: Observable<boolean>;
  SystemCheck$: Observable<boolean>;
  NumbericVirtualKey$: Observable<boolean>;
  onShow= false;
  dbAPIName= "";
  pingResponseTime =null;
  token ="";

  time: number = 0;
  timerDisplay ;
  interval;

 startTimer() {
    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.timerDisplay=this.transform( this.time)
    }, 1000);
  }
  transform(value: number): string {
    if(value > 20 &&  this.commonService.getSystemCheck())
    {
      this.pauseTimer();
      window.location.reload();
    }
    const minutes: number = Math.floor(value / 60);
    return minutes  + ' minutes : ' + (value - minutes * 60) + ' seconds';
  }

 
  pauseTimer() {
    clearInterval(this.interval);
  }
  showChangelog()
  {
    this._router.navigate(['/admin/changelog']);
  }
  production= false;
  

  offLine = false;
  buidTime =  "";  
  getFileTime()
  {
    // this.commonService.getIndexFile().subscribe((response: any)=>{
    //   console.log('response', response);
    // })
    // fetch("index.html")
    // .then(response => response.blob())
    // .then((blob: any) => {
    //   console.log('blob', blob);
    //   let file: any = new File([blob], blob.name);
    //   console.log('file', file);
    //   if(file!==null && file!==undefined && file?.lastModifiedDate !==null && file?.lastModifiedDate!==undefined && file?.lastModifiedDate?.toString()?.length > 0)
    //   { 
    //     this.buidTime = this.datePipe.transform(file?.dateMo, 'yyMMdd|HHmmss'); 
    //     //this.authService.formatDate(file?.lastModifiedDate)??"";
    //   }
     
    //   // console.log(file.lastModifiedDate, file.lastModified);
    // });
    // console.log("MyApp version " + version.buildtime);
  }
  setupMode= false;
  // async getCurrentTab() {
  //   let getting = browser.tabs.get(
  //     tabId              // integer
  //   )
  // }
  // checkexistedUrl()
  // {
  //   localStorage.
  // }
  ngOnInit(): void {
    // this.getFileTime();
    let url = this.router.url;
    let urlx= window.location.pathname;
    // const currentHost = window.location.hostname;
    // console.log('getSelection',  currentHost);
    // console.log('urlx', urlx);
    // debugger;
    if(urlx.includes('/setup-new-store') && this.authService.loggedIn()===false)
    {
      this.setupMode = true;
    } 
    console.log('this.setupMode', this.setupMode);
    let company = this.authService.getCurrentInfor();
    if(company!==null && company!==undefined)
    {
      this.loadSetting() ;
    }
    setTimeout(() => {
      fromEvent(window, 'online').subscribe((resp: any) => {
        // console.log(resp);
        // console.log('online');
         
          this.offLine = false;
          this.commonService.changeOffline(false);
        
        // Swal.fire({
        //   html: 'Connection restored',
        //   // target: '#custom-target',
        //   customClass: {
        //     container: 'position-absolute'
        //   },
        //   toast: true,
        //   timer: 5500,
        //   position: 'bottom-left'
        // })
      });
    
      fromEvent(window, 'offline').subscribe((resp: any) => {
        // console.log(resp);
        // console.log('offline');
       
        if(this.checkOffLine === 'true')
        {
          this.offLine = true;
          this.commonService.changeOffline(true);
        }
        else
        {
          this.offLine = false;
          this.commonService.changeOffline(false);
        }
  
        // Swal.fire({
        //   html: '<img src="../../../../assets/images/System/Offline_logo.svg" style="width: 10%;">   You are offline ',
        //   // target: '#custom-target',
        //   customClass: {
        //     container: 'position-absolute'
        //   },
        //   toast: true,
        //   timer: 5500,
        //   position: 'bottom-left'
        // })
      });
    }, 30);
    
    
    this.production =  environment.production;

    this.shortcuts$ = this.commonService.Shortcuts$;
    this.mainShortcuts$ = this.commonService.MainShortcuts$;
    this.SystemCheck$ = this.commonService.SystemCheck$;
    // if(this.)
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.NumbericVirtualKey$ = this.commonService.NumbericVirtualKey$;
    setTimeout(() => {
      let companyInfo = this.authService.getCompanyInfor();
      console.log('companyInfo', companyInfo);

      if(companyInfo!==null && companyInfo!== undefined && companyInfo?.checkUserStatus===true)
      {
        // let url = this._router?.url?.toString();  
        // console.log('url', url);
        // debugger;
        // if(url!==null && url!==undefined && url.includes('login') === false && this.token?.length > 0)
        // { 
          this.startTimer() ;
          this.commonService.changeSystemCheck(true);
          this.signalRService.connectHub().catch(e => {
            this.commonService.changeSystemCheck(false);
            console.log('connect Hub Error', e);
          });
          this.hubConnection = this.signalRService.hubConnection;
          this.hubConnection.on("publicMessageMethodName", (data) => {
           
            this.showNotify(data);
            console.log(data);
          });
          this.hubConnection.on("privateMessageMethodName", (data) => {
            
            this.showNotify(data);
            console.log(data);
          });
  
       
        // } 
      }
      
      this.commonService.NumbericVirtualKey$.subscribe(data =>{
        if(data === false)
        {
          this.initPage();
        }
        
      })
      if(this.commonService.getSystemCheck()=== false)
      {
        
        this.initPage();
      }  
    }, 50);
  
    // setTimeout(() => {
    //   var versionUpdate = (new Date()).getTime();  
    //   var script=document.createElement("script");
    //   // script.type="text/javascript";
    //   // s.innerHTML="console.log('done');"; //inline script
    //   script.src = "env.js?v=" + versionUpdate;   //external script
    //   // document.head.appendChild(script); 
    //   this._renderer2.appendChild(this._document.head, script);
    // } );
   

    // document.body.style.transform ='scale('+50+'%)';
   
   
  }
 

 



//   return {
//     restrict: 'E',
//     link: link,
// 		transclude: true,
//     replace: true,
//     scope: {},
//     template: '<button class="add-to-cart" ng-transclude></button>'
//   };
// });


  RefeshPage()
  {
    window.location.reload();
  }
  removeHeader=false;
  getDisalowance(companyCode, storeId, counterId, publicId) 
  {
    this.storeClient.getById(companyCode, storeId, '', counterId, publicId).subscribe((response: any)=>{
      localStorage.setItem("GetDisallowance", 'true');
      if(response.success)
      {
        localStorage.setItem('storeClient', JSON.stringify(response.data));
      }
      // else
      // {

      // }
      }, error =>{
        localStorage.setItem("GetDisallowance", 'true');
        console.log('Disallowance error', error);
    });
    // debugger;
    // let list: SClientDisallowance[] = JSON.parse(localStorage.getItem("DisalowanceList"));
    // if (list === null || list === undefined || list.length === 0) {
      
    // }
    // return list;
    // this.clientDisallowanceService.getAll(companyCode, storeId, '', counterId,'').subscribe((response: any) => {
    //   // debugger;
    //   localStorage.setItem("GetDisallowance", 'true');
    //   if (response.success === false) {
    //     // this..warning(response.message);
    //     console.log('Client disallowance message',response.message);
    //   }
    //   else {
    //     if(response.data!==null && response.data!==undefined && response.data?.length > 0)
    //     { 
    //       localStorage.setItem("DisallowanceList", JSON.stringify(response.data)); 
    //     }
    //     else
    //     {
    //       localStorage.setItem("DisallowanceList", null);
    //     }
       
    //   } 
    // }, error =>{
    //   localStorage.setItem("GetDisallowance", 'true');
    //   console.log('Disallowance error', error);
    // });
  }
  initPage()
  {
    if(this.router?.url?.toString().includes('/shop/order-display') )
    {
        this.removeHeader = true;
  
    }
    // debugger;
    this.detectScreenSize();
    // let id = 
    const fpPromise = FingerprintJS.load();(async () => {
      // Get the visitor identifier when you need it.
      const fp = await fpPromise
      const result = await fp.get()
    
      // This is the visitor identifier:
      const visitorId = result.visitorId;
      let currentLocalIP =  this.authService.getLocalIP();
      if(currentLocalIP===null || currentLocalIP === undefined || currentLocalIP ==='')
      {
        localStorage.setItem('visitorId',visitorId );
      }
    
      // let id =  await machineId();
      // let id = machineIdSync({original: true})
      // console.log('id XXX', id)
    })()
    // this.determineLocalIp();
  
    const token = localStorage.getItem('token');
    this.token = token;
    if(token)
    {
      this.authService.decodeToken = this.jwtHelper.decodeToken(token);
    }
    if(this.authService.loggedIn())
    {
      const permissions = localStorage.getItem('permissions');
    
      if(permissions=== null || permissions === "" || permissions === undefined)
      {
        this.authService.loadPermission(this.authService.decodeToken?.unique_name);
      }
      if(this.getDisallowance!==null && this.getDisallowance!==undefined && this.getDisallowance==='true')
      {
        let storeClient = this.authService.getStoreClient();
        if(storeClient!==null && storeClient!==undefined)
        {
          debugger; 
            let storeSelected = this.authService.storeSelected();
            let checkGetDisallowance = localStorage.getItem("GetDisallowance");
            if(checkGetDisallowance===null || checkGetDisallowance===undefined || checkGetDisallowance !== 'true')
            {
                this.getDisalowance(storeClient?.companyCode, storeSelected.storeId, storeClient.localIP, storeClient.publicIP);
            }
            
          // if( storeClient?.publicIP!==null  && storeClient?.publicIP!==null && storeClient?.localIP !== storeClient?.publicIP )
          // {
          //   let storeSelected = this.authService.storeSelected();
          //   let checkGetDisallowance = localStorage.getItem("GetDisallowance");
          //   if(checkGetDisallowance!==null && checkGetDisallowance!==undefined && checkGetDisallowance !== 'true')
          //   {
          //       this.getDisalowance(storeClient?.companyCode, storeSelected.storeId, storeClient.localIP);
          //   }
            
          // }
        }
      }
      else  
      {
        let storeClient = this.authService.getStoreClient();
        if(storeClient!==null && storeClient!==undefined)
        {
          // localStorage.setItem("storeClient", );
          if(storeClient?.disallowances!==undefined && storeClient?.disallowances!==null && storeClient.disallowances?.length > 0)
          {
            storeClient.disallowances = []; 
            localStorage.setItem("storeClient", JSON.stringify(storeClient));
          }
          
        }
      }
    }
    // debugger;
    if(this.width <= 1024)
    {
      // debugger;
      document.body.style.zoom = "80%";
    }
    if(environment.production===true)
    {
      setInterval(() => {
        if(this.onShow===false)   
        {
          // debugger;
          const t0 = performance.now();
          let interval;
      
          // console.log('processing request', request);
          interval = setInterval(() => {
            const t1 = performance.now();
            const responseTime = (t1 - t0) / 1000;
            // console.log(`Request took ${responseTime} ms since start`);
          }, 10);
          this.commonService.getVersion().subscribe((response: any)=>{
            // debugger;
            const t1 = performance.now();
            this.pingResponseTime = ((t1 - t0) / 1000 ) * 1000;
            // console.log(`Request finished: took ${this.pingResponseTime} ms`);
            this.pingResponseTime = this.authService.formatCurrentcy(this.pingResponseTime);
            // console.log(this.pingResponseTime);
            clearInterval(interval);
            if(response!==null && response!==undefined)
            {
              // if(res!==null && res!==undefined)
              // { 
                if(this.currentApplicationVersion !== response.version)
                { 
                  this.onShow = true;
               
                  Swal.fire({
                    icon: 'warning',
                    title: 'New version update',
                    text: "There is a new update. the site will automatically reload. Thanks!"
                  }).then(() => {
                    
                    
                    setTimeout(() => {
                      localStorage.setItem("currenVersion", '');
                      localStorage.setItem("currenVersion", null);
                    });
                    setTimeout(() => {
                      localStorage.setItem("currenVersion", response.version); 
                    },10);

                  
                   
                    window.location.href = window.location.href;
                  });
                
                }
              //   else
              //   {
              //     return;
              //   }
              // }
            }
          });
        
        }
        
      
      }, 1000 * 60);
    }
  }
  videoSource = "./assets/medias/testVideo.mp4";
  enableShorcut = 'false';
  checkOffLine = 'false';
  getDisallowance= 'false';
  loadSetting() {
    let store = this.authService.storeSelected();
    if(store!==null && store!==undefined && store.companyCode?.length > 0  && store.storeId?.length > 0)
    {
      let generalSetting = this.authService.getGeneralSettingStore(store.companyCode, store.storeId);
      if(generalSetting!==null && generalSetting!==undefined  && generalSetting?.length > 0)
      {
        let enableShorcut = generalSetting.find(x => x.settingId === 'EnableShorcut');
        // debugger;
        if (enableShorcut !== null && enableShorcut !== undefined) {
          this.enableShorcut = enableShorcut.settingValue;
        }
        let checkOffLine = generalSetting.find(x => x.settingId === 'CheckCounterOffline');
        // debugger;
        if (checkOffLine !== null && checkOffLine !== undefined) {
          this.checkOffLine = checkOffLine.settingValue;
        }
        let getDisallowanceData = generalSetting.find(x => x.settingId === 'ClientDisallowance');
        // debugger;
        if (getDisallowanceData !== null && getDisallowanceData !== undefined) {
          this.getDisallowance = getDisallowanceData.settingValue;
        }
      }
      
    }
   
    
  }
  shortcuts: ShortcutInput[] = [];  
  @ViewChild('input') input: ElementRef;  
  currentApplicationVersion = "";
  loadLocalVersion()
  {
    // console.log("call");
    let version = localStorage.getItem("currenVersion");
    let verStr= "";
    if(version!==null && version!==undefined && version!=='')
    {
      verStr = version;
    }
    else
    {
      localStorage.setItem("currenVersion", this.currentApplicationVersion);
      verStr = this.currentApplicationVersion;
    }
    return verStr;
  }

  ngAfterViewInit(): void {  
    this.currentApplicationVersion = environment.appVersion; 
    
    // debugger;
    
      let dbAPIName = localStorage.getItem('dbAPI');
      if(dbAPIName!==null && dbAPIName!==undefined && dbAPIName!=="" && dbAPIName!=='null' && dbAPIName!=='undefined')
      {
        this.dbAPIName = dbAPIName;
      }
      else
      {
        this.dbAPIName = "";
      }
    
   
    this.loadLocalVersion();
    this.detectScreenSize();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
         for (const registration of registrations) {
            // unregister service worker
            console.log('serviceWorker unregistered');
            registration.unregister();
         }
      });
   }
    
    // setTimeout(() => {
    //   var versionUpdate = (new Date()).getTime();  
    //   var script=document.createElement("script");
    //   script.type="text/javascript";
    //   // s.innerHTML="console.log('done');"; //inline script
    //   script.src = "env.js?v=" + versionUpdate;   //external script
    //   document.head.appendChild(script); 
    // } );
   
    //     
    //     var script = document.createElement("script");  
    //     script.type = "text/javascript";  
    //     script.src = "env.js?v=" + versionUpdate;  
        
    //     document.body.appendChild(script); 

    setTimeout(() => {
      // if(env.enableDebug) {
      //   console.log('Debug mode enabled!');
      // }
      // debugger;
      // console.log('env.apiUrl' , this.env.apiUrl);
      localStorage.setItem('environmentHost', this.env.host);
      // console.log('env.host' , this.env.host);
      // console.log('env.apiMWIUrl' , this.env.apiMWIUrl);
    });
    
  }  
  
  @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;  




  showMessage=false;
  seconds = 30;
 
  intervalId: number;
  NotifyMessage="";
  timer() {
    // debugger;
      this.seconds--;
      if (this.seconds == 0) { 
          
          clearInterval(this.intervalId); 
          this.showMessage = false;
          return;
      }
      
  }
  showNotify(message)
  {
    this.NotifyMessage=message;
    if (this.showMessage) {
     
      clearInterval(this.intervalId);
      
    } else {
       
        if(this.seconds === 0) {
            this.seconds = 30;
        }
         
        this.intervalId  = window.setInterval(() =>  this.timer(), 1000)
    }
    this.showMessage = !this.showMessage;
  }
  // @HostListener('window:beforeunload')
  ngOnDestroy() {
    // debugger;
    localStorage.clear();
    
    // this.signalRService.stopConnection();
  }

}