import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial } from 'src/app/_models/invoice';
import { Item } from 'src/app/_models/item';
import { Payment } from 'src/app/_models/payment';
import { MReason } from 'src/app/_models/reason';
import { TSalesLine, TSalesLineSerial } from 'src/app/_models/tsaleline';
import { TSalesPayment } from 'src/app/_models/tsalepayment';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';  
import { ReasonService } from 'src/app/_services/data/reason.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import Swal from 'sweetalert2';
import { BasketPayment } from '../../rma/shop-return/shop-return.component';
import { ShopApprovalInputComponent } from '../../tools/shop-approval-input/shop-approval-input.component';
import { ShopReasonInputComponent } from '../../tools/shop-reason-input/shop-reason-input.component';

@Component({
  selector: 'app-shop-checkout-detail',
  templateUrl: './shop-checkout-detail.component.html',
  styleUrls: ['./shop-checkout-detail.component.scss']
})
export class ShopCheckoutDetailComponent implements OnInit {
  modalRef: BsModalRef;
  showModal: boolean= false;
  invoice: TInvoiceHeader;
  discountModalShow: boolean = false;
 
  // tslint:disable-next-line: max-line-length
  constructor(private alertify: AlertifyService, private authService: AuthService, private shiftService: ShiftService,  private invoiceService: InvoiceService, private basketService: BasketService,
    private route: ActivatedRoute,private modalService: BsModalService, private reasonService: ReasonService, private permissionService: PermissionService, private router: Router) { 

      this.customizeText= this.customizeText.bind(this);
    }
  
    customizeText (e) {
      // debugger;
       if( e.value!==null &&  e.value!== undefined)
       {
         return this.authService.formatCurrentcy( e.value);
  
       }
       return 0;
    };
  ngAfterViewInit()
  {
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('check out detail');
        }
    });
    // paymentMenu
  
  }
  
  saveEntity()
  {
    // this.invoice= this.invoice;
    this.invoice.createdBy = this.authService.getCurrentInfor().username;
     this.invoiceService.create(this.invoice).subscribe((response:any)=>{
      if(response.success)
      {

        this.alertify.success('save promotion completed successfully. ' + response.message);
      }
      else
      {
       this.alertify.warning('save promotion failed. Message: ' + response.message);
      }
     });
  }
  addDays(days: number): Date {
    var futureDate = new Date(this.invoice.createdOn);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }
  dayOfCancel = 5;
  checkDayOfOrder() {
    debugger;
    console.log('this.authService.getVoidReturnSetting()',this.authService.getVoidReturnSetting());
    let setting = this.authService.getVoidReturnSetting().find(x => x.type.replace(/\s/g, "") === 'Retail' && x.code.replace(/\s/g, "") === 'SOVoidDay');
    if (setting !== null && setting !== undefined) {
      this.dayOfCancel = setting.value;
    }
  }
  cancelInvoice()
  {
    if (this.shiftService.getCurrentShip() == null || this.shiftService.getCurrentShip() === undefined) { 
      Swal.fire({
        icon: 'warning',
        title: 'Shift',
        text: "You are not on the shift. Please create your shift"
      });
    }
    else {
      let cancleLimitDate = this.addDays(this.dayOfCancel);// date.setDate(date.getDate() + );
      let now = new Date();
      if (1!==1 ) {
        // this.invoice.status.toLocaleLowerCase()!=='h' && this.invoice.status.toLocaleLowerCase()!=='hold' && now > cancleLimitDate
        Swal.fire({
          icon: 'warning',
          title: 'Payment',
          text: "Cant void order. Because order date out of range!"
        });
      }
      else {
        let checkAction = this.authService.checkRole('Spc_CancelOrder', '', 'I');
        let checkApprovalRequire =  this.authService.checkRole('Spc_CancelOrder', '', 'A');
        if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
        {
          checkAction = false;
        }
        // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().username, '', 'Spc_CancelOrder', '', 'I').subscribe((response: any) => {
        //   // const user = response;
        //    debugger;
        //   if (response.success) {
          
        //   }
        //   else {
        //     Swal.fire({
        //       icon: 'warning',
        //       title: 'Cancel Order',
        //       text: response.message
        //     });
        //   }
        // })
        if (checkAction) {
          this.cancelAction('');
        }
        else {
          // const initialState = {
          //   title: 'Permission denied',
          // };
          let permissionModel= { functionId:'Spc_CancelOrder', functionName: "Item Filter", controlId: '', permission: 'I'};
          const initialState = {
              title: 'Cancel Invoice - ' + 'Permission denied', 
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
            if (received.isClose) {
              modalApprovalRef.hide();
            }
            else {
              debugger;
              this.cancelAction(received.user);
              modalApprovalRef.hide();

              // let code = (received.customCode ?? '');
              // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code,'Spc_CancelOrder', '', 'I').subscribe((response: any) => {
                
              //   if (response.success) {
              //     let note = (received.note ?? '');
              //     if (note !== null && note !== undefined && note !== '') {
              //       this.basketService.changeNote(note).subscribe((response) => {
      
              //       });
              //       this.alertify.success('Set note successfully completed.');
              //     }
                 
              //   }
              //   else {
              //     Swal.fire({
              //       icon: 'warning',
              //       title: 'Cancel Order',
              //       text: response.message
              //     });
              //   }
              // })
            }
  
          });
  
        }
  
      }
  
    }
   
  }
  checkCancelOrder() {
    let rs = true;
    // let storeSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
    // if (storeSetting !== null && storeSetting !== undefined && storeSetting?.length > 0) {
    //   let voidSetting = storeSetting.find(x => x.settingId === 'VoidOrder');
    //   if (voidSetting !== null && voidSetting !== undefined) {
    //     if (voidSetting.settingValue === "BeforeSyncData" && this.invoice.syncMWIStatus === 'Y') {
    //       rs = false;
    //       this.alertify.warning("The order cannot be canceled because the order has been synced with MWI.");
    //     }
    //   }
    // }

    return rs;
  }
  reasonList: MReason[];
  loadReasonList() {
    debugger;
    this.reasonService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      debugger;
      this.reasonList = response.data.filter(x => x.status === 'A' && x.type === 'Cancel');
    })
  }
  cancelAction(approvalId) {
    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      this.invoice.terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      this.invoice.terminalId = this.authService.getLocalIP();
    }
    if (this.invoice.terminalId !== null && this.invoice.terminalId !== undefined && this.invoice.terminalId !== '') {
      if (this.checkCancelOrder()) {
        if (this.reasonList !== null && this.reasonList !== undefined && this.reasonList?.length > 0) {
          let langOptions = [];
          this.reasonList.forEach(element => {
            debugger;
            if (langOptions.filter(x => x.value === element.language)?.length <= 0) {
              debugger;
              langOptions.push({ value: element.language, name: element.language })
            }

          });
          debugger;
          const initialState = {
            reasonList: this.reasonList,
            langs: langOptions
          };

          let modalRefX = this.modalService.show(ShopReasonInputComponent, {
            initialState, animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });

          modalRefX.content.outReason.subscribe((response: any) => {
            debugger;
            modalRefX.hide();
            if (response.selected) {
              debugger;
              this.invoice.isCanceled = 'C';
              this.invoice.refTransId = this.invoice.transId;
              this.invoice.transId = "";
              this.invoice.reason = response.selectedReason;
              this.invoice.totalAmount = -this.invoice.totalAmount;
              this.invoice.totalDiscountAmt = -this.invoice.totalDiscountAmt;
              this.invoice.totalPayable = -this.invoice.totalPayable;
              this.invoice.totalReceipt = -this.invoice.totalReceipt;
              this.invoice.amountChange = -this.invoice.amountChange;
              this.invoice.createdBy = this.authService.getCurrentInfor().username;
              if (approvalId !== null && approvalId !== undefined && approvalId !== '') {
                this.invoice.approvalId = approvalId;
              }
              this.invoice.lines.forEach(line => {
                line.baseLine = parseInt(line.lineId);
                line.baseTransId = this.invoice.transId;
                line.quantity = -line.quantity;
                line.lineTotal = -line.lineTotal;
              });

              this.invoice.payments.forEach(line => {
                line.totalAmt = -line.totalAmt;
                line.chargableAmount = -line.chargableAmount;
                line.collectedAmount = -line.collectedAmount;
              });
              this.invoice.lines.forEach(line => {
                let BomLine = line.lines;
                if (BomLine !== null && BomLine !== undefined && BomLine.length > 0) {
                  BomLine.forEach(lineBOM => {
                    this.invoice.lines.push(lineBOM);
                  });
                }
              });
              let storeClient = this.authService.getStoreClient();
              if(storeClient!==null && storeClient!==undefined)
              {
                this.invoice.terminalId = this.authService.getStoreClient().publicIP;
              }
              else
              {
                this.invoice.terminalId = this.authService.getLocalIP();
              }
              this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;

              if(this.invoice.terminalId!==null && this.invoice.terminalId!==undefined && this.invoice.terminalId!== '')
              {
                this.invoiceService.create(this.invoice).subscribe((response: any) => {
                  debugger;
                  if (response.success) {
                    this.invoice.transId = response.data.refTransId;
                    console.log("response.success", response.data);
                    this.alertify.success("Succcessfully");
                    // response.data.isCanceled = "Y";
                    // this.outPutModel = response.data;
                    // setTimeout(() => {
                    //   window.print();
                    // }, 1000);
                    setTimeout(() => {
                      // this.alertify.success('Cancel completed successfully. ' );
                      // window.location.reload();
                      this.router.navigate(["shop/invoices", response.message, this.invoice.companyCode, this.invoice.storeId]);
                    }, 200);
  
                  }
                  else {
                    // order.refTransId = order.transId;
                    // this.invoice.transId ='';
                    this.invoice.isCanceled = 'C';
                    this.alertify.warning(response.message);
                  }
                })
              }
              else  
              {
                Swal.fire({
                  icon: 'warning',
                  title: 'Cancel Order',
                  text: "Counter ID can't null please mapping value in Store Counter"
                });
                // this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
              }
            
            }
            else {
              modalRefX.hide();
            }
          });

        }
        else {

          Swal.fire({
            title: 'Submit your reason',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              this.invoice.isCanceled = 'C';
              this.invoice.transId = "";
              this.invoice.refTransId = this.invoice.transId;
              this.invoice.reason = result.value;
              this.invoice.totalAmount = -this.invoice.totalAmount;
              this.invoice.totalDiscountAmt = -this.invoice.totalDiscountAmt;
              this.invoice.totalPayable = -this.invoice.totalPayable;
              this.invoice.totalReceipt = -this.invoice.totalReceipt;
              this.invoice.amountChange = -this.invoice.amountChange;
              // this.invoice.terminalId = this.authService.getLocalIP();
              this.invoice.createdBy = this.authService.getCurrentInfor().username;
              this.invoice.lines.forEach(line => {
                line.baseLine = parseInt(line.lineId);
                line.baseTransId = this.invoice.transId;
                line.quantity = -line.quantity;
                line.lineTotal = -line.lineTotal;
              });

              this.invoice.payments.forEach(line => {
                line.totalAmt = -line.totalAmt;
                line.chargableAmount = -line.chargableAmount;
                line.collectedAmount = -line.collectedAmount;
              });
              this.invoice.lines.forEach(line => {
                let BomLine = line.lines;
                if (BomLine !== null && BomLine !== undefined && BomLine.length > 0) {
                  BomLine.forEach(lineBOM => {
                    this.invoice.lines.push(lineBOM);
                  });
                }
              });
              this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;
              this.invoiceService.create(this.invoice).subscribe((response: any) => {
                // debugger;
                if (response.success) {
                  // console.log("response.success", response.data);
                  this.alertify.success("Succcessfully");
                  // response.data.isCanceled = "Y";
                  // this.outPutModel = response.data;
                  // setTimeout(() => {
                  //   window.print();
                  // }, 1000);
                  setTimeout(() => {
                    // this.alertify.success('Cancel completed successfully. ' );
                    this.router.navigate(["shop/invoices", response.message, this.invoice.companyCode, this.invoice.storeId]);
                    // window.location.reload();
                  }, 200);
                
                }
                else {
                  // order.refTransId = order.transId;
                  // this.invoice.transId ='';
                  this.invoice.isCanceled = 'C';
                  this.alertify.warning(response.message);
                }
              })
            }
          })
        }

      }
    }
    else {
      this.alertify.warning("Counter ID can't null please mapping value in Store Counter");
    }
  }
  filterNotBOM(items: TInvoiceLine[] )
  {
    // debugger;
    if (items !== null && items !== undefined) {
      let rs = items.filter(x=>x.bomId==='' || x.bomId===null || x.bomId===undefined);
      return rs;
    }
    
  }
  filterBOM(items: TInvoiceLine[], itemCode, uomCode, baseLine, remark )
  {
    debugger;
    if (items !== null && items !== undefined) {
      debugger;

      let rs = items.filter(x=>x.bomId===itemCode);
     
      if(baseLine!==null && baseLine!==undefined && baseLine?.length > 0)
      {
        rs = items.filter(x=>x.bomId===itemCode && x.baseLine?.toString() === baseLine?.toString()); 
      }
      if(rs!==null && rs!==undefined && rs?.length > 0)
      {
        if(remark!==null && remark!==undefined && remark?.length > 0)
        {
          rs = items.filter(x=>x.bomId===itemCode && x.remark?.toString() === remark?.toString());
         
        }
      }
      
      return rs;
    }
  }
  filterSerial(items: TInvoiceLineSerial[], itemCode, uomCode )
  {
    // debugger;
    if (items !== null && items !== undefined) {

      let rs = items.filter(x=>x.itemCode===itemCode&&x.uomCode===uomCode);
      return rs;
    }
  }
  ngOnInit() {
    this.loadReasonList();
    this.route.data.subscribe(data => {
      this.invoice = data['invoice'].data;
    });
  
    console.log("this.invoice.detail", this.invoice);
  }
  openModal(template: TemplateRef<any>) {
    this.showModal = true;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
       
        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    });
 
  }
  openPromotionModal(template: TemplateRef<any>) {
    
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
       
        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    });

    // this.resetDiscount();
  }

 
}
