import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MDeliverryInfor } from 'src/app/_models/deliverryinfor';
import { MInvoiceInfor } from 'src/app/_models/invoiceinfor';
import { TSalesDelivery } from 'src/app/_models/tsalesdelivery';
import { TSalesInvoice } from 'src/app/_models/tsalesinvoice';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { DeliveryinforService } from 'src/app/_services/data/deliveryinfor.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-delivery-input',
  templateUrl: './shop-delivery-input.component.html',
  styleUrls: ['./shop-delivery-input.component.scss']
})
export class ShopDeliveryInputComponent implements OnInit {


  // invoiceList: TSalesInvoice[]=[] ;
  delivery: TSalesDelivery;
  deliveryInfor: MDeliverryInfor;
  userParams: any = {};
  display = false;
  selectedKey = [];
  allMode: string;
  checkBoxesMode: string;
  deliveryList: MDeliverryInfor[] = [];
  lguAdd: string = "Add";

  constructor(private deliveryinforService: DeliveryinforService, private billService: BillService, private alertify: AlertifyService, private routeNav: Router, private authService: AuthService,
    private basketService: BasketService, public modalRef: BsModalRef, private route: ActivatedRoute,
  ) {
    // public ref: DynamicDialogRef,
    this.delivery = new TSalesDelivery();
    this.deliveryInfor = new MDeliverryInfor();
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always'

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
  ngAfterViewInit() {
    // this.item.lineItems.forEach((item)=> {
    //   this.selectedKey.push(item.serialNum);
    // });
  }

  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        width: 136,
        icon: "add", type: "default", text: this.lguAdd,
        onClick: this.reset.bind(this, true)
      }
    });
  }
  ngOnInit() {
    debugger;
    let basket = this.basketService.getCurrentBasket();
    if (basket.invoice !== null && basket.invoice !== undefined) {
      // this.deliveryInfor = this.mapTInvoice2Invoice(basket.invoice) ;
      this.showGrid = false;
      this.showEdit = true;
      this.isView = true;
    }
    else {
      this.showGrid = true;
      this.showEdit = false;
      this.isView = false;
    }
    this.loadInvoiceListByCus();
    // this.loadItemPagedList();
    // this.display= true;
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.bills = data['bills'].result;
    //   this.pagination = data['bills'].pagination;
    //   // debugger;

    //   // data['items']
    // });
  }
  EditInfor(delivery) {
    this.deliveryInfor = delivery;
    this.isNew = false;
    this.showEdit = true;
    this.showGrid = false;
    this.isView = false;
  }
  reset(isNew) {
    debugger;
    this.deliveryInfor = new MDeliverryInfor();
    this.isNew = true;
    this.showEdit = true;
    this.showGrid = false;
    this.isView = false;
  }
  filterBy(txtFilter: any) {
    if (txtFilter === null || txtFilter === undefined || txtFilter === "") {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(["serialNum", "contains", txtFilter]);
    }
    // debugger;
    // this.userParams.keyword = txtFilter;
    // this.loadItemPagedList();
  }
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  saveSelection() {
    // this.delivery = this.mapInvoice2TInvoice(this.deliveryInfor);
    // this.basketService.changeInvoice(this.delivery).subscribe((response: any)=>{

    // });
    this.alertify.success("Add invoice to basket successfully completed.");
    this.modalRef.hide();
    // let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
    // this.itemSerialSelected = dataSelected; 
    // debugger;
    // if(this.itemSerialSelected!==null && this.itemSerialSelected !== undefined)
    // {
    //   if(this.itemSerialSelected.length !== parseInt(this.item.quantity.toString()) )
    //   {
    //     Swal.fire({
    //       icon: 'warning',
    //       title: 'Warning',
    //       text: 'Please choose by the quantity entered' 
    //     });
    //   }
    //   else
    //   {
    //     this.item.lineItems = [];
    //     this.itemSerialSelected.forEach(serial => {
    //         const itemSerial = new  IBasketItem(); 
    //         itemSerial.serialNum = serial.serialNum;
    //         itemSerial.quantity = 1;
    //         itemSerial.lineItems = [];
    //         this.item.lineItems.push(itemSerial); 
    //     });  
    //     this.basketService.addItemBasketToBasket(this.item, this.item.quantity , null );
    //     this.modalRef.hide();
    //   }

    // }

  }
  SelectInvoice() {
    // let invoice = this.mapInvoice2TInvoice(this.deliveryInfor);
    // this.invoice = this.mapInvoice2TInvoice(this.invoiceInfor);
    // this.basketService.changeInvoice(invoice).subscribe((response: any)=>{

    // });
    this.alertify.success("Add invoice to basket successfully completed.");
    this.modalRef.hide();
  }
  SelectInfor(infor) {
    debugger;
    // this.invoice.customerName = infor.CustomerName;
    // this.invoice.taxCode = infor.TaxCode;
    // this.invoice.email = infor.Email;
    // this.invoice.address = infor.Address;
    // this.invoice.phone = infor.Phone;
    // this.invoice.remark = infor.Remark;
    let invoice = this.mapInvoice2TInvoice(infor);
    // this.invoice = this.mapInvoice2TInvoice(this.invoiceInfor);
    this.basketService.changeInvoice(invoice).subscribe((response: any) => {

    });
    this.alertify.success("Add invoice to basket successfully completed.");
    this.modalRef.hide();
  }
  isView = false;
  showGrid = true;
  showEdit = false;
  removeInvoice() {
    // let invoice = new TSalesInvoice();
    this.basketService.changeInvoice(null).subscribe((response: any) => {
      // this.alertify.success("Add invoice to basket successfully completed.");
      this.modalRef.hide();
    })
  }
  toggleDislay() {
    this.showGrid = !this.showGrid;
    this.showEdit = !this.showEdit;

  }
  isNew = false;
  mapInvoice2TInvoice(infor: MInvoiceInfor): TSalesInvoice {
    let invoice = new TSalesInvoice();
    invoice.companyCode = infor.companyCode;
    invoice.customerName = infor.name;
    invoice.email = infor.email;
    invoice.taxCode = infor.taxCode;
    invoice.phone = infor.phone;
    invoice.address = infor.address;
    invoice.remark = infor.remarks;
    return invoice;
  }

  mapTInvoice2Invoice(infor: TSalesInvoice): MInvoiceInfor {
    let invoice = new MInvoiceInfor();
    invoice.companyCode = infor.companyCode;
    invoice.name = infor.customerName;
    invoice.email = infor.email;
    invoice.taxCode = infor.taxCode;
    invoice.phone = infor.phone;
    invoice.address = infor.address;
    invoice.remarks = infor.remark;
    return invoice;
  }

  save() {
    let customer = this.basketService.getCurrentBasket().customer;
    // this.deliveryInfor.customerId = customer.customerId;
    this.deliveryInfor.companyCode = this.authService.getCurrentInfor().companyCode;
    if (this.isNew === true) {
      // let id = uuidv4();
      this.deliveryInfor.id = '';
      this.deliveryinforService.create(this.deliveryInfor).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully.');
          this.showGrid = true;
          this.showEdit = false;
          this.isView = false;
          this.loadInvoiceListByCus();
          // this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }

      }, error => {
        this.alertify.error(error);
      });

    }
    else {
      this.deliveryinforService.update(this.deliveryInfor).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.showGrid = true;
          this.showEdit = false;
          this.isView = false;
          this.loadInvoiceListByCus();
          // this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }

      }, error => {
        this.alertify.error(error);
      });

    }

  }
  loadInvoiceListByCus() {
    // let customer =this.basketService.getCurrentBasket().customer;
    //   this.invoiceInforService.getAll(this.authService.getCurrentInfor().companyCode, customer.customerId , '','','').subscribe((response: any) =>{

    //     this.invoiceList = response;
    //   })
  }
  loadInvoiceList() {
    // this.userParams.itemCode = this.item.id; 
    debugger;
    let customer = this.basketService.getCurrentBasket().customer;
    this.billService.getInvoiceInfor(this.authService.getCurrentInfor().companyCode, customer.mobile, '').subscribe((response: any) => {
      if (response.success) {
        // this.invoiceList = response.data;
        // console.log( this.invoiceList);
      }
      else {
        this.alertify.warning(response.message);
      }

    })


  }


}
