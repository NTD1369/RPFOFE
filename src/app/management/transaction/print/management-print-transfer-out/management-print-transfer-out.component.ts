import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 
import { BsModalService } from 'ngx-bootstrap/modal';
import { TInventoryHeader, TInventoryLine, TInventoryLineSerial } from 'src/app/_models/inventory';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service'; 
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';

@Component({
  selector: 'app-management-print-transfer-out',
  templateUrl: './management-print-transfer-out.component.html',
  styleUrls: ['./management-print-transfer-out.component.css']
})
export class ManagementPrintTransferOutComponent implements OnInit {
  inventory: TInventoryHeader;
  lines: TInventoryLine[]=[];
  serialLines: TInventoryLineSerial[]=[];
  constructor(public authService: AuthService, private inventoryService: InventoryService, private storeService: StoreService,
    private modalService: BsModalService, private storageService: StorageService ,private alertifyService: AlertifyService, private route: ActivatedRoute) { }
  mode="";
  invId="";
  store: MStore;
  total: number=0;
  @ViewChild('funnel' , { static: false}) funnel;  
  // @ViewChild(DxFunnelComponent, { static: false }) funnel: DxFunnelComponent;
  printFunnel () {
    debugger;
    this.funnel.instance.print();

  };
  scrollByContent = true;
    scrollByThumb = true;
    scrollbarMode: string;
    pullDown = false;
  ngOnInit() {
    this.store = this.authService.storeSelected();
    // this.loadItemList();
    // this.loadStore();
    // debugger;
    this.route.params.subscribe(data => { 
      this.invId = data['id'];
    })
  
    this.inventoryService.getInventoryTransfer(this.invId, this.store.storeId,  this.store.companyCode).subscribe((response: any)=>{
      this.inventory = response.data;
      debugger;
      // this.loadSlocFromStore(this.inventory.fromStore);
      // this.loadSlocToStore(this.inventory.toStore);
      setTimeout(() => {
        this.lines = response.data.lines;   
        this.total = this.inventory.lines.reduce((a,b)=> b.quantity + a, 0)
        // console.log(this.lines);
      },50);
  
     
    });
  }

  printPage(){
    window.print();
  }

}
