import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { TPurchaseOrderHeader } from 'src/app/_models/purchase';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintService } from 'src/app/_services/data/print.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PurchaseService } from 'src/app/_services/transaction/purchase.service';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-management-purchase-list',
  templateUrl: './management-purchase-list.component.html',
  styleUrls: ['./management-purchase-list.component.scss'],
  providers: [
    DatePipe
  ],
})
export class ManagementPurchaseListComponent implements OnInit {

  list: TPurchaseOrderHeader[];
  isFilter = false;
  fromdate = "";
  todate = "";
  totalBill = 0;
  openBill = 0;
  cancelBill = 0;
  closedBill = 0;
  saveBill: any = [];
  selectType = "";
  functionId = "Adm_Purchase";
  statusOptions: any = [
    { name: 'All', value: '' },
    { name: 'Closed', value: 'C' },
    { name: 'Canceled', value: 'N' },
    { name: 'Open', value: 'O' },
  ];
  production = false;


  constructor(public authService: AuthService, private purchaseService: PurchaseService, private alertifyService: AlertifyService, private router: Router,
    private printService: PrintService,private route: ActivatedRoute, public datepipe: DatePipe) {
    this.customizeText = this.customizeText.bind(this);
  }

  @ViewChild('transId', { static: false }) transId: DxTextBoxComponent;
  @ViewChild('toCalendar', { static: false }) toCalendar: DxDateBoxComponent;
  @ViewChild('fromCalendar', { static: false }) fromCalendar: DxDateBoxComponent;
  @ViewChild('cbbStatus', { static: false }) cbbStatus: DxSelectBoxComponent;

  ngAfterViewInit() {
    let now = new Date();
    let from = now.setDate(1);
    this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    setTimeout(() => {
      console.log("1");
      this.loadList();
    }, 50);
  }

  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'GoodsReceiptPO' ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
  
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        customizeCell: function(options) {
          debugger;
            // const excelCell = options;
            const { gridCell, excelCell } = options;

            if(gridCell.rowType === 'data') {
              // debugger;
              //   excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              //   excelCell.alignment = { horizontal: 'left' };
            }
        } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
  ngOnInit() {
    this.production = environment.production;

    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.route.params.subscribe(data => {
      debugger;
      this.isFilter = data['isfilter'];
    })
    // this.loadList();
  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  onToolbarPreparing(e) {
    // if (this.authService.checkRole(this.functionId, '', 'I')) {
    //   e.toolbarOptions.items.unshift({
    //     location: 'before',
    //     widget: 'dxButton',
    //     options: {
    //       width: 136,
    //       icon: "add", type: "default", text: "Add",
    //       onClick: this.newPromotion.bind(this)
    //     }
    //   });
    // }
  }

  newPromotion() {
    this.router.navigate(["admin/purchase/new"]);
  }
  createGrpo(data) {
    debugger;
    this.router.navigate(["admin/purchase/grpo/", data.data.purchaseId, data.data.companyCode, data.data.storeId]);
    // :id/:companycode/:storeid
    // this.alertifyService.warning('Function not response.');
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Do you want to delete this promotion',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No'
    // }).then((result) => {
    //   if (result.value) {
    //     this.purchaseService.removePromotion(data.data.promoId,"CP001").subscribe((response: any)=>{
    //       debugger;
    //       if(response.success)
    //       {
    //         debugger;
    //         this.alertifyService.success('Remove promotion '+ data.data.promoId +' completed successfully. ');
    //         this.loadList();
    //       }
    //       else
    //       {
    //         this.alertifyService.warning('Remove promotion failed. Message: ' + response.message);
    //       }
    //     });

    //   }
    // });
  }
  viewDetail(data) {
    debugger;
    // this.router.navigate(["admin/purchase", "edit", data.data.purchaseId]);
    window.open('admin/purchase/edit/' +  data.data.purchaseId , "_blank");
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
  printGrpo(data) {
    this.router.navigate(["admin/print/purchase", data.data.purchaseId]);
  }
  cardNameColumn_calculateCellValue(rowData) {
    let value = rowData.cardCode;
    if (rowData.cardName !== null && rowData.cardName !== undefined)
      value = rowData.cardCode + " - " + rowData.cardName;
    return value;
  }

  filterbills(type) {
    debugger;
    this.list = this.saveBill;
    if (type === "All") {
      this.list = this.saveBill;
    }
    if (type === "C") {
      this.list = this.list.filter(x => x.status?.toLowerCase() === 'closed' || x.status?.toLowerCase() === 'c');
    }
    if (type === "N") {
      this.list = this.list.filter(x => x.status?.toLowerCase() === 'canceled' || x.status?.toLowerCase() === 'n');
    }
    if (type === "O") {
      this.list = this.list.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o');
    }
    this.selectType = type;
  }


  loadList() {
    let fromStr = '';
    let toStr = '';
    let key = '';
    let status = '';
    // if (this.production === false) {

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
    // }

    let comp = this.authService.storeSelected();
    this.purchaseService.getAll(comp.companyCode, comp.storeId, fromStr, toStr, key, status).subscribe((response: any) => {
      if (response.success = true) {
        this.list = response.data;
        console.log("response", response);
        // if(this.isFilter)
        // this.list = response.filter(x=>x.status.toLowerCase() ==='o');
        // this.list.forEach(el => {
        //   if(el.isCanceled==='1')
        //   el.status = 'Canceled'
        //   el.status = this.statusOptions.filter(x => x.value == el.status)[0].name;
        // });
        this.list = response.data;
        this.totalBill = response.data?.length ?? 0;
        this.cancelBill = response.data?.filter(x => x.status?.toLowerCase()  === 'canceled' || x.status?.toLowerCase()  === 'n')?.length ?? 0;
        this.closedBill = response.data?.filter(x => x.status?.toLowerCase()  === 'closed' || x.status?.toLowerCase()  === 'c')?.length ?? 0; 
        this.openBill = response.data?.filter(x => x.status.toLowerCase() === 'open' || x.status.toLowerCase() === 'o')?.length ?? 0; 
        this.saveBill = this.list;
      }

    });
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  PrintDetail(data) {
    console.log("data", data);
    this.router.navigate(["admin/purchaseorder/print", data.purchaseId]).then(() => {
      // window.location.reload();
    });
  }
}
