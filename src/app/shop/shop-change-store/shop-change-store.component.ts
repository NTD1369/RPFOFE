import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { ToastrService } from 'ngx-toastr';
import { async, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoadingProgressModel, ProgressModel } from 'src/app/_models/common/LoadingProgressModel';
import { MCompany } from 'src/app/_models/company';
import { SGeneralSetting } from 'src/app/_models/generalsetting';
import { MStore } from 'src/app/_models/store';
 
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { DenominationService } from 'src/app/_services/data/denomination.service';
import { FormatconfigService } from 'src/app/_services/data/formatconfig.service';
import { GeneralsettingService } from 'src/app/_services/data/generalsetting.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
 
import { StorecurrencyService } from 'src/app/_services/data/storecurrency.service';
import { UserService } from 'src/app/_services/data/user.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { VoidreturnsettingService } from 'src/app/_services/system/voidreturnsetting.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-change-store',
  templateUrl: './shop-change-store.component.html',
  styleUrls: ['./shop-change-store.component.css']
})
export class ShopChangeStoreComponent implements OnInit {
  step = 0;
  changeStore(store) {

    this.setStoreSelected(store).then(() => {
      
    });

    // this.startprogress();
    // debugger;
    

  }
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
  //     return $event.returnValue='Your changes will not be saved';
  // }

  public onDetect(result: string)
  {
    console.log(result);
  }

  buttonText = "Start progress";

  inProgress = false;
  seconds = 30;
  maxValue = 30;
  intervalId: number;

  timer() {
    // debugger;
    this.seconds--;
    if (this.seconds == 0) {
      this.buttonText = "Restart progress";
      this.inProgress = !this.inProgress;
      clearInterval(this.intervalId);
      // this.loadShiftOpenList();
      // this.loadMenu();
      this.authService.setConfigComplete(this.loadingProgressModel);
      this.isShowMore = false;
      return;
    }
    // if(this.seconds % 2 === 0)
    // {
    //   this.step++;
    // }
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

    // console.log(selectedIds.filter((x, i, a) => a.indexOf(x) == i));
    // console.log(this.subListGroup);
    // console.log(this.subListItemGroup);
  }
  format(value) {
    return 'Loading: ' + value * 100 + '%';
  }
  hoverStore = -1;
  defaultStoreStr = "";
  defaultStore: MStore;
  constructor(private toastr: ToastrService, private voidreturnsettingService: VoidreturnsettingService, private userService: UserService,    public commonService: CommonService, public authService: AuthService, private formatService: FormatconfigService, private generasetting: GeneralsettingService,
    private alertifyService: AlertifyService, private customerService: CustomerService, private storeCurrencyService: StorecurrencyService,
    private mwiService: MwiService, private denomiService: DenominationService, private router: Router, private counterSerrvice: StoreclientService,
    private storeService: StoreService, private shiftService: ShiftService,) { }
    companyInfor: MCompany;
  waiting = false;

  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }

  ngOnInit() {

    let userInfor = this.authService.getCurrentInfor();
    if(userInfor?.notifyShowOn===null || userInfor?.notifyShowOn===undefined )
    {
      userInfor.notifyShowOn = 7;
    }
    if((userInfor?.expiredNumber !==null && userInfor?.expiredNumber !== undefined) && (userInfor?.expiredNumber <= userInfor?.notifyShowOn))  
    {
      let getDate = this.GetDateFormat(new Date(userInfor.validTo));
      Swal.fire('Software Licensing','Your license expires on ' + userInfor.expiredNumber + ' days ('+ getDate +')' ,'info');
    }



    this.waiting = true;
    
    localStorage.removeItem('shift');
    localStorage.setItem('shift', null);
    this.companyInfor = this.authService.getCompanyInfor();
    this.commonService.changeIsShowMenu(true);
    this.SystemCheck$ = this.commonService.SystemCheck$;

    // Add a listener


    // Remove the listener
    // scanner.off();
    // debugger;
   
    this.currentInfor = this.authService.getCurrentInfor();
    // let store= this.authService.storeSelected();
    this.loadConfig();
  }
  setProgress() {
    this.authService.setConfigComplete(this.loadingProgressModel);
    // this.loadMenu();
    if (this.loadingProgressModel.loadCompleted) {
      this.isShowMore = false;
      this.inProgress = false;
    }

  }
  shortcuts: ShortcutInput[] = [] ;
  loadShortcut()
  {
     
      for(let i= 1; i<= 9; i++)
      {
        //  let combokey = "alt + " + i;
        let label="Store " + i;
        this.shortcuts = this.shortcuts.filter(x=>x.label !== label);
        this.shortcuts.push(
          {
            key: ["alt + " + i],
            label: "Store " + i,
            description: "Store " + i, 
            command: (e) => {
              let items= this.storeList;  
              debugger;
              if(items.length >= i)
              {
                this.hoverStore = i - 1;
                // this.selectRow(items[i - 1]);
                setTimeout(() => {
                  const scrollTo = document.querySelector(".kselected");
                  if (scrollTo) {
                    scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
                  }
                })
              }
              // this.setFocus(i-1);
            },
            preventDefault: true
          }
        )
      }
      this.shortcuts.push(
        {
          key: ["enter"],
          label: "Change store",
          description: "Change store", 
          command: (e) => {
            let items= this.storeList;  
            debugger;
            if(this.hoverStore!==-1)
            {
              this.changeStore(items[this.hoverStore]);
            }
            
          },
          preventDefault: true
        },
        {
          key: ["down"],
          label: "Down",
          description: "Down",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
            debugger;
            if(this.hoverStore!==-1)
            {
              let items= this.storeList;  
              let row = this.hoverStore + 1;
              if(row > items.length - 1)
              {
                row = 0;
              }
              this.hoverStore = row;
              
              setTimeout(() => {
                const scrollTo = document.querySelector(".kselected");
                if (scrollTo) {
                  scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
                }
              })
              // this.selectRow(items[row]);
            }
            
            // this.selectRow(items[1]);
          },
          preventDefault: true
        },
        {
          key: ["right"],
          label: "Right",
          description: "Right",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
            debugger;
            if(this.hoverStore!==-1)
            {
              let items= this.storeList;  
              let row = this.hoverStore + 1;
              if(row > items.length - 1)
              {
                row = 0;
              }
              this.hoverStore = row;
              
              setTimeout(() => {
                const scrollTo = document.querySelector(".kselected");
                if (scrollTo) {
                  scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
                }
              })
              // this.selectRow(items[row]);
            }
            
            // this.selectRow(items[1]);
          },
          preventDefault: true
        },
        {
          key: ["up"],
          label: "Up",
          description: "Up",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
            debugger;
            if(this.hoverStore!==-1)
            {
              let items= this.storeList;  
              let row = this.hoverStore - 1;
              if(row <= 0)
              {
                row=0;
              }
              this.hoverStore = row;
             
              setTimeout(() => {
                const scrollTo = document.querySelector(".kselected");
                if (scrollTo) {
                  scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
                }
              })
              // this.selectRow(items[row]);
            }
            
            // this.selectRow(items[1]);
          },
          preventDefault: true
        },
        {
          key: ["left"],
          label: "Left",
          description: "Left",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
            debugger;
            if(this.hoverStore!==-1)
            {
              let items= this.storeList;  
              let row = this.hoverStore - 1;
              if(row <= 0)
              {
                row=0;
              }
              this.hoverStore = row;
             
              setTimeout(() => {
                const scrollTo = document.querySelector(".kselected");
                if (scrollTo) {
                  scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
                }
              })
              // this.selectRow(items[row]);
            }
            
            // this.selectRow(items[1]);
          },
          preventDefault: true
        }
         
      )
     
    
      // setTimeout(() => {
      //   // this.isShowSC= true;
      //   console.log('this.shortcuts payment', this.shortcuts);
      //   this.commonService.changeShortcuts(this.shortcuts, true);
       
      // }, 100);
  }
  SystemCheck$: Observable<boolean>;
  async loadConfig() {
    debugger;

    let a = this.authService.getConfigComplete();
    let store = this.authService.storeSelected();
    if (a !== null && a !== undefined) {
      this.loadingProgressModel = a;

    }
    else {
      this.loadingProgressModel = new LoadingProgressModel();

      this.progressList.push({ num: 1, code: "storeSelected", description: "Store Selected", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 2, code: "maxValueCurrency", description: "Max Value Currency", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 3, code: "formatConfig", description: "Format Config", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 4, code: "generalSetting", description: "General Setting", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 8, code: "shopMode", description: "Shop Mode", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 9, code: "invoice", description: "Invoice", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 7, code: "denomiService", description: "Denomination", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 5, code: "CRMSystem", description: "CRM System", icon: "C", value: "", pass: null });
      this.progressList.push({ num: 6, code: "defaultCustomer", description: "Default Customer", icon: "C", value: "", pass: null });
      this.loadingProgressModel.loadCompleted = false;
      this.loadingProgressModel.progressList = this.progressList;
      this.loadingProgressModel.message = "";
      store = null;
      localStorage.setItem('storeSelected', null);

    }
    if (store !== null && store !== undefined) {

      // if(this.currentShift===null || this.currentShift === undefined)
      // {  
      //   this.loadShiftOpenList();
      // }
    }
    else {
      debugger;
      // await timer(500).pipe(take(1)).toPromise();
      let company= this.authService.getCompanyInfor();
      if( company!== undefined && company!==null && company?.checkUserStatus === true )
      {
        await timer(3000).pipe(take(1)).toPromise();
        debugger;
        if(this.commonService.getSystemCheck() === false)
        {
            debugger
            this.commonService.getDefaultStore().subscribe((response: any) => {
              debugger
              if(response.success)
              {
                  //  this.defaultStoreStr = response;
                  let defStore =""
                  if(response=== null || response === undefined)
                  {
                    defStore = "";
                  }
                  else
                  {
                    defStore = response.data.toString();
                  }
                  // let user = this.authService.getCurrentInfor();
                  // let defStore = user?.defStore;
                  // if(defStore=== null || defStore === undefined)
                  // {
                  //   defStore = "";
                  // }
                  this.loadStoreList(defStore.toString() );
              }
              else
              {
                this.loadStoreList("");
              }
         
            
            }, error =>{
              debugger;
              console.log(error);
              this.loadStoreList("");
          });
        } 
        //  this.SystemCheck$.subscribe(value =>{
        //    if(value===false)
        //    {
            
        //    }
        //  })
        
      }
      else
      {
        this.commonService.getDefaultStore().subscribe((response: any) => {
          debugger;
          if(response.success)
          {
              //  this.defaultStoreStr = response;
              let defStore =""
              if(response=== null || response === undefined)
              {
                defStore = "";
              }
              else
              {
                defStore = response.data.toString();
              }
              // let user = this.authService.getCurrentInfor();
              // let defStore = user?.defStore;
              // if(defStore=== null || defStore === undefined)
              // {
              //   defStore = "";
              // }
              this.loadStoreList(defStore.toString() );
          }
          else
          {
            this.loadStoreList("");
          }
        //  this.defaultStoreStr = response;
          // let defStore =""
          // if(response=== null || response === undefined)
          // {
          //   defStore = "";
          // }
          // else
          // {
          //   defStore = response.toString();
          // }
          // // let user = this.authService.getCurrentInfor();
          // // let defStore = user?.defStore;
          // // if(defStore=== null || defStore === undefined)
          // // {
          // //   defStore = "";
          // // }
          // this.loadStoreList(defStore.toString() );
        
        }, error =>{
          debugger;
          console.log(error);
          this.loadStoreList("");
       });
      }
   
      
    }
    if (this.loadingProgressModel.loadCompleted === false) {
      this.inProgress = true;
    }
    else
    {
      let defScreen = this.authService.getCurrentInfor().defaultScreen;
      if(defScreen!==undefined && defScreen!==null && defScreen!=='')
      { 
        this.commonService.changeIsShowMenu(false);
        this.loadMenu();
        await timer(1000).pipe(take(1)).toPromise();
        setTimeout(()=>{
          
          this.router.navigate([defScreen]).then(()=>{
            location.reload();
          });
        })
       
      }
      else
      {
        let shopmode = this.authService.getShopMode();
          // this.router.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
          if (shopmode === 'FnB') {

            this.router.navigate(['/shop/order']).then(() => {

            });
          }
          if (shopmode === 'Grocery') {

            this.router.navigate(['/shop/order-grocery']).then(() => {

            });
          }

      }
    }
  }
  updateContentTimer: number;
  scrollByContent = true;
  scrollByThumb = true;
  scrollbarMode: string;
  pullDown = false;
  stepMessage="Information Shop";
  progressList: ProgressModel[] = [];
  moreOptionsVisible: boolean;
  loadingProgressModel: LoadingProgressModel;
  ngAfterViewInit() {

    // const paymentMenu = document.getElementsByClassName('paymentMenu');
    // Array.prototype.forEach.call(paymentMenu, function (item) {
    //   // Do stuff here
    //   if (item !== null && item !== undefined) {
    //     item.classList.remove('hide');
    //     item.classList.add('show');
    //   }
    // });
    // this.loadMenu();
     
    setTimeout(() => {
      this.loadShortcut();
      // this.waiting = false;
    }, 200);
    
  }
  showToast(boolValue, title, message)
  {
    if(boolValue===true)
    {
      this.toastr.success( message, title );
    }
    else
    {
      this.toastr.error(message, title  );
    }
  }
  startprogress() {
    if (this.inProgress) {
      this.buttonText = "Continue progress";
      clearInterval(this.intervalId);

    } else {
      this.buttonText = "Stop progress";

      if (this.seconds === 0) {
        this.seconds = 30;
      }

      // setInterval(() => this.timer(), 1000);
      //  = 
      // this.intervalId = setInterval(() => this.timer(), 1000);
      this.intervalId = window.setInterval(() => this.timer(), 1000)
    }
    this.inProgress = !this.inProgress;
  }
  async setStoreSelected(store: MStore) 
  {
    this.inProgress = true;
    debugger;
    // sessionStorage
    if(store.currencyCode!==null && store.currencyCode!==undefined  && store.currencyCode!== '' )
    {
      localStorage.setItem('storeSelected', JSON.stringify(store));
      let ax= this.progressList;
      let prog = this.progressList.find(x => x.code === 'storeSelected');
      prog.pass = true;
      this.step++;
      await timer(1000).pipe(take(1)).toPromise();
      prog.value = store.storeId + " - " + store.storeName;
      this.stepMessage = "Max Value Currency";
      this.commonService.getMaxValueCurrency(store.currencyCode).subscribe(async (response: any) => {
        // debugger;
        localStorage.setItem('maxValueCurrency', response.data);
        let maxValue = response.data;
        if (maxValue === null || maxValue === undefined) {
          maxValue = "None";
        }
        prog = this.progressList.find(x => x.code === 'maxValueCurrency');
        prog.pass = true;
        prog.value = maxValue;
        this.step++;
        await timer(1000).pipe(take(1)).toPromise();
        this.stepMessage = "Format Config";
        this.formatService.getByStore(store.companyCode, store.storeId).subscribe(async (response: any) => {
          if (response.data !== undefined && response.data !== null) {
            localStorage.setItem('formatConfig', JSON.stringify(response.data));
            prog = this.progressList.find(x => x.code === 'formatConfig');
            prog.pass = true;
            prog.value = "Date format " + response.data.dateFormat;
            this.step++;

            await timer(1000).pipe(take(1)).toPromise();
            this.stepMessage = "General Setting";
            this.authService.loadFormatUom();
            this.generasetting.GetGeneralSettingByStore(store.companyCode, store.storeId).subscribe(async (response: any) => {
  
               debugger;
              if (response.success === false) {
                this.alertifyService.error(response.message);
                localStorage.setItem("generalSetting", null);
                prog = this.progressList.find(x => x.code === 'generalSetting');
                prog.pass = false;
                prog.value = "Please check your setup";
                this.loadingProgressModel.message = "Can't get General Setting data. Please check your setup";
                this.loadingProgressModel.loadCompleted = false;
                this.loadingProgressModel.data = prog;
                this.step++;
                await timer(1000).pipe(take(1)).toPromise();
                this.setProgress();
                this.showToast(prog.pass, "General Setting", this.loadingProgressModel.message);
              
              }
              else {
               
                let generalsetting = response.data[0].generalSettings as SGeneralSetting[];
                if (generalsetting !== null && generalsetting !== undefined && generalsetting.length > 0) {
                  debugger;
                  localStorage.setItem("generalSetting", JSON.stringify(generalsetting));
                  let crmSource = "";
                  let defaultCusId = store.defaultCusId;
                  prog = this.progressList.find(x => x.code === 'generalSetting');
                  prog.pass = true;
                  prog.value = "Loaded";
                  this.step++;
                  await timer(1000).pipe(take(1)).toPromise();
                  this.showToast(prog.pass, "General Setting", prog.value);
                  let shopMode = generalsetting.find(x => x.settingId === 'ShopMode');
                  this.stepMessage = "Shop Mode";
                  if (shopMode !== null && shopMode !== undefined) {
                    localStorage.setItem("shopMode", shopMode.settingValue);
                    prog = this.progressList.find(x => x.code === 'shopMode');
                    prog.pass = true;
                    prog.value = shopMode.settingValue;
                    this.step++;
                    await timer(1000).pipe(take(1)).toPromise();
                   
                  }
                  else {
                    localStorage.setItem("shopMode", "FnB");
                    prog = this.progressList.find(x => x.code === 'shopMode');
                    prog.pass = true;
                    prog.value = "FnB";
                    this.step++;
                    await timer(1000).pipe(take(1)).toPromise();
                    
                  }
                  this.showToast(prog.pass, "Shop Mode", prog.value);
                  this.stepMessage = "Invoice";
                  let invoice = generalsetting.find(x => x.settingId === 'Invoice');
  
                  if (invoice !== null && invoice !== undefined) {
                    localStorage.setItem("invoice", invoice.settingValue);
                    prog = this.progressList.find(x => x.code === 'invoice');
                    prog.pass = true;
                    prog.value = invoice.settingValue;
                    this.step++;
                    await timer(1000).pipe(take(1)).toPromise();
                  }
                  else {
                    localStorage.setItem("invoice", "false");
                    prog = this.progressList.find(x => x.code === 'invoice');
                    prog.pass = true;
                    prog.value = "false";
                    this.step++;
                    await timer(1000).pipe(take(1)).toPromise();
                  }
                  this.showToast(prog.pass, "Invoice", prog.value);
 
                  // this.showToast(prog.pass, "Counter ID", prog.value);
                  await timer(1000).pipe(take(1)).toPromise();
                  this.stepMessage = "Store Currency";
                  this.storeCurrencyService.getByStoreWExchangeRate(this.authService.getCurrentInfor().companyCode , this.authService.storeSelected().storeId).subscribe(async (response: any)=>{
                    debugger;
                    if(response.success)
                    { 
                     
                      
                      localStorage.setItem('storeCurrency', JSON.stringify(response.data));
                      this.stepMessage = "Denomination";
                      this.denomiService.getAll(store.currencyCode).subscribe(async (response: any) => {
                        debugger;
                        localStorage.setItem('denomination', JSON.stringify(response?.data));
                        // debugger;
                        prog = this.progressList.find(x => x.code === 'denomiService');
                        prog.pass = true;
                        prog.value = "Loaded " + response?.data.length;
      
                        await timer(1000).pipe(take(1)).toPromise();
                        this.showToast(prog.pass, "Denomination", prog.value);
                        this.stepMessage = "CRM System";
                        let defSetting = generalsetting.find(x => x.settingId === "CRMSystem");
                        prog = this.progressList.find(x => x.code === 'CRMSystem');
                        prog.pass = true;
                        let crmX = "";

                        if (defSetting.settingValue !== null && defSetting.settingValue !== undefined) {
                          crmX = defSetting.settingValue;
                          prog.value = defSetting.settingValue;
                        }
                        else {
                          crmX = 'Local';
                          prog.value = crmX;
                        }
                        this.step++;
                        await timer(1000).pipe(take(1)).toPromise();
                        this.showToast(prog.pass, "CRM System", prog.value);
                        crmSource = crmX;
                        if (defSetting.defaultValue !== null && defSetting.defaultValue !== undefined) {
                          defaultCusId = defSetting.defaultValue;
                        }
      
                        if (crmSource !== undefined && crmSource !== null && crmSource !== "") {
                         
                          if (defaultCusId !== null && defaultCusId !== undefined) {
                            if (crmSource === 'Local' || crmSource === 'Input'  ) {
                              defaultCusId = store.defaultCusId; 
                              this.stepMessage = "Default Customer";
                              this.customerService.getItem(store.companyCode, defaultCusId).subscribe(async (response: any) => {
                                debugger;
                                if(response.data!==null && response.data!==undefined)
                                {
                                  localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
                                  prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                  prog.pass = true;
                                  prog.value = response.data.customerId + " - " + response.data.customerName;
                                  this.step++;
                                  await timer(1000).pipe(take(1)).toPromise();
                                  this.loadingProgressModel.loadCompleted = true;
                                  this.setProgress();
                                  this.showToast(prog.pass, "Default Customer", prog.value);
                                  this.stepMessage = "Void Return Setting";
                                  this.voidreturnsettingService.getAll().subscribe((response: any)=>{
                                    if(response.success)
                                    {
                                      
                                      localStorage.setItem("voidreturnSetting", JSON.stringify(response.data)); 
                                    }
                                    else{
                                      this.alertifyService.warning(response.message);
                                    } 
                                  })
                                  
                                  this.commonService.changeIsShowMenu(false);
                                  this.loadMenu();
                                  await timer(1000).pipe(take(1)).toPromise();

                                  let user = this.authService.getCurrentInfor();
                                  if(user!==null && user!==undefined)
                                  {
                                    user.lastLoginStoreId = store.storeId;
                                    this.userService.updateLastStore(user).subscribe((response: any)=>{

                                    });
                                  }
                         
                                  
                                  let defScreen = this.authService.getCurrentInfor().defaultScreen;
                                  if(defScreen!==undefined && defScreen!==null && defScreen!=='')
                                  {  
                                    setTimeout(()=>{
                                     
                                      this.router.navigate([defScreen]).then(()=>{
                                        location.reload();
                                      });
                                    })
                                  }
                                  else
                                  {
                                    // let 
                                    // this.counterSerrvice.getById(user.companyCode, store.storeId, '','','').subscribe((response: any)=>{

                                    // })
                                    let shopmode = this.authService.getShopMode(); 
                                    if (shopmode === 'FnB') {
                                
                                      this.router.navigate(['/shop/order']).then(() => {
                                
                                      });
                                    }
                                    if (shopmode === 'Grocery') {
                                
                                      this.router.navigate(['/shop/order-grocery']).then(() => {
                                
                                      });
                                    }
                                  }
                                  
                                }
                                else
                                {
                                  this.alertifyService.warning("Customer " + defaultCusId + " not defined.");
                                  Swal.fire({
                                    icon: 'warning',
                                    title: "Default Customer",
                                    text: "Customer " + defaultCusId + " not defined."
                                  });
                                }
                               
                              });
                            }
                            if (crmSource === 'Capi') {
                              let firstChar = defaultCusId.toString().substring(0, 1);
                              if (firstChar === "0") {
                                defaultCusId = "84" + defaultCusId.toString().substring(1, defaultCusId.length);
                              }
                              this.stepMessage = "Default Customer From CRM System";
                              debugger;
                              this.mwiService.getCustomerInformation(defaultCusId, store.storeId).subscribe(async (response: any) => {
                                // debugger;
                                if (response !== null && response !== undefined) {
                                  //  debugger;
                                  if (response.status === 1) {
                                    let cus = this.authService.mapWMiCustomer2Customer(response.data);
                                    localStorage.setItem("defaultCustomer", JSON.stringify(cus));
                                    prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                    prog.pass = true;
                                    prog.value = cus.customerId + " - " + cus.customerName;
                                    this.step++;
                                    await timer(1000).pipe(take(1)).toPromise();
                                    this.loadingProgressModel.loadCompleted = true;
                                    this.setProgress();
                                    this.showToast(prog.pass, "Default Customer", prog.value);

                                    this.commonService.changeIsShowMenu(false);
                                    this.loadMenu();
                                    await timer(1000).pipe(take(1)).toPromise();
                                    let user = this.authService.getCurrentInfor();
                                    if(user!==null && user!==undefined)
                                    {
                                      user.lastLoginStoreId = store.storeId;
                                      this.userService.updateLastStore(user).subscribe((response: any)=>{

                                      });
                                    }
                                 
                                    let defScreen = this.authService.getCurrentInfor().defaultScreen;
                                    if(defScreen!==undefined && defScreen!==null && defScreen!=='')
                                    {  
                                      setTimeout(()=>{ 
                                        this.router.navigate([defScreen]).then(()=>{
                                          location.reload();
                                        });
                                      })
                                     
                                    }
                                    else
                                    {
                                      debugger;
                                      let shopmode = this.authService.getShopMode();
                                      // this.router.navigate(['/shop/order']).then(() => {
                                      //   // window.location.reload();
                                      // });
                                      if (shopmode === 'FnB') {
                                  
                                        this.router.navigate(['/shop/order']).then(() => {
                                  
                                        });
                                      }
                                      if (shopmode === 'Grocery') {
                                  
                                        this.router.navigate(['/shop/order-grocery']).then(() => {
                                  
                                        });
                                      }
                                    }
                                  }
                                  else {
                                    // debugger;
                                    this.alertifyService.warning(response.msg);
                                    prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                    prog.pass = false;
                                    // this.loadingCompleted=false;
                                    prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                    this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                    this.loadingProgressModel.loadCompleted = false;
                                    this.loadingProgressModel.data = prog;
                                    this.setProgress();
                                    this.showToast(prog.pass, "Default Customer", prog.value);
                                  
                                  }
                                }
                                else {
                                  this.alertifyService.warning('Data not found');
      
                                  prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                  prog.pass = false;
                                  // this.loadingCompleted=false;
                                  prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                  this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                  this.loadingProgressModel.loadCompleted = false;
                                  this.loadingProgressModel.data = prog;
                                  this.setProgress();
                                  this.showToast(prog.pass, "Default Customer", prog.value);
                                  
                                }
                             
                                this.voidreturnsettingService.getAll().subscribe((response: any)=>{
                                  debugger;
                                  if(response.success)
                                  {
                                    
                                    localStorage.setItem("voidreturnSetting", JSON.stringify(response.data));
                                    // result = response.data;
                                  }
                                  else{
                                    this.alertifyService.warning(response.message);
                                  }
                                  // localStorage.setItem("voidreturnSetting", JSON.stringify(response));
                                })
                                
                              }, err => {

                                prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                prog.pass = false;
                              
                                prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                this.loadingProgressModel.loadCompleted = false;
                                this.loadingProgressModel.data = prog;
                                this.setProgress();
                                // this.showToast(prog.pass, "Default Customer", prog.value);
                                Swal.fire({
                                  icon: 'warning',
                                  title: "Default Customer",
                                  text: prog.value
                                });
                              });
                            }
                            if (crmSource === 'Tera') {
                              let firstChar = defaultCusId.toString().substring(0, 1);
                              this.stepMessage = "Default Customer From CRM System";
                              debugger;
                              this.mwiService.getCustomerInformation(defaultCusId, store.storeId).subscribe(async (response: any) => {
                                // debugger;
                                if (response !== null && response !== undefined) {
                                  //  debugger;
                                  if (response.status === 1) {
                                    let cus = this.authService.mapWMiCustomer2Customer(response.data);
                                    localStorage.setItem("defaultCustomer", JSON.stringify(cus));
                                    prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                    prog.pass = true;
                                    prog.value = cus.customerId + " - " + cus.customerName;
                                    this.step++;
                                    await timer(1000).pipe(take(1)).toPromise();
                                    this.loadingProgressModel.loadCompleted = true;
                                    this.setProgress();
                                    this.showToast(prog.pass, "Default Customer", prog.value);

                                    this.commonService.changeIsShowMenu(false);
                                    this.loadMenu();
                                    await timer(1000).pipe(take(1)).toPromise();
                                    let user = this.authService.getCurrentInfor();
                                    if(user!==null && user!==undefined)
                                    {
                                      user.lastLoginStoreId = store.storeId;
                                      this.userService.updateLastStore(user).subscribe((response: any)=>{

                                      });
                                    }
                                 
                                    let defScreen = this.authService.getCurrentInfor().defaultScreen;
                                    if(defScreen!==undefined && defScreen!==null && defScreen!=='')
                                    {  
                                      setTimeout(()=>{ 
                                        this.router.navigate([defScreen]).then(()=>{
                                          location.reload();
                                        });
                                      })
                                     
                                    }
                                    else
                                    {
                                      debugger;
                                      let shopmode = this.authService.getShopMode();
                                      // this.router.navigate(['/shop/order']).then(() => {
                                      //   // window.location.reload();
                                      // });
                                      if (shopmode === 'FnB') {
                                  
                                        this.router.navigate(['/shop/order']).then(() => {
                                  
                                        });
                                      }
                                      if (shopmode === 'Grocery') {
                                  
                                        this.router.navigate(['/shop/order-grocery']).then(() => {
                                  
                                        });
                                      }
                                    }
                                  }
                                  else {
                                    // debugger;
                                    this.alertifyService.warning(response.msg);
                                    prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                    prog.pass = false;
                                    // this.loadingCompleted=false;
                                    prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                    this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                    this.loadingProgressModel.loadCompleted = false;
                                    this.loadingProgressModel.data = prog;
                                    this.setProgress();
                                    this.showToast(prog.pass, "Default Customer", prog.value);
                                  
                                  }
                                }
                                else {
                                  this.alertifyService.warning('Data not found');
      
                                  prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                  prog.pass = false;
                                  // this.loadingCompleted=false;
                                  prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                  this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                  this.loadingProgressModel.loadCompleted = false;
                                  this.loadingProgressModel.data = prog;
                                  this.setProgress();
                                  this.showToast(prog.pass, "Default Customer", prog.value);
                                  
                                }
                             
                                this.voidreturnsettingService.getAll().subscribe((response: any)=>{
                                  debugger;
                                  if(response.success)
                                  {
                                    
                                    localStorage.setItem("voidreturnSetting", JSON.stringify(response.data));
                                    // result = response.data;
                                  }
                                  else{
                                    this.alertifyService.warning(response.message);
                                  }
                                  // localStorage.setItem("voidreturnSetting", JSON.stringify(response));
                                })
                                
                              }, err => {

                                prog = this.progressList.find(x => x.code === 'defaultCustomer');
                                prog.pass = false;
                              
                                prog.value = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                this.loadingProgressModel.message = "Can't get data " + defaultCusId + ". Please check with TapTap ";
                                this.loadingProgressModel.loadCompleted = false;
                                this.loadingProgressModel.data = prog;
                                this.setProgress();
                                // this.showToast(prog.pass, "Default Customer", prog.value);
                                Swal.fire({
                                  icon: 'warning',
                                  title: "Default Customer",
                                  text: prog.value
                                });
                              });
                            }
                          }
      
                        }
                        else {
                          this.authService.setCRMSource('Local');
                          defaultCusId = store.defaultCusId;
                          this.stepMessage = "Default Customer";

                          this.customerService.getItem(store.companyCode, defaultCusId).subscribe(async (response: any) => {
                            localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
                            prog = this.progressList.find(x => x.code === 'defaultCustomer');
                            prog.pass = true;
                            prog.value = response.data.customerId + response.data.datacustomerName;
                            this.step++;
                            await timer(1000).pipe(take(1)).toPromise();
                            this.loadingProgressModel.loadCompleted = true;
                            this.setProgress();
                            this.showToast(prog.pass, "Default Customer", prog.value);
                            debugger;
                            this.commonService.changeIsShowMenu(false);
                            this.loadMenu();

                            let user = this.authService.getCurrentInfor();
                            if(user!==null && user!==undefined)
                            {
                              user.lastLoginStoreId = store.storeId;
                              this.userService.updateLastStore(user).subscribe((response: any)=>{

                              });
                            }
                         

                            await timer(1000).pipe(take(1)).toPromise();
                            
                            let defScreen = this.authService.getCurrentInfor().defaultScreen;
                            if(defScreen!==undefined && defScreen!==null && defScreen!=='')
                            { 
                             
                              setTimeout(()=>{
                               
                                this.router.navigate([defScreen]).then(()=>{
                                  location.reload();
                                });
                              })
                            }
                            else
                            {
                              debugger;
                              let shopmode = this.authService.getShopMode();
                              // this.router.navigate(['/shop/order']).then(() => {
                              //   // window.location.reload();
                              // });
                              if (shopmode === 'FnB') {
                          
                                this.router.navigate(['/shop/order']).then(() => {
                          
                                });
                              }
                              if (shopmode === 'Grocery') {
                          
                                this.router.navigate(['/shop/order-grocery']).then(() => {
                          
                                });
                              }
                            }
                            
                           
                          });
      
                        }
      
                      }, error=>{
                        debugger;
                        // this.alertifyService.warning('denomination ' + error);
                        Swal.fire({
                          icon: 'warning',
                          title: "Denomination",
                          text: error
                        });
                      });
                    }
                    else
                    {
                      debugger;
                      // this.alertifyService.warning(response.message); 
                      Swal.fire({
                        icon: 'warning',
                        title: "General Setting",
                        text: response.message
                      });
                    }
                  }, error=>{
                    debugger;
                    this.alertifyService.warning(error);
                    Swal.fire({
                      icon: 'warning',
                      title: "General Setting",
                      text: error
                    });
                    // xx
                  });
 
                 
                
                }
                else {
                  localStorage.setItem("generalSetting", JSON.stringify(generalsetting));
  
                  prog = this.progressList.find(x => x.code === 'generalSetting');
                  prog.pass = false;
                  prog.value = "Please check your setup";
                  this.step++;
                  this.loadingProgressModel.message = "Can't get General Setting data. Please check your setup";
                  this.loadingProgressModel.loadCompleted = false;
                  this.loadingProgressModel.data = prog;
  
                  await timer(1000).pipe(take(1)).toPromise();
                  this.setProgress();
                  // this.showToast(prog.pass, "General Setting", this.loadingProgressModel.message);
                  Swal.fire({
                    icon: 'warning',
                    title: "General Setting",
                    text: this.loadingProgressModel.message
                  });
                }
  
              }
  
            });
          }
          else {
            localStorage.setItem("formatConfig", null);
            prog = this.progressList.find(x => x.code === 'formatConfig');
            prog.pass = false;
            prog.value = "Please check your setup";
            this.loadingProgressModel.message = "Can't get Format Config data. Please check your setup";
            this.loadingProgressModel.loadCompleted = false;
            this.loadingProgressModel.data = prog;
            this.step++;
            await timer(1000).pipe(take(1)).toPromise();
            this.setProgress();
            // this.showToast(prog.pass, "Format Config", this.loadingProgressModel.message);

            Swal.fire({
              icon: 'warning',
              title: "Format Config",
              text: this.loadingProgressModel.message
            });
            // xx
          }
  
        });
  
      });
    }
    else
    {
      this.alertifyService.warning("Store Currency is null");
      Swal.fire({
        icon: 'warning',
        title: "Store Currency",
        text: "Store Currency is null"
      });
    }
   



  }
  logOut() {
    this.authService.logout();
  }
  useLocaUser() {
    // this.authService.setCRMSource('Local') ;
    var store = this.authService.storeSelected();
    // var progress = this.authService.getConfigComplete();
    this.customerService.getItem(store.companyCode, store.defaultCusId).subscribe(async (response: any) => {
      debugger;
      if (response.data !== null && response.data !== undefined) {
        localStorage.setItem("defaultCustomer", JSON.stringify(response.data));
        var prog = this.loadingProgressModel.progressList.find(x => x.code === 'defaultCustomer');
        prog.pass = true;
        prog.value = response.data.customerId + response.data.customerName;
        this.step++;
        await timer(1000).pipe(take(1)).toPromise();
        this.loadingProgressModel.loadCompleted = true;
        this.setProgress();

        this.commonService.changeIsShowMenu(false);
        this.loadMenu();

        let user = this.authService.getCurrentInfor();
        if(user!==null && user!==undefined)
        {
          user.lastLoginStoreId = store.storeId;
          this.userService.updateLastStore(user).subscribe((response: any)=>{

          });
        }
     

        let defScreen = this.authService.getCurrentInfor().defaultScreen;
        if(defScreen!==undefined && defScreen!==null && defScreen!=='')
        { 
         
          setTimeout(()=>{
           
            this.router.navigate([defScreen]).then(()=>{
              location.reload();
            });
          })
        }
        else
        {
          debugger;
          let shopmode = this.authService.getShopMode();
          // this.router.navigate(['/shop/order']).then(() => {
          //   // window.location.reload();
          // });
          if (shopmode === 'FnB') {
      
            this.router.navigate(['/shop/order']).then(() => {
      
            });
          }
          if (shopmode === 'Grocery') {
      
            this.router.navigate(['/shop/order-grocery']).then(() => {
      
            });
          }
        }
      }
      else {
        this.alertifyService.warning("Can't found customer " + store.defaultCusId);
      }

    });
  }
  loadStoreList(defaultStore) {

    let store = this.authService.storeSelected();
    if (store === null || store === undefined) {
      let user = this.authService.getCurrentInfor();
      this.storeService.getByUser(user.username).subscribe((response: any) => {
        if(response.success)
        {
          this.storeList = response.data;
          this.waiting = false;
        
          if(this.storeList.length == 1)
          { 
            let storeChange = response.data[0];
            if(defaultStore?.length > 0 )
            {
              if(storeChange.storeId === defaultStore)
              {
                setTimeout(() => {
                  this.changeStore(storeChange);
                }, 100);
              }
              else
              {
                Swal.fire({
                  icon: 'error',
                  // title: "User Store",
                  html:
                  'User not assign to store id: <strong>' + defaultStore + '</strong>' +
                  '<br />' +
                  'Please contact to support team',
                  // text: "User not assign to store id:" + defaultStore + ". <br /> Please contact to support team."
                }).then(() => {
                  // setTimeout(() => {
                  //   this.inputs.toArray()[this.payment.lineNum - 1].nativeElement.focus();
                  // }, 100);
                  this.authService.logout();
                });
              }
             
            }
            else
            {
              setTimeout(() => {
                this.changeStore(storeChange);
              }, 100);
            }
             
          }
          else  
          {  debugger;
            if(defaultStore !==null && defaultStore !== undefined && defaultStore!=="")
            {
              debugger;
              let check = this.storeList.some(x=>x.storeId === defaultStore);
              if(check) 
              {
                let defaultStoreModel = this.storeList.find(x=>x.storeId === defaultStore);

                setTimeout(() => {
                  this.changeStore(defaultStoreModel);
                }, 100);
              } 
              else
              {
                Swal.fire({
                  icon: 'error',
                  // title: "User Store",
                  html:
                  'User not assign to store id: <strong>' + defaultStore + '</strong>' +
                  '<br />' +
                  'Please contact to support team',
                  // text: "User not assign to store id: " + defaultStore + ".<br /> Please contact to support team."
                }).then(() => {
                  // setTimeout(() => {
                  //   this.inputs.toArray()[this.payment.lineNum - 1].nativeElement.focus();
                  // }, 100);
                  this.authService.logout();
                });
              }
            }
            else
            {
              let user = this.authService.getCurrentInfor();
              let lastLoginStore= user?.lastLoginStoreId;
              if(lastLoginStore !==null && lastLoginStore !== undefined && lastLoginStore!=="")
              {
                let check = this.storeList.some(x=>x.storeId === lastLoginStore);
                if(check) 
                {
                  this.defaultStore = this.storeList.find(x=>x.storeId === lastLoginStore);
  
                  // setTimeout(() => {
                  //   this.changeStore(defaultStoreModel);
                  // }, 100);
                }
              }
            }
          }
          
        } 
        else
        {
          this.alertifyService.warning(response.message);
        }
       
        // this.storeList = response;
        // console.log(this.storeList);
      });
    }
    else
    {
      debugger;
      let shopmode = this.authService.getShopMode();
      // this.router.navigate(['/shop/order']).then(() => {
      //   // window.location.reload();
      // });
      if (shopmode === 'FnB') {

        this.router.navigate(['/shop/order']).then(() => {

        });
      }
      if (shopmode === 'Grocery') {

        this.router.navigate(['/shop/order-grocery']).then(() => {

        });
      }

      // this.router.navigate(['/shop']).then(()=>{
      //   // location.reload();
      // });
    }
  }
 
  loadDefaultStore() {
    this.commonService.getDefaultStore().subscribe((response: any) => {
       debugger
       if(response.success)
       {
           //  this.defaultStoreStr = response;
           let defStore =""
           if(response=== null || response === undefined)
           {
             defStore = "";
           }
           else
           {
             defStore = response.data.toString();
           }
           // let user = this.authService.getCurrentInfor();
          
           this.defaultStoreStr = defStore.toString() ;
       }
       else
       {
        this.defaultStoreStr = "";
       }
      // this.defaultStoreStr = response;
      // this.storeList = response;
      // console.log(this.storeList);
    });
     
  }
}
