import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { CommonService } from 'src/app/_services/common/common.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-payment-change-popup',
  templateUrl: './shop-payment-change-popup.component.html',
  styleUrls: ['./shop-payment-change-popup.component.css']
})
export class ShopPaymentChangePopupComponent implements OnInit {

   
  @Input() amount=0;
  @Input() currency : MStoreCurrency[];
  @Output() outPayment = new EventEmitter<boolean>();
  constructor(private alertify: AlertifyService, private commonService: CommonService) { }

  ngOnInit() {
    debugger;
    // console.log('payment', this.payment);
    console.log('currency', this.currency);
  }
  confirmOk()
  { 
    this.outPayment.emit(true);
  }

}
