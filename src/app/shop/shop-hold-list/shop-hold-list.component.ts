import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { MCustomer } from 'src/app/_models/customer';
import { Item } from 'src/app/_models/item';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { Basket } from 'src/app/_models/system/basket';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { TSalesLine } from 'src/app/_models/tsaleline';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { LoadingService } from 'src/app/_services/common/loading.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
export class IPermission {
  controlId: string;
  permission: string;
  result: boolean;
}
enum LoadingIndicator {
  OPERATOR,
  MANUAL,
  ASYNC_PIPE
}

@Component({
  selector: 'app-shop-hold-list',
  templateUrl: './shop-hold-list.component.html',
  styleUrls: ['./shop-hold-list.component.scss']
})
export class ShopHoldListComponent implements OnInit {

 
  
  bills: TSalesHeader[];
  pagination: Pagination;
  userParams: any = {};
  
  constructor(private billService: BillService, private basketService: BasketService,private authService: AuthService,  private commonService: CommonService, public loadingService: LoadingService ,private controlService: ControlService, 
    private itemService: ItemService, private alertify: AlertifyService, private routeNav: Router,
              private route: ActivatedRoute) {  this.customizeText= this.customizeText.bind(this);}
              customizeText (e) {
                debugger;
                 if( e.value!==null &&  e.value!== undefined)
                 {
                   return this.authService.formatCurrentcy( e.value);
            
                 }
                 return 0;
              };
  ngAfterViewInit()
  {
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('Hold list');
        }
    });
    // paymentMenu
    setTimeout(() => {
      this.loadShortcut();
    }, 100);
  }
  dateFormat="";
  shortcuts: ShortcutInput[] = [] ;
  focusedRowKey = "";
  focusedcelKey= -1;
  autoNavigateToFocusedRow = true;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
 
  
  loadShortcut()
  {
    
    this.shortcuts.push(
      {
        key: ["ctrl + i"],
        label: "View Order",
        description: "View Order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          if(this.dataGrid.focusedRowKey!==null && this.dataGrid.focusedRowKey!==undefined && this.dataGrid.focusedRowKey!=='')
          {
            let order: any  = this.bills.find(x=>x.transId === this.dataGrid.focusedRowKey);
            if(order!==null && order!==undefined)
            {
               this.OpenOrder(order)
              
            }
            
            debugger;
          
          }
             
        },
        preventDefault: true
      },
      {
        key: ["ctrl + o"],
        label: "Re Order",
        description: "Re Order",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          
          if(this.dataGrid.focusedRowKey!==null && this.dataGrid.focusedRowKey!==undefined && this.dataGrid.focusedRowKey!=='')
          {
            let order: any  = this.bills.find(x=>x.transId === this.dataGrid.focusedRowKey);
            if(order!==null && order!==undefined)
            {
               this.ReOrder(order)
              
            }
            
            debugger;
          
          }
        },
        preventDefault: true
      },
      {
        key: ["ctrl + p"],
        label: "Print",
        description: "Print",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => { 
          if(this.dataGrid.focusedRowKey!==null && this.dataGrid.focusedRowKey!==undefined && this.dataGrid.focusedRowKey!=='')
          {
            let order  = this.bills.find(x=>x.transId === this.dataGrid.focusedRowKey);
            if(order!==null && order!==undefined)
            {
               this.PrintOrder(order)
              
            }
            
            debugger;
          
          }
        },
        preventDefault: true
      },
        
      
        
      {
        key: ["ctrl + f"],
        label: "Focus grid",
        description: "Focus grid",
        command: (e) => { 
          this.dataGrid.instance.refresh();
           if(this.bills!==null && this.bills!==undefined && this.bills?.length > 0)
           {
            // this.focusedRowKey= this.items[0].keyId;
            this.dataGrid.focusedRowKey = this.bills[0].transId;  
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
    
    this.commonService.changeShortcuts(this.shortcuts); 
 
  }
  selectedKey = [];
  ngOnInit() {
    
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.loadControl();
    
    // this.route
    // this.loadItems();

    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    this.route.data.subscribe(data => {
      debugger;
      let result =  data['bills'];
      if(result.success)
      {
        this.bills = result.data;//.result;
        // this.totalBill = this.bills.length;
        // this.cancelBill = this.bills.filter(x=>x.status==='C' && x.isCanceled ==='Y').length;
        // this.closedBill = this.bills.filter(x=>x.status==='C' && x.isCanceled ==='N').length;
        // this.exchangeBill = this.bills.filter(x=>x.salesMode.toLowerCase()==='ex' || x.salesMode.toLowerCase()==='exchange').length;
        // this.returnBill = this.bills.filter(x=>x.salesMode.toLowerCase()==='return').length;
        // this.saveBill = this.bills;
      }
      else{
        this.alertify.warning(result.message);
      }
    //   this.pagination = data['bills'].pagination;
    //   // debugger;
    // this.userParams.status = 'H'; 
    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

      // data['items']
    });
  }
  permissionDic: IPermission[]=[];
  checkPermission(controlId: string, permission: string): boolean
  { 
    // debugger;
    let result=false;
    let re= this.permissionDic.find(x=>x.controlId===controlId && x.permission===permission);
    if(re===null || re===undefined)
    {
      let rs= this.authService.checkRole(this.functionId , controlId, permission );
      let per=  new IPermission();
      per.controlId= controlId;
      per.permission = permission;
      per.result = rs; 
      this.permissionDic.push(per);
      result=true;
    }
    else
    {
      result=re.result;
    }
    
    return result;
  }
  buttonList=[];
  functionId = "Adm_HoldList";
  marked = false;
  controlList: any[];
  loadControl()
  {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
      if(response.data.length > 0)
      {
      //  debugger;
       this.controlList= response.data.filter(x=>x.custom2!=='button' && x.controlType === 'GridColumn') ;
     
       this.buttonList = response.data.filter(x=>x.custom2==='button') ;
       this.controlList= this.controlList.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  )
       this.buttonList= this.buttonList.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  )
       console.log(this.controlList);  
      }
     });
  }
  filterBy(txtFilter: any)
  {
    debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void
  {
    this.pagination.currentPage = event.page;
     this.loadItemPagedList();
  }
  
  loadItemPagedList() {
    this.billService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<TSalesHeader[]>) => {
        debugger;
        this.bills = res.result;
        this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
  order: Order;
  changeCustomer(customer: MCustomer){
    this.basketService.changeCustomer(customer);
  }
  setItemToBasket(lines: TSalesLine[]){
    lines.forEach(async item => {
      // debugger;
      var response = await this.itemService.getItem(item.itemCode).toPromise();
      this.basketService.addItemtoBasket(response.data, item.quantity);
      //
    });
    
  }
  removeBasket()
  {
      const basket = this.basketService.getCurrentBasket();
      this.basketService.deleteBasket(basket);
  }
  async OpenOrder(order: Order)
  {
    debugger; 
    // const basket = this.basketService.getCurrentBasket();
    //        this.basketService.deleteBasket(basket);
    // setTimeout(() => {
        
    // });
    // this.routeNav.navigate(["shop/order/", order.transId]);
    
    this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]).then(() => {
      window.location.reload();
    }); 
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
     
    
  }
  
  PrintOrder(order)
  {
    //  /shop/bills/print//:companycode/:storeid
     this.routeNav.navigate(["shop/bills/print", order.transId, order.companyCode, order.storeId]).then(() => {
      window.location.reload();
    }); 
  }
  async ReOrder(order: Order)
  {
    debugger; 
    let basket= this.basketService.getCurrentBasket();
    if(basket!==null && basket!==undefined)
    {
      this.basketService.deleteBasket(basket).subscribe(()=>{
        
      });
      
    }
    if(this.authService.getShopMode()==='FnB')
      {
        this.routeNav.navigate(["shop/order", order.transId ]).then(() => {
          // window.location.reload();
        }); 
      }
      if(this.authService.getShopMode()==='Grocery')
      {
        this.routeNav.navigate(["shop/order-grocery", order.transId ]).then(() => {
          // window.location.reload();
        }); 
      
      }
      if(this.authService.getShopMode()==='FnBTable')
      {
        this.routeNav.navigate(["shop/order", order.transId ]).then(() => {
          // window.location.reload();
        }); 
      }
   
    // this.routeNav.navigate(["shop/order/", order.transId]);
      
  }
}
