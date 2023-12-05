import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { DxTextBoxComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import BarcodeScanner from 'simple-barcode-scanner';
import { EnvService } from 'src/app/env.service';
import { MCompany } from 'src/app/_models/company';
import { OrderLogModel } from 'src/app/_models/orderlogModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { SignalRService } from 'src/app/_services/common/signalR.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  isNameFocus: boolean = false;
  isPassFocus: boolean = false;
  // const inputs = document.querySelectorAll(".input");
  model: any = {};
  constructor(private authService: AuthService, private commonService: CommonService,  private _hotkeysService: HotkeysService,
     private companyService: CompanyService,  private env: EnvService, private http: HttpClient, 
     private titleService:Title,private alertify: AlertifyService, private router: Router) { }
  scannerProfile: any;
  public refresh() {
    // this.inputType === "Remark";
    // setTimeout(() => {this.inputType = "User";}, 100);

    setTimeout(() => {
      this.selectTab(this.selectedTab);
    }, 500);
  }
  ngOnInit() {
   

    // debugger;
    // console.log(this.authService.loggedIn());
    // this.authService.clearCache();
    // localStorage.setItem('dbAPI',  "");
    //  this.initScanner();
    this._hotkeysService.add(new Hotkey([ 'alt+u'], (event: KeyboardEvent): boolean => {
      // console.log('Secret message');
      debugger;
          if(this.selectedTab === 'user')
          {  
             setTimeout(() => {
              this.tab2.nativeElement.checked = true; 
              this.selectTab('customCode');
            }, 200);
          }
          else
          { 
            setTimeout(() => {
              this.tab1.nativeElement.checked = true;
              this.selectTab('user');
            }, 200); 
          }
      
      return false;
    }, ['INPUT'], 'Send a secret message to the console.'));
  }
  production= false;
  loginCustomCode(code)
  {
    debugger;
    this.model.username = "";
    this.model.password = "";
    this.model.customCode = code;
    this.authService.login(this.model).subscribe((response: any) => {
      // if(response)
     
      console.log(response);
      let user = this.authService.getCurrentInfor(); 
      
      setTimeout(() => {
        this.loadCompanyInfor();
        debugger;
        this.alertify.success("Logged in successfully");
        this.router.navigate(["/shop"]).then(() => {
          // window.location.reload();
          
          window.location.href = window.location.href;
        });
        // this.router.navigate(['/shop']);
        // window.location.href = window.location.href;
      }, 500);  
      this.writeLogLogin("Success", user.username, "", code, "");
    
    }, error => {
      console.log('Failed to login', error);
      this.model.username = "";
      this.model.password = "";
      this.model.customCode = "";
      
      setTimeout(() => {
        this.txtName.nativeElement.value = '';
        this.txtPassword.nativeElement.value = '';
      }, 10);
    
      this.alertify.error("Failed to login. Please contact to support team");
      this.writeLogLogin("Failed", code, "" ,code, error?.toString());
    });
  }
  initScanner()
  {
    this.scannerProfile = null;
    this.scannerProfile = BarcodeScanner();
    // this.basketService.changeBasketResponseStatus(true);
    this.scannerProfile.on( async (code, event: any) => {
      event.preventDefault();
      console.log('code', code); 
      debugger;
      if(this.selectedTab === 'customCode')
      {
        this.loginCustomCode(code);
      }
     
      // var source = event.target;
      // var sourceElement = event.srcElement;
      // let nameOfInput = source['name'];
      // let classnameOfInput = sourceElement['className'];
      // // nameOfInput === '' || nameOfInput === undefined ||nameOfInput === null ||
      // if( nameOfInput === 'txtCustomer' || nameOfInput === 'txtOMSId' ||  nameOfInput === 'txtQrCode' ||   classnameOfInput === 'txtQrCode' || classnameOfInput === 'swal2-input' )
      // {
      //     if( nameOfInput === 'txtQrCode' ||   classnameOfInput === 'txtQrCode')
      //     {
      //       return false;
      //     }
      // }
      // else
      // { 
      //     if(this.basketService.getBasketResponseStatus())
      //     {
      //       this.basketService.changeBasketResponseStatus(false);
      //       if(code!==null && code !==undefined && code !=='')
      //       {
      //         this.txtSearch.nativeElement.value = '';
      //         let enterKey = '%0A'; 
      //         if(code.indexOf(enterKey) !== -1)
      //         {
      //           code = code.replace(enterKey,'');
      //         } 
      //         this.onEnter(code, true);
             
      //       }
      //     }
      //     else
      //     { 
      //       this.txtSearch.nativeElement.value = '';
      //     }
      // }
        
      
    });
  }
  defaultLogin = "User";
  ngAfterViewInit() {
    this.production =  environment.production;
    let loginBarcode =   this.env.barcodeLogin ?? false;
    if(loginBarcode)
    {
      this.production = false;
    }
    debugger;
    let defaultLogin =   this.env.defaultLogin ?? "CustomCode";
    if(defaultLogin === "User")
    {
        this.selectedTab = 'user';
        this.defaultLogin = "User";
        // this.selectTab(this.selectedTab);
        setTimeout(() => {
          this.selectTab(this.selectedTab);
        }, 10);
    }
    else
    {

      this.selectedTab = 'customCode';
      this.defaultLogin = "CustomCode";
      
      setTimeout(() => {
        this.selectTab(this.selectedTab);
      }, 10);
      
    }
   
    setTimeout(() => {
      this.loadShortcut();
      this.initScanner();
     
      // this.txtName.nativeElement.focus();
    }, 10);
  }
  shortcuts: ShortcutInput[] = [];  
  // shortcuts$: Observable<ShortcutInput[]>;
  // tempShortcuts: ShortcutInput[] = [];  
  @ViewChild('txtAmount', { static: false }) txtAmount: ElementRef;
  loadShortcut()
  {
    this.shortcuts = [];
    this.shortcuts.push(
      {
        key: ["enter"],
        label: "",
        description: "",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
           this.login()
        },
        preventDefault: true
      },
      // {
      //   key: ["alt + u"],
      //   label: "Switch to " + (this.selectedTab === 'user' ? 'Barcode / Qrcode' : 'User') + ' mode',
      //   description: "Switch to " + (this.selectedTab === 'user' ? 'Barcode / Qrcode' : 'User') + ' mode',
      //   allowIn: [AllowIn.Textarea, AllowIn.Input],  
      //   command: (e) => {
      //     debugger;
      //     if(this.selectedTab === 'user')
      //     { 
      //        this.tab2.nativeElement.checked = true;
      //        this.selectTab('customCode');
      //     }
      //     else
      //     {
      //       this.tab1.nativeElement.checked = true;
      //       this.selectTab('user');
      //     }
      
          
      //   },
      //   preventDefault: true
      // },
      
    ) 
    setTimeout(() => {
     
      this.commonService.changeShortcuts(this.shortcuts, true);

    }, 100);
  }
  @ViewChild('txtCustomCode', { static: false }) txtCustomCode: ElementRef;
  @ViewChild('tab1', { static: false }) tab1;
  @ViewChild('tab2', { static: false }) tab2;
  selectedTab = "user";
  
  @ViewChild('txtName', { static: false }) txtName: ElementRef;
  @ViewChild('txtPassword', { static: false }) txtPassword: ElementRef;
 
  selectTab(code)
  {
    debugger;
    if(code === 'customCode')
    {
      this.selectedTab=  'customCode';
       setTimeout(() => {
        this.txtCustomCode.nativeElement.value = '';
        this.txtCustomCode.nativeElement.focus();
      }, 10);
    
       
    }
    else
    { 
      this.scannerProfile = null;
      
      this.selectedTab=  'user';
      setTimeout(() => {
        this.txtName.nativeElement.focus();
      }, 10);
  
      
    }
  }
  private clickStream = new Subject();
  writeLogLogin(result, userName, password, customerCode, message)
  {
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = "";
    
    // debugger;
    // let basket = this.getCurrentBasket();
    order.orderId =  uuidv4();
    let storeClient = this.authService.getStoreClient();
    if(storeClient!==null && storeClient!==undefined)
    {
      order.terminalId = storeClient?.publicIP??'';
    }
    else
    {
      order.terminalId = this.authService.getLocalIP()??'';
    } 
    order.storeId = this.authService.storeSelected()?.storeId??'';
    order.companyCode = this.authService.getCurrentInfor()?.companyCode??'';
    order.createdBy =  (userName?.toString()??(customerCode?.toString()??"").toString() ).toString() ;  
    let log= new OrderLogModel();
    log.type = "LogIn";
    log.action = "Request" ;
    log.time = new Date();
    log.result = (result?.toString()??"").toString() ;  
    log.value =  (userName?.toString()??"").toString() ;  
    log.customF1 = (customerCode?.toString()??"").toString() ; 
    log.customF2 = (password?.toString()??"").toString() ; 
    log.customF3 =(message?.toString()??"").toString() ;  
    log.createdBy = (userName?.toString()??(customerCode?.toString()??"").toString() ).toString() ;  
    order.logs.push(log); 
    
  
    this.clickStream.pipe(debounceTime(500)).pipe( e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
    .subscribe(response=> {
     
    }, error => {
    
    });
  }
  login() {
    debugger;
    console.log('this.model', this.model);
    if(this.model?.customCode!== undefined && this.model?.customCode!==null && this.model?.customCode?.length > 0 )
    {
       this.loginCustomCode(this.model.customCode);
    }
    else
    {
      if(this.model.username!== undefined && this.model.username!==null && this.model.username!==""  )
      {
        if(this.model.password!== undefined && this.model.password!==null && this.model.password!==""  )
        {
  
          this.authService.login(this.model).subscribe((response: any) => {
            // if(response)
            debugger;
            console.log(response);
            let user = this.authService.getCurrentInfor();
            // this.commonService.checkOnline(user.companyCode, user.username).subscribe((responseX: any)=>{
            //   debugger;
            //   if(responseX)
            //   {
            //     this.alertify.error("Online");
            //   }
            //   else
            //   {
               
            //   }
            // })
            
            
            
              
            setTimeout(() => {
              this.loadCompanyInfor();
              debugger;
              this.alertify.success("Logged in successfully");
              // let shopMode =    this.authService.getShopMode();
             
              // if(shopMode!==null && shopMode!==undefined && shopMode==='Grocery')
              // {
              //   this.router.navigate(["shop/order-grocery"]).then(() => {
              //     window.location.href = window.location.href;
              //   }); 
              
              // }
              // else  
              // {
              
              //   this.router.navigate(["shop/order"]).then(() => {
              //     window.location.href = window.location.href;
              //   }); 
              
               
              // }
              this.router.navigate(["/shop"]).then(() => {
                
                window.location.href = window.location.href;
                
              });
              // this.router.navigate(['/shop']);
              // window.location.href = window.location.href;
            }, 500);  
            this.writeLogLogin("Success", user.username,"", "", "");
          
          }, error => {
            console.log('Failed to login', error);
            this.alertify.error("Failed to login. Please contact to support team");
            this.writeLogLogin("Failed", this.model.username, this.model.password , "", error.toString());
          });
        }
        else
        {
          this.alertify.warning("Please input password");
          this.txtPassword.nativeElement.focus();
          this.writeLogLogin("Failed", this.model.username, this.model.password, "", "Please input password");

        }
        
      }
      else
      {
        this.alertify.warning("Please input user name");
        this.txtName.nativeElement.focus();
        this.writeLogLogin("Failed", this.model.username, this.model.password, "", "Please input user name");
      }
    }
    
    
  }
  onVirtualKeyChange(event)
  {
    console.log(event);
  }
  public amount: number | string = '';

  companyInfor: MCompany;
  
  loadCompanyInfor()
  {
    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      this.companyInfor= response.data;
      localStorage.setItem('companyInfor', JSON.stringify(this.companyInfor));
      this.titleService.setTitle(response.data.companyName);
    })
  }
  onFocus(txt: any)
  {
    let IdFocus = txt.id;
    let IdValue = txt.value;
    if(IdFocus === 'txtName' && IdValue ==='')
    {
       this.isNameFocus = !this.isNameFocus;
    }
    if(IdFocus === 'txtPassword' && IdValue ==='')
    {
       this.isPassFocus = !this.isPassFocus;
    }
    // debugger;

  }
}
