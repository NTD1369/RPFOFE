import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Item } from 'src/app/_models/item';
import { MItemSerialStock } from 'src/app/_models/itemserialstock';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { Pagination } from 'src/app/_models/pagination';
import { IBasketItem } from 'src/app/_models/system/basket';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
 
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemserialService } from 'src/app/_services/data/itemserial.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { Sale } from 'src/app/_services/test/app.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-member-input',
  templateUrl: './shop-member-input.component.html',
  styleUrls: ['./shop-member-input.component.scss']
})
export class ShopMemberInputComponent implements OnInit {


  
 
  itemSerials: MItemSerial[];
  itemSerialSelected: MItemSerial[];
  pagination: Pagination;
  userParams: any = {};
  display= false;
  
  @Input() selectedKey = [];
  sales: Sale[];
  allMode: string;
  checkBoxesMode: string;
  selectFromTop()
  {
    this.selectedKey=[];
    // let itemList = this.itemSerials.slice(this.item.quantity);
    // itemList.forEach((item)=> {
    //   this.selectedKey.push(item.serialNum);
    // });
    for (var i = 0; i < this.item.quantity; i++) { 
      this.selectedKey.push(this.itemSerials[i].serialNum); 
    }
    console.log(this.selectedKey);
  }
  selectRandom()
  {
    this.selectedKey=[];
    var colArr = [];
    for (var i = 0; i < this.item.quantity; i++) { 
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

  isCreateSerial= false;
  createSerial(txtFilter: any)
  {
    debugger;
    let serial = new MItemSerial();
    serial.companyCode = this.authService.getCurrentInfor().companyCode;
    serial.itemCode = this.item.id;
    serial.quantity = 1;
    serial.serialNum = txtFilter;
    // serial.expDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    serial.expDate = this.item.endDate;
    serial.createdBy = this.authService.getCurrentInfor().username;
    let serialStock = new MItemSerialStock();
    serialStock.companyCode = serial.companyCode;
    serialStock.itemCode = serial.itemCode;
    serialStock.stockQty = 1;
    serialStock.slocId = this.authService.storeSelected().whsCode;
    serial.serialStock = serialStock;
    serial.status =  "N/A" ;
    this.itemserialService.create(serial).subscribe((response: any)=>{
      if(response.success===true)
      {
        this.alertify.success("Create successfully completed. Serial: " + serial.serialNum);
        this.loadItemPagedList();
      }
      else
      {
        this.alertify.error(response.message);
      }
    })
    
  }
  filterBy(txtFilter: any)
  {
    if (txtFilter === null || txtFilter === undefined || txtFilter === "") {
      this.dataGrid.instance.clearFilter();
      this.isCreateSerial=false;
    } else {

       
       
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
        // else
        // {
          
        // }
      
    }
    // debugger;
    // this.userParams.keyword = txtFilter;
    // this.loadItemPagedList();
  }
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  saveSelection()
  { 
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to apply!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
        this.itemSerialSelected = dataSelected; 
        debugger;
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
            this.item.lineItems = [];
            this.itemSerialSelected.forEach(serial => {
              debugger;
                const itemSerial = new  IBasketItem(); 
                itemSerial.serialNum = serial.serialNum;
                itemSerial.quantity = 1;
                itemSerial.phone = serial.phone;
                itemSerial.name = serial.name;
                itemSerial.custom1 = serial.licensePlates;
                itemSerial.lineItems = [];
                this.item.lineItems.push(itemSerial); 
            });  
            debugger;
            setTimeout(() => {
              this.basketService.removeItemWiththoutPromotion(this.item);
            }, 5); 
            setTimeout(() => {
              this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
              this.modalRef.hide();
              
            }, 120);
          }
            
        }
      }
    });
     
  }
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
   if(this.item?.itemType?.toLowerCase() === 'member' || this.item?.itemType?.toLowerCase() === 'class' )
   {
      let basket = this.basketService.getCurrentBasket();  
      this.userParams.customer = basket?.customer?.customerId; 
   }  
    // if(this.pagination.currentPage === null || this.pagination.currentPage === undefined)
    //   this.pagination.currentPage=1;
    // if(this.pagination.itemsPerPage === null || this.pagination.itemsPerPage === undefined)
    //   this.pagination.currentPage=50;
    this.itemService.getItemSerialByItem(this.pagination === undefined ? 1: this.pagination.currentPage, this.pagination === undefined ? 200 : this.pagination.itemsPerPage, this.userParams).subscribe((res: any) => {
        debugger;
        this.itemSerials = res.result;
        this.pagination = res.pagination;
        this.itemSerials.forEach(element => {
          if(element.serialNum === this.item.serialNum)
          {
            element.name = this.item.name;
            element.phone = this.item.phone;
            element.licensePlates = this.item.custom1;
          }
        });
        
        this.display= true;
    }, error => {
      this.alertify.error(error);
    });
     
  }
  

  @Input() item: IBasketItem;
  // @Input() item: ItemViewModel;
 
  itemBasket: IBasketItem= new IBasketItem();
  // @Input() itemCode: string;
 
  @Output() outItem = new EventEmitter<any>();
  constructor(private basketService: BasketService ,private itemService: ItemService,  private itemserialService: ItemserialService,
    private alertify: AlertifyService, public authService: AuthService, public modalRef: BsModalRef ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always'
  }
  
  ngOnInit() {
    if(this.item.memberDate===null || this.item.memberDate===undefined)
    {
      this.item.memberDate= new Date();
    }
  
    if(this.item.quantity === undefined || this.item.quantity === null)
    {
      this.item.quantity =1;
    }
    let a = this.selectedKey;
    debugger;
    this.calcuEndate();
    this.loadItemPagedList();
  
  }
  calcuEndate()
  {
    debugger;
    let mothValue = this.item.customField2 ===null ? 0 : parseFloat(this.item.customField2) ;
    var date = new Date(new Date(this.item.memberDate).setMonth(new Date(this.item.memberDate).getMonth() + ( mothValue * parseInt(this.item.quantity.toString())))) ;
    this.item.endDate = date;
  }
  handleValueChange (e) {
    // const previousValue = e.previousValue;
    // const newValue = e.value;
    // Event handling commands go here
    this.calcuEndate();
}
  addToOrder()
  {
    debugger;
    
    // this.item.memberValue = this.item.quantity;
    
    // this.item.memberValue= this.quantity;
    // this.item.lineItems = [];
    // this.itemSerialSelected.forEach(serial => {
    //     const itemSerial = new  IBasketItem(); 
    //     itemSerial.serialNum = serial.serialNum;
    //     itemSerial.quantity = 1;
    //     itemSerial.lineItems = [];
    //     this.item.lineItems.push(itemSerial); 
    // });  
    this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
    this.modalRef.hide();
    // this.basketService.addItemtoBasket(this.item, 1, response);
    // this.outItem.emit(this.item); 
  }
}
