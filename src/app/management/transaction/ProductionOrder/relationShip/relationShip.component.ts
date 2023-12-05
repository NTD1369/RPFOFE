import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TGoodsIssueHeader } from 'src/app/_models/goodissue';
import { TGoodsReceiptHeader } from 'src/app/_models/goodreceipt';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GoodreceiptService } from 'src/app/_services/transaction/goodreceipt.service';
import { GoodsissueService } from 'src/app/_services/transaction/goodsissue.service';

@Component({
  selector: 'app-relationShip',
  templateUrl: './relationShip.component.html',
  styleUrls: ['./relationShip.component.css']
})
export class RelationShipComponent implements OnInit {

  constructor(private router: Router,private alertifyService: AlertifyService, public authService: AuthService) { }
  @Input() goodIssueList: TGoodsIssueHeader[];
  @Input() goodReceiptList: TGoodsReceiptHeader[];
  isLoading=false;

  ngOnInit() {
  }


 storeNameColumn_calculateCellValue(rowData) {
    let value = rowData.storeId;
    if (rowData.storeName !== null && rowData.storeName !== undefined)
      value = rowData.storeId + " - " + rowData.storeName;
    return value;
  }



  viewGoodIssue(data: any) {
    debugger;
    window.open('admin/goodissue/e/' +  data.invtid , "_blank");
    // this.router.navigate(["admin/goodissue", 'e', data.invtid]).then(x=>window.location.reload());

  }
  viewGoodReceipt(data: any) {
    debugger;
    window.open('admin/goodreceipt/e/' +  data.invtid , "_blank");

    // this.router.navigate(["admin/goodreceipt", 'e', data.invtid]).then(x=>window.location.reload());
  }
}
