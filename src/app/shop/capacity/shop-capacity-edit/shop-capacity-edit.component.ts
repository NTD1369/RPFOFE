import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MStoreCapacity } from 'src/app/_models/mstorecapacity';
import { IBasketItem } from 'src/app/_models/system/basket'; 
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-capacity-edit',
  templateUrl: './shop-capacity-edit.component.html',
  styleUrls: ['./shop-capacity-edit.component.scss']
})
export class ShopCapacityEditComponent implements OnInit {

  @Input() model: IBasketItem;
  @Input()  isNew= false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  // @HostListener('window:beforeunload', ['$event'])
  constructor(   private formBuilder: FormBuilder, private alertify: AlertifyService) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      productName: [''],
      appointmentDate: [''],
      quantity: [''],  
    });
  }
  saveModel()
  {
    debugger;

   
    this.outModel.emit(this.model); 
  }
 
}
