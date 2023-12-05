import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { TDeliveryHeader } from 'src/app/_models/deliveryOrder';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial } from 'src/app/_models/invoice';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { MReason } from 'src/app/_models/reason';
import { MStore } from 'src/app/_models/store';
import { ItemCheckModel, ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { DeliveryOrderService } from 'src/app/_services/data/delivery-order.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ReasonService } from 'src/app/_services/data/reason.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import Swal from 'sweetalert2';
import { ShopReasonInputComponent } from '../../tools/shop-reason-input/shop-reason-input.component';

@Component({
  selector: 'app-shop-delivery-order-detail',
  templateUrl: './shop-delivery-order-detail.component.html',
  styleUrls: ['./shop-delivery-order-detail.component.scss']
})
export class ShopDeliveryOrderDetailComponent implements OnInit {

  
  mode = "";
  modalRef: BsModalRef;
  showModal: boolean= false;
  deliveryOrder: TDeliveryHeader;
  discountModalShow: boolean = false;
  order: Order; 
  // private invoiceService: InvoiceService,
  constructor(private alertify: AlertifyService,  private reasonService: ReasonService,  private billService: BillService, private invoiceService: InvoiceService,
   private shiftService: ShiftService,   private basketService: BasketService, public commonService: CommonService,  private deliveryService: DeliveryOrderService,
   public authService: AuthService, private itemService: ItemService,  
    //  private shiftService: ShiftService, 
      
    private route: ActivatedRoute,private modalService: BsModalService, private router: Router) {
      this.deliveryOrder = new TDeliveryHeader();
      this.customizeText = this.customizeText.bind(this);
     }
     invoices: TInvoiceHeader[] = [];
    
  OpenInvoice(invoice: TInvoiceHeader)
  {
    // debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
      this.router.navigate(["shop/invoices", invoice.transId, invoice.companyCode, invoice.storeId]);
  }
  PrintInvoice(invoice)
  {
    this.router.navigate(["shop/invoices/print", invoice.transId, invoice.companyCode, invoice.storeId]);
  }
  @ViewChild('dataGrid', { static: false }) dataGrid;
  @ViewChild('gridBox') gridBox;
  @ViewChild('gridTaxBox') gridTaxBox;
  @ViewChild('gridUoMBox', { static: false }) gridUoMBox;
  @ViewChild('dropDownUoM') dropDownUoM;
  taxAmtCellValue(rowData) {

    if (rowData.quantity !== undefined && rowData.price !== undefined) {
      // debugger;
      let amount = rowData.quantity * rowData.price;
      if (amount !== null && amount !== undefined) {
        let taxpercent = rowData.taxRate;

        return amount * taxpercent / 100;
      }
    }

    return 0;
  }
  onRowPrepared(e) {

    if (e.rowType == "data" && (e.data.lines === null || e.data.lines === undefined || e.data.lines.length === 0 || e.data.lines === 'undefined')) {

      e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");
      e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");

    }
  }
  lineTotalCellValue(rowData) {

    if (rowData.quantity !== null && rowData.price !== null) {
      return rowData.quantity * rowData.price;
    }
    return 0;
  }
  gridBoxValue: string[] = [];
  customerAddress = [
  ];
  loadCustomerAddress()
  {

  }
  // getFilteredUom(options): any {
  //   // debugger;

  //   // console.log('options: ' + options);
  //   if (options !== null && options !== undefined) {
  //     if (options.data !== undefined && options.data !== null) {
  //       this.itemUomService.getByItem(this.authService.getCompanyInfor().companyCode, options.data.itemCode).subscribe((response: any) => {
  //         // debugger; 
  //         // this.itemUom = response;
  //         if (response.success) {
  //           debugger;
  //           this.itemUom = response.data;
  //         }
  //         else {
  //           this.alertifyService.error(response.message);
  //         }
  //       });
  //     }

  //   }

  //   this.uomService.getAll(this.authService.getCompanyInfor().companyCode).subscribe((response: any) => {
  //     debugger;
  //     if (response.success) {
  //       this.itemUom = response.data;
  //     }
  //     else {
  //       this.alertifyService.warning(response.message);
  //     }
  //     // return response;
  //     // this.itemUom = response;
  //   });

  // }
  // onUoMSelectionChanged(e: any, data: any) {
  //   console.log(e);
  //   debugger;
  //   if (e.selectedRowsData[0] !== null && e.selectedRowsData[0] !== undefined) {
  //     let itemCode = data.data.itemCode;
  //     let uomCode = e.selectedRowsData[0].uomCode;

  //     this.itemUomService.getByItem(this.authService.getCompanyInfor().companyCode, itemCode).subscribe((response: any) => {
  //       // this.itemUom = response;
  //       debugger;
  //       if (response.success) {
  //         debugger;
  //         this.itemUom = response.data;
  //         if (this.itemUom === null || this.itemUom === undefined) {
  //           this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', '');
  //         }
  //         else {
  //           let itemuom = this.itemUom.find(x => x.uomCode === uomCode);
  //           // debugger;
  //           if (itemuom !== null && itemuom !== undefined) {
  //             this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);

  //           }
  //           else {
  //             this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', '');
  //           }
  //         }
  //       }
  //       else {
  //         this.alertifyService.error(response.message);
  //       }
  //       //



  //     })

  //   }

  // }
  // onFromStoreChanged(store) {
     
  //   if (store !== null && store !== undefined) {
  //     this.loadStorageList(store);
  //   }
  // }
  // isDropDownBoxOpened(e, data) {
    
  //   setTimeout(() => {
  //     this.loadUomNew(data.itemCode)
  //   }, 2);
  //   return true;
  // }
  // loadUomNew(itemCode) {
  //   this.itemUomService.getByItem(this.authService.getCompanyInfor().companyCode, itemCode).subscribe((response: any) => {
      
  //     if (response.success) {
  //       debugger;
  //       this.itemUom = response.data;

  //     }
  //     else {
  //       this.alertify.error(response.message);
  //     }

  //   })
  // }
  // onSelectionChanged(e: any, data: any): void {
     
  //   console.log(e.selectedRowsData);
  //   let itemCode = e.selectedRowsData[0].itemCode;
    
  //   this.itemUomService.getByItem(this.authService.getCompanyInfor().companyCode, itemCode).subscribe((response: any) => {
    
  //     if (response.success) {
  //       debugger;
  //       this.itemUom = response.data;

  //       let price = e.selectedRowsData[0].defaultPrice;
  //       this.dataGrid.instance.cellValue(data.rowIndex, 'price', price);
  //       let uom = e.selectedRowsData[0].inventoryUom;
  //       this.dataGrid.instance.cellValue(data.rowIndex, 'uomCode', uom);
  //       let itemuom = this.itemUom.find(x => x.itemCode === itemCode && x.uomcode === uom);

  //       if (itemuom !== null && itemuom !== undefined) {
  //         this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);
  //       }
  //       let tax = e.selectedRowsData[0].grpoTaxCode;
  //       this.dataGrid.instance.cellValue(data.rowIndex, 'quantity', 1);
  //       let taxamt = 0;
  //       if (tax !== '' && tax !== undefined && tax !== null) {
  //         this.dataGrid.instance.cellValue(data.rowIndex, 'taxCode', tax);
  //         let taxvalue = this.taxList.find(x => x.taxCode === tax);
  //         if (taxvalue !== null && taxvalue !== undefined) {
  //           this.dataGrid.instance.cellValue(data.rowIndex, 'taxRate', taxvalue.taxPercent);
  //         }
  //         let taxSelected = this.taxList.filter(x => x.taxCode === tax)[0];
  //         let percent = taxSelected.taxPercent;
  //         taxamt = price * percent / 100;
  //         this.dataGrid.instance.cellValue(data.rowIndex, 'taxAmt', taxamt);
  //       }
  //       // let uom = e.selectedRowsData[0].inventoryUom;
  //       this.dataGrid.instance.cellValue(data.rowIndex, 'currencyCode', this.storeSelected.currencyCode);

  //       let linetotal = price;// + taxamt;
  //       this.dataGrid.instance.cellValue(data.rowIndex, 'lineTotal', linetotal);
  //       // setTimeout(() => {  
  //       //   this.dataGrid.instance.repaintRows([data.rowIndex]);  
  //       // }, 200);  
  //       this.gridBox.instance.close();
  //     }
  //     else {
  //       this.alertify.error(response.message);
  //     }
  //     // console.log(this.itemList);
  //     // console.log(this.itemUom);

  //   });


  // }

  backpage()
  {
    this.router.navigate(["shop/bills", this.order.transId, this.order.companyCode, this.order.storeId]);
  }


  ngAfterViewInit()
  {
    // this.invoice = new TInvoiceHeader();
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('check out boill');
        }
    });
    // paymentMenu
  
  }
  getNewCode()
  {
    this.deliveryService.getNewOrderCode(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe((data: any) => {
      console.log('Id', data);
      
      this.deliveryOrder.transId = data.message;
    }); 
    
  }
  checkLine()
  {
    this.deliveryOrder.lines.forEach(line => {
      if(line.openQty>line.quantity)
      {
        return false;
      } 
    });
    return true;
  }
  reasonList: MReason[];
  loadReasonList()
  {
    debugger;
    this.reasonService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      debugger;
      this.reasonList = response.data.filter(x=>x.status==='A' && x.type==='Checkout');
    })
  }
  saveEntity()
  {
    // debugger;
    // let basket= this.basketService.getCurrentBasket();


   

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.saveModel();
        // if(this.deliveryOrder.posType==="Event")
        // {
        //   if(!this.checkLine())
        //   {
        //     this.alertify.warning("check Open qty ");
        //   }
        //   else
        //   {
            
          
        //   }
           
        // }
        // else
        // {
        //   this.saveModel();
        // }
      }
    });
   
    
  }
  filterNotBOM(items: TInvoiceLine[] )
  {
    // debugger;
    if(items!==null&& items!==undefined)
    {
      let rs = items.filter(x=>x.bomId==='' || x.bomId===null);
      // console.log(rs);
      return rs;
    }
  
  }
  filterBOM(items: TInvoiceLine[], itemCode, uomCode )
  {
    // debugger;
    if(items!==null&& items!==undefined)
    {
      let rs = items.filter(x=>x.bomId===itemCode);
      return rs;
    }
   
  }
  filterSerial(items: TInvoiceLineSerial[], itemCode, uomCode )
  {
    if(items!==null&& items!==undefined)
    {
      let rs = items.filter(x=>x.itemCode===itemCode&&x.uomCode===uomCode);
      return rs;
    }
   
    // debugger;
  
  }
  items: ItemViewModel[]; 
  selectedCateFilter: string ="";
  merchandiseList: MMerchandiseCategory[];
  // pagination: Pagination;
  userParams: any = {};
  // @HostListener('window:beforeunload', ['$event'])
  
  isVirtualKey = false;
 
  saveModel()
  {
    if(this.reasonList!==null && this.reasonList!==undefined && this.reasonList?.length > 0)
    {
      let langOptions = [];
      this.reasonList.forEach(element => {
        debugger;
        if(langOptions.filter(x=>x.value===element.language)?.length <= 0)
        {
          debugger;
          langOptions.push({value: element.language, name: element.language})
        }
      
      });
      debugger;
      const initialState = {
        reasonList:  this.reasonList,
        langs: langOptions
    };

    let modalRefX = this.modalService.show(ShopReasonInputComponent, {initialState ,  animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false, 
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title', 
      class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'});
      
      modalRefX.content.outReason.subscribe((response: any) => {
        debugger; 
        modalRefX.hide();
          if(response.selected)
          {
            debugger;
            this.order.reason = response.selectedReason;
            this.saveAction();
            
          }
          else  
          {
            modalRefX.hide();
          }
      });

    }
    else
    {

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
          this.order.reason = result.value;
          this.saveAction();
        }
      })
    }
        

    
  }
   
  saveAction()
  {

     
        let shift = this.shiftService.getCurrentShip();
        if(shift!==null && shift!==undefined)
        {
           var invoice: any = Object.assign({}, this.deliveryOrder);
           invoice.shiftId = this.shiftService.getCurrentShip().shiftId; 
           if(invoice.cusAddress!==null && invoice.cusAddress!==undefined && invoice.cusAddress?.length > 0)
           {
            if(invoice?.luckyNo===null || invoice?.luckyNo===undefined || invoice?.luckyNo?.length === 0  )
            {
              Swal.fire({
                title: 'Mã vận đơn',
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off', 
                },
                showCancelButton: true,
                confirmButtonText: 'Look up',
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                if (result.isConfirmed) {
                  let valRs = result.value;
                  if(valRs!==null && valRs!==undefined && valRs?.length === 0  )
                  {

                    invoice.lines = this.deliveryOrder.lines.filter(x=>x.quantity !== 0);
                    invoice.luckyNo = valRs;
                    if( invoice.lines!==undefined && invoice.lines!==null &&  invoice.lines?.length > 0)
                    {
                         
                        invoice.payments=[];
                        console.log(invoice.lines);
                        
                        invoice.createdBy = this.authService.getCurrentInfor().username;
                          invoice.status = 'C';
                        this.deliveryService.create(invoice).subscribe((response:any)=>{
                          if(response.success)
                          {
                    
                            this.alertify.success('Check In completed successfully. ' + response.message);
                          
                            this.router.navigate(["shop/invoices", response.message, this.deliveryOrder.companyCode, this.deliveryOrder.storeId]);
                          }
                          else
                          {
                          this.alertify.warning('Check In failed. Message: ' + response.message);
                          }
                        });
                    }
                    else
                    {
                      this.alertify.warning('Please input number check out');
                    }
                  }
                  else
                  {
                    Swal.fire({
                      icon: 'info',
                      title: 'Mã vận đơn',
                      text: "Vui lòng nhập mã vận đơn!"
                    });
                  }
                }
              })



            }
            else
            {
                //  invoice.invoiceType = "Deliver";
                invoice.lines = this.deliveryOrder.lines.filter(x=>x.quantity !== 0);
                  
                if( invoice.lines!==undefined && invoice.lines!==null &&  invoice.lines?.length > 0)
                {
                    
                    
                  // invoice.lines.forEach(line => {
                  // debugger;
                  //   line.openQty = line.openQty - line.quantity;
                  //   line.quantity = line.quantity;
                  //   if(line.serialLines!==null && line.serialLines!==undefined)
                  //   {
                  //     line.serialLines.forEach(serialLine => {
                  //       debugger;
                  //       serialLine.openQty = serialLine.openQty - serialLine.quantity;
                        
                  //     });
                  //   }
                  
                  // });
                    invoice.payments=[];
                  console.log(invoice.lines);
                  // invoice.invoiceType = "CheckOut";
                  invoice.createdBy = this.authService.getCurrentInfor().username;
                    invoice.status = 'C';
                  this.deliveryService.create(invoice).subscribe((response:any)=>{
                    if(response.success)
                    {

                      this.alertify.success('Check In completed successfully. ' + response.message);
                    
                      this.router.navigate(["shop/invoices", response.message, this.deliveryOrder.companyCode, this.deliveryOrder.storeId]);
                    }
                    else
                    {
                    this.alertify.warning('Check In failed. Message: ' + response.message);
                    }
                  });
                }
                else
                {
                  this.alertify.warning('Please input number check out');
                }
            }
          
           }
           else
           {
              Swal.fire({
                icon: 'info',
                title: 'Address',
                text: "Vui lòng nhập địa chỉ giao hàng!"
              });
           }
           
        }
        else
        {
          this.alertify.warning('Not in shift');
        }
       
  }
  onSerialBlurMethod(item, serialItem, value)
  {
    // debugger;
    console.log("onSerialBlurMethod");
    if(value===null || value===undefined || value.toString()=="undefined" || value.toString()=="")
    {
      value=0;
    }
     let itemX = item.serialLines.find(x=>x.serialNum === serialItem.serialNum);
     itemX.quantity= value;
    let qty= item.serialLines.reduce((a, b) => parseInt(b.quantity)   + a, 0);
    item.quantity= qty;
  }
  VirtualKey$: Observable<boolean>;
  storeSelected: MStore;
  storeIdX ="";companyX="";  
  dateFormat = "";
  priceColumn_customizeText(cellInfo) {
    // debugger;
    return cellInfo.value + "$";
  }

  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  ngOnInit() {

    
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected= this.authService.storeSelected();
   
    this.route.params.subscribe(data => {
      this.orderId = data['id'];
      this.mode = data['m'];
      this.companyX = data['companycode'];
      this.storeIdX = data['storeid']; 
    })
    this.loadOrder();
   
    console.log("deliveryOrder",this.deliveryOrder);

     
    this.loadReasonList();
    // console.log(this.invoice.lines);
    // this.loadCheckedListByDate();
  }
  onBlurMethod(item) {
    debugger;
    if (item.quantity <= 0 || item.quantity === null || item.quantity === undefined || item.quantity.toString() === "") {
      item.quantity = 0;
    }
     
    this.deliveryOrder.lines.filter(x=>x.bomId === item?.itemCode).map(x=>x.quantity = item.quantity * x.orgQty);
    
    // if (item.quantity > item.openQty) {
    //   item.quantity = item.openQty;
    //   this.alertify.warning("Return number can't more than open qty");
    // }
    // this.basketService.updateItemQtyWPromotion(item);
  }
  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["shop/bills/delivery-print",  data.transId, data.companyCode, data.storeId]);
    // this.router.navigate(["admin/grpo/print", data.purchaseId]).then(() => {
    //   // window.location.reload();
    // });
  }
  loadOrder()
  {
    if(this.mode==='edit')
    {
      this.deliveryService.getBill(this.orderId, this.companyX, this.storeIdX).subscribe((response: any)=>{
        if(response.success)
        {
          this.deliveryOrder = response.data;
        }
        else
        {
          this.alertify.warning(response.message);
        }
      })
    }
    else
    {
      this.billService.getCheckOutById(this.orderId, this.companyX, this.storeIdX).subscribe((response: any)=>{
        if(response.success)
        {
          debugger;
          if(response.data!==null && response.data!==undefined)
          {
            this.order = response.data;
            console.log('order', this.order);
  
            this.deliveryOrder =  this.deliveryService.mapSO2DO(this.order);
  
            let storeSelected = this.authService.storeSelected();
            let items:ItemCheckModel[] = [];
            // console.log(this.deliveryOrder);
            this.getNewCode();
            this.deliveryOrder.createdOn = new Date();
  
            // this.itemService.GetItemFilterByList(storeSelected.companyCode, storeSelected.storeId, '','', items).subscribe((response: any) =>{
            //   if(response.success)
            //   {
            //     if(response.data!==null && response.data!== undefined && response.data?.length > 0)
            //     {
  
            //     }
            //     else
            //     {
            //       Swal.fire({
            //         icon: 'warning',
            //         title: 'Item Data',
            //         text: response.message
            //       }).then(() => {
                     
            //       });
            //     }
            //   }
            //   else
            //   {
            //     Swal.fire({
            //       icon: 'warning',
            //       title: 'Item Data',
            //       text: response.message
            //     }).then(() => {
                   
            //     });
            //   }
            // }, error=>{
            //   Swal.fire({
            //     icon: 'error',
            //     title: 'Item Data',
            //     text: 'Get Item Data Failed'
            //   }).then(() => {
                 
            //   });
            // })
           
          }
          else
          {
            this.alertify.warning("Can't found data");
           
          }
        }
        else
        {
          this.alertify.warning(response.message);
        }
        
       
  
      })
    }
  
  }
  orderId="";


  @ViewChild('ManualPromotion' , { static: false}) ManualPromotion;  
  @ViewChild('template' , { static: false}) template;  
  checkOutAction(result: any)
  {
    // debugger;
    if(result==="ShowPayment")
    {
      this.modalRef = this.modalService.show(this.template);
    }
    if(result==="CheckOut")
    {
       this.saveEntity();
    }
    if(result==="ShowDiscount")
    {
      this.modalRef = this.modalService.show(this.ManualPromotion);
    }
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
  // openCheckedModal(template: TemplateRef<any>) {
  //   this.loadCheckedListByDate();
  //   setTimeout(() => {
  //     this.modalRef = this.modalService.show(template, {
  //       ariaDescribedby: 'my-modal-description',
  //       ariaLabelledBy: 'my-modal-title',
       
  //       class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
  //     });
  //   });
 
  // }
  
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
  paymentCheckout()
  {
    debugger;
    this.router.navigate(["shop/bills/checkout-payment", this.order.transId, this.order.contractNo, this.order.companyCode, this.order.storeId]).then( ()=>{
        location.reload();
    });
  }


}
