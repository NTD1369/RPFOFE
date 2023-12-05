import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MStore } from 'src/app/_models/store';

@Component({
  selector: 'app-shop-store-select',
  templateUrl: './shop-store-select.component.html',
  styleUrls: ['./shop-store-select.component.scss']
})
export class ShopStoreSelectComponent implements OnInit {
  @Input() store: MStore;
  @Input() index: number;
  @Input() hoverStore: number;
  @Output() storeSelected = new EventEmitter<any>();
  constructor() { }

  imagesBackground = ["image-store-1.png","image-store-2.jpg", "image-store-3.png", "image-store-4.jpg","image-store-5.jpg","image-store-6.jpg"];
  ngOnInit() {
    this.imagesBackground;
  }
  selectStore()
  {
    console.log("this.store", this.store);
    this.storeSelected.emit(this.store); 
  }
}
