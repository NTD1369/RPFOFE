import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { MStoreCurrency } from 'src/app/_models/storecurrency';
import { CommonService } from 'src/app/_services/common/common.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-payment-currency',
  templateUrl: './shop-payment-currency.component.html',
  styleUrls: ['./shop-payment-currency.component.css']
})
export class ShopPaymentCurrencyComponent implements OnInit {
  @Input() payment: MPaymentMethod;
  @Input() type="";
  @Input() amount=0;
  @Input() storeCurrency : MStoreCurrency[];
  @Output() outPayment = new EventEmitter<MPaymentMethod>();
  constructor(private alertify: AlertifyService, private commonService: CommonService) { }

  ngOnInit() {
    debugger;
    this.storeCurrency = this.storeCurrency.filter(x=>x.status === 'A');
  }
  applyPayment()
  { 
    // debugger;
   
    if(this.payment.currency!==null && this.payment.currency!==undefined && this.payment.currency!=='' )
    {
      if(this.payment.value!==null && this.payment.value!==undefined )
      {
        this.outPayment.emit(this.payment);
      }
      else
      {
        this.alertify.warning('Please input value');
       
      }
      
      
    }
    else
    {
      this.alertify.warning('Please select currency');
    }
    
  }
  closeModal()
  { 
    this.payment.isCloseModal = true;
    this.outPayment.emit(this.payment);
  }
  selectCurrency(currency: MStoreCurrency)
  {
    this.payment.rate = currency.rate;
    this.payment.currency = currency.currency;
    this.payment.value = 0;
    this.payment.isCloseModal = false;
    this.outPayment.emit(this.payment);
  }
  // 
}
