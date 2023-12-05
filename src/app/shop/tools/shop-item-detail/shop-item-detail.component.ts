import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Item } from 'src/app/_models/item';

@Component({
  selector: 'app-shop-item-detail',
  templateUrl: './shop-item-detail.component.html',
  styleUrls: ['./shop-item-detail.component.css']
})
export class ShopItemDetailComponent implements OnInit {
  @Input() item: Item ;
  constructor( public modalRef: BsModalRef) { }

  ngOnInit() {
  }
  closeModal()
  {
    this.modalRef.hide();
  }
}
