import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DxDrawerComponent } from 'devextreme-angular';
import { Observable } from 'rxjs';
import { MCustomer } from '../_models/customer';
import { SGeneralSetting } from '../_models/generalsetting';
import { MStore } from '../_models/store';
import { TShiftHeader } from '../_models/tshiftheader';
import { AuthService } from '../_services/auth.service';
import { CommonService } from '../_services/common/common.service';
import { CustomerService } from '../_services/data/customer.service';
import { DenominationService } from '../_services/data/denomination.service';
import { FormatconfigService } from '../_services/data/formatconfig.service';
import { GeneralsettingService } from '../_services/data/generalsetting.service';
import { ShiftService } from '../_services/data/shift.service';
import { StoreService } from '../_services/data/store.service';
import { MwiService } from '../_services/mwi/mwi.service';
import { AlertifyService } from '../_services/system/alertify.service';
import { timer } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { LoadingProgressModel, ProgressModel } from '../_models/common/LoadingProgressModel';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserService } from '../_services/data/user.service';
import { MUser } from '../_models/user';
import { AbstractControl, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';   
import { StorecurrencyService } from '../_services/data/storecurrency.service';
import BarcodeScanner from "simple-barcode-scanner"; 
import { MCompany } from '../_models/company';
import { ToastrService } from 'ngx-toastr';
import { VoidreturnsettingService } from '../_services/system/voidreturnsetting.service';
import { StoreclientService } from '../_services/data/storeclient.service';
import { SStoreClient } from '../_models/storeclient';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { SignalRService } from '../_services/common/signalR.service';
import { stepper, transformer } from './route.animation';
import { KeyboardService } from '../component/shared/virtual-keyboard/virtual-keyboard.service';
import { ClientDisallowanceService } from '../_services/data/client-disallowance.service';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  animations: [
    // fader,
    // slider,
    transformer,
    // stepper
  ]
})
export class ShopComponent implements OnInit {
  selectedOpenMode: string = 'overlap';
  selectedPosition: string = 'right';
  selectedRevealMode: string = 'slide';
  isDrawerOpen: Boolean = false;
  isMore: boolean = false;
  selectedStore: MStore;
  showFiller = false;
  storeList: MStore[];
  shiftList: TShiftHeader[];
  isVirtualKey = false;
  showSubMenu: boolean = false;
  menuList: any[];
  subList: any[];
  subListGroup: any[];
  subListItemGroup: any[];
  isShowMore = false;
  currentInfor: any;
  progressShow = false;

  // @HostListener('window:beforeunload', ['$event']) 
  // yourfunction($event) {
  //   this.signalRService.stopConnection();
  //     return $event.returnValue='Your changes will not be saved';
  // }
  // @HostListener('window:beforeunload')
  ngOnDestroy() {
    // debugger; 
    // this.signalRService.stopConnection();
    // this.keyboardShow = false;
  }
  public onDetect(result: string)
  {
    console.log(result);
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  // buttonText = "Start progress";

  // inProgress = false;
  // seconds = 30;
  // maxValue = 30;
  // intervalId: number;

  // timer() {
  //   // debugger;
  //   this.seconds--;
  //   if (this.seconds == 0) {
  //     this.buttonText = "Restart progress";
  //     this.inProgress = !this.inProgress;
  //     clearInterval(this.intervalId);
  //     // this.loadShiftOpenList();
  //     this.loadMenu();
  //     this.authService.setConfigComplete(this.loadingProgressModel);
  //     this.isShowMore = false;
  //     return;
  //   }
  //   // if(this.seconds % 2 === 0)
  //   // {
  //   //   this.step++;
  //   // }
  // }

  format(value) {
    return 'Loading: ' + value * 100 + '%';
  }
  switchVirtualKey(value) {
    // debugger;
    this.commonService.changeVirtualKey(value);
    // this.isVirtualKey=!this.isVirtualKey;
    // localConfig.isVirtualKey=!localConfig.isVirtualKey; 


  }
  updateContentTimer: number;
  scrollByContent = true;
  scrollByThumb = true;
  scrollbarMode: string;
  pullDown = false;
 
  progressList: ProgressModel[] = [];
  moreOptionsVisible: boolean;
  loadingProgressModel: LoadingProgressModel;
  toggleMoreOptions() {
    this.moreOptionsVisible = !this.moreOptionsVisible;
  }
  previousUrl: string;
  // formatService, GeneralSetting, alertifyService, customerService, mwiService,
  // loadDenomination
  constructor(private toastr: ToastrService, private keyboardService: KeyboardService,  private voidreturnsettingService: VoidreturnsettingService, 
    public storeClient: StoreclientService,  public commonService: CommonService, public authService: AuthService,  private counterService: ClientDisallowanceService, 
    private mwiService: MwiService, private denomiService: DenominationService, private router: Router, private signalRService: SignalRService, 
    private storeService: StoreService, private shiftService: ShiftService, private userService: UserService ) {
    this.moreOptionsVisible = false;
    // let progess = new ProgressModel();
    // progess.num=1;
    // progess.code="A";
    // progess.description="B";
    // progess.icon= "C";
    // progess.value = "D";
    // progess.pass= false;
    // router.events
    // .pipe(filter(event => event instanceof NavigationEnd))
    // .subscribe((event: NavigationEnd) => {
    //   debugger;
    //   // console.log('prev:', event.url);
    //   this.previousUrl = event.url;
    // });

  }
 
  @ViewChild('drawer', { static: false }) drawer: DxDrawerComponent;
  @ViewChild(DxDrawerComponent, { static: false }) drawerKeyboard: DxDrawerComponent;

  sttGhi = 0;
  showDissallowanceList = false;
  dissallowanceView()
  {
    debugger;
    this.showDissallowanceList=!this.showDissallowanceList;

    if(this.showDissallowanceList===true)
    {
     let storeClient = this.authService.getStoreClient();
     let storeSelected = this.authService.storeSelected();
      if(storeClient!==null && storeClient!==undefined)
      {
         this.disallowanceList =  storeClient?.disallowances;
        // this.counterService.getAll(storeClient.companyCode, storeSelected.storeId, '', storeClient.localIP,'').subscribe((response: any) => {
        //   // debugger;
        //   // localStorage.setItem("GetDisallowance", 'true');
        //   if (response.success === false) {
        //     // this..warning(response.message);
        //     Swal.fire('Disallowance',response.message,'warning');
        //     // console.log('Client disallowance message',response.message);
        //   }
        //   else {
        //     this.disallowanceList = response.data;
        //     // if(response.data!==null && response.data!==undefined && response.data?.length > 0)
        //     // { 
        //     //   localStorage.setItem("DisallowanceList", JSON.stringify(response.data)); 
        //     // }
        //     // else
        //     // {
        //     //   localStorage.setItem("DisallowanceList", null);
        //     // }
           
        //   } 
        // }, error =>{
        //   // localStorage.setItem("GetDisallowance", 'true');
        //   console.log('Disallowance error', error);

        // });
      }
     
    }
  }

  toggleSideBar(event) {

    this.isDrawerOpen = false;
    if (event === true) {
      this.isMore = true;
      this.selectedPosition = 'right';
    }
    else {
      this.isMore = false;
      this.selectedPosition = 'left';
    } 
    // debugger;
    this.isDrawerOpen = true;
     
  }
  // toggleSideBarKey(value) {  
    
  //   this.isDrawerOpen = false;
  //   if(value)
  //   {
  //     this.isMore = false;
  //     this.selectedPosition = 'bottom'; 
  //     this.selectedOpenMode  = 'push'; 
  //      this.selectedRevealMode  = 'expand';
  //     this.isDrawerOpen = true;
  //   }
    
    
  // }
  // showRight()
  // {
  //   this.drawer.toggle();
  // }

  VirtualKey$: Observable<boolean>;
  ShowMenu$: Observable<boolean>;
  currentShift: TShiftHeader;
  companyInfor: MCompany;
 
  terminalRequire = 'FingerId';

  loadSetting() {
    let terminalRequite = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'DefaultCounter');
    // debugger;
    if (terminalRequite !== null && terminalRequite !== undefined) {
      this.terminalRequire = terminalRequite.settingValue;
    }
    
  }
  redirectToDeviceSetup()
  {
    let url = this.router?.url?.toString();
    debugger;
    if(url!==null && url!==undefined && url.includes('/shop/bills') === false)
    {
      if(url!==null && url!==undefined && url!=='')
      {
        if(url.includes('/admin/device-setting/'))
        {
          url= url.replace('/admin/device-setting/','').split('%252F').join('/').split('%2F').join('/'); //
        }
        
      }
      if(url !== '/admin/device-setting')
      {
          if(url!==null && url!==undefined && url!=='')
          {
          this.router.navigate(['/admin/device-setting', url]);
          }
          else
          {
          this.router.navigate(['/admin/device-setting']);
          }
      }
    }
    
  }
  keyboardShow = false;
  virtualKey;
  ngOnInit() {
  
    // var navigator_info = window.navigator;
    // var screen_info = window.screen;
    // debugger;
    // let uid: any = navigator_info.mimeTypes.length;
    // uid += navigator_info.userAgent.replace(/\D+/g, '');
    // uid += navigator_info.plugins.length;
    // uid += screen_info.height || '';
    // uid += screen_info.width || '';
    // uid += screen_info.pixelDepth || '';
    // console.log(uid);
    // document.write(uid);
    
    // this.keyboardService.keyboardRequested.subscribe(show => {
    //   this.keyboardShow = show ?? false;
    //   // if(this.keyboardShow)
    //   // {
    //   //   this.toggleSideBarKey(true);
    //   // }
    // });
    // this.virtualKey = this.commonService.getCurrentVirtualKey();
    // if(this.virtualKey!==undefined && this.virtualKey!==null && this.virtualKey===true)
    // {
    //   this.commonService.changeVirtualKey(false);
    //   this.keyboardShow = false;
    // }
    // setTimeout(() => {
    //   let virtualKey = this.virtualKey; 
    //   debugger;
    //   if(virtualKey!==undefined && virtualKey!==null && virtualKey===true)
    //   {
    //     this.commonService.changeVirtualKey(true);
    //     this.keyboardShow = true;
    //     // window.location.reload();
    //   }
    // }, 150);
   
  
    this.companyInfor = this.authService.getCompanyInfor();
  // Add a listener

   
// Remove the listener
// scanner.off();
    // debugger;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.currentShift = this.shiftService.getCurrentShip();
    this.ShowMenu$ = this.commonService.ShowMenu$;
    this.currentInfor = this.authService.getCurrentInfor();
    this.selectedStore = this.authService.storeSelected();
    if(this.selectedStore !==null && this.selectedStore !==undefined)
    {
      this.loadSetting();
    }
    // 

    if(this.selectedStore===null || this.selectedStore===undefined)
    {
      this.router.navigate(['/shop/select-outlets']).then(()=>{
        // location.reload();
      });
    }
    else  
    {
      let storeClient = this.authService.getStoreClient();
      // debugger;
      if(storeClient===null || storeClient===undefined || storeClient?.publicIP === '' || storeClient?.publicIP === null || storeClient?.publicIP === undefined)
      {
        // this.router.navigate(['/shop/device-setting']);
        if(this.terminalRequire.toLowerCase()!=="fingerid")
        {
          this.redirectToDeviceSetup();
        }
      
        // if(this.currentShift===null || this.currentShift===undefined)
        // {
        //   if(this.router?.url?.toString() === '/shop/order-grocery' || this.router?.url?.toString() === '/shop/order')
        //   {
        //     this.router.navigate(['/shop/shifts']);
        //   }
          
        // }
        // else
        // {
        //   if(this.currentInfor===null || this.currentInfor===undefined)
        //   {
        //     this.router.navigate(['/login']);
        //   }
        // }
      }
      else
      {
        if(this.terminalRequire.toLowerCase()!=="fingerid")
        {
          this.storeClient.getById(this.selectedStore.companyCode , this.selectedStore.storeId, '', this.authService.getLocalIP() ,'').subscribe((response: any)=>{
            if(response.success)
            {
              // debugger;
              let result = response.data;
              if(result=== null && result === undefined)
              {
                this.redirectToDeviceSetup();
              } 
            }
            else
            {
               this.redirectToDeviceSetup();
            }
          });
        }
        
        if(this.currentShift===null || this.currentShift===undefined)
        {
          if(this.router?.url?.toString() === '/shop/order-grocery' || this.router?.url?.toString() === '/shop/order')
          {
            this.router.navigate(['/shop/shifts']);
          }
          
        }
        else
        {
          if(this.currentInfor===null || this.currentInfor===undefined)
          {
            this.router.navigate(['/login']);
          }
        }
      }
    }
  
    // let store= this.authService.storeSelected();
    // this.loadConfig();


    // this.startprogress();

    // console.log("store" +  this.authService.storeSelected().storeId);

    // if(permissions.some(x=>x.ParentId === "AdminPage" && x.V === 1 && x.ControlId === null && x.functionId ==="Adm_MORE"))
    // {


    // }
    let counterInfor = this.authService.getStoreClient();
    if(counterInfor!==null && counterInfor!==undefined)
    {
      this.disallowanceList = counterInfor?.disallowances;

    }
  }
  disallowanceList =[];
  logOut() {
    this.authService.logout();
  }
  // loadShiftOpenList() {

  //   let store = this.authService.storeSelected();
  //   let now = new Date();
  //   let month = now.getMonth() + 1;
  //   if (month === 13) {
  //     month = 1;
  //   }
  //   let dateFormat = now.getFullYear() + "/" + month + "/" + now.getDate();
  //   // if(store === null || store=== undefined)
  //   // {
  //     let storeClient = this.authService.getStoreClient();
  //     let terminalId ="";
  //     if(storeClient!==null && storeClient!==undefined)
  //     {
  //       terminalId = this.authService.getStoreClient().publicIP;
  //     }
  //     else
  //     {
  //       terminalId = this.authService.getLocalIP();
  //     }
  //   this.shiftService.loadOpenShift(this.currentInfor.companyCode, store.storeId, dateFormat, this.authService.getCurrentInfor().username, terminalId).subscribe((response: any) => {
  //     // debugger;
  //     if(response.success)
  //     {
  //       this.shiftList = response.data;
  //       if (this.shiftList === null || this.shiftList === undefined || this.shiftList.length === 0) {
  //         this.isNewShift = true;
  //       }
  //       else {
  //         this.isNewShift = false;
  //       }
  //       console.log(this.storeList);
  //     }
  //     else
  //     {
  //       this.alertifyService.warning(response.message);
  //     }
      
  //   });
  //   // debugger;

  //   // }
  // }
  closeDraw()
  {
    
      debugger;
      this.isDrawerOpen = false;
    
    
   
  }
  shortcuts: ShortcutInput[] = [];  
  // loadStoreList() {
  //   let store = this.authService.storeSelected();
  //   if (store === null || store === undefined) {
  //     this.storeService.getByUser(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
  //       if(response.success)
  //       {
  //         this.storeList = response.data;
  //         if(this.storeList.length == 1)
  //         {
  //           this.changeStore(response.data[0]);
  //         }
  //       } 
  //       else
  //       {
  //         this.alertifyService.warning(response.message);
  //       }
       
  //       // this.storeList = response;
  //       // console.log(this.storeList);
  //     });
  //   }
  // }
  removeHeader = false;
  ngAfterViewInit() {
    // if(this.previousUrl.includes('admin/'))
    // {
    //   window.location.reload();
    // }
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.remove('hide');
        item.classList.add('show');
      }
    });
   if(this.router?.url?.toString() === '/shop/order-display')
  {
      this.removeHeader = true;

  }
    this.loadMenu();
     
    
  }
  
  loadMenu() {
    let permissions = JSON.parse(localStorage.getItem("permissions"));
    // debugger;
    if (permissions !== null) {
      this.menuList = permissions.filter(x => x.ParentId === "AdminPage" && x.V === 1 && x.ControlId === null && x.functionId !== "Adm_MORE");
      this.subList = permissions.filter(x => x.ParentId === "Adm_MORE" && x.ControlId === null && x.V === 1 && x.CustomF1 === null);
      let group = permissions.filter(x => x.ParentId === "Adm_MORE" && x.ControlId === null && x.V === 1 && x.CustomF1 !== null);
      this.subListItemGroup = permissions.filter(x => x.ParentId === "Adm_MORE" && x.ControlId === null && x.V === 1 && x.CustomF1 !== null);
      this.subListGroup = group.map(({ CustomF1 }) => CustomF1).filter((x, i, a) => a.indexOf(x) == i);
    } 
  }
  filter(items: any[], key: string) {
    // debugger;
    let list = items.filter(x => x.CustomF1 === key[0]);
    // console.log(list);
    return list;
  }
  // step = 0;
  // changeStore(store) {

  //   this.setStoreSelected(store).then(() => {
      
  //   });
 
  // }
  // hoverStore = -1;
  // loadConfig() {
  //   // debugger;

  //   let a = this.authService.getConfigComplete();
  //   let store = this.authService.storeSelected();
  //   if (a !== null && a !== undefined) {
  //     this.loadingProgressModel = a;

  //   }
  //   else {
  //     this.loadingProgressModel = new LoadingProgressModel();

  //     this.progressList.push({ num: 1, code: "storeSelected", description: "Store Selected", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 2, code: "maxValueCurrency", description: "Max Value Currency", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 3, code: "formatConfig", description: "Format Config", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 4, code: "generalSetting", description: "General Setting", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 8, code: "shopMode", description: "Shop Mode", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 9, code: "invoice", description: "Invoice", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 7, code: "denomiService", description: "Denomination", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 5, code: "CRMSystem", description: "CRM System", icon: "C", value: "", pass: null });
  //     this.progressList.push({ num: 6, code: "defaultCustomer", description: "Default Customer", icon: "C", value: "", pass: null });
  //     this.loadingProgressModel.loadCompleted = false;
  //     this.loadingProgressModel.progressList = this.progressList;
  //     this.loadingProgressModel.message = "";
  //     store = null;
  //     localStorage.setItem('storeSelected', null);

  //   }
  //   if (store !== null && store !== undefined) {

  //     // if(this.currentShift===null || this.currentShift === undefined)
  //     // {  
  //     //   this.loadShiftOpenList();
  //     // }
  //   }
  //   else {

  //     this.loadStoreList();
  //   }
  //   if (this.loadingProgressModel.loadCompleted === false) {
  //     this.inProgress = true;
  //   }
  // }
  // shortcuts: ShortcutInput[] = [] ;
  // loadShortcut()
  // {
     
  //     for(let i= 1; i<= 9; i++)
  //     {
  //       //  let combokey = "alt + " + i;
  //       let label="Store " + i;
  //       this.shortcuts = this.shortcuts.filter(x=>x.label !== label);
  //       this.shortcuts.push(
  //         {
  //           key: ["alt + " + i],
  //           label: "Store " + i,
  //           description: "Store " + i, 
  //           command: (e) => {
  //             let items= this.storeList;  
  //             debugger;
  //             if(items.length >= i)
  //             {
  //               this.hoverStore = i - 1;
  //               // this.selectRow(items[i - 1]);
  //             }
  //             // this.setFocus(i-1);
  //           },
  //           preventDefault: true
  //         }
  //       )
  //     }
  //     this.shortcuts.push(
  //       {
  //         key: ["enter"],
  //         label: "Change store",
  //         description: "Change store", 
  //         command: (e) => {
  //           let items= this.storeList;  
  //           debugger;
  //           if(this.hoverStore!==-1)
  //           {
  //             this.changeStore(items[this.hoverStore]);
  //           }
            
  //         },
  //         preventDefault: true
  //       },
  //       {
  //         key: ["down"],
  //         label: "Down",
  //         description: "Down",
  //         allowIn: [AllowIn.Textarea, AllowIn.Input],  
  //         command: (e) => {
  //           debugger;
  //           if(this.hoverStore!==-1)
  //           {
  //             let items= this.storeList;  
  //             let row = this.hoverStore + 1;
  //             if(row > items.length - 1)
  //             {
  //               row = 0;
  //             }
  //             this.hoverStore = row;
              
  //             setTimeout(() => {
  //               const scrollTo = document.querySelector(".kselected");
  //               if (scrollTo) {
  //                 scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
  //               }
  //             })
  //             // this.selectRow(items[row]);
  //           }
            
  //           // this.selectRow(items[1]);
  //         },
  //         preventDefault: true
  //       },
  //       {
  //         key: ["right"],
  //         label: "Right",
  //         description: "Right",
  //         allowIn: [AllowIn.Textarea, AllowIn.Input],  
  //         command: (e) => {
  //           debugger;
  //           if(this.hoverStore!==-1)
  //           {
  //             let items= this.storeList;  
  //             let row = this.hoverStore + 1;
  //             if(row > items.length - 1)
  //             {
  //               row = 0;
  //             }
  //             this.hoverStore = row;
              
  //             setTimeout(() => {
  //               const scrollTo = document.querySelector(".kselected");
  //               if (scrollTo) {
  //                 scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
  //               }
  //             })
  //             // this.selectRow(items[row]);
  //           }
            
  //           // this.selectRow(items[1]);
  //         },
  //         preventDefault: true
  //       },
  //       {
  //         key: ["up"],
  //         label: "Up",
  //         description: "Up",
  //         allowIn: [AllowIn.Textarea, AllowIn.Input],  
  //         command: (e) => {
  //           debugger;
  //           if(this.hoverStore!==-1)
  //           {
  //             let items= this.storeList;  
  //             let row = this.hoverStore - 1;
  //             if(row <= 0)
  //             {
  //               row=0;
  //             }
  //             this.hoverStore = row;
             
  //             setTimeout(() => {
  //               const scrollTo = document.querySelector(".kselected");
  //               if (scrollTo) {
  //                 scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
  //               }
  //             })
  //             // this.selectRow(items[row]);
  //           }
            
  //           // this.selectRow(items[1]);
  //         },
  //         preventDefault: true
  //       },
  //       {
  //         key: ["left"],
  //         label: "Left",
  //         description: "Left",
  //         allowIn: [AllowIn.Textarea, AllowIn.Input],  
  //         command: (e) => {
  //           debugger;
  //           if(this.hoverStore!==-1)
  //           {
  //             let items= this.storeList;  
  //             let row = this.hoverStore - 1;
  //             if(row <= 0)
  //             {
  //               row=0;
  //             }
  //             this.hoverStore = row;
             
  //             setTimeout(() => {
  //               const scrollTo = document.querySelector(".kselected");
  //               if (scrollTo) {
  //                 scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
  //               }
  //             })
  //             // this.selectRow(items[row]);
  //           }
            
  //           // this.selectRow(items[1]);
  //         },
  //         preventDefault: true
  //       }
         
  //     )
     
    
  //     setTimeout(() => {
  //       // this.isShowSC= true;
  //       // console.log('this.shortcuts payment', this.shortcuts);
  //       this.commonService.changeShortcuts(this.shortcuts, true);
       
  //     }, 100);
  // }
  // showToast(boolValue, title, message)
  // {
  //   if(boolValue===true)
  //   {
  //     this.toastr.success( message, title );
  //   }
  //   else
  //   {
  //     this.toastr.error(message, title  );
  //   }
    
  // }
  // async setStoreSelected(store: MStore) {
  //   this.inProgress = true;
  //   debugger;
  //   // sessionStorage
  //   if(store.currencyCode!==null && store.currencyCode!==undefined  && store.currencyCode!== '' )
  //   {
  //     localStorage.setItem('storeSelected', JSON.stringify(store));
  //     let ax= this.progressList;
  //     let prog = this.progressList.find(x => x.code === 'storeSelected');
  //     prog.pass = true;
  //     this.step++;
  //     await timer(1000).pipe(take(1)).toPromise();
  //     prog.value = store.storeId + " - " + store.storeName;
  //     this.commonService.getMaxValueCurrency(store.currencyCode).subscribe(async (response: any) => {
  //       // debugger;
  //       localStorage.setItem('maxValueCurrency', response.data);
  //       let maxValue = response.data;
  //       if (maxValue === null || maxValue === undefined) {
  //         maxValue = "None";
  //       }
  //       prog = this.progressList.find(x => x.code === 'maxValueCurrency');
  //       prog.pass = true;
  //       prog.value = maxValue;
  //       this.step++;
  //       await timer(1000).pipe(take(1)).toPromise();
  //       this.formatService.getByStore(store.companyCode, store.storeId).subscribe(async (response: any) => {
  //         if (response.data !== undefined && response.data !== null) {
  //           localStorage.setItem('formatConfig', JSON.stringify(response.data));
  //           prog = this.progressList.find(x => x.code === 'formatConfig');
  //           prog.pass = true;
  //           prog.value = "Date format " + response.data.dateFormat;
  //           this.step++;
  //           await timer(1000).pipe(take(1)).toPromise();
  //           this.generasetting.GetGeneralSettingByStore(store.companyCode, store.storeId).subscribe(async (response: any) => {
  
  //              debugger;
  //             if (response.success === false) {
  //               this.alertifyService.error(response.message);
  //               localStorage.setItem("generalSetting", null);
  //               prog = this.progressList.find(x => x.code === 'generalSetting');
  //               prog.pass = false;
  //               prog.value = "Please check your setup";
  //               this.loadingProgressModel.message = "Can't get General Setting data. Please check your setup";
  //               this.loadingProgressModel.loadCompleted = false;
  //               this.loadingProgressModel.data = prog;
  //               this.step++;
  //               await timer(1000).pipe(take(1)).toPromise();
  //               this.setProgress();
  //               this.showToast(prog.pass, "General Setting", this.loadingProgressModel.message);
              
  //             }
  //             else {
               
  //               let generalsetting = response.data[0].generalSettings as SGeneralSetting[];
  //               if (generalsetting !== null && generalsetting !== undefined && generalsetting.length > 0) {
  //                 debugger;
  //                 localStorage.setItem("generalSetting", JSON.stringify(generalsetting));
  //                 let crmSource = "";
  //                 let defaultCusId = store.defaultCusId;
  //                 prog = this.progressList.find(x => x.code === 'generalSetting');
  //                 prog.pass = true;
  //                 prog.value = "Loaded";
  //                 this.step++;
  //                 await timer(1000).pipe(take(1)).toPromise();
  //                 this.showToast(prog.pass, "General Setting", prog.value);
  //                 let shopMode = generalsetting.find(x => x.settingId === 'ShopMode');
  
  //                 if (shopMode !== null && shopMode !== undefined) {
  //                   localStorage.setItem("shopMode", shopMode.settingValue);
  //                   prog = this.progressList.find(x => x.code === 'shopMode');
  //                   prog.pass = true;
  //                   prog.value = shopMode.settingValue;
  //                   this.step++;
  //                   await timer(1000).pipe(take(1)).toPromise();
                   
  //                 }
  //                 else {
  //                   localStorage.setItem("shopMode", "FnB");
  //                   prog = this.progressList.find(x => x.code === 'shopMode');
  //                   prog.pass = true;
  //                   prog.value = "FnB";
  //                   this.step++;
  //                   await timer(1000).pipe(take(1)).toPromise();
                    
  //                 }
  //                 this.showToast(prog.pass, "Shop Mode", prog.value);

  //                 let invoice = generalsetting.find(x => x.settingId === 'Invoice');
  
  //                 if (invoice !== null && invoice !== undefined) {
  //                   localStorage.setItem("invoice", invoice.settingValue);
  //                   prog = this.progressList.find(x => x.code === 'invoice');
  //                   prog.pass = true;
  //                   prog.value = invoice.settingValue;
  //                   this.step++;
  //                   await timer(1000).pipe(take(1)).toPromise();
  //                 }
  //                 else {
  //                   localStorage.setItem("invoice", "false");
  //                   prog = this.progressList.find(x => x.code === 'invoice');
  //                   prog.pass = true;
  //                   prog.value = "false";
  //                   this.step++;
  //                   await timer(1000).pipe(take(1)).toPromise();
  //                 }
  //                 this.showToast(prog.pass, "Invoice", prog.value);
  //                 let model: SStoreClient = new SStoreClient();
  //                 model.companyCode = this.authService.getCurrentInfor().companyCode;
  //                 model.storeId = this.authService.storeSelected().storeId;
  //                 model.status = 'A';
  //                 model.name = this.authService.getLocalIP();
  //                 model.localIP= this.authService.getLocalIP();
  //                 model.publicIP= this.authService.getLocalIP(); 
  //                 // debugger;
  //                 // this.showToast(prog.pass, "Counter ID", prog.value);
  //                 await timer(1000).pipe(take(1)).toPromise();
              
  //                 this.storeClient.getById(this.authService.getCurrentInfor().companyCode , this.authService.storeSelected().storeId, '', this.authService.getLocalIP() ,'').subscribe(async (response: any)=>{
  //                   // debugger;
  //                   if(response.success)
  //                   { 
  //                       if(response.data===null || response.data === undefined)
  //                       {
  //                         this.storeClient.create(model).subscribe(async (response: any)=>{
  //                           // debugger;
  //                             localStorage.setItem("storeClient", JSON.stringify(response.data));
  //                           });
  //                       }
  //                       else
  //                       {
  //                         localStorage.setItem("storeClient", JSON.stringify(response.data));
  //                       } 
  //                       debugger;
  //                       await timer(1000).pipe(take(1)).toPromise();
  //                       this.storeCurrencyService.getByStoreWExchangeRate(this.authService.getCurrentInfor().companyCode , this.authService.storeSelected().storeId).subscribe(async (response: any)=>{
  //                         debugger;
  //                         if(response.success)
  //                         { 
                           
                            
  //                           localStorage.setItem('storeCurrency', JSON.stringify(response.data));
  //                           this.denomiService.getAll(store.currencyCode).subscribe(async (response: any) => {
                              
  //                             localStorage.setItem('denomination', JSON.stringify(response?.data));
  //                             // debugger;
  //                             prog = this.progressList.find(x => x.code === 'denomiService');
  //                             prog.pass = true;
  //                             prog.value = "Loaded " + response?.data.length;
            
  //                             await timer(1000).pipe(take(1)).toPromise();
  //                             this.showToast(prog.pass, "Denomination", prog.value);
                               
  //                             let defSetting = generalsetting.find(x => x.settingId === "CRMSystem");
  //                             prog = this.progressList.find(x => x.code === 'CRMSystem');
  //                             prog.pass = true;
  //                             let crmX = "";
  //                             if (defSetting.settingValue !== null && defSetting.settingValue !== undefined) {
  //                               crmX = defSetting.settingValue;
  //                               prog.value = defSetting.settingValue;
  //                             }
  //                             else {
  //                               crmX = 'Local';
  //                               prog.value = crmX;
  //                             }
  //                             this.step++;
  //                             await timer(1000).pipe(take(1)).toPromise();
  //                             this.showToast(prog.pass, "CRM System", prog.value);
  //                             crmSource = crmX;
  //                             if (defSetting.defaultValue !== null && defSetting.defaultValue !== undefined) {
  //                               defaultCusId = defSetting.defaultValue;
  //                             }
            
  //                             if (crmSource !== undefined && crmSource !== null && crmSource !== "") {
                               
  //                               if (defaultCusId !== null && defaultCusId !== undefined) {
  //                                 if (crmSource === 'Local' || crmSource === 'Input'  ) {
  //                                   defaultCusId = store.defaultCusId; 
  //                                   this.customerService.getItem(store.companyCode, defaultCusId).subscribe(async (response: any) => {
  //                                     debugger;
  //                                     if(response.data!==null && response.data!==undefined)
  //                                     {
  //                                       localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
  //                                       prog = this.progressList.find(x => x.code === 'defaultCustomer');
  //                                       prog.pass = true;
  //                                       prog.value = response.data.customerId + " - " + response.data.customerName;
  //                                       this.step++;
  //                                       await timer(1000).pipe(take(1)).toPromise();
  //                                       this.loadingProgressModel.loadCompleted = true;
  //                                       this.setProgress();
  //                                       this.showToast(prog.pass, "Default Customer", prog.value);
  //                                       debugger;
  //                                       let defScreen = this.authService.getCurrentInfor().defaultScreen;
  //                                       if(defScreen!==undefined && defScreen!==null && defScreen!=='')
  //                                       { 
  //                                         this.router.navigate([defScreen]);
  //                                       }
  //                                       this.voidreturnsettingService.getAll().subscribe((response: any)=>{
  //                                         if(response.success)
  //                                         {
                                            
  //                                           localStorage.setItem("voidreturnSetting", JSON.stringify(response.data));
  //                                           // result = response.data;
  //                                         }
  //                                         else{
  //                                           this.alertifyService.warning(response.message);
  //                                         }
  //                                         // localStorage.setItem("voidreturnSetting", JSON.stringify(response));
  //                                       })
  //                                     }
  //                                     else
  //                                     {
  //                                       this.alertifyService.warning("Customer " + defaultCusId + " not defined.");
  //                                     }
                                     
  //                                   });
  //                                 }
  //                                 if (crmSource === 'Capi') {
  //                                   let firstChar = defaultCusId.toString().substring(0, 1);
  //                                   if (firstChar === "0") {
  //                                     defaultCusId = "84" + defaultCusId.toString().substring(1, defaultCusId.length);
  //                                   }
  //                                   this.mwiService.getCustomerInformation(defaultCusId, store.storeId).subscribe(async (response: any) => {
  //                                     // debugger;
  //                                     if (response !== null && response !== undefined) {
  //                                       //  debugger;
  //                                       if (response.status === 1) {
  //                                         let cus = this.authService.mapWMiCustomer2Customer(response.data);
  //                                         localStorage.setItem("defaultCustomer", JSON.stringify(cus));
  //                                         prog = this.progressList.find(x => x.code === 'defaultCustomer');
  //                                         prog.pass = true;
  //                                         prog.value = cus.customerId + " - " + cus.customerName;
  //                                         this.step++;
  //                                         await timer(1000).pipe(take(1)).toPromise();
  //                                         this.loadingProgressModel.loadCompleted = true;
  //                                         this.setProgress();
  //                                         this.showToast(prog.pass, "Default Customer", prog.value);
  //                                         let defScreen = this.authService.getCurrentInfor().defaultScreen;
  //                                         if(defScreen!==undefined && defScreen!==null && defScreen!=='')
  //                                         { 
  //                                           this.router.navigate([defScreen]);
  //                                         }
  //                                       }
  //                                       else {
  //                                         // debugger;
  //                                         this.alertifyService.warning(response.msg);
  //                                         prog = this.progressList.find(x => x.code === 'defaultCustomer');
  //                                         prog.pass = false;
  //                                         // this.loadingCompleted=false;
  //                                         prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
  //                                         this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
  //                                         this.loadingProgressModel.loadCompleted = false;
  //                                         this.loadingProgressModel.data = prog;
  //                                         this.setProgress();
  //                                         this.showToast(prog.pass, "Default Customer", prog.value);
                                        
  //                                       }
  //                                     }
  //                                     else {
  //                                       this.alertifyService.warning('Data not found');
            
  //                                       prog = this.progressList.find(x => x.code === 'defaultCustomer');
  //                                       prog.pass = false;
  //                                       // this.loadingCompleted=false;
  //                                       prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
  //                                       this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
  //                                       this.loadingProgressModel.loadCompleted = false;
  //                                       this.loadingProgressModel.data = prog;
  //                                       this.setProgress();
  //                                       this.showToast(prog.pass, "Default Customer", prog.value);
                                        
  //                                     }
  //                                     this.voidreturnsettingService.getAll().subscribe((response: any)=>{
  //                                       if(response.success)
  //                                       {
                                          
  //                                         localStorage.setItem("voidreturnSetting", JSON.stringify(response.data));
  //                                         // result = response.data;
  //                                       }
  //                                       else{
  //                                         this.alertifyService.warning(response.message);
  //                                       }
  //                                       // localStorage.setItem("voidreturnSetting", JSON.stringify(response));
  //                                     })
  //                                   }, err => {
  //                                     prog = this.progressList.find(x => x.code === 'defaultCustomer');
  //                                     prog.pass = false;
                                    
  //                                     prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
  //                                     this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
  //                                     this.loadingProgressModel.loadCompleted = false;
  //                                     this.loadingProgressModel.data = prog;
  //                                     this.setProgress();
  //                                     this.showToast(prog.pass, "Default Customer", prog.value);
                                    
  //                                   });
  //                                 }
            
  //                               }
            
  //                             }
  //                             else {
  //                               this.authService.setCRMSource('Local');
  //                               defaultCusId = store.defaultCusId;
  //                               this.customerService.getItem(store.companyCode, defaultCusId).subscribe(async (response: any) => {
  //                                 localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
  //                                 prog = this.progressList.find(x => x.code === 'defaultCustomer');
  //                                 prog.pass = true;
  //                                 prog.value = response.data.customerId + response.data.datacustomerName;
  //                                 this.step++;
  //                                 await timer(1000).pipe(take(1)).toPromise();
  //                                 this.loadingProgressModel.loadCompleted = true;
  //                                 this.setProgress();
  //                                 this.showToast(prog.pass, "Default Customer", prog.value);
  //                                 debugger;
  //                                 let defScreen = this.authService.getCurrentInfor().defaultScreen;
  //                                 if(defScreen!==undefined && defScreen!==null && defScreen!=='')
  //                                 { 
  //                                   this.router.navigate([defScreen]);
  //                                 }
  //                               });
            
  //                             }
            
  //                           });
  //                         }
  //                         else
  //                         {
  //                           this.alertifyService.warning(response.message); 
  //                         }
  //                       }, error=>{
  //                         this.alertifyService.warning(error);
  //                       });
                       
  //                   }
  //                   else
  //                   {
  //                     this.alertifyService.warning(response.message);
  //                   }
                    
  //                 });
                 
                
  //               }
  //               else {
  //                 localStorage.setItem("generalSetting", JSON.stringify(generalsetting));
  
  //                 prog = this.progressList.find(x => x.code === 'generalSetting');
  //                 prog.pass = false;
  //                 prog.value = "Please check your setup";
  //                 this.step++;
  //                 this.loadingProgressModel.message = "Can't get General Setting data. Please check your setup";
  //                 this.loadingProgressModel.loadCompleted = false;
  //                 this.loadingProgressModel.data = prog;
  
  //                 await timer(1000).pipe(take(1)).toPromise();
  //                 this.setProgress();
  //                 this.showToast(prog.pass, "General Setting", this.loadingProgressModel.message);
  //               }
  
  //             }
  
  //           });
  //         }
  //         else {
  //           localStorage.setItem("formatConfig", null);
  //           prog = this.progressList.find(x => x.code === 'formatConfig');
  //           prog.pass = false;
  //           prog.value = "Please check your setup";
  //           this.loadingProgressModel.message = "Can't get Format Config data. Please check your setup";
  //           this.loadingProgressModel.loadCompleted = false;
  //           this.loadingProgressModel.data = prog;
  //           this.step++;
  //           await timer(1000).pipe(take(1)).toPromise();
  //           this.setProgress();
  //           this.showToast(prog.pass, "Format Config", this.loadingProgressModel.message);
  //         }
  
  //       });
  
  //     });
  //   }
  //   else
  //   {
  //     this.alertifyService.warning("Store Currency is null");
  //   }
   



  // }
  // useLocaUser() {
  //   // this.authService.setCRMSource('Local') ;
  //   var store = this.authService.storeSelected();
  //   // var progress = this.authService.getConfigComplete();
  //   this.customerService.getItem(store.companyCode, store.defaultCusId).subscribe(async (response: any) => {
  //     // debugger;
  //     if (response.data !== null && response.data !== undefined) {
  //       localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
  //       var prog = this.loadingProgressModel.progressList.find(x => x.code === 'defaultCustomer');
  //       prog.pass = true;
  //       prog.value = response.data.customerId + response.data.customerName;
  //       this.step++;
  //       await timer(1000).pipe(take(1)).toPromise();
  //       this.loadingProgressModel.loadCompleted = true;
  //       this.setProgress();
  //     }
  //     else {
  //       this.alertifyService.warning("Can't found customer " + store.defaultCusId);
  //     }

  //   });
  // }
  // setProgress() {
  //   this.authService.setConfigComplete(this.loadingProgressModel);
  //   this.loadMenu();
  //   if (this.loadingProgressModel.loadCompleted) {
  //     this.isShowMore = false;
  //     this.inProgress = false;
  //   }

  // }
  // startprogress() {
  //   if (this.inProgress) {
  //     this.buttonText = "Continue progress";
  //     clearInterval(this.intervalId);

  //   } else {
  //     this.buttonText = "Stop progress";

  //     if (this.seconds === 0) {
  //       this.seconds = 30;
  //     }

  //     // setInterval(() => this.timer(), 1000);
  //     //  = 
  //     // this.intervalId = setInterval(() => this.timer(), 1000);
  //     this.intervalId = window.setInterval(() => this.timer(), 1000)
  //   }
  //   this.inProgress = !this.inProgress;
  // }
  // isNewShift = false;
  // changeShift(selected) {
  //   // debugger;
  //   if (selected.endShift === true) {
  //     this.isNewShift = true;
  //     this.shiftService.endShift(selected.shift);

  //   }
  //   else {
  //     this.isNewShift = false;
  //     // localStorage.setItem("shift", JSON.stringify(selected.shift));
  //     var tomorrow = new Date();
  //     var now = new Date();
  //     tomorrow.setDate(tomorrow.getDate()+1);
  //     tomorrow.setHours(1);
  //     let value = tomorrow.getTime() - now.getTime();
  //     this.commonService.setLocalStorageWithExpiry("shift", selected.shift, value);
  //     this.shiftService.changeShift(selected.shift);
  //     this.currentShift = selected.shift;
  //   }
  //   // this.shiftService.create().subscribe()

  // }
  isShown: boolean;
  togleSubmenu(event) {
    this.isShown = event;
  }
  togleSubmenuClick() {
    this.isShown = !this.isShown;
  }
  
}
