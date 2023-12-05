import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';

@Component({
  selector: 'app-shop-reason-input',
  templateUrl: './shop-reason-input.component.html',
  styleUrls: ['./shop-reason-input.component.scss']
})
export class ShopReasonInputComponent implements OnInit {

  @Input() langs;
  @Input() reasonList;
  reasonFilterList;
  @Output() outReason = new EventEmitter<any>();
  reasonSelected: any={};
  constructor( private basketService: BasketService , public modalRef: BsModalRef , private route: ActivatedRoute, public authService: AuthService) { }

  ngOnInit() {
    this.reasonFilterList = this.reasonList;
  }
  
  onLanguageChanged(lang)
  {
    this.reasonFilterList = this.reasonList.filter(x=>x.language === lang);
  }
  reasonText='';
  onReasonChanged(reason)
  {
    debugger;
    this.reasonText = reason.value;
  }
  cancel()
  {
    this.reasonSelected.selected = false;
    this.outReason.emit(this.reasonSelected);
  }
  applyReason(reason)
  {
    this.reasonSelected.selected = true;
    this.reasonSelected.selectedReason = reason;
    this.outReason.emit(this.reasonSelected);
  }
}
