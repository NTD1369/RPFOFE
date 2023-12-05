import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MPriceList } from 'src/app/_models/mpricelist';
import { MPrepaidCard } from 'src/app/_models/prepaidcard';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { PricelistService } from 'src/app/_services/data/pricelist.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import saveAs from 'file-saver';
@Component({
  selector: 'app-management-price-list',
  templateUrl: './management-price-list.component.html',
  styleUrls: ['./management-price-list.component.scss']
})
export class ManagementPriceListComponent implements OnInit {

  message="";
  dateFormat = "";
  list: MPriceList[];
  userParams: any = {};
  modalRef: BsModalRef;
  card: MPriceList;
  isNew: boolean = false;
  lguAdd: string = "Add";
  storelist: MStore[];
  loadStoreList()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storelist = response.data;
        this.storelist.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName; 
        });
      } 
      else
      {
        this.alertify.warning(response.message);
      }
      // this.storelist = response;
    })
  }
  openModal(isNew: boolean, model: MPriceList, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.card = new MPriceList();
      this.card.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.card = model;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private pricelistService: PricelistService, private alertify: AlertifyService, private authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute,private storeService: StoreService) {
    this.customizeText = this.customizeText.bind(this);
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
  selectedDate;

  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    // this.loadItems();
    this.loadStoreList();
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'InventoryPosting' ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
    
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        // customizeCell: function(options) {
        //     const excelCell = options;
        //     excelCell.font = { name: 'Arial', size: 12 };
        //     excelCell.alignment = { horizontal: 'left' };
        // } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
  customizeText(e) {

    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  loadItems(store) {
    this.message = "";
    this.pricelistService.getAll(this.authService.getCurrentInfor().companyCode,store,'' ).subscribe((response: any) => {
      if (response.success) {
        this.list = response.data;
        // console.log("list", res);
        if(this.list!==null && this.list!==undefined && this.list?.length > 0 )
        {
          
        }
        else
        {
          this.message = "Price list data "+ store +" is null";
        }
      }
      else {
        this.alertify.warning(response.message);
      }

    }, error => {
      this.alertify.error(error);
    });
  }

  getItem(item: MPrepaidCard) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }

  // updateModel(model) {
  //   debugger; 
  //   if(this.isNew)
  //   {

  //     this.prepaidService.create(model).subscribe((response: any) => {
  //       if(response.success)
  //       {
  //         this.alertify.success('Create completed successfully'); 
  //         this.loadItems();
  //         this.modalRef.hide();
  //       }
  //       else{
  //         this.alertify.error(response.message);
  //       } 
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  //   }
  //   else{
  //     this.prepaidService.update(model).subscribe((response: any) => {
  //       if(response.success)
  //       {
  //         this.alertify.success('Update completed successfully.'); 
  //         this.modalRef.hide();
  //       }
  //       else{
  //         this.alertify.error(response.message);
  //       }

  //     }, error => {
  //       this.alertify.error(error);
  //     });
  //   }

  // }
  functionId = "Adm_PriceList";
  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "success", text: this.lguAdd,
          onClick: this.openModal.bind(this, true, null, this.template)
        }
      });
    }
  }


}
