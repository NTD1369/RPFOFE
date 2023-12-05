import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Image } from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebcamImage } from 'ngx-webcam';
import { error } from 'protractor';
import { Observable, Subject, timer } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { MCustomer } from 'src/app/_models/customer';
import { TInvoiceHeader, TInvoiceLine, TInvoiceLineSerial } from 'src/app/_models/invoice';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { OrderLogModel } from 'src/app/_models/orderlogModel';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service'; 
import { BillService } from 'src/app/_services/data/bill.service';
import { BomService } from 'src/app/_services/data/bom.service';
import { ImageService } from 'src/app/_services/data/image.service';
import { ItemService } from 'src/app/_services/data/item.service'; 
import { ShiftService } from 'src/app/_services/data/shift.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service'; 
import { InvoiceService } from 'src/app/_services/transaction/invoice.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EnvService } from 'src/app/env.service';
import { DxTextBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'app-shop-checkin-voucher',
  templateUrl: './shop-checkin-voucher.component.html',
  styleUrls: ['./shop-checkin-voucher.component.scss']
})
export class ShopCheckinVoucherComponent implements OnInit {
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  triggerSnapshot(): void {
    this.trigger.next();
    this.openCamera = false;
  }
  removeSnapshot() {
    this.openCamera = true;
    this.webcamImage = null;
  }
  saveSnapshot(customerName) {
    this.invoice.image = this.webcamImage.imageAsDataUrl.toString();
    debugger;

    this.invoice.companyCode = this.storeSelected.companyCode;
    this.invoice.createdBy = this.authService.getCurrentInfor().username;
    this.invoice.storeId = this.storeSelected.storeId;
    this.invoice.storeName = this.storeSelected.storeName;
    this.invoice.salesMode = 'SALES';
    this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;
    this.invoice.invoiceType = "CheckIn";
    this.invoice.posType = 'R';
    this.invoice.salesType = 'Voucher';
    if (this.webcamImage !== null && this.webcamImage !== undefined) {
      this.invoice.image = this.webcamImage.imageAsBase64;
    }
   
    debugger;
    this.invoice.cusId = this.customerInvoice.id;
    this.invoice.cusAddress = this.customerInvoice.address;
    this.invoice.phone = this.customerInvoice.mobile;
    let name = "";
    // if (this.customerInvoice.first_name !== null && this.customerInvoice.first_name !== undefined) {
    //   name += this.customerInvoice.first_name;
    // }
    // if (this.customerInvoice.last_name !== null && this.customerInvoice.last_name !== undefined) {
    //   name += " " + this.customerInvoice.first_name;
    // }
    name = customerName;
    this.invoice.cusName = name;

    this.invoiceService.saveImage(this.invoice).subscribe((response: any) => {
      if (response.success) {
        this.alertify.success('Save Image successfully. '); 
        this.openCamera = false;
        this.webcamImage = null;
        this.loadImage(this.invoice.phone);
      }
      else {
        this.alertify.warning('Save Image failed. Message: ' + response.message);
      }
    });
  }
  handleImage(webcamImage: WebcamImage): void {
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  modalRef: BsModalRef;
  showModal: boolean = false;
  invoice: TInvoiceHeader;
  discountModalShow: boolean = false;
  order: Order;
  constructor(public gallery: Gallery,  private http: HttpClient, private spinnerService: NgxSpinnerService, public lightbox: Lightbox, private sanitizer: DomSanitizer, 
    private imageService: ImageService, private alertify: AlertifyService, private itemService: ItemService, private bomService: BomService,
    private mwiService: MwiService, private invoiceService: InvoiceService,  private salesService: BillService,  public env: EnvService , 
    private shiftService: ShiftService, private basketService: BasketService, public commonService: CommonService,  
    private authService: AuthService,
    //  private shiftService: ShiftService, 

    private route: ActivatedRoute, private modalService: BsModalService, private router: Router) {
    this.invoice = new TInvoiceHeader();
  }

  
  ngAfterViewInit() {
    this.invoice = new TInvoiceHeader();
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function (item) {
      // Do stuff here
      if (item !== null && item !== undefined) {
        item.classList.add('hide');
        // console.log('check in voucher');
      }
    });
    // paymentMenu
    setTimeout(() => { 
      let defaultCust = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CRMSystem');
      if(defaultCust!==null && defaultCust!==undefined)
      {

        this.txtFilterData.value = defaultCust?.defaultValue??'';
        if(this.txtFilterData.value!==undefined && this.txtFilterData.value!==null && this.txtFilterData.value?.length > 0)
        {
          let defCustomer = this.authService.getDefaultCustomer();
          if(defCustomer?.phone??defCustomer?.mobile === this.txtFilterData.value)
          {
            this.customerInvoice = defCustomer;
          }
        }
       
      }
      
    }, 100);
  }
  imageList: Image[];
  imageSource: any[];

  imageGallery: GalleryItem[];

  // imageData=[];
  loadImage(phone) {
    this.imageService.getImage(this.authService.getCurrentInfor().companyCode, '', '', phone).subscribe((response: any) => {

      debugger;
      // let image = 'data:image/png;base64,' + response[2].image;
      response.forEach(item => {
        item.image = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${item.image}`);
        //  let img= new Image();
        //  img.base
        //  this.imageList.push(item.)
      });
      // this.imageList = response;
      this.imageSource = response;
      this.createGalary();
      // const objectURL = URL.createObjectURL(this.convertDataUrlToBlob(response[0].image));
      // console.log(image);
    });
  }
  getNewCode() {
    this.invoiceService.getNewOrderCode(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).subscribe(data => {
      console.log(data);
      this.invoice.transId = data;

    });
    // this.invoiceService.getNewOrderCode(this.invoice.companyCode, this.invoice.storeId).subscribe((response: any)=>{
    //   debugger;
    //    this.invoice.transId = response;

    // }); 
  }
  
  // @ViewChild(DxTextBoxComponent)  : DxTextBoxComponent;  
  @ViewChild('txtVoucher', { static: false }) txtVoucher: DxTextBoxComponent;
  @ViewChild('txtFilterData', { static: false }) txtFilterData: DxTextBoxComponent;
  convertDataUrlToBlob(dataUrl): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
  checkLine() {
    this.invoice.lines.forEach(line => {
      if (line.openQty > line.quantity) {
        return false;
      }
    });
    return true;
  }
  saveEntity() {
    debugger;
    if (this.invoice.posType === "Event") {
      if (!this.checkLine()) {
        this.alertify.warning("check Open qty ");
      }
      else {
        this.saveModel();

      }

    }
    else {
      this.saveModel();
    }
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Do you want to save!',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No'
    // }).then((result) => {
    //   if (result.value) {
    //     // let basket= this.basketService.getCurrentBasket();
       
    //   }
    // })
    

  }
  filterNotBOM(items: TInvoiceLine[]) {
   
    if (items !== null && items !== undefined && items?.length > 0) {
      // debugger;
      let rs = items.filter(x => x.bomId === '' || x.bomId === null || x.bomId === undefined);
      // console.log(rs);
      return rs;
    }

  }
  filterBOM(items: TInvoiceLine[], itemCode, uomCode, baseLine) {
    debugger;
    if (items !== null && items !== undefined  && items?.length > 0) {
      if(baseLine !== null && baseLine !== undefined  && baseLine?.length > 0)
      {
        let rs = items.filter(x => x.bomId === itemCode && x.baseLine?.toString() === baseLine);
        return rs;
      }
      else
      {
        let rs = items.filter(x => x.bomId === itemCode );
        return rs;
      }
     
    }

  }
  filterSerial(items: TInvoiceLineSerial[], itemCode, uomCode) {
    if (items !== null && items !== undefined && items?.length > 0) {
      let rs = items.filter(x => x.itemCode === itemCode && x.uomCode === uomCode);
      return rs;
    }

    // debugger;

  }
  items: ItemViewModel[];
  selectedCateFilter: string = "";
  merchandiseList: MMerchandiseCategory[];
  // pagination: Pagination;
  userParams: any = {};
  // @HostListener('window:beforeunload', ['$event'])
  slideFilterConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 3,
    "rows": 1,
    // "prevArrow": '<button type="button" id="scrollLeft" class="scroll-btn"> <span class="arrow arrow-left"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="17.085" viewBox="0 0 10 17.085"> <g id="surface1" opacity="0.9"> <path class="arrow-icon" id="Path_10" data-name="Path 10" d="M25.437,8.246,26.895,9.7l-7.1,7.087,7.1,7.1-1.441,1.439L17.63,17.508l-.736-.72.736-.72Z" transform="translate(-16.895 -8.246)" /> </g> </svg> </span> </button>',
    // "nextArrow": '<button type="button" id="scrollRight" class="scroll-btn"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="17.085" viewBox="0 0 10 17.085"> <g id="surface1" opacity="0.9"><path class="arrow-icon" id="Path_10" data-name="Path 10" d="M25.437,8.246,26.895,9.7l-7.1,7.087,7.1,7.1-1.441,1.439L17.63,17.508l-.736-.72.736-.72Z" transform="translate(-16.895 -8.246)"/></g></svg></button>',
    dots: false,
    "infinite": false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1430,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },]
  };
  isVirtualKey = false;
  onddlTypeChanged (e) {
    const previousValue = e.previousValue;
    const newValue = e.value;
    if(newValue === 'phone')
    {
      setTimeout(() => { 
        let defaultCust = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'CRMSystem');
        if(defaultCust!==null && defaultCust!==undefined)
        {
  
          this.txtFilterData.value = defaultCust?.defaultValue??'';

        }
        
      }, 100);
      // this.txtFilterData.value = "";
    }
    else
    {
      setTimeout(() => {
        this.txtFilterData.value = "";
        this.txtFilterData.instance.focus();
      }, 100);
    
    }
    // Event handling commands go here
}
 
isCreating = false;
  saveModel() {
    if(this.isCreating)
    {
      Swal.fire('Save Bill', "Bill In Process, Please wait to complete data", 'info');
    }
    else
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save bill!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.invoice.transId = '';
          this.invoice.companyCode = this.storeSelected.companyCode;
          this.invoice.createdBy = this.authService.getCurrentInfor().username;
          this.invoice.storeId = this.storeSelected.storeId;
          this.invoice.storeName = this.storeSelected.storeName;
          this.invoice.salesMode = 'SALES';
          this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;
          this.invoice.invoiceType = "CheckIn";
          this.invoice.posType = 'R';
          this.invoice.salesType = 'Voucher';
          if (this.webcamImage !== null && this.webcamImage !== undefined) {
            this.invoice.image = this.webcamImage.imageAsBase64;
          }
         
          debugger;
          this.invoice.cusId = this.customerInvoice.id;
          this.invoice.cusAddress = this.customerInvoice.address;
          this.invoice.phone = this.customerInvoice.mobile;
          let name = "";
          if (this.customerInvoice.first_name !== null && this.customerInvoice.first_name !== undefined) {
            name += this.customerInvoice.first_name;
          }
          if (this.customerInvoice.last_name !== null && this.customerInvoice.last_name !== undefined) {
            name += " " + this.customerInvoice.first_name;
          }
          this.invoice.cusName = name;
          
          let invoiceLines = this.invoice.lines.filter(x=> x.bomId === '' || x.bomId === null || x.bomId === undefined);
          
          if(invoiceLines?.length > 0)
          {
             
            let countList: CountVoucherModel[] = [];
            invoiceLines.forEach(invoiceLine => {
              let checkVoucherincountList = countList.filter(x=>x.voucher === invoiceLine.remark);
              if(checkVoucherincountList!==null && checkVoucherincountList!==undefined && checkVoucherincountList?.length > 0)
              {
                 let firstModel = checkVoucherincountList[0];
                 firstModel.numOfcount = (firstModel.numOfcount + 1);
              }
              else
              {
                let newCount: CountVoucherModel = { voucher: invoiceLine.remark, numOfcount : 1, maxRedeem:(invoiceLine?.max_redemption??1)}; 
                countList.push(newCount);
              }
            });
            if(countList?.length > 0)
            {
               let voucherMultiRow = countList.filter(x=>x.numOfcount > x.maxRedeem);
               if(voucherMultiRow?.length > 0)
               {
                  let firstRow = voucherMultiRow[0];
                  Swal.fire('Check In ',"Can't redeem voucher " + firstRow.voucher + " b/c max redeem: " + firstRow.maxRedeem ,'error');
               }
               else
               {
                 this.createInvoice();
               }
            }
            else
            {
              this.createInvoice();
            }
          }
          else
          {
            this.createInvoice();
          }
       
        }
        else
        {

        }
      });
  
    }
   


  }
  createInvoice()
  {
    this.isCreating = true;
    this.clickStream.pipe(debounceTime(1000)).pipe( e => this.invoiceService.create(this.invoice)).subscribe((response: any) => {
      this.isCreating = false;
      if (response.success) {
          this.alertify.success('Check In completed successfully. ' + response.message);
          // Đóng chổ này
          this.redeeemVoucher(this.invoice.cusId, this.invoice.lines, response.message); 
        }
        else {
          // this.alertify.warning('Check In failed. Message: ' + response.message);
          Swal.fire('Check In','Check In failed. Message: ' + response.message,'warning');

        }
      }, error => {
        console.log('errorResponse',error);
        this.isCreating = false;
        Swal.fire('Check In',"Can't connect to system",'error');
        // this.alertify.warning('Check In failed. Message: ' + error);
      });
     
  }
  cusId = '';
  waitToReddem =false;
  private clickStream = new Subject();
  writeLog(transactionId, lines)
  {
    const order = new Order();
    order.logs = [];//this.authService.getOrderLog();
    order.transId = transactionId;  
    order.orderId =  uuidv4(); 
    let storeClient = this.authService.getStoreClient();
    if(storeClient!==null && storeClient!==undefined)
    {
      order.terminalId = this.authService.getStoreClient().publicIP;
    }
    else
    {
      order.terminalId = this.authService.getLocalIP();
    } 
    order.storeId = this.authService.storeSelected().storeId;
    order.companyCode = this.authService.getCurrentInfor().companyCode;

    var items = lines;  
    var newArray = [];
    order.createdBy = this.authService.getCurrentInfor().username;
    order.logs = lines;
    // items.forEach(val => newArray.push(Object.assign({}, val))); 
    // if(lines!==null && lines!==undefined && lines?.length > 0)
    // {
    //   lines.forEach((item) => {
        
    //     let logItem= new OrderLogModel();
    //     logItem.type = "RedeemVoucher";
    //     logItem.action = "Request";
    //     logItem.result = ""; 
    //     logItem.value = "";
    //     logItem.customF1 = item?.id;
    //     logItem.customF2 = item?.uom;
    //     logItem.customF3 = (item?.barCode ?? item?.barcode) ?? "";
    //     logItem.customF4 = (item?.price?.toString()??"").toString() ;
    //     logItem.customF5 =  (item?.lineTotal?.toString()??"").toString();
    //     logItem.customF6 =  (item?.quantity?.toString()??"").toString();
    //     logItem.customF7 =  (userApproval??"").toString();
    //     logItem.customF8 =  (note?.toString()??"").toString();
    //     logItem.createdBy = this.getCurrentInfor().username;
    //     logItem.storeId = this.storeSelected().storeId;
    //     logItem.companyCode = this.getCurrentInfor().companyCode;
        
    //     logItem.time = new Date();
    //     order.logs.push(logItem);
  
    //   });
    // }
    this.clickStream.pipe(debounceTime(500)).pipe( e => this.http.post(this.baseUrl + 'Sale/WriteLogRemoveBasket', order))
    .subscribe(response=> {
      // this.orderCached.next("");
      Swal.fire('Redeem Voucher Log',"Successfully completed.",'success').then(()=>{
        setTimeout(() => {
          this.router.navigate(["shop/invoices", transactionId, this.invoice.companyCode, this.invoice.storeId]); 
        }, 1000);
      })
     
      // this.alertify.success("Successfully completed.");
    },error =>{
      Swal.fire('Redeem Voucher Log',"Failed to log.",'error').then(()=>{
        setTimeout(() => {
          this.router.navigate(["shop/invoices", transactionId, this.invoice.companyCode, this.invoice.storeId]); 
        }, 1000);
      })
    });


  }
  
  redeeemVoucher(cusId, lines, transactionId) {
    let numOffRedeem = 0
    this.waitToReddem= true;
    let logs: any = [];
    let redeemList = lines.filter(x=> x.remark !== null &&  x.remark !== undefined &&  x.remark?.length > 0)
    if(redeemList!==null && redeemList!==undefined && redeemList?.length>0)
    {
       redeemList = redeemList.filter(x=> x.bomId === '' || x.bomId === null || x.bomId === undefined);
      // .lines.filter(x=> x.bomId === '' || x.bomId === null || x.bomId === undefined);
    } 
    if(redeemList!==null && redeemList!==undefined && redeemList?.length>0)
    {
      redeemList.forEach(element => {
        debugger;
        let logItem= new OrderLogModel();
        logItem.type = "RedeemVoucher";
        logItem.action = "Request";
        logItem.result = ""; 
        logItem.value = (element.remark??element.remark) ?? "";
        logItem.customF1 = transactionId ;
        logItem.customF2 = (this.storeSelected.storeId??this.storeSelected.storeId) ?? "";
        logItem.customF3 = (cusId?.toString()??"").toString() ;
        
        logItem.createdBy = this.authService.getCurrentInfor().username;
        logItem.storeId = this.authService.storeSelected().storeId;
        logItem.companyCode = this.authService.getCurrentInfor().companyCode; 
        logItem.time = new Date();
        logs.push(logItem);
        let createdBy= this.authService.getCurrentInfor().username;
        let voucherName = "";
        let cusPhone ="";
        let cusName ="";

        this.mwiService.redeemVoucher(cusId, element.remark, this.storeSelected.storeId, transactionId, createdBy, voucherName, cusPhone, cusName).subscribe(async (response: any) => {
          numOffRedeem++;
          console.log('response redeem', response);
          if (response.status === 1) { 
            await timer(1000).pipe(take(1)).toPromise();
            debugger;
            let logItem= new OrderLogModel();
            logItem.type = "RedeemVoucher";
            logItem.action = "Redeem";
            logItem.result = "Success"; 
            logItem.value = (element.remark??element.remark) ?? "";
            logItem.customF1 = transactionId ;
            logItem.customF2 = (this.storeSelected.storeId??this.storeSelected.storeId) ?? "";
            logItem.customF3 = (cusId?.toString()??"").toString() ;
            logItem.customF4 = "CheckByVoucher"; 
            // logItem.customF4 = 
            
            logItem.createdBy = this.authService.getCurrentInfor().username;
            logItem.storeId = this.authService.storeSelected().storeId;
            logItem.companyCode = this.authService.getCurrentInfor().companyCode; 
            logItem.time = new Date();
            logs.push(logItem);
    
          }
          else
          {
            let message = response.msg??response.message;
            await timer(1000).pipe(take(1)).toPromise();
            debugger;
            let logItem= new OrderLogModel();
            logItem.type = "RedeemVoucher";
            logItem.action = "Redeem";
            logItem.result = "Failed"; 
            logItem.value = (element.remark??element.remark) ?? "";
            logItem.customF1 = transactionId ;
            logItem.customF2 = (this.storeSelected.storeId??this.storeSelected.storeId) ?? "";
            logItem.customF3 = (cusId?.toString()??"").toString() ;
            logItem.customF4 = "CheckByVoucher"; 
            logItem.customF5 = message?? "";

            // logItem.customF4 = 
            
            logItem.createdBy = this.authService.getCurrentInfor().username;
            logItem.storeId = this.authService.storeSelected().storeId;
            logItem.companyCode = this.authService.getCurrentInfor().companyCode; 
            logItem.time = new Date();
            logs.push(logItem);
    
          }
         
          if(numOffRedeem === lines?.length)
          {
            debugger;
            this.waitToReddem= false;
  
            this.writeLog(transactionId, logs);
           
          }
         
        },error =>{
          numOffRedeem++;
          let logItem= new OrderLogModel();
          logItem.type = "RedeemVoucher";
          logItem.action = "Redeem";
          logItem.result = "Failed"; 
          logItem.value = (element.remark??element.remark) ?? "";
          logItem.customF1 = transactionId ;
          logItem.customF2 = (this.storeSelected.storeId??this.storeSelected.storeId) ?? "";
          logItem.customF3 = (cusId?.toString()??"").toString() ;
          logItem.customF4 = "CheckByVoucher";  
          logItem.customF5 = (error?.toString()??"").toString() ;
          // logItem.customF4 = 
          
          logItem.createdBy = this.authService.getCurrentInfor().username;
          logItem.storeId = this.authService.storeSelected().storeId;
          logItem.companyCode = this.authService.getCurrentInfor().companyCode; 
          logItem.time = new Date();
          logs.push(logItem);
  
          if(numOffRedeem === lines?.length)
          {
            debugger;
            this.waitToReddem= false; 
            this.writeLog(transactionId, logs);
           
          }
        });
        
      });
    }
    
   
  }
  onSerialBlurMethod(item, serialItem, value) {
    // debugger;
    console.log("onSerialBlurMethod");
    if (value === null || value === undefined || value.toString() == "undefined" || value.toString() == "") {
      value = 0;
    }
    let itemX = item.serialLines.find(x => x.serialNum === serialItem.serialNum);
    itemX.quantity = value;
    let qty = item.serialLines.reduce((a, b) => parseInt(b.quantity) + a, 0);
    item.quantity = qty;

  }
  VirtualKey$: Observable<boolean>;
  storeSelected: MStore;
  ngOnInit() {
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.storeSelected = this.authService.storeSelected();

    // this.route.data.subscribe(data => {
    //   this.order = data['order'];
    // });

    
    this.getNewCode();
    let date = new Date();
    this.invoice.createdOn = date;




  }
  openCamera = false;
  toggleCamera() {
    this.openCamera = !this.openCamera;
  }
  createGalary() {
    debugger;
    /** Basic Gallery Example */

    // Creat gallery items
    // this.imageGallery = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));
    this.imageGallery = this.imageSource.map(item => new ImageItem({ src: item.image, thumb: item.image }));

    /** Lightbox Example */

    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,


    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.imageGallery);
  }
  lineNo = 1;
  customerInvoice: MCustomer;
  isMC= false;
  redeemVoucher = false;
  redeemMessage = "";
  NewcheckIn()
  {
    window.location.reload();
  }
  simpleProducts=[{
    value: 'phone', name:'Customer Phone'
  },
  {
    value: 'serial', name:'Member Id'
  }]

  
  redeemVoucherMember(voucher)
  {
    debugger;
    this.serialMemberList = [];
    this.waitToReddem = true;
    this.redeemVoucher = false;
    // if(this.customerInvoice!==null && this.customerInvoice!==undefined &&  (voucher.customerId === null ||  voucher.customerId ===undefined ||  voucher.customerId===''))
    // {
    //   voucher.customerId = this.customerInvoice.id;
    // }
    // if(voucher.customerId!==null && voucher.customerId!==undefined && voucher.customerId!=='')
    // {
    //   if(voucher===null || voucher ===undefined)
    //   {
    //     voucher = this.voucherMember;
    //   }
    //   if(voucher.voucher_code ===undefined || voucher.voucher_code === null || voucher.voucher_code ==='')
    //   {
    //     voucher.voucher_code = voucher?.vouchercode;
    //   }
   
    if(voucher?.voucher_name === undefined || voucher?.voucher_name === null || voucher?.voucher_name ==='')
    {
      voucher.voucher_name = voucher?.vouchername;
    }
    let vouchername = voucher.voucher_name??'';
    let createdBy = this.authService.getCurrentInfor().username;
      this.mwiService.redeemVoucher(voucher.customerId, voucher.voucher_code??voucher.vouchercode, this.storeSelected.storeId, '', createdBy,vouchername , voucher?.phone?.toString()??"", voucher?.cusName?.toString()??"").subscribe((response: any) => {
        console.log(response);
        debugger;
        this.waitToReddem = false;
        this.redeemVoucher=true;
        
        if (response.status === 1) { 
         
          let msg= "Redeem voucher " + voucher.voucher_code   + ": " + voucher.voucher_name  + " sucessfully.";
          this.redeemMessage = msg;
          this.alertify.success(msg);
          this.voucherMember = null;
          
          
        
        
          // this.invoiceService.create(this.invoice).subscribe((response: any) => {
          //   if (response.success) {
          //     this.alertify.success('Check In completed successfully. ' + response.message); 
          //   }
          //   else {
            
          //     Swal.fire({
          //       icon: 'warning',
          //       title: "Create AR Check In" ,
          //       text: response.message
          //     });
          //   }
          // }, error =>{
          //   Swal.fire({
          //     icon: 'error',
          //     title: "Create AR Check In" ,
          //     text: error
          //   });
            
          // });
    
        }
        else {
          
          this.redeemMessage = response.msg;
          // this.alertify.warning(response.msg);
          Swal.fire({
            icon: 'warning',
            title: "Redeem Voucher(OMS)" ,
            text: response.msg
          });
        }
        this.basketService.writeLogRedeem(voucher.customerId?.toString(), voucher.voucher_code?.toString(), voucher.voucher_name?.toString(), this.authService.storeSelected().storeId, response?.status?.toString(), response?.msg?.toString()??"", voucher.phone?.toString()??"", voucher.cusName?.toString()??"");
      }, error =>{
        this.waitToReddem = false;
        this.redeemVoucher=true;
        this.redeemMessage = "Unable Connect OMS";
        Swal.fire({
          icon: 'error',
          title: "Redeem Voucher(OMS)" ,
          text: error
        });
        this.basketService.writeLogRedeem(voucher.customerId?.toString(), voucher.voucher_code?.toString(), voucher.voucher_name?.toString(),
         this.authService.storeSelected().storeId,  "Failed", "Unable Connect OMS", voucher.phone?.toString()??"", voucher.cusName?.toString()??"");
      })
      // let twoChar = voucher.discount_code.substring(0, 2);
             
      // if (twoChar === "PR" || twoChar === "PI" || voucher.discount_code === "xyz_123") {
      //   // this.alertify.warning("Voucher cannot be used to check in. Please check your voucher.");
      //   Swal.fire({
      //     icon: 'warning',
      //     title: "Member/Class Check In" ,
      //     text: 'Voucher cannot be used to check in. Please check your voucher'
      //   });
      // }
      // else {
      //   if (twoChar === "BL") {
      //     this.ShowAllItemByVoucher(voucher, this.itemTemplate);
         
      //   }
      //   else
      //   {
      //     setTimeout(() => {
      //       if (voucher.discount_code === 'MC') {
        
      //       }
      //       else 
      //       { 
      //           this.invoice = new TInvoiceHeader();
      //           this.invoice.lines = [];
      //           this.invoice.companyCode = this.storeSelected.companyCode;
      //           this.invoice.createdBy = this.authService.getCurrentInfor().username;
      //           this.invoice.storeId = this.storeSelected.storeId;
      //           this.invoice.storeName = this.storeSelected.storeName;
      //           this.invoice.salesMode = 'SALES';
      //           this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;
      //           this.invoice.invoiceType = "CheckIn";
      //           this.invoice.posType = 'R';
      //           this.invoice.salesType = 'Voucher';
      //           if (this.webcamImage !== null && this.webcamImage !== undefined) {
      //             this.invoice.image = this.webcamImage.imageAsBase64;
      //           } 
      //           this.invoice.cusId = this.customerInvoice.id;
      //           this.invoice.cusAddress = this.customerInvoice.address;
      //           this.invoice.phone = this.customerInvoice.mobile;
      //           let name = "";
      //           if (this.customerInvoice.first_name !== null && this.customerInvoice.first_name !== undefined) {
      //             name += this.customerInvoice.first_name;
      //           }
      //           if (this.customerInvoice.last_name !== null && this.customerInvoice.last_name !== undefined) {
      //             name += " " + this.customerInvoice.first_name;
      //           }
      //           this.invoice.cusName = name;
      
      
      //           let item = voucher.discount_code.split('_');
      //           let itemcode = item[0];
      //           let uomCode = item[1];
      
      //           let voucherInList = this.invoice.lines.filter(x=>x.remark === voucher.voucher_code);
      //           let canAdd = true;
      //           if(voucherInList?.length > 0)
      //           {
      //             let totalQty = 0;
      //             let maxRedeem = voucherInList[0].max_redemption;
      //             voucherInList.forEach(element => {
      //               totalQty++;
      //             });
      //             if(totalQty >= maxRedeem)
      //             {
      //               canAdd = false;
                    
      //               this.alertify.warning("Can't add voucher. Max redeem: " + maxRedeem);
      //             }
      //           }
      //           // if(canAdd)
      //           // {
                
      //           //     let invoiceLine = new TInvoiceLine();
       
      //           //     invoiceLine.lineId = this.lineNo.toString();
      //           //     invoiceLine.quantity = 1;
      //           //     invoiceLine.max_redemption = voucher.max_redemption ?? 1;
      
      //           //     this.lineNo++; 
      //           //       this.itemService.getItemViewList(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, itemcode, uomCode, '', '', '','')
      //           //       .subscribe((itemResponse: any) => {
      //           //         console.log(itemResponse);
      //           //         debugger;
      //           //         if (itemResponse.data !== null && itemResponse.data !== undefined && itemResponse.data.length > 0) {
      //           //           let item = itemResponse.data[0];
      //           //           invoiceLine.itemCode = itemcode;
      //           //           invoiceLine.uomCode = item.uomCode;
      //           //           invoiceLine.itemName = item.itemName;
      //           //           invoiceLine.remark = voucher.voucher_code;  
      //           //           invoiceLine.price= item.defaultPrice;
      //           //           invoiceLine.lineTotal = invoiceLine.price * 1;
      //           //           this.invoice.lines.push(invoiceLine);
      
      //           //           setTimeout(() => {
      //           //             this.invoiceService.checkOrderOnHand(this.invoice).subscribe((responseCheckOnhand: any) => {
      //           //               if(responseCheckOnhand.success)
      //           //               {
      //           //                
      //           //               }
      //           //               else
      //           //               {
      //           //                 Swal.fire({
      //           //                   icon: 'warning',
      //           //                   title: "Redeem Voucher(OMS)" ,
      //           //                   text: responseCheckOnhand.message
      //           //                 });
      //           //               }

      //           //             }, error =>{
      //           //               Swal.fire({
      //           //                 icon: 'error',
      //           //                 title: "Redeem Voucher(OMS)" ,
      //           //                 text: error
      //           //               });
      //           //             })
                           
                            
      //           //           }, 200);
      
                        
      //           //         }
      //           //         else {
      //           //           this.alertify.warning("Item code " + itemcode + ", uom " + uomCode + " not found.");
      //           //         }
      
      //           //       })
                     
      //           // }
                 
      //       }
      //     }, 100);

        
      //   }
      
  
      // }
     
    //  xxx
     
      
    // }
    // else
    // {
    //   this.alertify.warning("Voucher customer not existed.");
    // }
  }
  redeemVoucherFunction(voucher)
  {
    debugger;
    this.serialMemberList = [];
    this.waitToReddem = false;
    this.redeemVoucher = false;
    setTimeout(() => {
      this.txtVoucher.value = voucher.vouchercode;
    }, 10);
    setTimeout(() => { 
      this.findVoucherDetail(this.txtVoucher.value, this.customerInvoice.mobile);
    }, 30);
    // if(this.customerInvoice!==null && this.customerInvoice!==undefined &&  (voucher.customerId === null ||  voucher.customerId ===undefined ||  voucher.customerId===''))
    // {
    //   voucher.customerId = this.customerInvoice.id;
    // }
    // if(voucher.customerId!==null && voucher.customerId!==undefined && voucher.customerId!=='')
    // {
    //   if(voucher===null || voucher ===undefined)
    //   {
    //     voucher = this.voucherMember;
    //   }
    //   if(voucher.voucher_code ===undefined || voucher.voucher_code === null || voucher.voucher_code ==='')
    //   {
    //     voucher.voucher_code = voucher?.vouchercode;
    //   }
    //   let twoChar = voucher.discount_code.substring(0, 2);
             
    //   if (twoChar === "PR" || twoChar === "PI" || voucher.discount_code === "xyz_123") {
         
    //     Swal.fire({
    //       icon: 'warning',
    //       title: "Member/Class Check In" ,
    //       text: 'Voucher cannot be used to check in. Please check your voucher'
    //     });
    //   }
    //   else {
    //     if (twoChar === "BL") {
    //       this.ShowAllItemByVoucher(voucher, this.itemTemplate);
          
    //     }
    //     else
    //     {
    //       setTimeout(() => {
    //         if (voucher.discount_code === 'MC') {
        
    //         }
    //         else 
    //         { 
    //             this.invoice = new TInvoiceHeader();
    //             this.invoice.lines = [];
    //             this.invoice.companyCode = this.storeSelected.companyCode;
    //             this.invoice.createdBy = this.authService.getCurrentInfor().username;
    //             this.invoice.storeId = this.storeSelected.storeId;
    //             this.invoice.storeName = this.storeSelected.storeName;
    //             this.invoice.salesMode = 'SALES';
    //             this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;
    //             this.invoice.invoiceType = "CheckIn";
    //             this.invoice.posType = 'R';
    //             this.invoice.salesType = 'Voucher';
    //             if (this.webcamImage !== null && this.webcamImage !== undefined) {
    //               this.invoice.image = this.webcamImage.imageAsBase64;
    //             } 
    //             this.invoice.cusId = this.customerInvoice.id;
    //             this.invoice.cusAddress = this.customerInvoice.address;
    //             this.invoice.phone = this.customerInvoice.mobile;
    //             let name = "";
    //             if (this.customerInvoice.first_name !== null && this.customerInvoice.first_name !== undefined) {
    //               name += this.customerInvoice.first_name;
    //             }
    //             if (this.customerInvoice.last_name !== null && this.customerInvoice.last_name !== undefined) {
    //               name += " " + this.customerInvoice.first_name;
    //             }
    //             this.invoice.cusName = name;
      
      
    //             let item = voucher.discount_code.split('_');
    //             let itemcode = item[0];
    //             let uomCode = item[1];
      
    //             let voucherInList = this.invoice.lines.filter(x=>x.remark === voucher.voucher_code);
    //             let canAdd = true;
    //             if(voucherInList?.length > 0)
    //             {
    //               let totalQty = 0;
    //               let maxRedeem = voucherInList[0].max_redemption;
    //               voucherInList.forEach(element => {
    //                 totalQty++;
    //               });
    //               if(totalQty >= maxRedeem)
    //               {
    //                 canAdd = false;
                    
    //                 this.alertify.warning("Can't add voucher. Max redeem: " + maxRedeem);
    //               }
    //             }
    //             if(canAdd)
    //             {
                
    //                 let invoiceLine = new TInvoiceLine();
       
    //                 invoiceLine.lineId = this.lineNo.toString();
    //                 invoiceLine.quantity = 1;
    //                 invoiceLine.max_redemption = voucher.max_redemption ?? 1;
      
    //                 this.lineNo++; 
    //                   this.itemService.getItemViewList(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, itemcode, uomCode, '', '', '','')
    //                   .subscribe((itemResponse: any) => {
    //                     console.log(itemResponse);
    //                     debugger;
    //                     if (itemResponse.data !== null && itemResponse.data !== undefined && itemResponse.data.length > 0) {
    //                       let item = itemResponse.data[0];
    //                       invoiceLine.itemCode = itemcode;
    //                       invoiceLine.uomCode = item.uomCode;
    //                       invoiceLine.itemName = item.itemName;
    //                       invoiceLine.remark = voucher.voucher_code;  
    //                       invoiceLine.price= item.defaultPrice;
    //                       invoiceLine.lineTotal = invoiceLine.price * 1;
    //                       this.invoice.lines.push(invoiceLine);
      
    //                       setTimeout(() => {
    //                         this.invoiceService.checkOrderOnHand(this.invoice).subscribe((responseCheckOnhand: any) => {
    //                           if(responseCheckOnhand.success)
    //                           {
    //                             this.mwiService.redeemVoucher(voucher.customerId, voucher.voucher_code??voucher.vouchercode, this.storeSelected.storeId, '').subscribe((response: any) => {
    //                               console.log(response);
    //                               debugger;
    //                               if (response.status === 1) { 
    //                                 if(voucher?.voucher_name === undefined || voucher?.voucher_name === null || voucher?.voucher_name ==='')
    //                                 {
    //                                   voucher.voucher_name = voucher?.vouchername;
    //                                 }
    //                                 let msg= "Redeem voucher " + voucher.voucher_code   + ": " + voucher.voucher_name  + " sucessfully.";
    //                                 this.redeemMessage = msg;
    //                                 this.alertify.success(msg);
    //                                 this.voucherMember = null;
    //                                 this.redeemVoucher=true;
                                  
                                  
    //                                 this.invoiceService.create(this.invoice).subscribe((response: any) => {
    //                                   if (response.success) {
    //                                     this.alertify.success('Check In completed successfully. ' + response.message);
                                         
    //                                   }
    //                                   else {
                                      
    //                                     Swal.fire({
    //                                       icon: 'warning',
    //                                       title: "Create AR Check In" ,
    //                                       text: response.message
    //                                     });
    //                                   }
    //                                 }, error =>{
    //                                   Swal.fire({
    //                                     icon: 'error',
    //                                     title: "Create AR Check In" ,
    //                                     text: error
    //                                   });
                                      
    //                                 });
                              
    //                               }
    //                               else {
    //                                 this.redeemVoucher=false;
    //                                 this.redeemMessage = response.msg;
                                    
    //                                 Swal.fire({
    //                                   icon: 'warning',
    //                                   title: "Redeem Voucher(OMS)" ,
    //                                   text: response.msg
    //                                 });
    //                               }
    //                             }, error =>{
    //                               Swal.fire({
    //                                 icon: 'error',
    //                                 title: "Redeem Voucher(OMS)" ,
    //                                 text: error
    //                               });
    //                             })
    //                           }
    //                           else
    //                           {
    //                             Swal.fire({
    //                               icon: 'warning',
    //                               title: "Redeem Voucher(OMS)" ,
    //                               text: responseCheckOnhand.message
    //                             });
    //                           }

    //                         }, error =>{
    //                           Swal.fire({
    //                             icon: 'error',
    //                             title: "Redeem Voucher(OMS)" ,
    //                             text: error
    //                           });
    //                         })
                           
                            
    //                       }, 200);
      
                        
    //                     }
    //                     else {
    //                       this.alertify.warning("Item code " + itemcode + ", uom " + uomCode + " not found.");
    //                     }
      
    //                   })
                     
    //             }
                 
    //         }
    //       }, 100);

        
    //     }
      
  
    //   }
     
    
    // }
    // else
    // {
    //   this.alertify.warning("Voucher customer not existed.");
    // }
  }
  voucherMember: any;
  validateVoucher = false;
  // voucherMeber = ;
  findVoucherDetail(voucher, customerMobile) {
    // this.loadImage(customerMobile);
    voucher = voucher.replace(/\s/g, "");
    debugger;
   
    if(this.isMC===true && (customerMobile==null || customerMobile===undefined || customerMobile ===''))
    { 
      let cusDef = this.authService.getDefaultCustomer();
      customerMobile = cusDef.mobile;
    }
    else
    {
      let firstChar = customerMobile.toString().substring(0, 1);
      if (firstChar === "0") {
        customerMobile = "84" + customerMobile.toString().substring(1, customerMobile.length);
      }
    }
    if(customerMobile!==null && customerMobile!==undefined && customerMobile!=='')
    {
      customerMobile= customerMobile.replace(/\s/g, "");
      if(this.customerInvoice!==null && this.customerInvoice!==undefined && this.customerInvoice?.id?.length > 0)
      {
        let cusId = this.customerInvoice.id;
        this.validateVoucher = true;
        this.mwiService.validateVoucher(cusId, voucher, this.storeSelected.storeId).subscribe((response: any) => {
          console.log(response);
          this.spinnerService.show();
          this.validateVoucher = false;
          if (response !== null && response !== undefined) {
            if (response.status === 1) {
              this.cusId = cusId; 
              let getvoucher = response.data;
              debugger;
              if (getvoucher.discount_code === 'MC') {
                this.redeemVoucher=true;
                this.voucherMember = { voucher_code: voucher, voucher_name: getvoucher.name, customerId: cusId,  phone: customerMobile,
                  cusName: this.customerInvoice?.first_name + ' ' + this.customerInvoice?.last_name
                };
                this.redeemMessage = "Voucher " + voucher + ": " + getvoucher.name;
                if(this.flagRedeemMember)
                {
                  setTimeout(() => {
                    this.redeemVoucherMember(this.voucherMember) ;
                  }, 50);
                } 
              }
              else 
              {
                debugger;
                let twoChar = getvoucher.discount_code.substring(0, 2);
                // if (twoChar !== ("PR" || "PI" || "BL") || voucher.discount_code !== ("xyz_123" || 'MC')) {
                  
                //     this.alertify.warning("Voucher cannot be used to promotion. Please check your voucher.");
                   
                // }
                if (twoChar === "PR" || twoChar === "PI" || getvoucher.discount_code === "xyz_123") {
                  this.alertify.warning("Voucher cannot be used to check in. Please check your voucher.");
                }
                else {
                  debugger;
                  let item = getvoucher.discount_code.split('_');
                  let itemcode = item[0];
                  let uomCode = item[1];

                  let voucherInList = this.invoice.lines.filter(x=>x.remark === getvoucher.voucher_code);
                  let canAdd = true;
                  if(voucherInList?.length > 0)
                  {
                    let totalQty = 0;
                    let maxRedeem = voucherInList[0]?.max_redemption??1;
                    voucherInList.forEach(element => {
                      totalQty++;
                    });
                    if(totalQty >= maxRedeem)
                    {
                      canAdd = false;
                      this.alertify.warning("Can't add voucher. Max redeem: " + maxRedeem);
                      Swal.fire('Redeem Voucher',"Can't add voucher. Max redeem: " + maxRedeem,'info');

                    }
                  }
                  if(canAdd)
                  {
                    if (twoChar === "BL") {
                      this.ShowAllItemByVoucher(getvoucher, this.itemTemplate);
                    } else {
                      let invoiceLine = new TInvoiceLine();

                      // invoiceLine.itemCode = getvoucher.discount_code;
  
                      invoiceLine.lineId = this.lineNo.toString();
                      invoiceLine.quantity = 1;
                      invoiceLine.max_redemption = getvoucher.max_redemption ?? 1;

                      this.lineNo++;
                    
                    
                        this.itemService.getItemViewList(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, itemcode, uomCode, '', '', '','')
                        .subscribe((itemResponse: any) => {
                          console.log(itemResponse);
                          debugger;
                          if (itemResponse.data !== null && itemResponse.data !== undefined && itemResponse.data.length > 0) {
                            let item = itemResponse.data[0];
                            invoiceLine.itemCode = itemcode;
                            invoiceLine.uomCode = item.uomCode;
                            invoiceLine.itemName = item.itemName;
                            invoiceLine.remark = getvoucher.voucher_code; 
                            invoiceLine.price= item.defaultPrice;
                            invoiceLine.lineTotal = invoiceLine.price * 1;
                            this.invoice.lines.push(invoiceLine);
                          }
                          else {
                            this.alertify.warning("Item code " + itemcode + ", uom " + uomCode + " not found.");
                          }
  
                        })
                      
                    
                    }
                  }
                }

              }


            }
            else {
              this.alertify.warning("Valid voucher failed. Message: " + response.msg);
              // this.alertify.warning('Voucher not found');
              Swal.fire('Validate Voucher', response.msg,'info').then(()=>{
                this.txtVoucher.text = '';
                this.txtVoucher.instance.focus();
              })
            }
            this.spinnerService.hide();
          }
          else {
            this.spinnerService.hide();
            this.alertify.warning('Voucher not found');
            Swal.fire('Validate Voucher','Voucher not found','warning').then(()=>{
                this.txtVoucher.text = '';
                this.txtVoucher.instance.focus();
              })
          }
        
        }, error =>{
          this.validateVoucher = false;
        });
      }
      else
      {
        this.mwiService.getCustomerInformation(customerMobile, this.storeSelected.storeId).subscribe((response: any) => {
          debugger;
          if (response !== null && response !== undefined) {
            if (response.status === 1) {
              if(response.data!==null && response.data!==undefined )
              {
                this.customerInvoice = response.data;
                let cusId = response.data.id;
                this.validateVoucher = true;
                // '706ad8ca-0e99-4700-ba5c-7627f96c5901' Default Cus
                this.mwiService.validateVoucher(cusId, voucher, this.storeSelected.storeId).subscribe((response: any) => {
                  console.log(response);
                  this.spinnerService.show();
                  this.validateVoucher = false;
                  if (response !== null && response !== undefined) {
                    if (response.status === 1) {
                      this.cusId = cusId; 
                      let getvoucher = response.data;
                      debugger;
                      if (getvoucher.discount_code === 'MC') {
                        this.redeemVoucher=true;
                        this.voucherMember = { voucher_code: voucher, voucher_name: getvoucher.name, customerId: cusId,  phone: customerMobile,
                          cusName: this.customerInvoice?.first_name + ' ' + this.customerInvoice?.last_name
                        };
                        this.redeemMessage = "Voucher " + voucher + ": " + getvoucher.name;
                        if(this.flagRedeemMember)
                        {
                          setTimeout(() => {
                            this.redeemVoucherMember(this.voucherMember) ;
                          }, 50);
                        } 
                      }
                      else 
                      {
                        debugger;
                        let twoChar = getvoucher.discount_code.substring(0, 2);
                        // if (twoChar !== ("PR" || "PI" || "BL") || voucher.discount_code !== ("xyz_123" || 'MC')) {
                          
                        //     this.alertify.warning("Voucher cannot be used to promotion. Please check your voucher.");
                           
                        // }
                        if (twoChar === "PR" || twoChar === "PI" || getvoucher.discount_code === "xyz_123") {
                          this.alertify.warning("Voucher cannot be used to check in. Please check your voucher.");
                        }
                        else {
                          debugger;
                          let item = getvoucher.discount_code.split('_');
                          let itemcode = item[0];
                          let uomCode = item[1];
  
                          let voucherInList = this.invoice.lines.filter(x=>x.remark === getvoucher.voucher_code);
                          let canAdd = true;
                          if(voucherInList?.length > 0)
                          {
                            let totalQty = 0;
                            let maxRedeem = voucherInList[0].max_redemption??1;
                            voucherInList.forEach(element => {
                              totalQty++;
                            });
                            if(totalQty >= maxRedeem)
                            {
                              canAdd = false;
                              this.alertify.warning("Can't add voucher. Max redeem: " + maxRedeem);
                              Swal.fire('Redeem Voucher',"Can't add voucher. Max redeem: " + maxRedeem,'info');
                            }
                          }
                          if(canAdd)
                          {
                            if (twoChar === "BL") {
                              this.ShowAllItemByVoucher(getvoucher, this.itemTemplate);
                            } else {
                              let invoiceLine = new TInvoiceLine();
        
                              // invoiceLine.itemCode = getvoucher.discount_code;
          
                              invoiceLine.lineId = this.lineNo.toString();
                              invoiceLine.quantity = 1;
                              invoiceLine.max_redemption = getvoucher.max_redemption ?? 1;
  
                              this.lineNo++;
                            
                            
                                this.itemService.getItemViewList(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, itemcode, uomCode, '', '', '','')
                                .subscribe((itemResponse: any) => {
                                  console.log(itemResponse);
                                  debugger;
                                  if (itemResponse.data !== null && itemResponse.data !== undefined && itemResponse.data.length > 0) {
                                    let item = itemResponse.data[0];
                                    invoiceLine.itemCode = itemcode;
                                    invoiceLine.uomCode = item.uomCode;
                                    invoiceLine.itemName = item.itemName;
                                    invoiceLine.remark = getvoucher.voucher_code; 
                                    invoiceLine.price= item.defaultPrice;
                                    invoiceLine.lineTotal = invoiceLine.price * 1;
                                    this.invoice.lines.push(invoiceLine);
                                  }
                                  else {
                                    this.alertify.warning("Item code " + itemcode + ", uom " + uomCode + " not found.");
                                  }
          
                                })
                              
                            
                            }
                          }
                        }
      
                      }
      
      
                    }
                    else {
                      // this.alertify.warning("Valid voucher failed. Message: " + response.msg);
                      this.alertify.warning('Voucher not found');
                      Swal.fire('Validate Voucher', response.msg,'info').then(()=>{
                        this.txtVoucher.text = '';
                        this.txtVoucher.instance.focus();
                      })
                    }
                    this.spinnerService.hide();
                  }
                  else {
                    this.spinnerService.hide();
                    this.alertify.warning('Voucher not found');
                    Swal.fire('Validate Voucher','Voucher not found','warning')
                    .then(()=>{
                      this.txtVoucher.text = '';
                      this.txtVoucher.instance.focus();
                    })
                  }
                
                }, error =>{
                  this.validateVoucher = false;
                });
              }
              else
              {
                // this.alertify.warning('Voucher data not found');
                // Swal.fire('Validate Voucher','Voucher data not found','warning');
                this.alertify.warning('Customer not found');
                Swal.fire('Get customer infor', 'Customer not found','warning');
              }
             
            }
            else {
              this.alertify.warning("Get customer infor failed. Message: " + response.msg);
              Swal.fire('Get customer infor', response.msg,'warning');
  
            }
          }
          else {
            this.alertify.warning('Customer not found');
            Swal.fire('Get customer infor', 'Customer not found','warning');
          }
        }, error =>{
            Swal.fire({
              icon: 'error',
              title: "MWI Customer Information" ,
              text: error
            });
        })
       
      }
     
    }
    else {
      this.alertify.warning('Please input mobile number');
      
    }

  }
  voucherListTemp:any =[];
  vouchertemp: any={};
  modalItemListRef: BsModalRef;
  itemByVouchers: ItemViewModel[] = [];
  @ViewChild('itemTemplate', { static: false }) itemTemplate;
  
  ShowAllItemByVoucher(voucher, template) {
    // voucher = 'VO_SIZE_SML';
    if (voucher !== null && voucher !== undefined && voucher !== '') {
      let vouchercode = voucher.discount_code;
      let store = this.authService.storeSelected();
      this.itemService.GetItemByVoucherCollection(store.companyCode, store.storeId , vouchercode).subscribe((response: any) => {
        if (response?.data?.length > 0) {
          this.itemByVouchers = response.data;
          this.vouchertemp = voucher;
        
          console.log("this.itemByVouchers", this.itemByVouchers);
          setTimeout(() => {
            this.modalItemListRef = this.modalService.show(template, {
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title',
              class: 'modal-dialog modal-dialog-centered modal-sm'
            });
          });
        } else {
          this.alertify.warning('Voucher code not item. Please input item voucher');
        }

      }, error =>{
        console.log('GetItemByVoucherCollection error', error);
        Swal.fire('Get Item By Voucher Collection','Failed to connect System','warning').then(()=>{});
      });


    }
  }
  // memberClassCheckin = false;
  ApplyData(data ) {
    if (data.uomName != null) {
      data.uomName = data.uomName;
    } else {
      data.uomName = '';
    }

    this.itemService.GetItemInforList(data.companyCode, this.authService.storeSelected().storeId, data.itemCode, data.uomName, '', '', '', '', '').subscribe((response: any) => {
      debugger;
      if (response.success === true) {
        // this.itemByVoucher = response.data[0];
        // debugger;
        // this.itemByVoucher.defaultPrice = 0;
        // this.itemByVoucher.priceAfterTax =0;
        // this.itemByVoucher.priceBeforeTax =0;
        // let itemBasket = this.basketService.mapProductItemtoBasket(this.itemByVoucher, 1);
        // itemBasket.price = 0;
        // itemBasket.promotionIsPromo = "1";
        // itemBasket.promotionLineTotal = 0;
        // itemBasket.promotionPriceAfDis = 0;
        // itemBasket.discountType = "Fixed Quantity";
        // itemBasket.promotionType = "Fixed Quantity";
        // this.basketService.addPromotionItemToSimulation(itemBasket);
        // // voucherListTemp:any =[];
        // // vouchertemp = {};
        // this.basketService.addVoucherToBasket(this.vouchertemp);
        // this.vouchertemp = {};
        let itemDataLoaded = true;
        // if(this.memberClassCheckin)
        // {
        //   this.invoice = new TInvoiceHeader();
        //   this.invoice.lines = [];
        //   this.invoice.companyCode = this.storeSelected.companyCode;
        //   this.invoice.createdBy = this.authService.getCurrentInfor().username;
        //   this.invoice.storeId = this.storeSelected.storeId;
        //   this.invoice.storeName = this.storeSelected.storeName;
        //   this.invoice.salesMode = 'SALES';
        //   this.invoice.shiftId = this.shiftService.getCurrentShip().shiftId;
        //   this.invoice.invoiceType = "CheckIn";
        //   this.invoice.posType = 'R';
        //   this.invoice.salesType = 'Voucher';
        //   if (this.webcamImage !== null && this.webcamImage !== undefined) {
        //     this.invoice.image = this.webcamImage.imageAsBase64;
        //   } 
        //   this.invoice.cusId = this.customerInvoice.id;
        //   this.invoice.cusAddress = this.customerInvoice.address;
        //   this.invoice.phone = this.customerInvoice.mobile;
        //   let name = "";
        //   if (this.customerInvoice.first_name !== null && this.customerInvoice.first_name !== undefined) {
        //     name += this.customerInvoice.first_name;
        //   }
        //   if (this.customerInvoice.last_name !== null && this.customerInvoice.last_name !== undefined) {
        //     name += " " + this.customerInvoice.first_name;
        //   }
        //   this.invoice.cusName = name;   
        // }

     

        let item = response.data[0];
        let invoiceLine = new TInvoiceLine();
        this.lineNo++;
        // invoiceLine.itemCode = getvoucher.discount_code;
        invoiceLine.lineId = this.lineNo.toString();
        invoiceLine.quantity = 1;
        invoiceLine.itemCode = data.itemCode;
        invoiceLine.uomCode = item.uomCode;
        invoiceLine.itemName = item.itemName;
        invoiceLine.remark =  this.vouchertemp.voucher_code.toString() ;
        invoiceLine.max_redemption =  this.vouchertemp.max_redemption ?? 1;
        invoiceLine.price= item.defaultPrice;
        invoiceLine.lineTotal = invoiceLine.price * invoiceLine.quantity;
        
     
        if(data.isBom)
        {
          itemDataLoaded = false;
          
          this.bomService.GetByItemCode(this.authService.getCurrentInfor().companyCode , data.itemCode).subscribe((response : any) =>{
            this.invoice.lines.push(invoiceLine);
            debugger;
            if(response.success)
            {
              debugger;
              let BOMitem = response.data;
              let BOMLIne = BOMitem.lines;
              if(BOMLIne!==null && BOMLIne!==undefined && BOMLIne?.length > 0)
              {
                BOMLIne.forEach(item => {
                    let invoiceLineBom = new TInvoiceLine();
                    invoiceLineBom.baseLine = parseInt(invoiceLine.lineId);
                    this.lineNo++; 
                    invoiceLineBom.quantity = item.quantity;
                    invoiceLineBom.itemCode = item.itemCode;
                    invoiceLineBom.uomCode = item.uomCode;
                    invoiceLineBom.itemName = item.itemName;
                    invoiceLineBom.bomId = invoiceLine.itemCode;
                    invoiceLineBom.remark =  this.vouchertemp.voucher_code.toString() ; 
                    invoiceLineBom.price= 0;
                    invoiceLineBom.lineTotal = invoiceLineBom.price * invoiceLineBom.quantity;
                    this.invoice.lines.push(invoiceLineBom);
                });

                console.log('this.invoice.lines', this.invoice.lines);
              }
              itemDataLoaded = true;
             
            }
            else
            {
              itemDataLoaded = true;
            }
            if(itemDataLoaded)
            {
              if(this.voucherMember!==null && this.voucherMember!==undefined )
              {
                this.invoiceService.checkOrderOnHand(this.invoice).subscribe((responseCheckOnhand: any) => {
                  if(responseCheckOnhand.success)
                  {
                    this.saveModel();
                  }
                  else
                  {
                    Swal.fire({
                      icon: 'warning',
                      title: "Redeem Voucher (OMS)" ,
                      text: responseCheckOnhand.message
                    });
                  }
                }, error=>{
                  Swal.fire({
                    icon: 'error',
                    title: "Redeem Voucher(OMS)" ,
                    text: error
                  });
                })
               
              }
              else
              {
                this.modalItemListRef.hide();
                // if()
                setTimeout(() => {
                  this.txtVoucher.value = '';
                }, 10);
               
              }
            }
          }, error=>{
            itemDataLoaded = true;
            console.log('error Get BOM Item Code', error);
            Swal.fire({
              icon: 'error',
              title: "Get BOM Item Code " + data.itemCode,
              text: "Can't get data"
            });
          })
        }
        else
        {
          this.invoice.lines.push(invoiceLine);
        debugger;
          if(itemDataLoaded)
          {
            if(this.voucherMember!==null && this.voucherMember!==undefined )
            {
              this.invoiceService.checkOrderOnHand(this.invoice).subscribe((responseCheckOnhand: any) => {
                if(responseCheckOnhand.success)
                {
                  this.saveModel();
                }
                else
                {
                  Swal.fire({
                    icon: 'warning',
                    title: "Redeem Voucher (OMS)" ,
                    text: responseCheckOnhand.message
                  });
                }
              }, error=>{
                Swal.fire({
                  icon: 'error',
                  title: "Redeem Voucher(OMS)" ,
                  text: error
                });
              })
            
            }
            else
            {
              this.modalItemListRef.hide();
              setTimeout(() => {
                this.txtVoucher.value = '';
              }, 10);
             
            }
          }
        }
        
        
        
      }
    });
  }
  removeItem(item)
  {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove item!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        debugger;
        this.invoice.lines = this.invoice.lines.filter(x=>x.itemCode != item.itemCode && x.uomCode != item.uomCode);
        //Kiểm tra xem item có BOM line không
        let checkItemInLine = this.invoice.lines.filter(x=>x.bomId?.length > 0 && x.bomId === item.itemCode && x.remark === item.remark);
        if(checkItemInLine!==undefined && checkItemInLine!==null && checkItemInLine?.length > 0)
        {
          //Xóa Bom Line của Item
          checkItemInLine.forEach(line => {
            this.invoice.lines = this.invoice.lines.filter(x=>x.remark !== line.remark  && x.itemCode != line.itemCode && x.uomCode != line.uomCode)
          });
          //  this.invoice.lines.filter(x=>x.bomId?.length > 0 && x.bomId === item.itemCode && x.remark === item.remark);
        }
      }
    })
   
  }
  itemByVoucher: ItemViewModel;
  getDataMWI(value, type)
  {
    if(value?.length > 0)
    {
      this.flagRedeemMember = false;
      if(type==='phone')
      {
        this.findCustomer(value);
      }
      else
      {
        this.getMemberCard(value);
      }
    }
    else
    {
      Swal.fire({
          icon: 'warning',
          title: "Input Data" ,
          text: 'Please input value'
        });
    }
   

  }
  findCustomer(phone) {
    debugger;
    let firstChar = phone.toString().substring(0, 1);

    if (firstChar === "0") {
      phone = "84" + phone.toString().substring(1, phone.length);
    }
    phone= phone.replace(/\s/g, "");
    this.mwiService.getCustomerInformation(phone, this.storeSelected.storeId).subscribe((response: any) => {
      debugger;
      console.log("response", response);
      if (response !== null && response !== undefined) {

        if (response.status === 1) {
          this.customerInvoice = response.data;
          
          // response.data.forEach(cus => {
          //   let customer = this.mapWMiCustomer2Customer(cus);
          //   this.customers.push(customer);
          //  });
          //  console.log(this.customer);
          this.loadImage(phone);
        }
        else {
          //Msg  MsgVN
          if(response.msg===null || response.msg === undefined || response.msg === '')
          {
            this.alertify.warning("Can't get customer");
          }
          else
          {
            this.alertify.warning(response.msg);
          }
         
        }
      }
      else {
       
        Swal.fire({
          icon: 'warning',
          title: "Get Customer Infor (OMS)" ,
          text: 'Data not found'
        });
      }

    }, error=>{
      Swal.fire({
        icon: 'error',
        title: "Get Customer Infor (OMS)" ,
        text: error
      });
    })
  }
  serialMemberList: any[]=[];
  flagRedeemMember = false;
  getMemberCard(memberId) {
    // let firstChar = phone.toString().substring(0, 1);

    // if (firstChar === "0") {
    //   phone = "84" + phone.toString().substring(1, phone.length);
    // }
    this.flagRedeemMember = false;
    memberId= memberId.replace(/\s/g, "");
    this.mwiService.getMemberCard(memberId).subscribe((response: any) => {
      debugger;
      this.flagRedeemMember = true;
      // console.log("response", response);
      if (response !== null && response !== undefined) {

        if (response.status === 1) {
          this.serialMemberList = response.data; 
          // this.loadImage(phone);
          
          let getCus = response.data.filter(x=>x.parentphone!==null && x.parentphone!==undefined && x.parentphone!==''); 
          if(getCus!==null && getCus!==undefined && getCus.length >0)
          {
            debugger;
            let parrentphone = getCus[0].parentphone;
            if(parrentphone!==null && parrentphone!==undefined && parrentphone !== '')
            {
              this.findCustomer(parrentphone);
            }
            else
            {
              this.alertify.warning("Can't get data main account");
            }
           
          }
        }
        else {
          //Msg  MsgVN
          if(response.msg===null || response.msg === undefined || response.msg === '')
          {
            this.alertify.warning("Can't get data");
          }
          else
          {
            this.alertify.warning(response.msg);
          }
         
        }
      }
      else {
        this.alertify.warning('Data not found');
      }

    }, error=>{
      this.alertify.warning(error);
    });
  }
  isShowSlickSlider = false;
  public refreshSlickSlider() {
    this.isShowSlickSlider = false;
    setTimeout(x => this.isShowSlickSlider = true);
  }
  orderId = "";


  @ViewChild('ManualPromotion', { static: false }) ManualPromotion;
  @ViewChild('template', { static: false }) template;
  checkOutAction(result: any) {
    // debugger;
    if (result === "ShowPayment") {
      this.modalRef = this.modalService.show(this.template);
    }
    if (result === "CheckOut") {
      this.saveEntity();
    }
    if (result === "ShowDiscount") {
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
export class CountVoucherModel{
  voucher: string="";
  numOfcount: number = 0;
  maxRedeem: number = 0;

}
const data = [
  {
    srcUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg',
    previewUrl: 'https://preview.ibb.co/jrsA6R/img12.jpg'
  },
  {
    srcUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg',
    previewUrl: 'https://preview.ibb.co/kPE1D6/clouds.jpg'
  },
  {
    srcUrl: 'https://preview.ibb.co/mwsA6R/img7.jpg',
    previewUrl: 'https://preview.ibb.co/mwsA6R/img7.jpg'
  },
  {
    srcUrl: 'https://preview.ibb.co/kZGsLm/img8.jpg',
    previewUrl: 'https://preview.ibb.co/kZGsLm/img8.jpg'
  }
];