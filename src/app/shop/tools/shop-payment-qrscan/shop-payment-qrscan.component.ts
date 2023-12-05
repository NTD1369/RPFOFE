import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxTextBoxComponent, DxTextBoxModule } from 'devextreme-angular';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { IBasketPayment } from 'src/app/_models/system/basket';
import { CommonService } from 'src/app/_services/common/common.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-payment-qrscan',
  templateUrl: './shop-payment-qrscan.component.html',
  styleUrls: ['./shop-payment-qrscan.component.css']
})
export class ShopPaymentQrscanComponent implements OnInit {

  // @Input() apiValue: string ="";
  @Input() payment: IBasketPayment;
  @Input() isResetText: boolean = true;
  @Output() outEvent = new EventEmitter<IBasketPayment>();
  
  @ViewChild('txtQrCode', { static: false }) txtQrCode: DxTextBoxComponent;
  // response:MPaymentMethod;
  constructor(private alertify: AlertifyService, private commonService: CommonService) { }

  ngOnInit() {
 
    this.shortcuts = null;
    setTimeout(() => {
      this.txtQrCode.instance.focus();
    }, 100);
  }
  shortcuts: ShortcutInput[] = [];  
  
  showCamera=true;
  qrResultString="";
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.showCamera=false;
  }
  ngAfterViewInit() {
 
    this.loadShortcutManual();
    this.commonService.setHotKeyToNull();
  }
  loadShortcutManual()
  {
    // this.shortcuts = this.commonService.getShortcutsTonull(false);

   
    this.shortcuts = null;
  
   setTimeout(() => {
    this.commonService.changeShortcuts(this.shortcuts, true);
   }, 150);
  
    
  }
  applyValue(value)
  { 
    // debugger;
   
    if(value!==null && value!==undefined && value!=='' )
    {
      if(value!==null && value!==undefined )
      {
        this.payment.refNum= value;
        this.payment.isCloseModal = false;
        this.outEvent.emit(this.payment);
      }
        
    }
    else
    {
      this.alertify.warning('Please input value');
    }
    
  }
  checkCamera: boolean= false;
  camerasNotFound(e: Event) {
    // Display an alert modal here
    this.checkCamera = false;
  }

  cameraFound(e: Event) {
    // Log to see if the camera was found
    this.checkCamera = true;
  }
  closeModal()
  { 
    this.payment.isCloseModal = true;
    this.outEvent.emit(this.payment);
  }
   
}
