import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SBarcodeSetup } from 'src/app/_models/barcodesetup';
import { ItemScanBarcodeViewModel } from 'src/app/_models/itemScanBarcodeViewModel';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { BarcodesetupService } from 'src/app/_services/data/barcodesetup.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { MUser } from 'src/app/_models/user';

@Component({
  selector: 'app-shop-scan-barcode',
  templateUrl: './shop-scan-barcode.component.html',
  styleUrls: ['./shop-scan-barcode.component.scss']
})
export class ShopScanBarcodeComponent implements OnInit {

  storeSelected: MStore;
  userSelected: MUser;
  searchBarcodeOnly = "false";
  orderId: string = "";
  order: Order;
  functionId = "Adm_Shop";
  modalRef: BsModalRef;
  scannerEnabled = false;
  result: string;
  itemBc: string = '';

  barcodeSetup: SBarcodeSetup[];
  itemsBybarcode: ItemScanBarcodeViewModel[] = [];
  @ViewChild('txtSearch', { static: false }) txtSearch: ElementRef;

  // test
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent;

  barcodeValue;

  ngAfterViewInit() {
    // this.barcodeScanner.start();
  }

  onValueChanges(result) {
    this.GetData(result.codeResult.code, true);
    this.barcodeValue = result.codeResult.code;
  }

  onStarted(started) {
    console.log("started", started);
  }
  // test
  constructor(private itemService: ItemService, private barcodeService: BarcodesetupService, private alertify: AlertifyService,
    public authService: AuthService) {
    this.order = new Order();
  };

  ngOnInit() {

  }

  onScanSuccess(result: string) {
    console.log("result", result);
    this.GetData(result, true);
  }

  onEnter(value, type) {
    this.GetData(value, type);
    this.hideCamera();
  }

  onSubmit(value, type) {
    this.GetData(value, type);
    this.hideCamera();
  }

  arr = [];
  GetData(value, type) {
    this.storeSelected = this.authService.storeSelected();
    this.userSelected = this.authService.getCurrentInfor();
    this.itemService.getScanBarcode(this.storeSelected.companyCode, this.userSelected.userId, this.storeSelected.storeId, value, '').subscribe((response: any) => {
      console.log("response", response);
      if (response.data !== null && response.data !== undefined && response.data.length > 0) {
        const found = response.data.filter(x => x.slocId !== this.storeSelected.customField1);
        this.itemsBybarcode = found;
        console.log("this.itemsBybarcode", this.itemsBybarcode);

        if (type === true) {
          this.scannerEnabled = false;
          this.txtSearch.nativeElement.value = value;
          this.barcodeScanner.stop();
        }
      }
      else {
        Swal.fire({
          icon: 'warning',
          title: 'Item',
          text: "Data not found."
        });
        this.scannerEnabled = false;
        this.txtSearch.nativeElement.value = '';
      }
    })
  }

  value: string;
  isError = false;

  onError(error) {
    console.error(error);
    this.isError = true;
  }

  showCamera() {
    this.scannerEnabled = true;
    this.txtSearch.nativeElement.value = '';
    this.barcodeScanner.start();
    this.itemsBybarcode = [];
  }

  hideCamera() {
    this.scannerEnabled = false;
    this.txtSearch.nativeElement.value = '';
    this.barcodeScanner.stop();
  }

  qrResultString: string;

  onCodeResult(resultString: string){
    this.qrResultString = resultString;
  }
}
