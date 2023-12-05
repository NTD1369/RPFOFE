import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import BarcodeScanner from 'simple-barcode-scanner';
import { MItemSerialStock } from 'src/app/_models/itemserialstock';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { Pagination } from 'src/app/_models/pagination';
import { IBasketItem } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemserialService } from 'src/app/_services/data/itemserial.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { Sale } from 'src/app/_services/test/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-item-serial-expand',
  templateUrl: './shop-item-serial-expand.component.html',
  styleUrls: ['./shop-item-serial-expand.component.css']
})
export class ShopItemSerialExpandComponent implements OnInit {

  
  @Input() item: IBasketItem;
  @Input() title ='Item Serial';
  @Output() outValue = new EventEmitter<any>();
  itemSerials: MItemSerial[] = [];
  itemSerial: MItemSerial;
  itemSerialSelected: MItemSerial[] =[];
  pagination: Pagination;
  userParams: any = {};
  display= false;
  selectedKey = [];
  sales: Sale[];
  allMode: string;
  checkBoxesMode: string;
  isBooklet = false;
  switchMode()
  {
    this.isBooklet=!this.isBooklet;
    if(this.isBooklet)
    {
      setTimeout(() => {
        this.txtBookletId.nativeElement.value = "";
         this.txtBookletId.nativeElement.focus();
      }, 1);
      
    }
    else
    {
      setTimeout(() => {
        this.filter.nativeElement.value = "";
         this.filter.nativeElement.focus();
      }, 1);
      
    }
  }

  checkBookletInbasket(bookNo)
  {
    let result = false;
    let basket= this.basketService.getCurrentBasket();
    let checkRow = basket.items.filter(x=>x.id === this.item.id && x.uom === this.item.uom && x.bookletNo === bookNo);
    if(checkRow!==null && checkRow!==undefined && checkRow.length > 0)
    {
      result = true;
    }
    return result;
  }
  searchBooklet(value)
  {
    this.selectedKey= [];
    this.item.bookletNo  = "";
     if(value !==null && value!==undefined && value !== '')
     {
      debugger;

      if(this.checkBookletInbasket(value))
      {
        
        Swal.fire({
          icon: 'warning',
          title: 'Book voucher',
          text: 'Book voucher ' + value + ' has existed in basket. please input another book number' 
        }).then(() => {
          setTimeout(() => {
            this.txtBookletId.nativeElement.value = '';
            this.txtBookletId.nativeElement.focus();
          }, 10);
          
        });
      }
      else
      {
        this.mwiService.S4GetBooklet(value, this.authService.storeSelected().storeId, this.item.id ).subscribe((response: any)=>{
          debugger;
          if(response.success)
          { 
            
            let bookletNumber = value;
            this.txtBookletId.nativeElement.value = '';
            this.itemSerials = [];
            if(response.data?.vouchers.length > 0)
            {
              this.item.bookletNo = bookletNumber;
              response.data.vouchers.forEach(voucher => {
                let serial = new MItemSerial();
                serial.companyCode = this.authService.getCurrentInfor().companyCode;
                serial.itemCode = this.item.id;
                serial.quantity = 1;
                serial.serialNum = voucher.serialnumber;
                serial.bookletNo = bookletNumber;
                serial.customF1 = bookletNumber;
                serial.prefix = "BOOKLET"; 
                serial.expDate =  null; 
                serial.createdBy = this.authService.getCurrentInfor().username;
                // this.itemSerials=[]; 
                if(this.itemSerials!==null && this.itemSerials!==undefined && this.itemSerials.some(x=>x.serialNum === bookletNumber))
                {
                  
                }
                else
                {
                  this.itemSerials.push(serial);
                  this.selectedKey.push(serial.serialNum); 
                }
              });
            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Book voucher',
                text: 'Data not found'
              });
            }
  
          } 
          else
          {
            Swal.fire({
              icon: 'warning',
              title: 'Book voucher',
              text: response.message
            });
          }
        }, error => {
          // this.alertify.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Book voucher',
            text: "Can't get data"
          });
        });
      }

  
     }
  }
  selectFromTop()
  {
    debugger;
    this.selectedKey=[];
    let quantity = 0;
    if(this.txtQuantity.nativeElement.value !==null && this.txtQuantity.nativeElement.value!==undefined && this.txtQuantity.nativeElement.value!=='')
    {
      quantity = parseInt(this.txtQuantity.nativeElement.value);
    }
    
    // let itemList = this.itemSerials.slice(this.item.quantity);
    // itemList.forEach((item)=> {
    //   this.selectedKey.push(item.serialNum);
    // });
    for (var i = 0; i < quantity; i++) { 
      this.selectedKey.push(this.itemSerials[i].serialNum); 
    }
    console.log(this.selectedKey);
  }
  selectRandom()
  {

    this.selectedKey=[];
    var colArr = [];
    let quantity = 0;
    if(this.txtQuantity.nativeElement.value !==null && this.txtQuantity.nativeElement.value!==undefined && this.txtQuantity.nativeElement.value!=='')
    {
      quantity = parseInt(this.txtQuantity.nativeElement.value);
    }
    for (var i = 0; i < quantity; i++) { 
      var rand = this.itemSerials[Math.floor(Math.random() * this.itemSerials.length)];
      colArr.push(rand);
    }
    // var item = this.itemSerials[Math.floor(Math.random() * this.itemSerials.length)];
    // let randomNumber = Array.from({length: this.item.quantity}, () => Math.floor(Math.random() * this.itemSerials.length));
    // const random = Math.floor(Math.random() * this.itemSerials.length);
    colArr.forEach((item)=> {
      this.selectedKey.push(item.serialNum);
    });
  }
  constructor(  private itemService: ItemService, private alertify: AlertifyService, private mwiService: MwiService, private routeNav: Router, private itemserialService: ItemserialService,
           private basketService: BasketService , private commonService: CommonService,  private route: ActivatedRoute, public authService: AuthService,
            ) { 
              // public ref: DynamicDialogRef,
                console.log("Item add");
                console.log(this.item); 
                // this.sales = service.getSales();
                this.allMode = 'allPages';
                this.checkBoxesMode = 'always'
              }
              ngAfterViewInit() {
                this.item.lineItems.forEach((item)=> {
                  this.selectedKey.push(item.serialNum);
                });
              }

  expDate1Year ;
  ngOnInit() {
    // this.route
    // this.loadItems();
    // debugger;
  
    this.expDate1Year = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    this.loadSerialSource();
    if(this.serialSource !== "MWI.S4SV")
    {
      // this.loadItemPagedList();
      this.loadItemSerialList();
    }
    else
    {
      console.log(this.item);
      debugger;
      this.item.lineItems.forEach(element => {
        let serial = new MItemSerial();
        serial.companyCode = this.authService.getCurrentInfor().companyCode;
        serial.itemCode = this.item.id;
        serial.quantity = 1;
        serial.serialNum = element.serialNum;
        serial.expDate =  null;
        serial.createdBy = this.authService.getCurrentInfor().username;
        // this.itemSerials=[]; 
        if(this.itemSerials!==null && this.itemSerials!==undefined && this.itemSerials.some(x=>x.serialNum === serial.serialNum))
        {
           
        }
        else
        {
          this.itemSerials.push(serial); 
         
        }
      });
      // this.itemSerials = this.item.lineItems;
    }
  
    this.display= true;
   
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.bills = data['bills'].result;
    //   this.pagination = data['bills'].pagination;
    //   // debugger;
     
    //   // data['items']
    // });
    setTimeout(() => {
      this.filter.nativeElement.focus();
      this.filter.nativeElement.value = '';
    }, 10);
  
  }
  serialSource="";
  salesBooklet="false";
  loadSerialSource()
  {
    let generalSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
    let checkSerial = generalSetting.find(x=>x.settingId==="SerialCheck");
    if(checkSerial!==null && checkSerial!==undefined )
    {
      this.serialSource = checkSerial?.settingValue;
    }

    
    let salesBooklet = generalSetting.find(x=>x.settingId==="SalesBooklet");
    if(salesBooklet!==null && salesBooklet!==undefined )
    {
      this.salesBooklet = salesBooklet?.settingValue;
    }
  }
  isCreateSerial= false;
  showPopupCreate = false;
  @ViewChild('filter', { static: false }) filter: ElementRef; 
  @ViewChild('txtBookletId', { static: false }) txtBookletId: ElementRef; 
  @ViewChild('txtQuantity', { static: false }) txtQuantity: ElementRef; 
  @ViewChild('txtSerialNum', { static: false }) txtSerialNum: ElementRef; 
  showNewSerial(serial)
  {
    debugger;
    if(serial!==null && serial!==undefined && serial!=="")
    {
     
      this.showPopupCreate=!this.showPopupCreate;
      setTimeout(() => {
        this.txtSerialNum.nativeElement.value = serial;
      }, 10);
    }
    
  }
  backToList()
  {
    this.showPopupCreate= false;
    this.isCreateSerial = false;
  }
  checkSerialInBasket(serial)
  {
    let result = false;
    let basket = this.basketService.getCurrentBasket();
    let itemInbasket= basket.items.filter(x=>x.isVoucher || x.isSerial);
    if(itemInbasket!==null && itemInbasket !==undefined && itemInbasket?.length > 0)
    {
      // let itemSame = itemInbasket.filter(x=>x.id === this.item.id && x.uom === this.item.uom && x.barcode === this.item.barcode);
      // if(itemSame!==null && itemSame !==undefined && itemSame?.length > 0)
      // {
        
        // for (let i in itemSame) {
        //   console.log(i); // "0", "1", "2",
        // }
        for (let item of itemInbasket) {
          let serialInList = item.lineItems.filter(x=>x.serialNum === serial);
          if(serialInList!==null && serialInList !==undefined && serialInList?.length > 0)
          {
            return true;
          }
        }
      // }
      
    }
    return result;
      
   
  }
  createSerial(txtFilter: any, expDate )
  {
   
    // let txtFilter: any = event.value;
    let checkSerrial =false;
   
    // let generalSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
    // let checkSerial = generalSetting.find(x=>x.settingId==="SerialCheck");
    if(this.serialSource === "MWI.S4SV")
    {
      if(this.checkSerialInBasket(txtFilter))
      {
        Swal.fire({
          icon: 'warning',
          title: 'Serial No',
          text:  txtFilter + ' has already in basket'
        }).then(() =>{
           setTimeout(() => {
            this.filter.nativeElement.focus();
            this.filter.nativeElement.value = '';
           }, 10);
        }) ;
      }
      else
      {
        this.mwiService.S4GetVoucher(txtFilter, this.authService.storeSelected().storeId).subscribe((response: any)=>{
          debugger;
          if(response.success)
          {
            let voucherGet = response.data[0];
            let voucherValue = response.data[0]?.cardvalue;
            //1300400100006 voucherGet
            let itemPrice = this.item.price;
            // if((this.item.promotionIsPromo === '1' && voucherGet.vouchercategory=== "PGV" ) )
            // {
              
             
            // }
            // else
            // {
            //   Swal.fire({
            //     icon: 'warning',
            //     // title: 'Item',
            //     text: "Voucher category not valid"
            //   });
            // }
            debugger; 
            if(voucherValue < itemPrice && this.item?.promotionIsPromo?.toString() !== '1')
            {
              if(voucherValue < itemPrice)
              {
                Swal.fire({
                  icon: 'warning',
                  // title: 'Item',
                  text: 'Value  voucher not valid (' + voucherValue +')'
                }).then(() =>{
                  setTimeout(() => {
                   this.filter.nativeElement.focus();
                   this.filter.nativeElement.value = '';
                  }, 10);
               }) ;
              }
              debugger; 
              if(this.item?.promotionIsPromo?.toString() !== '1')
              {
                Swal.fire({
                  icon: 'warning',
                  // title: 'Item',
                  text: "Voucher category not valid (" + voucherGet.vouchercategory + ")"
                }).then(() =>{
                  setTimeout(() => {
                   this.filter.nativeElement.focus();
                   this.filter.nativeElement.value = '';
                  }, 10);
               }) ;
              }
            }
            else
            {
              let msg="Can't select voucher. Because ";
              // redeemTransId: string;
              // redeemDate: Date | string | null; 
              if( voucherGet?.statuscode !==null && voucherGet?.statuscode !== undefined)
              {
                if(voucherGet?.statuscode !=='INAC')
                {
                  switch(voucherGet?.statuscode) { 
                    case 'EXPI': { 
                      //statements; 
                      msg += "voucher " + txtFilter + " is expired";
                      break; 
                    } 
                    case 'BLCK': { 
                      //statements; 
                      msg += "voucher " + txtFilter + " is blocked";
                      break; 
                    } 
                    case 'ACTI': { 
                      //statements; 
                      msg += "voucher " + txtFilter  + " is active";
                      break; 
                    } 
                    case 'REDE': { 
                      //statements; 
                      msg = "Voucher " + txtFilter + " redeemed";
                      break; 
                    } 
                    default: { 
                      //statements; 
                      msg += "voucher " + txtFilter + " " + voucherGet.message;
                      break; 
                    } 
                  } 
                  Swal.fire({
                    icon: 'warning',
                    // title: 'Item',
                    text: msg
                  }).then(() =>{
                    setTimeout(() => {
                     this.filter.nativeElement.focus();
                     this.filter.nativeElement.value = '';
                    }, 10);
                  });
                  // this.alertify.warning(msg);
                }
                else
                {
                  let serial = new MItemSerial();
                  serial.companyCode = this.authService.getCurrentInfor().companyCode;
                  serial.itemCode = this.item.id;
                  serial.quantity = 1;
                  serial.serialNum = txtFilter;
                  serial.price = voucherValue;
                  if(voucherGet?.validto!==null && voucherGet?.validto!==undefined && voucherGet?.validto!=='')
                  {
                    serial.expDate = new Date(new Date(voucherGet?.validto));
                  }
                  else  
                  {
                    serial.expDate =  null;
                  }
                 
                  serial.createdBy = this.authService.getCurrentInfor().username;
                  // this.itemSerials=[]; 
                  if(this.itemSerials!==null && this.itemSerials!==undefined && this.itemSerials.some(x=>x.serialNum === txtFilter))
                  {
                     
                  }
                  else
                  {
                    this.itemSerials.push(serial);
    
                  }
                  this.filter.nativeElement.focus();
                  this.filter.nativeElement.value = '';
                }
                  
              }
            }
            
           
            
          }
          else
          {
            // this.alertify.warning(response.message);
            Swal.fire({
              icon: 'warning',
              // title: 'Item',
              text: response.message
            }).then(() =>{
              setTimeout(() => {
               this.filter.nativeElement.focus();
               this.filter.nativeElement.value = '';
              }, 10);
            }) ;
          }
        
        })
       
      }
    
    }
    else
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want create new serial ' + txtFilter,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) { 
          debugger;
          let serial = new MItemSerial();
          serial.companyCode = this.authService.getCurrentInfor().companyCode;
          serial.itemCode = this.item.id;
          serial.quantity = 1;
          serial.serialNum = txtFilter;
          if(expDate!==null && expDate!==undefined && expDate!=="")
          { 
            serial.expDate = expDate;
          }
          else
          {
            serial.expDate = this.expDate1Year;
          }
          // serial.status = "I";
          serial.status = "N/A";
          serial.createdBy = this.authService.getCurrentInfor().username;
          let serialStock = new MItemSerialStock();
          serialStock.companyCode = serial.companyCode;
          serialStock.itemCode = serial.itemCode;
          serialStock.stockQty = 1;
          serialStock.status = "N/A";
          serialStock.slocId = this.authService.storeSelected().whsCode;
          serial.serialStock = serialStock;
          this.itemserialService.create(serial).subscribe((response: any)=>{
            if(response.success===true)
            {
              this.alertify.success("Create successfully completed. Serial: " + serial.serialNum); 
              this.backToList(); 
              setTimeout(() => {
                this.filter.nativeElement.focus();
                this.filter.nativeElement.value = '';
                this.loadItemSerialList();
              }, 10);
              
              // this.loadItemPagedList();
            }
            else
            {
              // this.alertify.error(response.message);
              Swal.fire({
                icon: 'warning',
                title: 'Create Serial',
                text:response.message
              });
            }
          })
        }
      })

    }
    
    
  }
  previousValue="";

  filterBy(event)
  {
    let txtFilter: any = event.value;
    
  
    debugger;
    txtFilter = txtFilter.replace(/\s/g, "");
    if (txtFilter === null || txtFilter === undefined || txtFilter === "") {
      this.dataGrid.instance.clearFilter();
      this.isCreateSerial=false;
    } else {
        if(this.previousValue!=txtFilter)
        {
          this.previousValue=txtFilter;
          // let generalSetting = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId);
          // let checkSerial = generalSetting.find(x=>x.settingId==="SerialCheck");
          if(this.serialSource  === "MWI.S4SV")
          {
            if(this.itemSerials!==null && this.itemSerials!==undefined && this.itemSerials.some(x=>x.serialNum === txtFilter))
            {
              //  this.alertify.warning(txtFilter + ' has already in list');
               Swal.fire({
                icon: 'warning',
                title: 'Serial No',
                text:  txtFilter + ' has already in basket'
              }).then(() =>{
                 setTimeout(() => {
                  this.filter.nativeElement.focus();
                  this.filter.nativeElement.value = '';
                 }, 10);
              }) ;
            }
            else
            {
                this.createSerial(txtFilter, null);
            }
              
          }
          else
          {
              this.dataGrid.instance.filter(["serialNum", "contains", txtFilter]);
                  
              //  this.dataGrid.instance.getDataSource().searchValue();
              let dataSource =this.itemSerials.filter(x=>x.serialNum === txtFilter);
              debugger;
              // let search=  this.dataGrid.instance.
              if(dataSource!==undefined && dataSource!==null && dataSource.length > 0)
              {
                this.isCreateSerial=false;
                // this.dataGrid.instance.filter(["serialNum", "contains", txtFilter]);
              }
              else
              {
                this.isCreateSerial=true;
              }
          }
         
        } 
        // else
        // {
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Serial No',
        //     text:  'Please input different value'
        //   }).then(() =>{
        //      setTimeout(() => {
        //       this.filter.nativeElement.focus();
        //       this.filter.nativeElement.value = '';
        //      }, 10);
        //   }) ;
        // }
      
    }
    // debugger;
    // this.userParams.keyword = txtFilter;
    // this.loadItemPagedList();
  }
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  saveSelection()
  { 
    if((this.selectedKey.length??0)===0)
    {
      Swal.fire({
        icon: 'warning',
        title: 'Serial Number',
        text: 'Please select serial number' 
      });
    }
    else
    {
      if(this.item?.promotionIsPromo?.toString() !== '1')
      {
        this.item.quantity = this.selectedKey.length ?? 0;
        let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
        this.itemSerialSelected = dataSelected; 
        // debugger;
        if(this.itemSerialSelected!==null && this.itemSerialSelected !== undefined)
        {
          if(this.itemSerialSelected.length !== parseInt(this.item.quantity.toString()) )
          {
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Please choose by the quantity entered' 
            });
          }
          else
          {
            let arr = [];
            this.item.lineItems = [];
           
            // var groups =  this.itemSerialSelected.reduce(function (obj, item) {
  
              
            //   obj[item.bookletNo] = obj[item.bookletNo] || [];
            //   obj[item.bookletNo].name = item.bookletNo;
            //   obj[item.bookletNo].push({
            //     serialNum : item.serialNum,
            //     expDate : item.expDate,
            //     quantity : 1,
            //     lineItems : [],
            //     bookletNo : item.bookletNo,
        
            //   });
        
            //   return obj;
            // }, {});
            // // Step 1. Get all the object keys.
            // let evilResponseProps = Object.keys(groups);
        
            // // Step 2. Create an empty array.
            // let goodResponse = [];
        
            // // Step 3. Iterate throw all keys.
            // for (let prop of evilResponseProps) {
            //   goodResponse.push(groups[prop]);
            // }
   
            // var itemX = Object.assign({}, this.item);
            // goodResponse.forEach(element => {
             
            //   let itemAdd: IBasketItem = new IBasketItem();
            //   itemAdd = itemX;
            //   // itemAdd.lineItems=[];
            //   itemAdd.bookletNo = element.name;
            //   let quantity =0;
            //   debugger;
            //   element.forEach(serial => {
            //     quantity++; 
            //     itemAdd.lineItems.push(serial); 
            //   });  
            //   console.log('add itemX', itemAdd);
            //   debugger;
            //   this.basketService.addItemBasketToBasket(itemAdd, quantity , null );
            // });
            // this.modalRef.hide();
  
            this.itemSerialSelected.forEach(serial => {
              const itemSerial = new  IBasketItem(); 
              itemSerial.serialNum = serial.serialNum;
              itemSerial.expDate = serial.expDate;
              itemSerial.quantity = 1;
              itemSerial.lineItems = [];
              itemSerial.bookletNo = serial.bookletNo;
             this.item.lineItems.push(itemSerial); 
             
              arr.push(this.item);
              this.closeModal() ;
              // this.modalRef.hide();
          });
          // debugger;
          this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
          // this.basketService.addItemListBasketToBasket(arr, true);
          }
            
        }
      }
      else
      {
        if(this.item.quantity != (this.selectedKey?.length ?? 0))
        {
          Swal.fire({
            icon: 'warning',
            title: 'Promotion item Serial',
            text: 'Please select valid serial line number' 
          });
        }
        else
        {
          this.item.quantity = this.selectedKey.length ?? 0;
          let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
          this.itemSerialSelected = dataSelected; 
          // debugger;
          if(this.itemSerialSelected!==null && this.itemSerialSelected !== undefined)
          {
            if(this.itemSerialSelected.length !== parseInt(this.item.quantity.toString()) )
            {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please choose by the quantity entered' 
              });
            }
            else
            {
              let arr = [];
              this.item.lineItems = [];
           
              debugger;
              this.itemSerialSelected.forEach(serial => {
                const itemSerial = new  IBasketItem(); 
                itemSerial.serialNum = serial.serialNum;
                itemSerial.expDate = serial.expDate;
                itemSerial.quantity = 1;
                itemSerial.price = this.item.price;// serial.price;
                itemSerial.lineItems = [];
                itemSerial.bookletNo = serial.bookletNo;
               this.item.lineItems.push(itemSerial); 
               
                arr.push(this.item);
                this.closeModal() ;
                // this.modalRef.hide();
            });
            // Chỉ cập nhật lại Serial Item không update và update promotion
            // debugger;
            // this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
            // this.basketService.addItemListBasketToBasket(arr, true);
            }
              
          }
        }
        
      }
       
    }
   
     
  }
  scannerProfile: any;
  // initScanner()
  // {
  //   this.scannerProfile = null;
  //   this.scannerProfile = BarcodeScanner();
  //   // this.basketService.changeBasketResponseStatus(true);
  //   this.scannerProfile.on( async (code, event: any) => {
  //     event.preventDefault();
  //     console.log(code); 
  //     debugger;
  //     var source = event.target;
  //     var sourceElement = event.srcElement;
  //     let nameOfInput = source['name'];
  //     console.log('Begin Scan', new Date().getMilliseconds());
  //     let classnameOfInput = sourceElement['className'];
  //     // nameOfInput === '' || nameOfInput === undefined ||nameOfInput === null ||
  //     if( nameOfInput === 'txtCustomer' || nameOfInput === 'txtOMSId' || nameOfInput === 'txtNote' || nameOfInput === 'txtSerialNumber' || nameOfInput === 'txtBookletNumber' ||  nameOfInput === 'txtQrCode' ||   classnameOfInput === 'txtQrCode' || classnameOfInput === 'swal2-input' )
  //     {
  //         if( nameOfInput === 'txtQrCode' ||   classnameOfInput === 'txtQrCode')
  //         {
  //           return false;
  //         }
  //     }
  //     else
  //     { 
  //         if(this.basketService.getBasketResponseStatus())
  //         {
           
  //           if(code!==null && code !==undefined && code !=='')
  //           {
  //             this.txtSearch.nativeElement.value = '';
  //             let enterKey = '%0A';
  //             // code.includes()
  //             if(code.indexOf(enterKey) !== -1)
  //             {
  //               code = code.replace(enterKey,'');
  //             } 
  //             this.onEnter(code, true);
             
  //           }
  //         }
  //         else
  //         {
  //         //  this.alertify.warning('System running progress. Please try again.');
  //           this.txtSearch.nativeElement.value = '';
  //         }
  //     }
        
      
  //   });
  //   this.commonService.scannerProfile = this.scannerProfile;
  // }
  pageChanged(event: any): void
  {
    this.pagination.currentPage = event.page;
     this.loadItemPagedList();
  }
  
  loadItemPagedList() {
    this.userParams.itemCode = this.item.id; 
    this.userParams.company = this.authService.getCurrentInfor().companyCode; 
    this.userParams.slocId = this.authService.storeSelected().whsCode; 
   debugger;
   
    // if(this.pagination.currentPage === null || this.pagination.currentPage === undefined)
    //   this.pagination.currentPage=1;
    // if(this.pagination.itemsPerPage === null || this.pagination.itemsPerPage === undefined)
    //   this.pagination.currentPage=50;
    this.itemService.getItemSerialByItem(this.pagination === undefined ? 1: this.pagination.currentPage, this.pagination === undefined ? 200 : this.pagination.itemsPerPage, this.userParams).subscribe((res: any) => {
        debugger;
        this.itemSerials = res.result;
        this.pagination = res.pagination;
    }, error => {
      // this.alertify.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Serial By Item',
        text: "Can't get data"
      });
    });
     
  }
  closeModal() {
    // this.payment.isCloseModal = true;
    this.outValue.emit(true);
  }
  loadItemSerialList() {
    // this.userParams.itemCode = this.item.id; 
    // this.userParams.company = this.authService.getCurrentInfor().companyCode; 
    // this.userParams.slocId = this.authService.storeSelected().whsCode; 
   debugger;
   let store = this.authService.storeSelected();
    // if(this.pagination.currentPage === null || this.pagination.currentPage === undefined)
    //   this.pagination.currentPage=1;
    // if(this.pagination.itemsPerPage === null || this.pagination.itemsPerPage === undefined)
    //   this.pagination.currentPage=50;
    this.itemService.getSerialByItem(store.companyCode, this.item.id, "", store.whsCode).subscribe((response: any) => {
        // debugger;
        if(response.success)
        {
          this.itemSerials = response.data;
        }
        else
        {
          // this.alertify.warning(response.message);
          Swal.fire({
            icon: 'warning',
            title: 'Serial By Item',
            text: response.message
          });
        }
        // this.itemSerials = res.result;
        // this.pagination = res.pagination;
    }, error => {
      // this.alertify.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Serial By Item',
        text: "Can't get data"
      });
    });
     
  }

}
