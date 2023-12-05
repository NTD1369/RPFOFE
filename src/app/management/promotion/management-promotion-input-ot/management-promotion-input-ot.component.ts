import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SPromoBuy } from 'src/app/_models/promotion/promotionbuy';
import { SPromoOTGroup } from 'src/app/_models/promotion/promotionViewModel';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-management-promotion-input-ot',
  templateUrl: './management-promotion-input-ot.component.html',
  styleUrls: ['./management-promotion-input-ot.component.scss']
})
export class ManagementPromotionInputOtComponent implements OnInit {

  ot: SPromoBuy;
  @Input() items: ItemViewModel[];
  display= false; 
  @Input() selectedKey = []; 
  allMode: string;
  checkBoxesMode: string;
  @Output() outItem = new EventEmitter<any>();
  constructor(public authService: AuthService) {  
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always'
    this.ot = new SPromoBuy();
  }

  ngOnInit() {
    this.ot.lineType = 'OTGroup';
  }
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  applyOTGroup()
  {
    let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
    // this.itemSerialSelected = dataSelected; 
    this.ot.lines =[];
    let stt= 1;
    dataSelected.forEach((itemSelected : ItemViewModel) => {
      let line = new SPromoOTGroup();
      line.lineCode = itemSelected.itemCode;
      line.lineUom = itemSelected.uomCode;
      line.groupID = this.ot.lineCode;
      line.lineName = itemSelected.itemName;
      line.lineNum= stt;
      stt++;
      this.ot.lines.push(line);
    });
   
    debugger;
    this.outItem.emit(this.ot); 

  }

}
