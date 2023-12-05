import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IBasketItem } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-shop-exchange-item-list',
  templateUrl: './shop-exchange-item-list.component.html',
  styleUrls: ['./shop-exchange-item-list.component.scss']
})
export class ShopExchangeItemListComponent implements OnInit {

  @Input() items: IBasketItem[]=[];
  itemSelected: IBasketItem[]=[];
  @Input() title = "";
  display= false;
  selectedKey = [];
 
  allMode: string;
  checkBoxesMode: string;
  @Output() outEvent = new EventEmitter<any>();
  constructor(private basketService: BasketService , private commonService: CommonService, public authService: AuthService, public modalRef: BsModalRef ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always'
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this.loadShortcuts();
    },10);
    
  }
  shortcuts: ShortcutInput[] = [];  
  autoNavigateToFocusedRow = true;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  
  loadShortcuts()
  {
    this.shortcuts=[];
    this.shortcuts.push(
      {
        key: ["enter"],
        label: "Add item to order",
        description: "Add item to order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          setTimeout(() => {
            this.commitEvent(true);
          }, 100); 
        },
        preventDefault: true
      },
      {
        key: ["ctrl + o"],
        label: "New order",
        description: "New order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          setTimeout(() => {
            this.commitEvent(false);
          }, 100);
           
        },
        preventDefault: true
      },
       
      {
        key: ["ctrl + d"],
        label: "Focus grid",
        description: "Focus grid",
        command: (e) => { 
          // this.dataGrid.instance.refresh();
          debugger;
           if(this.items!==null && this.items!==undefined && this.items?.length > 0)
           {
            // this.focusedRowKey= this.items[0].keyId;
            this.dataGrid.focusedRowKey = this.items[0].barcode;  
            // const scrollTo = document.querySelector(".gridContainerX");
            // if (scrollTo) {
            //   scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
            // }
            this.dataGrid.instance.focus();
            // this.focusedcelKey = 1;
            // this.dataGrid.instance.navigateToRow(1);
           }
          
        },
        preventDefault: true
      },
        
    )
    setTimeout(() => {
      debugger;
      this.commonService.changeShortcuts(this.shortcuts, true); 
      console.log("this.shortcuts Ex", this.shortcuts);
    }, 100);
   
 
  }
  ngOnInit() {
    debugger;
    console.log(this.items,"11231231231")
    if(this.title!==null && this.title!==undefined && this.title!=='')
    {
      
    }
    else
    {
      this.title = "Exchange Items";
    }
  }
  // @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  commitEvent(apply)
  {
    let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
    this.itemSelected = dataSelected; 
    this.outEvent.emit({success :apply, models: dataSelected});
  }
}
