import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventorycoutingService } from 'src/app/_services/transaction/inventorycouting.service';

@Component({
  selector: 'app-management-inventory-couting',
  templateUrl: './management-inventory-couting.component.html',
  styleUrls: ['./management-inventory-couting.component.scss']
})
export class ManagementInventoryCoutingComponent implements OnInit {

  
  inventoryList: any;
  lguAdd: string = "Add";
  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];
 
  fromdate = "";
  todate = "";
  @ViewChild('transId', { static: false }) transId: DxTextBoxComponent;
  @ViewChild('toCalendar', { static: false }) toCalendar: DxDateBoxComponent;
  @ViewChild('fromCalendar', { static: false }) fromCalendar: DxDateBoxComponent;
  @ViewChild('cbbStatus', { static: false }) cbbStatus: DxSelectBoxComponent;
  totalBill = 0; 
  openBill = 0;
  cancelBill = 0;
  closedBill = 0;
  saveBill: any = [];
  ngAfterViewInit() {
    
    let now = new Date();
    let from = now.setDate(1);


    this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    setTimeout(() => {
      this.loadList();
    }, 50);
   
  }
  selectType = "";
  filterbills(type) {
    debugger;
    this.inventoryList = this.saveBill;
    if (type === "All") {
      this.inventoryList = this.saveBill;
    }
    if (type === "C") {
      this.inventoryList = this.inventoryList.filter(x =>x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c');
    }
    if (type === "N") {
      this.inventoryList = this.inventoryList.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n');
    } 
    if (type === "O") {
      this.inventoryList = this.inventoryList.filter(x =>x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o');
    }
    this.selectType = type;
  }
  production = false;

  constructor(public authService: AuthService, private inventorycoutingService : InventorycoutingService , public datepipe: DatePipe, private alertifyService: AlertifyService, private router: Router,
    private inventoryCountingService: InventorycoutingService, private printService: PrintService) {
      // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
     }
  functionId="Adm_InvCounting";
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.loadList();
  }
  storeNameColumn_calculateCellValue(rowData)
{
  let value=rowData.storeId;
  if(rowData.storeName!==null && rowData.storeName!==undefined)
    value= rowData.storeId + " - " + rowData.storeName; 
  return value;
}

  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    debugger;
    if(this.authService.checkRole(this.functionId , '', 'I'))
    {
    e.toolbarOptions.items.unshift( {
            location: 'before',
            widget: 'dxButton',
            options: {
                width: 136, 
                icon:"add", type:"default", text:this.lguAdd,
                onClick: this.newModel.bind(this)
            } 
        });
      }
}
  // loadList()
  // {
  //   let store= this.authService.storeSelected();
  //   this.inventorycoutingService.getByStore(store.companyCode, store.storeId).subscribe((response: any)=>{
  //     console.log("response.data", response.data);
  //       this.inventoryList = response.data; 
        
  //       this.totalBill = response.data?.length ?? 0;
  //       this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
  //       this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
  //       this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
  //       this.saveBill = this.inventoryList;
  //   });
  // }
  loadList() { 
    let store = this.authService.storeSelected();
    let user= this.authService.getCurrentInfor().username;

    let now = new Date();
    let fromStr = '';
    let toStr = '';
    let key = '';
    debugger;
    let status = '';
    if(this.production===false)
    {
       let from = this.fromCalendar.value;
       let to = this.toCalendar.value;
       status = this.cbbStatus.value;
       key = this.transId.value;
       if (from !== null && from !== undefined) {
         // from = now.setDate(now.getDate() - 60 ); 
         fromStr = this.datepipe.transform(from, 'yyyy-MM-dd');
       }
   
       if (to !== null && to !== undefined) {
         // to = now;
         toStr = this.datepipe.transform(to, 'yyyy-MM-dd');
       }
    }
    this.inventorycoutingService.getInventoryCountingList(store.companyCode, store.storeId,  status, fromStr, toStr, key, user).subscribe((response: any) => {
    // this.inventory.getInventoryList(this.authService.storeSelected().companyCode, '', store.storeId, 'R', '', '', '', '', user).subscribe((response: any) => {
      if (response.success) {
        // response.data.forEach(el => {
        //   if (el.status == 'C' && el.isCanceled == 'Y') {
        //     el.status = 'Canceled';
        //   }
        // }); 
        this.inventoryList = response.data;
        // console.log("this.inventoryList R:", this.inventoryList);
        this.totalBill = response.data?.length ?? 0;
        this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
        this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
        this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
        this.saveBill = this.inventoryList;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  newModel()
  {
    // this.inventory = new TGoodsReceiptHeader();
    // this.router.navigate['/goodreceipt/m=i'];
    this.router.navigate(["admin/inventory/counting", 'i', '']);
  }
  viewDetail(data: any)
  {
    debugger;
    this.router.navigate(["admin/inventory/counting", 'e', data.icid]);
  }

  // PrintDetail(data: any) {
  //   this.inventoryCountingService.getInventoryCounting(data.icid, data.storeId,  data.companyCode).subscribe((response: any) => {
  //     this.printService.changeParamInvCouting(response);
  //   });
  // }

  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["admin/inventorycouting/print", data.icid]).then(() => {
      // window.location.reload();
    });
  }
}
