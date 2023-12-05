import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventorycoutingService } from 'src/app/_services/transaction/inventorycouting.service';

@Component({
  selector: 'app-management-inventory-counted-list',
  templateUrl: './management-inventory-counted-list.component.html',
  styleUrls: ['./management-inventory-counted-list.component.scss']
})
export class ManagementInventoryCountedListComponent implements OnInit {

  @Output() dataSelected = new EventEmitter<any[]>();
  inventoryList: any;
  store: MStore;
  //public modalRef: BsModalRef ,
  constructor(private authService: AuthService, private inventory: InventorycoutingService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.store = this.authService.storeSelected();
    this.loadList();
  }
  selected(data) {
    console.log("data count", data);
    // this.modalRef.hide();
    this.dataSelected.emit(data);
  }
  loadList() {
    let comp = this.store.companyCode;
    let store = this.store.storeId;
    this.inventory.getInventoryCountedList(comp, store, '', '', '').subscribe((response: any) => {
      debugger;
      this.inventoryList = response.data.filter(x => x.status === 'C' && x.isCanceled === 'N');
      console.log("this.inventoryList", this.inventoryList);
    });
  }

}
