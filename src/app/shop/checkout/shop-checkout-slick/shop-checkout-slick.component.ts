import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Item } from 'src/app/_models/item';
import { ShopItemDetailComponent } from '../../tools/shop-item-detail/shop-item-detail.component';

@Component({
  selector: 'app-shop-checkout-slick',
  templateUrl: './shop-checkout-slick.component.html',
  styleUrls: ['./shop-checkout-slick.component.scss']
})
export class ShopCheckoutSlickComponent implements OnInit {

  @Input() items: Item[];
  display= false;
  item: Item = new Item();
  modalRef: BsModalRef; 
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
  slickInit(e) {
    // console.log('slick initialized');
  }
  itemDisplay(event)
  { 
    this.item = event;
    const initialState = {
      item:  this.item, title: 'Item Detail',
    };
    this.modalRef = this.modalService.show(ShopItemDetailComponent, {initialState});
  }
  breakpoint(e) {
    // console.log('breakpoint');
  }
  
  afterChange(e) {
    // console.log('afterChange');
  }
  
  beforeChange(e) {
    // console.log('beforeChange');
  }
  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 3,
    "rows": 2,
    "nextArrow": "<a class='nav-btn next-slide' style='z-index: 999;'><i class='far fa-arrow-alt-circle-right fa-3x'></i></a>",
    "prevArrow": "<a class='nav-btn prev-slide' style='z-index: 999;'><i class='far fa-arrow-alt-circle-left fa-3x'></i></a>",
    "dots": true,
    "infinite": false,
    variableWidth: false,
    // mobileFirst:true,//add this one
    "responsive": [
      {
        breakpoint: 1430,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          rows:2
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

}
