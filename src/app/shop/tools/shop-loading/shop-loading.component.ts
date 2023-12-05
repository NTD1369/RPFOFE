import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-loading',
  templateUrl: './shop-loading.component.html',
  styleUrls: ['./shop-loading.component.scss']
})
export class ShopLoadingComponent implements OnInit {

  @Input() inputText;
  constructor() { }

  ngOnInit() {
    console.log("inputText", this.inputText);
  }

}
