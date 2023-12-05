import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';

@Component({
  selector: 'app-management-invtransfer-search',
  templateUrl: './management-invtransfer-search.component.html',
  styleUrls: ['./management-invtransfer-search.component.scss']
})
export class ManagementInvtransferSearchComponent implements OnInit {

  @Output() dataSelected = new EventEmitter<any[]>();
  inventoryList: any;
  constructor(public authService: AuthService, private inventory: InventoryService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.loadList();
  }
  selected(data)
  { 
    this.dataSelected.emit(data);
  }
  loadList()
  {
    this.inventory.getInventoryList(this.authService.getCurrentInfor().companyCode ,'', this.authService.storeSelected().storeId,'S','','','','', '')
      .subscribe((response: any)=>{
      
        console.log("this.inventoryList", response.data)
        this.inventoryList = response.data.filter(x=>x.status!=='C'); 

    });
  }
}
