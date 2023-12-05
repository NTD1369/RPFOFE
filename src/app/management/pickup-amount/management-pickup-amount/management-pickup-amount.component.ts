import { Component, OnInit, Pipe, PipeTransform, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ShopPickupAmountInputComponent } from 'src/app/shop/tools/shop-pickup-amount-input/shop-pickup-amount-input.component';
import { SGeneralSetting, GeneralSettingStore } from 'src/app/_models/generalsetting';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { MStore } from 'src/app/_models/store';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { GeneralsettingService } from 'src/app/_services/data/generalsetting.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';
import { ShopApprovalInputComponent } from 'src/app/shop/tools/shop-approval-input/shop-approval-input.component';
 
@Component({
  selector: 'app-management-pickup-amount',
  templateUrl: './management-pickup-amount.component.html',
  styleUrls: ['./management-pickup-amount.component.scss']
})


export class ManagementPickupAmountComponent implements OnInit {
 
  functionId = "Adm_PickupAmount";
  items: SGeneralSetting[]; 
  userParams: any = {};
  isNew:boolean = false;
  constructor(private pickupService: PickupAmountService, private alertify: AlertifyService, private router: Router, private commonService: CommonService, 
    public authService: AuthService,  private storeService: StoreService,  private pickupAmountService: PickupAmountService,
    private modalService: BsModalService,  private printService: PrintService,private route: ActivatedRoute) {
       
      // this.usbPrintDriver = new UsbDriver();
      // this.printService.isConnected.subscribe(result => {
      //     this.status = result;
      //     if (result) {
      //         console.log('Connected to printer!!!');
      //     } else {
      //     console.log('Not connected to printer.');
      //     }
      // });
     }
  canAdd = false;
  canEdit = false;
  canView = false;
  fromDate: Date;
  toDate: Date;
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  ngOnInit() {
    // this.route
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    this.canView = check;
    this.canAdd =  this.authService.checkRole(this.functionId , '', 'I' );
    this.canEdit =  this.authService.checkRole(this.functionId , '', 'E' );
   
    let checkApprovalRequire =  this.authService.checkRole(this.functionId , '', 'A' );
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      this.canAdd = false;
      this.canEdit = false;
    }
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const lastDay =  new Date(year, month +1, 0).getDate();

    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;

    this.defaultStoreId = this.authService.storeSelected().storeId;
    this.loadStoreList();
    this.printest();
   
  }

  printest()
  {
//     const escpos = require('escpos');
// // install escpos-usb adapter module manually
// escpos.USB = require('escpos-usb');
    // let EscPosEncoder = require('esc-pos-encoder');

    // let encoder = new EscPosEncoder();

    // let result = encoder
    //     .initialize()
    //     .text('The quick brown fox jumps over the lazy dog')
    //     .newline()
    //     .qrcode('https://nielsleenheer.com')
    //     .encode();
  }
  counters: SStoreClient[] = [];
  storeId="";

  pickupAmounts: TPickupAmount[] = [];
  counterSelected: any;

  counterIdPrint ="";
  shiftIdPrint ="";
  widthPrint = "";
  counterSelectionChanged(counter)
  {
    this.counterSelected = counter;
    let value = counter.addedItems[0].publicIP;
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDate(); 
    const lastDay =  new Date(year, month +1, 0).getDate();

    let now =  year + '/' + (month + 1) + '/' + nowDate ;
    this.commonService.getDailyId(this.authService.getCurrentInfor().companyCode,this.storeId , '').subscribe((responseX: any)=>{
     if( responseX.success)
     {
      this.pickupAmountService.GetItems(this.authService.getCurrentInfor().companyCode,this.storeId ,  responseX.data , value, '','','','','').subscribe((response: any)=>{
        if(response.success)
        {
         debugger;
          this.pickupAmounts = response.data;
        }
        else
        {
          this.alertify.warning(response.message);
        }
     })
     }
     else 
     {
      this.alertify.warning(responseX.message); 
     }
     
    })
   
  }

  // Bank in  = Sum Amount Pickup + Số Collected Amount
  // Tạm thời vẫn cho edit
  loadCounter(store)
  {
    debugger;
    this.storeId = store.value;
    this.loadPickupAmountList();
    // var d = new Date();
    // const year = d.getFullYear();
    // const month = d.getMonth(); 
    // const nowDate = d.getDate(); 
    // const lastDay =  new Date(year, month +1, 0).getDate();

    // let now =  year + '/' + (month + 1) + '/' + nowDate ;

    //  this.counterService.GetCounterSalesInDay(this.authService.getCurrentInfor().companyCode, this.storeId, now).subscribe((response: any)=>{
    //    if(response.success)
    //    {
    //      debugger;
    //       this.counters = response.data.filter(x=>x.publicIP !== null && x.publicIP !== undefined && x.publicIP !== '');
    //    }
    //    else
    //    {
    //       this.alertify.warning(response.message);
    //    }
    //  })
  }
 
  storelist : MStore[];
  loadStoreList()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storelist = response.data;
        this.storelist.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName;
        // if (todo.storeId == newRecordToUpdate.storeId){
           
        //  }
       });
       this.storeId = this.authService.storeSelected().storeId;
       this.loadPickupAmountList();
      } 
      else
      {
        this.alertify.warning(response.message);
      }
      // this.storelist = response;
    })
  }
  currentStore: MStore;
  modalRef: BsModalRef;
  model: TPickupAmount;
  updateSettingModel: any;
  status: boolean = false;
  usbPrintDriver: UsbDriver;
  webPrintDriver: WebPrintDriver;
  ip: string = '\\127.0.0.1';

  requestUsb() {
    this.usbPrintDriver.requestUsb().subscribe(result => {
        this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
        this.print();
    });
}
  connectToWebPrint() {
    this.webPrintDriver = new WebPrintDriver(this.ip);
    this.printService.setDriver(this.webPrintDriver, 'WebPRNT');
  }
  print() {
    debugger
    this.printService.init()
        .setBold(true)
        .writeLine('Hello World!')
        .setBold(false)
        .feed(4)
        .cut('full')
        .flush();
}
  loadPickupAmountList()
  {
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDate(); 
    const lastDay =  new Date(year, month +1, 0).getDate();

    let now =  year + '/' + (month + 1) + '/' + nowDate ;
    this.commonService.getDailyId(this.authService.getCurrentInfor().companyCode,this.storeId , '').subscribe((responseX: any)=>{
    
     if( responseX.success)
     {
      this.pickupAmountService.GetPickupAmountLst(this.authService.getCurrentInfor().companyCode,this.storeId ,  responseX.data , '', 'N').subscribe((response: any)=>{
        debugger;
        if(response.success)
        {
         debugger;
          this.pickupAmounts = response.data;
        }
        else
        {
          this.alertify.warning(response.message);
        }
        this.pickAmount = null;
     })
     }
     else 
     {
      this.alertify.warning(responseX.message); 
     }
    })
    // this.pickupService.GetPickupAmountLst(this.authService.getCurrentInfor().companyCode, '','' ,'').subscribe((response: any) =>{
    //   if(response.success)
    //   {
    //     this.pickupAmounts= response.data;
    //   }
    //   else
    //   {

    //     this.alertify.error(response.message);
    //   }
    // })
  }
  checkPermision(isNew: boolean, model: TPickupAmount)
  {
    // this.canAdd = false;
    if(this.canAdd)
    {
      this.openModal(isNew , model)
    } 
    else
    {
      
      let permissionModel= { functionId: this.functionId, functionName: 'Pickup Amount(Add)', controlId: '', permission: 'I'};
      const initialState = {
          title: 'Pickup Amount(Add) - Permission denied',
          freeApprove : true,
          permissionModel : permissionModel
      };
      let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
        initialState,
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-xl medium-center-modal'
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      let aplplyData = false;

      modalApprovalRef.content.outEvent.subscribe((received: any) => {
        debugger;
        if (received.isClose) {
          modalApprovalRef.hide();
          // this.modalRef.hide();
          // this.modalRef = null;
          // aplplyData = false;  
        }
        else {
          // debugger;
          // aplplyData = true;
          // let discountAllBillType = event?.discountAllBillType;
          // let discountAllBillAmount = parseFloat(event?.discountAllBill??0);
          // this.basketService.applyDiscountPromotionToBasket(discountAllBillType, discountAllBillAmount);
          // setTimeout(() => {
          //   modalApprovalRef.hide();
          //   this.modalRef.hide();
          //   this.closeModal(false);
          // }, 30);
            setTimeout(() => {
            modalApprovalRef.hide();
            model.approveBy = received?.username??"";
            this.openModal(isNew , model);
          }, 30);
         
        }

      });

      modalApprovalRef.onHide.subscribe((reason: string) => {
        this.commonService.TempShortcuts$.subscribe((data) => {
          this.commonService.changeShortcuts(data, true);
          console.log('Old Shorcut', data);
        });
       
      })
    }
  }
  poleValue : SStoreClient;
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
  openModal(isNew: boolean, model: TPickupAmount) {
    debugger;

    
    // this.requestUsb();
    // this.counterIdPrint ="";
    this.pickAmount = null;
    this.widthPrint = "";

    this.isNew = isNew;

    
    // if(isNew)
    // {
    //   // this.model = new TPickupAmount();
    //   this.model.companyCode = this.authService.storeSelected().companyCode;
    // }
    // else
    // {
    //   this.model = model;
    // }
     model.pickupBy =  this.authService.getCurrentInfor().username;

     setTimeout(() => {
      this.poleValue =this.getPole();
      let cut = false;
      let interval = setInterval(async () => {
        if (cut === false) {
          // if (this.poleValue === null || this.poleValue === undefined) {
          //   console.log("Pole Null")

          //   let currenInfor = this.authService.storeSelected();
          //   let localIp = this.authService.getLocalIP();
          //   this.storeClient.getById(currenInfor.companyCode, currenInfor.storeId, '', localIp, '').subscribe((response: any) => {

          //     if (response.success) {
          //       this.poleValue = response.data;
          //     }
          //   });
          //   await timer(200).pipe(take(1)).toPromise();
          // }
          if (this.poleValue?.printName?.length > 0) {
            
            this.commonService.OpenDrawer(this.poleValue?.printName, "").subscribe((response: any) => {
            }, (error) => {
              this.alertify.error(error);
            }
            );
            cut = true;
          }
          else {

            cut = true;
          }
        }
        if (cut === true) {
          clearInterval(interval);
          
        }
      }, 200);
    }, 100);


    setTimeout(() => {
      const initialState = { 
        isNew: isNew,
        model: model,
      };
      let modalPickupRef = this.modalService.show(ShopPickupAmountInputComponent, {
        initialState, 
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
     
      modalPickupRef.content.outPickUp.subscribe((received: any) => {
        if(received.isClose)
        {
          modalPickupRef.hide();
        }
        else  
        {
          this.createPickup(received);
          modalPickupRef.hide();
         
        } 
      });
    });
 
  }
  defaultStoreId= "";
  openEditModal(model: TPickupAmount, NumOfList) {
  
    let permissionModel= { functionId: this.functionId, functionName: 'Pickup Amount(Edit)', controlId: '', permission: 'E'};
      const initialState = {
          title: 'Pickup Amount(Edit) - Permission denied',
          freeApprove : true,
          permissionModel : permissionModel
      };
      let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
        initialState,
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-xl medium-center-modal'
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
    
      modalApprovalRef.content.outEvent.subscribe((received: any) => {
        debugger;
        if (received.isClose) {
          modalApprovalRef.hide();
         
        }
        else {
         
          setTimeout(() => {
            modalApprovalRef.hide();
          

            this.pickAmount = null;
            this.widthPrint = "";
            this.pickupAmountService.GetItem(this.authService.getCurrentInfor().companyCode, model.storeId, '', model.counterId , model.shiftId , '' , NumOfList).subscribe((response: any) =>{
        
              if(response.success)
              {
                model = null;
                debugger;
                model = response.data;
                setTimeout(() => {
                  const initialState = { 
                    isNew: false,
                    model: model,
                  };
                  let modalPickupRef = this.modalService.show(ShopPickupAmountInputComponent, {
                    initialState, 
                    animated: true,
                    keyboard: true,
                    backdrop: true,
                    ignoreBackdropClick: true,
                    ariaDescribedby: 'my-modal-description',
                    ariaLabelledBy: 'my-modal-title',
                    class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
                  });
                 
                  modalPickupRef.content.outPickUp.subscribe((received: any) => {
                    if(received.isClose)
                    {
                      modalPickupRef.hide();
                    }
                    else  
                    {
                      this.updatePickup(received);
                      modalPickupRef.hide();
                     
                    } 
                  });
                });
             
              }
              else
              {
                this.alertify.warning(response.message);
              }
            })
     
            
          }, 30);
         
        }

      });

      modalApprovalRef.onHide.subscribe((reason: string) => {
        this.commonService.TempShortcuts$.subscribe((data) => {
          this.commonService.changeShortcuts(data, true);
          console.log('Old Shorcut', data);
        });
       
      })
    

    // this.requestUsb();
    // this.counterIdPrint ="";
    // this.shiftIdPrint ="";
   
    //  model.pickupBy =  this.authService.getCurrentInfor().username;
   
  }
  deletePickeUp(model)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        model.createdBy = this.authService.getCurrentInfor().username;
        this.pickupService.delete(model).subscribe((response: any)=>{
          if(response.success)
          {
            this.alertify.success("Delete successfully completed");
            debugger;
            this.counterSelectionChanged(this.counterSelected);
          }
          else
          {

            this.alertify.error(response.message);
          }
        })
      }
    });
  }
  pickAmount : TPickupAmount ;
  createPickup(model)
  { 
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        debugger;
        // let value = this.counterSelected.addedItems[0].publicIP;
        // model.counterId = value;
        model.companyCode = this.authService.getCurrentInfor().companyCode;
        model.createdBy = this.authService.getCurrentInfor().username;
        this.pickupService.create(model).subscribe((response: any)=>{
          if(response.success)
          {
            console.log('response', response.data);
            this.alertify.success("Pickup amount " +  model.amount + " successfully completed");
            debugger;
            this.pickAmount = new TPickupAmount();
            this.pickAmount = response.data;
            // this.counterIdPrint = response.data?.counterId;
            // this.counterSelectionChanged(this.counterSelected);
            setTimeout(() => {
              this.loadPickupAmountList();
            }, 300);
           
          }
          else
          {

            this.alertify.error(response.message);
          }
        })
      }
    });
  }
  updatePickup(model)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        debugger;
        // let value = this.counterSelected.addedItems[0].publicIP;
        // model.counterId = value;
        model.companyCode = this.authService.getCurrentInfor().companyCode;
        model.modifiedBy = this.authService.getCurrentInfor().username;
        this.pickupService.update(model).subscribe((response: any)=>{
          if(response.success)
          {
            this.alertify.success("Update Pickup amount " +  model.amount + " successfully completed");
            debugger;
            // this.counterSelectionChanged(this.counterSelected);
            this.loadPickupAmountList();
          }
          else
          {

            this.alertify.error(response.message);
          }
        })
      }
    });
  }
  // updateModel(model) {
  //   debugger; 
  //   if(this.isNew)
  //   {
  //     this.model.createdBy = this.authService.getCurrentInfor().username;
  //     this.generalsettingService.create(model).subscribe((response: any) => {
  //       if(response.success)
  //       {
  //         this.alertify.success('Create completed successfully'); 
  //         this.loadGeneralSetting(this.currentStore.storeId);
  //         this.modalRef.hide();
  //       }
  //       else{
  //         this.alertify.error(response.message);
  //       } 
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  //   }
  //   else{
  //     this.model.modifiedBy = this.authService.getCurrentInfor().username;
  //     this.generalsettingService.update(model).subscribe((response: any) => {
  //       if(response.success)
  //       {
  //         this.alertify.success('Update completed successfully.'); 
  //         this.modalRef.hide();
  //       }
  //       else{
  //         this.alertify.error(response.message);
  //       }
       
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  //   }
   
  // }
   
  @ViewChild('template' , { static: false}) template;  
  // onToolbarPreparing(e) {
  //   e.toolbarOptions.items.unshift( {
  //           location: 'before',
  //           widget: 'dxButton',
  //           options: {
  //               width: 136, 
  //               icon:"add", type:"default", text:"Add",
  //               onClick: this.openModal.bind(this, true, null)
  //           } 
  //       });
  // }
  onToolbarPreparing(e) {
    // if(this.authService.checkRole(this.functionId , '', 'I'))
    // {
      e.toolbarOptions.items.unshift( 
        {
          location: 'before',
          template: 'totalGroupCount'
      }, 
       
      
      
        );
      
  }
}
@Pipe({ name: 'gridCellData' })
export class GridCellDataPipe implements PipeTransform {
  transform(gridData: any) {
    return gridData.data[gridData.column.caption.toLowerCase()];
  }
}
 
export class Employee {
  ID: number;

  FirstName: string;

  LastName: string;

  Prefix: string;

  Position: string;

  Picture: string;

  BirthDate: string;

  HireDate: string;

  Notes: string;

  Address: string;
}

