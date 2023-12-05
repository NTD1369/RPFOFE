import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TGoodsReceiptPolineSerial } from 'src/app/_models/grpo';
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
  selector: 'app-management-item-serial',
  templateUrl: './management-item-serial.component.html',
  styleUrls: ['./management-item-serial.component.scss']
})
export class ManagementItemSerialComponent implements OnInit {

 
  @Input() item: ItemViewModel;
  itemSerials: MItemSerial[];
  itemSerialSelected: MItemSerial[];
  pagination: Pagination;
  userParams: any = {};
  display= false;
  selectedKey = [];
  sales: Sale[];
  allMode: string;
  checkBoxesMode: string;
  quantity = 1;
  @Output() outEvent = new EventEmitter<any>();
  selectFromTop()
  {
    this.selectedKey=[];
    // let itemList = this.itemSerials.slice(this.item.quantity);
    // itemList.forEach((item)=> {
    //   this.selectedKey.push(item.serialNum);
    // });
    for (var i = 0; i < this.quantity; i++) { 
      this.selectedKey.push(this.itemSerials[i].serialNum); 
    }
    console.log(this.selectedKey);
  }
  selectRandom()
  {
    this.selectedKey=[];
    var colArr = [];
    for (var i = 0; i < this.quantity; i++) { 
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
  constructor(  private itemService: ItemService, private alertify: AlertifyService, private routeNav: Router, private itemserialService: ItemserialService,
           private basketService: BasketService , public modalRef: BsModalRef , private route: ActivatedRoute, private authService: AuthService,
            ) { 
              // public ref: DynamicDialogRef,
                console.log("Item add");
                console.log(this.item); 
                // this.sales = service.getSales();
                this.allMode = 'allPages';
                this.checkBoxesMode = 'always'
              }
  ngAfterViewInit() {
    if(this.item.serialLines!==null && this.item.serialLines!==undefined && this.item.serialLines.length > 0)
    {
      this.item.serialLines.forEach((item)=> {
        this.selectedKey.push(item.serialNum);
      });
    }
    
  }
  ngOnInit() {
    // this.route
    // this.loadItems();
    // debugger;
    
    this.loadItemPagedList();
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
  }
  isCreateSerial= false;
  createSerial(txtFilter: any)
  {
    debugger;
    let serial = new MItemSerial();
    serial.companyCode = this.authService.getCurrentInfor().companyCode;
    serial.itemCode = this.item.itemCode;
    serial.quantity = 1;
    serial.serialNum = txtFilter;
    serial.expDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    serial.createdBy = this.authService.getCurrentInfor().username;
    let serialStock = new MItemSerialStock();
    serialStock.companyCode = serial.companyCode;
    serialStock.itemCode = serial.itemCode;
    serialStock.stockQty = 1;
    serialStock.slocId = this.authService.storeSelected().whsCode;
    serial.serialStock = serialStock;
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
      let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
      this.itemSerialSelected = dataSelected; 
      debugger;
      if(this.itemSerialSelected!==null && this.itemSerialSelected !== undefined)
      {
        if(this.itemSerialSelected.length !== parseInt(this.quantity.toString()) )
        {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: 'Please choose by the quantity entered' 
          });
        }
        else
        {
          // this.item.serialLines = [];
          // this.itemSerialSelected.forEach(serial => {
          //     const itemSerial = new  TGoodsReceiptPolineSerial(); 
          //     itemSerial.serialNum = serial.serialNum;
          //     itemSerial.quantity = 1;
          //     // itemSerial.lineItems = [];
          //     this.item.serialLines.push(itemSerial); 
          // });  
          this.outEvent.emit(this.itemSerialSelected); 
        
          // this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
          // this.modalRef.hide();
        }
          
      }
     
  }
  pageChanged(event: any): void
  {
    this.pagination.currentPage = event.page;
     this.loadItemPagedList();
  }
  
  loadItemPagedList() {
    this.userParams.itemCode = this.item.itemCode; 
    this.userParams.company = this.authService.getCurrentInfor().companyCode; 
    this.userParams.slocId = this.item.slocId; 
    debugger;
   
    // if(this.pagination.currentPage === null || this.pagination.currentPage === undefined)
    //   this.pagination.currentPage=1;
    // if(this.pagination.itemsPerPage === null || this.pagination.itemsPerPage === undefined)
    //   this.pagination.currentPage=50;
    this.itemService.getItemSerialByItem(this.pagination === undefined ? 1: this.pagination.currentPage, this.pagination === undefined ? 200 : this.pagination.itemsPerPage, this.userParams).subscribe((res: any) => {
        debugger;
        this.itemSerials = res.result;
        this.itemSerials = this.itemSerials.filter(x=>x.quantity > 0);
        this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
     
  }
  


}
