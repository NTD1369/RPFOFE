import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { info } from 'console';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MInvoiceInfor } from 'src/app/_models/invoiceinfor';
import { TSalesInvoice } from 'src/app/_models/tsalesinvoice';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { InvoiceinforService } from 'src/app/_services/data/invoiceinfor.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-shop-invoice-input',
  templateUrl: './shop-invoice-input.component.html',
  styleUrls: ['./shop-invoice-input.component.scss']
})
export class ShopInvoiceInputComponent implements OnInit {

  // invoiceList: TSalesInvoice[]=[] ;
  invoice: TSalesInvoice;
  invoiceInfor: MInvoiceInfor;
  userParams: any = {};
  display = false;
  selectedKey = [];
  allMode: string;
  checkBoxesMode: string;
  invoiceList: MInvoiceInfor[] = [];
  lguAdd: string = "Add";

  constructor(private invoiceInforService: InvoiceinforService, private billService: BillService, private alertify: AlertifyService, private routeNav: Router, private authService: AuthService,
    private basketService: BasketService, public modalRef: BsModalRef, private route: ActivatedRoute, private customerService: CustomerService
  ) {
    // public ref: DynamicDialogRef,
    this.invoice = new TSalesInvoice();
    this.invoiceInfor = new MInvoiceInfor();
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
    // console.log(this.invoiceInfor)
    let basket = this.basketService.getCurrentBasket();
    console.log("basket", basket);
    if (basket.invoice !== null && basket.invoice !== undefined) {
      this.invoiceInfor = this.mapTInvoice2Invoice(basket.invoice);
      this.showGrid = false;
      this.showEdit = true;
      this.isView = false;
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
  EditInfor(invoice) {
    this.invoiceInfor = invoice;
    this.isNew = false;
    this.showEdit = true;
    this.showGrid = false;
    this.isView = false;
  }
  reset(isNew) {
    debugger;
    this.invoiceInfor = new MInvoiceInfor();
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
    this.invoice = this.mapInvoice2TInvoice(this.invoiceInfor);
    this.basketService.changeInvoice(this.invoice).subscribe((response: any) => {

    });
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
    let invoice = this.mapInvoice2TInvoice(this.invoiceInfor);
    // console.log("Test",invoice)
    // this.invoice = this.mapInvoice2TInvoice(this.invoiceInfor);
    this.basketService.changeInvoice(invoice).subscribe((response: any) => {

    });
    this.alertify.success("Add invoice to basket successfully completed.");
    this.modalRef.hide();
  }
  SelectInfor(infor) {
    // debugger;
    // this.invoice.customerName = infor.CustomerName;
    // this.invoice.taxCode = infor.TaxCode;
    // this.invoice.email = infor.Email;
    // this.invoice.address = infor.Address;
    // this.invoice.phone = infor.Phone;
    // this.invoice.remark = infor.Remark;
    let invoice = this.mapInvoice2TInvoice(infor);
    // console.log("Test1",invoice)
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
    invoice.id = infor.id;
    invoice.companyCode = infor.companyCode;
    invoice.name = infor.name;
    invoice.customerName = infor.customerName;
    invoice.email = infor.email;
    invoice.taxCode = infor.taxCode;
    invoice.phone = infor.phone;
    invoice.address = infor.address;
    invoice.remark = infor.remarks;
    return invoice;
  }

  mapTInvoice2Invoice(infor: TSalesInvoice): MInvoiceInfor {
    let invoice = new MInvoiceInfor();
    invoice.id = infor.id;
    invoice.companyCode = infor.companyCode;
    invoice.name = infor.name;
    invoice.customerName = infor.customerName;
    invoice.email = infor.email;
    invoice.taxCode = infor.taxCode;
    invoice.phone = infor.phone;
    invoice.address = infor.address;
    invoice.remarks = infor.remark;
    return invoice;
  }

  validateEmail(email) {
    console.log("email", email);
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email));
  }

  save() {
    let customer = this.basketService.getCurrentBasket().customer;
    console.log("customer", customer);
    this.invoiceInfor.customerId = customer.customerId;

    this.invoiceInfor.companyCode = this.authService.getCurrentInfor().companyCode;
    if (this.isNew === true) {
      let id = uuidv4();
      this.invoiceInfor.id = id;
      const vEmail = this.validateEmail(this.invoiceInfor.email);
      // if (this.invoiceInfor.customerName === "") {
      //   this.alertify.error('Please enter Customer Name.');
      // } else if (this.invoiceInfor.name === "") {
      //   this.alertify.error('Please enter Name.');
      // } else 
      debugger;
      if (this.invoiceInfor.taxCode === "") {
        this.alertify.error('Please enter Tax Code.');
      } else if (vEmail !== true && this.invoiceInfor.email !=="") {
        this.alertify.error('Wrong format Email');
      }
      // else if (this.invoiceInfor.address === "") {
      //   this.alertify.error('Please enter Address.');
      // }
      else {
        this.invoiceInforService.create(this.invoiceInfor).subscribe((response: any) => {
          if (response.success) {
            this.alertify.success('Create completed successfully.');
            this.showGrid = true;
            this.showEdit = false;
            this.isView = false;
            this.loadInvoiceListByCus();
            // this.modalRef.hide();
          }
          else {
            // this.alertify.error(response.message);
            Swal.fire({
              icon: 'warning',
              title: 'Create Invoice Information',
              text: response.message
            });
          }

        }, error => {
          // this.alertify.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Invoice Information',
            text: "Can't get data"
          });
        });
      }


    }
    else {
      this.invoiceInforService.update(this.invoiceInfor).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.showGrid = true;
          this.showEdit = false;
          this.isView = false;
          this.loadInvoiceListByCus();
          // this.modalRef.hide();
        }
        else {
          // this.alertify.error(response.message);
          Swal.fire({
            icon: 'warning',
            title: 'Invoice Information',
            text: response.message
          });
        }

      }, error => {
        // this.alertify.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Invoice Information',
          text: "Can't get data"
        });
      });

    }
  }


  loadInvoiceListByCus() {
    let customer = this.basketService.getCurrentBasket().customer;
    this.invoiceInforService.getAll(customer.companyCode, customer.customerId, '', '', '').subscribe((response: any) => {
      if (response.success) {
        this.invoiceList = response.data;

        console.log("this.invoiceList", this.invoiceList);
      }
      else {
        // this.alertify.error(response.message);
        Swal.fire({
          icon: 'warning',
          title: 'Invoice Information',
          text: response.message
        });
      }
    })

    // let customer = this.basketService.getCurrentBasket().customer;
    // console.log("customer", customer);
    // if (customer.customerId === "") {
    //   this.customerService.getByCompanyFilter(customer.companyCode, "", "", "", "", "", "", "", customer.phone, "").subscribe((res: any) => {
    //     if (res.data.length > 0) {
    //       localStorage.setItem('basket', JSON.stringify(res.data))
    //       this.GetAllCusInvoice();
    //     }
    //   })
    // }
  }

  GetAllCusInvoice() {

  }


  loadInvoiceList() {
    // this.userParams.itemCode = this.item.id; 
    debugger;
    let customer = this.basketService.getCurrentBasket().customer;
    this.billService.getInvoiceInfor(this.authService.getCurrentInfor().companyCode, customer.mobile, '').subscribe((response: any) => {
      if (response.success) {
        this.invoiceList = response.data;
        console.log("load invoid lisst", this.invoiceList);
      }
      else {
        this.alertify.warning(response.message);
      }

    })


  }

}
