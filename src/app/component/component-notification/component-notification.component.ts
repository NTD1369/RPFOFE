import { identifierName } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { identity } from 'rxjs';
import { TInventoryHeader } from 'src/app/_models/inventory';
import { AuthService } from 'src/app/_services/auth.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';

@Component({
  selector: 'app-component-notification',
  templateUrl: './component-notification.component.html',
  styleUrls: ['./component-notification.component.scss']
})
export class ComponentNotificationComponent implements OnInit {
  @Input() inventoryListTS : TInventoryHeader[]= [];
  @Input() inventoryListTR : TInventoryHeader[]= [];
  showSubMenu: boolean = false;
  scrollByContent = true;
  scrollByThumb = true;
  scrollbarMode: string;
  pullDown = false;
  @Output() closeIntificationMenu = new EventEmitter<any>();
  // inventoryListTS: TInventoryHeader[];
  // inventoryListTR: TInventoryHeader[];
  constructor( public authService: AuthService,private inventory: InventoryService,private router: Router) {
    // this.loadList();
   }
  closeMore() {
    // debugger;
    // this.showDrop = false;
    this.closeIntificationMenu.emit(false);

  }
  ngOnInit() {
    // debugger
   
  }
  loadList() {
    let store = this.authService.storeSelected();
    this.inventory.GetTranferNotify(store.companyCode, store.storeId).subscribe((response: any) => {
      debugger;
      this.inventoryListTS = response.data.filter(x=>x.fromStore ==store.storeId && x.docType ==='S' );
      this.inventoryListTR = response.data.filter(x=>x.toStore ==store.storeId && x.docType ==='S');

    });
  }
  createTR(id){
    this.router.navigate(["admin/inventory/transfer-receipt", 'i', id]).then(x=> window.location.reload());
  }
  viewDetail(id){
    // debugger;
    this.router.navigate(["admin/inventory/transfer-shipment", 'e', id]).then(x=> window.location.reload());
  }
}
