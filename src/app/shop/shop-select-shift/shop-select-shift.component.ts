import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TInventoryHeader } from 'src/app/_models/inventory';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { InventoryService } from 'src/app/_services/transaction/inventory.service';

@Component({
  selector: 'app-shop-select-shift',
  templateUrl: './shop-select-shift.component.html',
  styleUrls: ['./shop-select-shift.component.css']
})
export class ShopSelectShiftComponent implements OnInit {
  inventoryListTS: TInventoryHeader[];
  inventoryListTR: TInventoryHeader[];
  modalRef: BsModalRef;
  constructor( private alertify: AlertifyService, private commonService: CommonService, private shiftService: ShiftService,
    private basketService: BasketService,   private authService: AuthService, private router: Router,  private activeRoute: ActivatedRoute ,
    private inventory: InventoryService,private modalService: BsModalService  ) { 
      this.activeRoute.queryParams.subscribe((qp) => {
        console.log('Get Router URL in segment:', this.activeRoute.snapshot);
        console.log('Get Full Router URL:', this.router.url);
      });


     }
  shiftList: TShiftHeader[];
  isNewShift = false;
  showShift = false;
  changeShift(selected) {

    if (selected.endShift === true) {

      this.router.navigate(["admin/shift/summary", selected.shift.shiftId]);
    }
    else {
      this.isNewShift = false;
      var tomorrow = new Date();
      var now = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      tomorrow.setHours(1);
      let value = tomorrow.getTime() - now.getTime();
      this.commonService.setLocalStorageWithExpiry("shift", selected.shift, value);
      // localStorage.setItem("shift", JSON.stringify(selected.shift));
      this.shiftService.changeShift(selected.shift);
      
      this.basketService.deleteBasketLocal();
      if (this.authService.getShopMode() === 'FnB') {
        let storeSelected = this.authService.storeSelected();
        let ShopModeData = this.authService.getGeneralSettingStore(storeSelected.companyCode, storeSelected.storeId).find(x => x.settingId === 'ShopMode');
    
        if(ShopModeData.customField1?.length > 0 && ShopModeData.customField1?.toLowerCase() === 'table')
        {
          if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
          {
            this.router.navigate(["shop/placeInfo", storeSelected.storeId]).then(()=>{
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            });
          }
          else
          {
            this.router.navigate(['/shop/order']).then(() => {
              window.location.href = window.location.href;
            });
          }
        
        }
        else
        {
          this.router.navigate(["shop/order"]).then(() => {
            // window.location.reload();
            window.location.href = window.location.href;
            
          });
        }
        
      }
      if (this.authService.getShopMode() === 'FnBTable') {
        let storeSelected = this.authService.storeSelected();
        if(this.shiftService.getCurrentShip()!==null && this.shiftService.getCurrentShip()!==undefined)
          {
            this.router.navigate(["shop/placeInfo", storeSelected.storeId]).then(()=>{
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            });
          }
          else
          {
            this.router.navigate(['/shop/order']).then(() => {
              window.location.href = window.location.href;
            });
          }
        
      }
      if (this.authService.getShopMode() === 'Grocery') {
        this.router.navigate(["shop/order-grocery"]).then(() => {
          // window.location.reload();
          window.location.href = window.location.href;
        });

      }
      // this.routeNav.navigate(['/shop/order-grocery']).then(() => {
      //   window.location.reload();
      // }); 

    }

  }
  loadShiftOpenList() {

    let store = this.authService.storeSelected();
    let now = new Date();
    let month = now.getMonth() + 1;
    if (month === 13) {
      month = 1;
    }
    let dateFormat = now.getFullYear() + "/" + month + "/" + now.getDate();
    // if(store === null || store=== undefined)
    // {
      let storeClient = this.authService.getStoreClient();
      let terminalId ="";
      if(storeClient!==null && storeClient!==undefined)
      {
        terminalId = this.authService.getStoreClient().publicIP;
      }
      else
      {
        terminalId = this.authService.getLocalIP();
      }
    this.shiftService.loadOpenShift(this.authService.getCurrentInfor().companyCode, store.storeId, dateFormat, this.authService.getCurrentInfor().username, terminalId).subscribe((response: any) => {
      // debugger;
      if (response.success) {
        this.shiftList = response.data;
        if (this.shiftList === null || this.shiftList === undefined || this.shiftList.length === 0) {
          this.isNewShift = true;
          // this.routeNav.navigate(["shop/shifts"]).then(() => {
          //   window.location.reload();
          // });
        }
        else {
          this.isNewShift = false;
        }
        this.showShift = true;
        if(this.authService.checkRole('Adm_InvNotification' , '', 'V' ))
        {
         
          this.loadListTranfer();
        }
      }
      else {
        this.alertify.warning(response.message);
      }

      // console.log(this.storeList);
    });
    // debugger;

    // }
  }
  ngOnInit() {
    this.loadShiftOpenList();
    
  }

  @ViewChild('template')
  private template: TemplateRef<any>;
  loadListTranfer() {
    // debugger;
    let store = this.authService.storeSelected();
    this.inventory.GetTranferNotify(store.companyCode,this.authService.storeSelected().storeId).subscribe((response: any) => {
      debugger;
      this.inventoryListTS = response.data.filter(x=>x.fromStore ==store.storeId && x.docType ==='S');
      this.inventoryListTR = response.data.filter(x=>x.toStore ==store.storeId && x.docType ==='S');
      // this.count = response.data.length;
      if(this.inventoryListTS.length>0 || this.inventoryListTR.length>0)
      {
      this.modalRef = this.modalService.show(this.template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',

        class: 'modal-dialog modal-dialog-centered modal-xl discount-modal-clss'
      });
    }
    });
  }
}
