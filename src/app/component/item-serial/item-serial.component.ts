import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Item } from 'src/app/_models/item';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { IBasketItem } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-serial',
  templateUrl: './item-serial.component.html',
  styleUrls: ['./item-serial.component.scss']
})
export class ItemSerialComponent implements OnInit {

  @Input() itemCode: string;
  itemSerials: MItemSerial[];
  itemSerialSelected: MItemSerial[]; 
  userParams: any = {};
  display= false;
  selectedKey = []; 
  allMode: string;
  checkBoxesMode: string;
  public onClose: Subject<MItemSerial[]>;
  @Output() SerialSelected = new EventEmitter<MItemSerial[]>();
  // selectFromTop()
  // {
  //   this.selectedKey=[];
    
  //   for (var i = 0; i < this.item.quantity; i++) { 
  //     this.selectedKey.push(this.itemSerials[i].serialNum); 
  //   }
  //   console.log(this.selectedKey);
  // }
  // selectRandom()
  // {
  //   this.selectedKey=[];
  //   var colArr = [];
  //   for (var i = 0; i < this.item.quantity; i++) { 
  //     var rand = this.itemSerials[Math.floor(Math.random() * this.itemSerials.length)];
  //     colArr.push(rand);
  //   }
   
  //   colArr.forEach((item)=> {
  //     this.selectedKey.push(item.serialNum);
  //   });
  // }
  constructor( private itemService: ItemService, private alertify: AlertifyService, private routeNav: Router,private authService: AuthService,
      public modalRef: BsModalRef , private route: ActivatedRoute,
     ) { 
       // public ref: DynamicDialogRef,
         console.log("Item add");
        //  console.log(this.item); 
         // this.sales = service.getSales();
         this.allMode = 'allPages';
         this.checkBoxesMode = 'always'
       }
  ngAfterViewInit() {
    // this.item.lineItems.forEach((item)=> {
    //   this.selectedKey.push(item.serialNum);
    // });
  }
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  ngOnInit() {
    this.onClose = new Subject();
    this.loadSerialList();
  }
  loadSerialList()
  {
    this.itemService.getSerialByItem(this.authService.getCurrentInfor().companyCode, this.itemCode,'','').subscribe((response: any)=>{
       this.itemSerials = response.data;
    });
  }
  saveSelection()
  { 
      let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
      this.itemSerialSelected = dataSelected; 
      debugger;
      if(this.itemSerialSelected!==null && this.itemSerialSelected !== undefined)
      {
        // if(this.itemSerialSelected.length !== parseInt(this.item.quantity.toString()) )
        // {
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Warning',
        //     text: 'Please choose by the quantity entered' 
        //   });
        // }
        // else
        // {
          // this.item.lineItems = [];
          // this.itemSerialSelected.forEach(serial => {
          //     const itemSerial = new  IBasketItem(); 
          //     itemSerial.serialNum = serial.serialNum;
          //     itemSerial.quantity = 1;
          //     itemSerial.lineItems = [];
          //     this.item.lineItems.push(itemSerial); 
          // });  
          // this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
          this.SerialSelected.emit(this.itemSerialSelected); 
          this.onClose.next(this.itemSerialSelected);
          this.modalRef.hide();
        // }
          
      }
     
  }
}
