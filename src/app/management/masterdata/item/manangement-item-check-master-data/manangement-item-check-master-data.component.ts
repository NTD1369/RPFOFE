import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxSelectBoxModule } from 'devextreme-angular';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manangement-item-check-master-data',
  templateUrl: './manangement-item-check-master-data.component.html',
  styleUrls: ['./manangement-item-check-master-data.component.css']
})
export class ManangementItemCheckMasterDataComponent implements OnInit {

  storeList: MStore[] = [];
  constructor(public authService: AuthService, private itemService: ItemService, private router: Router, private controlService: ControlService, 
     private activedRoute: ActivatedRoute,private storeService: StoreService, private alertifyService: AlertifyService) { }
  storeIdPar = "";
  keywordPar = "";
  cusGrpPar = "";

  @ViewChild('keyword', { static: false }) keyword;
  @ViewChild('customerid', { static: false }) customerid;
  // @ViewChild('storeId', { static: false }) storeId;
  @ViewChild(DxSelectBoxModule, { static: false }) storeId: DxSelectBoxModule;
  functionId ="Tool_CheckItemMaster";
  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.storeIdPar = data['storeId'];
      this.keywordPar = data['keyword'];
      this.cusGrpPar = data['cusGrp'];
    })
     this.loadStore();
     this.loadControl() ;
  }
  checkPermission(controlId: string, permission: string): boolean {

    return this.authService.checkRole(this.functionId, controlId, permission);
  }
  loadControl() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any) => {
      if (response.data.length > 0) {
         
          debugger; 
          this.controlList = response.data.filter(x => x.custom2 !== 'button' && x.controlType === 'GridColumn');
          
          if(this.controlList!==null && this.controlList!==undefined && this.controlList?.length > 0)
          {
            this.controlList = this.controlList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1);
          
            if(this.controlList!==null && this.controlList!==undefined && this.controlList?.length > 0)
            {
              this.controlList.forEach(control => {
                control.isView= this.checkPermission(control.controlId,'V'),
                control.isEdit=  control?.readOnly ? false : this.checkPermission(control.controlId,'E'),
                control.isInsert=  control?.readOnly ? false : this.checkPermission(control.controlId,'I')
              });
            }
          }
        
      }
    });
  }
  loadStore()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      debugger;
      if(response.success)
      {
          this.storeList = response.data;
          if(this.storeList!==null && this.storeList!==undefined && this.storeList?.length > 0)
          {
            this.storeList.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName;
             
           });
          }
          
          if(this.storeIdPar!==null && this.storeIdPar!==undefined && this.storeIdPar?.length > 0)
          {
            let checkStore = this.storeList.filter(x=>x.storeId ===  this.storeIdPar);
            if(checkStore!==null && checkStore!==undefined && checkStore?.length > 0)
            {
              if(this.keywordPar!==null && this.keywordPar!==undefined && this.keywordPar?.length > 0)
              {
                setTimeout(() => {
                  this.keyword.nativeElement.value = this.keywordPar;
                });
                if(this.cusGrpPar!==null && this.cusGrpPar!==undefined && this.cusGrpPar?.length > 0)
                {
                  setTimeout(() => {
             
                    this.customerid.nativeElement.value = this.cusGrpPar;
                  });
                }
               
                // setTimeout(() => {
                //   this.keyword.nativeElement.value = '';
                // });
                  this.checkMaster(this.storeId, this.keywordPar, this.cusGrpPar);
              }
            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Store',
                text: "Store " + this.storeIdPar + " not assign for user. Please contact to admin"
              }).then(()=>{
                if (this.authService.getShopMode() === 'FnB') {
                  this.router.navigate(["shop/order"]).then(() => {
                    
                  });
                }
                if (this.authService.getShopMode() === 'Grocery') {
                  this.router.navigate(["shop/order-grocery"]).then(() => {
                    // window.location.reload();
                  });
        
                }
              });
            }
          }
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.storeList = response;
      // if(response.success)
      // {
         

      // }
      // else
      // {
      //   this.alertifyService.warning(response.message);
      // }
    })
  }
  message ="";
  result: any;
  controlList: any[];
  checkMaster(store,keyword, customerid)
  {
    if(keyword===null || keyword===undefined ||  keyword?.length <=0)
    {
      keyword = "";
    }
    if(customerid===null || customerid===undefined ||  customerid?.length <=0)
    {
      customerid = "";
    }
    this.itemService.CheckMasterData(this.authService.getCompanyInfor().companyCode, store, keyword, customerid).subscribe((response: any)=>{
      if(response.success)
      {
          this.result = response.data; 
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    })
  }
}
