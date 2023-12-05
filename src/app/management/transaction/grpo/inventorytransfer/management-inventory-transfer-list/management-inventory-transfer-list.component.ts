import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventorycoutingService } from 'src/app/_services/transaction/inventorycouting.service';

@Component({
  selector: 'app-management-inventory-transfer-list',
  templateUrl: './management-inventory-transfer-list.component.html',
  styleUrls: ['./management-inventory-transfer-list.component.scss']
})
export class ManagementInventoryTransferListComponent implements OnInit {

  //public modalRef: BsModalRef ,
  constructor(private authService: AuthService, private inventory: InventorycoutingService) { }

  ngOnInit() {
    
  }
 
}
