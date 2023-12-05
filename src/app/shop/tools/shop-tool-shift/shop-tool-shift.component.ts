import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MStore } from 'src/app/_models/store';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service'; 
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcuteFunctionService } from 'src/app/_services/common/excuteFunction.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-tool-shift',
  templateUrl: './shop-tool-shift.component.html',
  styleUrls: ['./shop-tool-shift.component.css']
})
export class ShopToolShiftComponent implements OnInit {

  shiftNum: string ="";
  shiftHeader: TShiftHeader;
  currentDate = new Date();
  shiftHeader$: Observable<TShiftHeader>;
  @Input() isShowCreate:boolean = false;
  @Input() endOfShift:TShiftHeader;
  
  @Output() outEvvent = new EventEmitter<any>();
  startFirst = false;
  // @Output() 
  store: MStore;
  constructor(private authService: AuthService,  private excuteFunction: ExcuteFunctionService,
     private alertify: AlertifyService, private route: Router,private basketService: BasketService,  private envService: EnvService,  private commonService: CommonService, 
      private shiftService: ShiftService,  private router: Router,  private activeRoute: ActivatedRoute  ) { 
    this.shiftHeader = new TShiftHeader();
    // this.activeRoute.queryParams.subscribe((qp) => {
    //   console.log('Get Router URL in segment:', this.activeRoute.snapshot);
    //   console.log('Get Full Router URL:', this.router.url);
    // });
  }
  shortcuts: ShortcutInput[] = [];  
  // shortcuts$: Observable<ShortcutInput[]>;
  // tempShortcuts: ShortcutInput[] = [];  
  @ViewChild('txtAmount', { static: false }) txtAmount: ElementRef;
  loadShortcut()
  {
    this.shortcuts.push(
      {
        key: ["enter"],
        label: "Start Shift",
        description: "Start Shift",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
           this.startShift();
        },
        preventDefault: true
      },
      {
        key: ["delete"],
        label: "Cancel",
        description: "Cancel",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
           this.cancelShift();
        },
        preventDefault: true
      },
      {
        key: ["alt + a"],
        label: "Amount",
        description: "Amount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
           this.txtAmount.nativeElement.focus();
        },
        preventDefault: true
      }
    )
    
    //  console.log('this.shortcuts X', this.shortcuts);
     this.commonService.changeShortcuts(this.shortcuts, true); 
     
  }
  functionId = "Adm_Shift";
  canEndShift=true;
  canStartShift=true;

  production= false;
  openDrawer = "false";
  loadSetting()
  {
    let OpenDrawer = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'OpenDrawerOnNewShift');
    if (OpenDrawer !== null && OpenDrawer !== undefined) {
      this.openDrawer = OpenDrawer.settingValue;
    }
  }
  ngOnInit() {

    this.production =  environment.production ?? false; 
    let debug =  this.envService.enableDebug ?? false; 
    if(debug === true)
    {
      this.production = false;
    }
    this.loadSetting();
    this.loadShiftOpenList();
    this.canEndShift = this.authService.checkRole(this.functionId , '', 'E'); 
    this.canStartShift =  this.authService.checkRole(this.functionId , '', 'I'); 

    
    this.store = this.authService.storeSelected();
    this.shiftHeader$ = this.shiftService.shiftHeader$;
    let shift = this.shiftService.getCurrentShip();
    // debugger
    if(shift===null || shift===undefined)
    {
      let terminalId ="";
      let storeClient = this.authService.getStoreClient();
      if(storeClient!==null && storeClient!==undefined)
      {
        if(storeClient?.publicIP !== storeClient?.localIP)
        {
            terminalId = storeClient.publicIP;
        }
        //  let model = this.authService.getStoreClient();
        //  if(model!==null && model!==undefined)
        //  {
            
        //  }
      }
      
      
      this.shiftService.getNewShiftCode(this.store.companyCode, this.store.storeId, terminalId).subscribe(data => {
        this.shiftNum = data;
      });
    }
    this.shiftService.changeShift(shift); 
  }
  
  ngAfterViewInit() {
     
    setTimeout(() => {  
      if(this.router?.url?.toString() === '/shop/shifts')
      {
        this.loadShortcut();
      }
     
    }, 500);
    
  }
  ngOnDestroy() {
     
    // this.commonService.changeShortcuts(null, true);
  }
  shiftList: TShiftHeader[]; 
  loadShiftOpenList() {

    let store = this.authService.storeSelected();
    let now = new Date();
    let month = now.getMonth() + 1;
    if (month === 13) {
      month = 1;
    }
    let dateFormat = now.getFullYear() + "/" + month + "/" + now.getDate();
    // if(store === null || store=== undefined)
    // {
      let storeClient = this.authService.getStoreClient();
      let terminalId ="";
      if(storeClient!==null && storeClient!==undefined)
      {
        terminalId = this.authService.getStoreClient().publicIP;
      }
      else
      {
        terminalId = this.authService.getLocalIP();
      }
    this.shiftService.loadOpenShift(this.authService.getCurrentInfor().companyCode, store.storeId, dateFormat, this.authService.getCurrentInfor().username, terminalId).subscribe((response: any) => {
      // debugger;
      if(response.success)
      { 
        this.shiftList = response.data;
      }
      else
      {
        this.alertify.warning(response.message);
      }
      
      // if (this.shiftList === null || this.shiftList === undefined || this.shiftList.length === 0) {
      //   this.isNewShift = true;
      // }
      // else {
      //   this.isNewShift = false;
      // }
      
    });
    // debugger;

    // }
  }

  startShiftForTest()
  {
    debugger;
    if(this.shiftList!==null && this.shiftList!==undefined && this.shiftList?.length > 0)
    {
      window.location.reload();
    }
    else
    {
      let currencshift = this.shiftService.getCurrentShip();
      if(currencshift=== null || currencshift===undefined)
      {
        this.startFirst = true;
        this.shiftHeader.storeId= this.store.storeId;
        this.shiftHeader.companyCode = this.store.companyCode;
        this.shiftHeader.createdBy =  this.authService.decodeToken?.unique_name;
        if(this.shiftHeader.openAmt===null || this.shiftHeader.openAmt===undefined)
        {
          this.shiftHeader.openAmt=0;
        }
        // authService.
        // this.shiftHeader.dailyId = this.currentDate.toString("yyyyMMdd");
        let storeClient = this.authService.getStoreClient();
        if(storeClient!==null && storeClient!==undefined)
        {
          this.shiftHeader.deviceId = this.authService.getStoreClient().publicIP;
        }
        else
        {
          this.shiftHeader.deviceId = this.authService.getLocalIP();
        }
        if( this.shiftHeader.deviceId!==null && this.shiftHeader.deviceId!==undefined && this.shiftHeader.deviceId!== '')
        {
        // this.shiftHeader.deviceId = this.authService.getLocalIP();
          this.shiftHeader.openAmt = parseFloat(this.shiftHeader.openAmt.toString().split(',').join('')); 
          this.isShowCreate=false;
        
          this.shiftHeader.shiftId = "ShiftForTest0001";
          // this.modalRef.hide(); 
         
        
          // localStorage.setItem("shift", JSON.stringify(this.shiftHeader));
          var tomorrow = new Date();
          var now = new Date();
          tomorrow.setDate(tomorrow.getDate()+1);
          tomorrow.setHours(1);
          let value = tomorrow.getTime() - now.getTime();
          this.commonService.setLocalStorageWithExpiry("shift", this.shiftHeader, value);
          this.shiftService.changeShift(this.shiftHeader);
          // this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.shiftHeader.storeId);
          // this.newOrder();
          this.basketService.deleteBasketLocal();
          if(this.authService.getShopMode()==='FnB')
          {
            // this.redirectTo('/shop/order');
            let storeSelected = this.authService.storeSelected();
                  let ShopModeData = this.authService.getGeneralSettingStore(storeSelected.companyCode, storeSelected.storeId).find(x => x.settingId === 'ShopMode');
              
                  if(ShopModeData.customField1?.length > 0 && ShopModeData.customField1?.toLowerCase() === 'table')
                  {
                    if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
                    {
                        this.router.navigate(["shop/placeInfo", storeSelected.storeId]).then(()=>{
                          setTimeout(() => {
                            window.location.reload();
                          }, 1000);
                        });
                    }
                    else
                    {
                      this.redirectTo('/shop/order');
                    }
                  
                  }
                  else
                  {
                    this.redirectTo('/shop/order');
                  }
                  
                  
          }
          if(this.authService.getShopMode()==='FnBTable')
          {
            // this.redirectTo('/shop/order');
            let storeSelected = this.authService.storeSelected();
            if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
            {
                this.router.navigate(["shop/placeInfo", storeSelected.storeId]).then(()=>{
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                });
            }
            else
            {
              this.redirectTo('/shop/order');
            }
                  
          }
          if(this.authService.getShopMode()==='Grocery')
          {
            this.redirectTo('/shop/order-grocery'); 
          }
        }
        else
        {
          this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
        }
      }
      else
      {
        this.alertify.warning("Inshift");
      }
    }
    
  }

 
  startShift()
  {

   
    debugger;
    if(this.shiftList!==null && this.shiftList!==undefined && this.shiftList?.length > 0)
    {
      window.location.reload();
    }
    else
    {
   
          let currencshift = this.shiftService.getCurrentShip();
          if(currencshift=== null || currencshift===undefined)
          {
            this.startFirst = true;
            this.shiftHeader.storeId= this.store.storeId;
            this.shiftHeader.companyCode = this.store.companyCode;
            this.shiftHeader.createdBy =  this.authService.decodeToken?.unique_name;
            if(this.shiftHeader.openAmt===null || this.shiftHeader.openAmt===undefined)
            {
              this.shiftHeader.openAmt=0;
            }
            // authService.
            // this.shiftHeader.dailyId = this.currentDate.toString("yyyyMMdd");
            let storeClient = this.authService.getStoreClient();
            if(storeClient!==null && storeClient!==undefined)
            {
              this.shiftHeader.deviceId = this.authService.getStoreClient().publicIP;
            }
            else
            {
              this.shiftHeader.deviceId = this.authService.getLocalIP();
            }
            if( this.shiftHeader.deviceId!==null && this.shiftHeader.deviceId!==undefined && this.shiftHeader.deviceId!== '')
            {
             
            // this.shiftHeader.deviceId = this.authService.getLocalIP();
              this.shiftHeader.openAmt = parseFloat(this.shiftHeader.openAmt.toString().split(',').join('')); 
              Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to open shift with amount: ' + this.shiftHeader.openAmt,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
              }).then((result) => {
                if (result.value) {
                  this.shiftService.create(this.shiftHeader).subscribe( (response: any) => {
                    if(response.success)
                    { 
                      if(this.openDrawer==='true')
                      {
                        this.excuteFunction.openDrawer();
                      }
                      
                      this.isShowCreate=false;
                      this.alertify.success(response.message);
                      this.shiftHeader.shiftId = response.message;
                      this.shiftHeader.createdOn = new Date();
                      // this.modalRef.hide(); 
                      if(this.endOfShift!==null && this.endOfShift!==undefined)
                      {
                        this.shiftService.endShift(this.endOfShift).subscribe(
                          (responseEoS: any) => {
                            if(responseEoS.success)
                            {
                              localStorage.removeItem("shift");
                              this.shiftService.changeShift(null);
                              this.alertify.success("End shift completed successfully!");
                              // this.route.navigate(['/admin/shift/print/', this.shiftHeader.shiftId]).then(() => {
                              //   window.location.reload();
                              // }); 
                            }
                            else
                            {
                             
                              this.alertify.warning(responseEoS.message); 
                              Swal.fire({
                                icon: 'warning',
                                title: 'End Of Shift',
                                text: responseEoS.message
                              });
                            }
                           
                          },
                          (error) => {
                            // this.alertify.error(error);
                            Swal.fire({
                              icon: 'error',
                              title: 'End Of Shift',
                              text: error
                            });
                          }
                        );;
                      }
                    
                      // localStorage.setItem("shift", JSON.stringify(this.shiftHeader));
                      var tomorrow = new Date();
                      var now = new Date();
                      tomorrow.setDate(tomorrow.getDate()+1);
                      tomorrow.setHours(1);
                      let value = tomorrow.getTime() - now.getTime();
                      this.commonService.setLocalStorageWithExpiry("shift", this.shiftHeader, value);
                      this.shiftService.changeShift(this.shiftHeader);
                      // this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.shiftHeader.storeId);
                      // this.newOrder();
                      this.basketService.deleteBasketLocal();
                      if(this.authService.getShopMode()==='FnB')
                      {
                        let storeSelected = this.authService.storeSelected();
                        let ShopModeData = this.authService.getGeneralSettingStore(storeSelected.companyCode, storeSelected.storeId).find(x => x.settingId === 'ShopMode');
                    
                        if(ShopModeData.customField1?.length > 0 && ShopModeData.customField1?.toLowerCase() === 'table')
                        {
                          if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
                          {
                              this.router.navigate(["shop/placeInfo", storeSelected.storeId]).then(()=>{
                                setTimeout(() => {
                                  window.location.reload();
                                }, 1000);
                              });
                          }
                          else
                          {
                            this.redirectTo('/shop/order');
                          }
                        
                        }
                        else
                        {
                          this.redirectTo('/shop/order');
                        }
                        
                        
                      }
                      if(this.authService.getShopMode()==='FnBTable')
                      {
                        // this.redirectTo('/shop/order');
                        let storeSelected = this.authService.storeSelected();
                        if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
                        {
                            this.router.navigate(["shop/placeInfo", storeSelected.storeId]).then(()=>{
                              setTimeout(() => {
                                window.location.reload();
                              }, 1000);
                            });
                        }
                        else
                        {
                          this.redirectTo('/shop/order');
                        }
                              
                      }
                      if(this.authService.getShopMode()==='Grocery')
                      {
                        this.redirectTo('/shop/order-grocery'); 
                      }
                      
                    }
                    else
                    { 
                      this.alertify.warning(response.message); 
                      Swal.fire({
                        icon: 'warning',
                        title: 'Create New Shift',
                        text: response.message
                      });
                     
                    }},
                  (error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Create New Shift',
                      text: error
                    });
                    
                  }
                );
                }
              })
            }
            else
            {
              this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
            }
          }
          else
          {
            this.alertify.warning("Inshift");
          }
        
      
    }
    
  }
   
  redirectTo(uri:string){
    this.route.navigate([uri]).then(() => {
      // window.location.reload(true);
      window.location.href = window.location.href;
    });
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    
   
 }
  createShift()
  {
    this.outEvvent.emit(true);
    this.route.navigate(["shop/order"]);
    // if(this.authService.getShopMode()==='Grocery')
    // {
    //   this.redirectTo('/shop/order-grocery'); 
    // }
    // else
    // {
    //   this.route.navigate(["shop/order"]);
    // }
   
    // let store= this.store.storeId;
    // this.shiftService.getNewShiftCode(store).subscribe(data => {
    //   this.shiftNum = data;
    // });
    // this.shiftHeader.shiftId = this.shiftNum;
    // this.shiftHeader.openAmt = 0;
    // this.shiftHeader.endAmt = 0;
    // this.shiftHeader.shiftTotal =0;
    // this.isShowCreate = !this.isShowCreate;
    // this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, store);
  }
  cancelShift()
  {
    // this.isShowCreate = false;
    this.route.navigate(["shop/dasboard"]);
    this.commonService.MainShortcuts$.subscribe((data: any)=>{
      this.commonService.changeShortcuts(data, true);
    })
  }
  endShift()
  {
    let shift = this.shiftService.getCurrentShip();
    this.route.navigate(["admin/shift/summary", shift.shiftId]);
    // Swal.fire({
    //   title: 'Submit your amount',
    //   input: 'number',
    //   inputAttributes: {
    //     autocapitalize: 'off'
    //   },
    //   showCancelButton: true,
    //   confirmButtonText: 'Submit',
    //   showLoaderOnConfirm: true, 
    //   allowOutsideClick: () => !Swal.isLoading()
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     debugger;
       
    //     let shift = this.shiftService.getCurrentShip();
    //     if(result.value===null || result.value===undefined)
    //     {
    //       shift.endAmt = 0;
    //     }
    //     else
    //     {
    //       shift.endAmt = result.value;
    //     }
      
    //     this.shiftService.endShift(shift).subscribe(
    //       (response: any) => {
    //         debugger;
    //         if(response.success)
    //         {
    //           localStorage.removeItem("shift");
    //           this.shiftService.changeShift(null);
    //           this.alertify.success("End shift completed successfully!");
    //           this.route.navigate(["admin/shift/print", shift.shiftId]);
              
    //           // this.route.navigate(['/admin/shift/print/', shift.shiftId]).then(() => {
    //           //   window.location.reload();
    //           // }); 
    //         }
    //         else
    //         {
             
    //           this.alertify.success(response.message); 
    //         }
           
    //       },
    //       (error) => {
    //         this.alertify.error(error);
    //       }
    //     );
       
    //     // let itembasket= this.basketService.mapProductItemtoBasket(this.item, 1 );
    //     // itembasket.quantity = result.value;
    //     // itembasket.storeAreaId = '';
    //     // itembasket.timeFrameId = ''; 
    //     // itembasket.appointmentDate = '';
    //     // itembasket.isCapacity = true;
    //     // // 
    //     // const initialState = {
    //     //   basketModel:  itembasket, title: 'Item Capacity',
    //     // };
    //     // this.modalRef = this.modalService.show(ShopCapacityComponent, {initialState});
    //   }
    // })
    
  }
}
