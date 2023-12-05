import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TInventoryHeader, TInventoryLine, TInventoryLineSerial } from 'src/app/_models/inventory';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';

@Component({
  selector: 'app-management-print-transfer-in',
  templateUrl: './management-print-transfer-in.component.html',
  styleUrls: ['./management-print-transfer-in.component.css']
})
export class ManagementPrintTransferInComponent implements OnInit {

  
  inventory: TInventoryHeader;
  lines: TInventoryLine[]=[];
  serialLines: TInventoryLineSerial[]=[];
  invId='';
  mode='';
  isNew= false;
  isEditGrid=false;
  store: MStore;
  fromStore: MStore;
  toStore: MStore;
  isReceipt= false;
  constructor(private authService: AuthService, private inventoryService: InventoryService, private storeService: StoreService,
    private itemService: ItemService, private modalService: BsModalService, private storageService: StorageService ,private alertifyService: AlertifyService, private route: ActivatedRoute) { }
  storeList: MStore[]=[];
  SlocFromList: MStorage[]=[];
  SlocToList: MStorage[]=[];
  itemList: ItemViewModel[]= [];
  docTypes: any = [
    { name: 'Shipment', value:'S'},
    { name: 'Receipt', value:'R'},
    
  ];
  loadStore()
  {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeList = response.data;
         
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.storeList= response;
    });
    // this.storeService.getAll().subscribe((response)=>{
    //   this.storeList = response;
    // })
  }
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  transferSelected(data)
  {
    this.modalRef.hide();
    this.inventoryService.getInventoryTransfer(data.invtid,this.store.storeId, this.store.companyCode).subscribe((response: any)=>{
      setTimeout(() => {
        this.inventory= response.data;
        this.lines = response.data.lines;   
        this.inventory.refInvtid = this.inventory.invtid;
        this.loadSlocFromStore(this.inventory.fromStore);
        this.loadSlocToStore(this.inventory.toStore);
        console.log(response);
      },50);
    });
    console.log(data);
  }
   
  loadSlocFromStore(storeId)
  {
    let comp= this.store.companyCode;
    this.storageService.getByStore(storeId, comp).subscribe((response: any)=>{
      if(response.success)
      {
        this.SlocFromList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.SlocFromList = response;
    })
  }
  loadSlocToStore(storeId)
  {
    let comp= this.store.companyCode;
    this.storageService.getByStore(storeId, comp).subscribe((response: any)=>{
      if(response.success)
      {
        this.SlocToList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.SlocToList = response;
    })
  }
   
  loadItemList()
  {
    this.itemService.getItemViewList(this.authService.getCurrentInfor().companyCode,'','','','','','','').subscribe((response: any)=>{
      this.itemList = response.data;
      // debugger;
    });
     
  }
  total: number=0;
  ngOnInit() {
    this.store= this.authService.storeSelected();
    this.loadStore();
    // debugger;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.invId = data['id'];
    })
   
    this.inventoryService.getInventoryTransfer(this.invId, this.store.storeId,  this.store.companyCode).subscribe((response: any)=>{
      this.inventory = response.data;
      debugger;
      this.loadSlocFromStore(this.inventory.fromStore);
      this.loadSlocToStore(this.inventory.toStore);
      setTimeout(() => {
        this.lines = response.data.lines;   
        this.total = this.inventory.lines.reduce((a,b)=> b.quantity + a, 0)
        // console.log(this.lines);
      },50);
  
     
    });
  }
  onFromStoreChanged(store)
  {
    // debugger;
    this.fromStore= store;
    this.loadSlocFromStore(this.fromStore.storeId);
  }
  onToStoreChanged(store)
  {
    this.toStore= store;
    this.loadSlocToStore(this.fromStore.storeId);
  }
  printPage(){
    window.print();
  }

}
