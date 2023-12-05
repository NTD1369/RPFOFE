import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-tool-popover',
  templateUrl: './shop-tool-popover.component.html',
  styleUrls: ['./shop-tool-popover.component.scss']
})
export class ShopToolPopoverComponent implements OnInit {
  @Input()  target: any='';
  @Input()  content: any='';
  @Input()  withShowDetailVisible = false;
  constructor() { }

  ngOnInit() {

  }

}
