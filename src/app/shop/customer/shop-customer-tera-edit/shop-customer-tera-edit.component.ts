import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MCustomer } from 'src/app/_models/customer';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-customer-tera-edit',
  templateUrl: './shop-customer-tera-edit.component.html',
  styleUrls: ['./shop-customer-tera-edit.component.scss']
})
export class ShopCustomerTeraEditComponent implements OnInit {
  @Input() customer: MCustomer; 
  functionId = "Adm_Company";
  @Input() isNew= false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  constructor(private authService: AuthService, private alertify: AlertifyService,public datepipe: DatePipe) { }

  ngOnInit() {
    console.log(this.customer,"customer")
  }
update()
{
  let formatDob = new Date(this.customer.dob);
  this.customer.dob = new DatePipe("en-US").transform(formatDob, 'yyyy-MM-dd');
  let formatJonner = new Date(this.customer.joinedDate);
  this.customer.joinedDate = new DatePipe("en-US").transform(formatJonner, 'yyyy-MM-dd');
  this.customer.companyCode= this.authService.getCompanyInfor().companyCode;
  this.customer.createdBy= this.authService.getCurrentInfor().username;
  this.outModel.emit(this.customer);
}
}
