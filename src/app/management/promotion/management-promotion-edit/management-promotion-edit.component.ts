import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WindowService } from 'src/app/windowService';
import { MWICustomerModel } from 'src/app/_models/mwi/customer';
import { SPromoBuy } from 'src/app/_models/promotion/promotionbuy';
import { SPromoCustomer } from 'src/app/_models/promotion/promotioncus';
import { SPromoGet } from 'src/app/_models/promotion/promotionget';
import { SPromoHeader } from 'src/app/_models/promotion/promotionheader';
import { MPromoType } from 'src/app/_models/promotion/promotiontype';
import { PromotionViewModel } from 'src/app/_models/promotion/promotionViewModel';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { promotion } from 'src/environments/environment';

@Component({
  selector: 'app-management-promotion-edit',
  templateUrl: './management-promotion-edit.component.html',
  styleUrls: ['./management-promotion-edit.component.scss']
})
export class ManagementPromotionEditComponent implements OnInit {

   // @HostListener('window:resize', ['$event'])
   modalRef: BsModalRef;
   CustomerSelected: string='';
   promotion: PromotionViewModel;
   header: SPromoHeader;
   customers: SPromoCustomer[]=[];
   getLines: SPromoGet[]=[];
   buyLines: SPromoBuy[]=[];
   itemList: ItemViewModel[];
   promtionType: MPromoType[] ;
   isMon= false;
   isTue= false;
   isWed= false;
   isThu= false;
   isFri= false;
   isSat= false;
   isSun= false;
   isCombine=false;
   isActive=false;
   customerType: any = [
     { name: 'Customer Code', value:'C'},
     { name: 'Customer Group', value:'G'},
     
   ];
   discountType: any = [
     { name: 'Percent', value:'percent'},
     { name: 'Amount', value:'amount'},
     
   ]; 
  
   lineType: any= promotion.lineType;
   valueType: any=promotion.valueType;
   // cols: any = [
   //   { name: 'Buy Type', value:'Type'},
   //   { name: 'Buy Item', value:'Item'},
   //   { name: 'Buy Name', value:'Name'},
   //   { name: 'Buy UOM', value:'UOM'},
   //   { name: 'Value Type', value:'ValueType'},
   //   { name: 'Condition 1', value:'Condition1'},
   //   { name: 'Value 1', value:'Value1'},
   //   { name: 'Condition 2', value:'Condition2'},
   //   { name: 'Value 2', value:'Value2'}, 
   //   { name: 'Get Value', value:'GetValue'},
   // ];
   @ViewChild('gett' , { static: false}) gett;  
   @ViewChild('buytt' , { static: false}) buytt;  
   constructor(private authService: AuthService,  private windowService: WindowService, private modalService: BsModalService, private alertifyService: AlertifyService,
     private promotionService: PromotionService, private router: Router, private route: ActivatedRoute, private itemService: ItemService ) { 
       
       this.promotion = new PromotionViewModel();
      //subscribe to the window resize event
     //  windowService.height$.subscribe((value:any) => {
         //Do whatever you want with the value.
         //You can also subscribe to other observables of the service
         // this.buytt.in
     // });
   }
   updateCustomerSelected(event: MWICustomerModel[])
   {
     debugger;
     this.modalRef.hide();
     this.promotion.promoCustomers = [];
     let customers='';
     let num=1;
     event.forEach((item)=>{
       customers+= item.mobile+';';
       let promotion: SPromoCustomer = new SPromoCustomer();
       promotion.companyCode = this.authService.getCurrentInfor().companyCode;
       promotion.customerType = this.promotion.customerType;
       promotion.customerValue = item.mobile.toString();
       promotion.companyCode=this.authService.storeSelected().companyCode;;
       promotion.lineNum = num;
       this.promotion.promoCustomers.push(promotion);
       num++;
     });
     this.CustomerSelected = customers.substring(0, customers.length - 1);
   }
   openModal(template: TemplateRef<any>) {
     this.modalRef = this.modalService.show(template);
   }
   now: Date = new Date();
   promotionId: string='';
   ngOnInit() {
     debugger;
     this.route.params.subscribe(data => {
       debugger;
       this.promotionId = data['promotionId'];
     });
    //  this.promotionId='PICP00100000001';
     if(this.promotionId !== null || this.promotionId !== undefined)
     { 
       this.loadPromotion();
     }
     this.loadItemList();
     this.loadPromotionType();
   }
   
   loadPromotion()
   {
     debugger;
     let comp=this.authService.storeSelected().companyCode;
 
     this.promotionService.getPromotion(comp, this.promotionId).subscribe((response: any)=>{
       if(response.success===true)
       {
           this.promotion = response.data;
           debugger;
           this.buyLines = this.promotion.promoBuys;
           this.getLines = this.promotion.promoGets;
           let customerList= this.promotion.promoCustomers;
           if(customerList!==null)
           {
            customerList.forEach(customer=>{
              this.CustomerSelected+=customer.customerValue + ",";
            })
           }
           if(this.promotion.isMon === 'Y') this.isMon = true;
           if(this.promotion.isFri === 'Y') this.isFri = true;
           if(this.promotion.isSat === 'Y') this.isSat = true;
           if(this.promotion.isSun === 'Y') this.isSun = true;
           if(this.promotion.isThu === 'Y') this.isThu = true;
           if(this.promotion.isTue === 'Y') this.isTue = true;
           if(this.promotion.isWed === 'Y') this.isWed = true;
           if(this.promotion.status === 'Y') this.isActive = true;
           if(this.promotion.isCombine === 'Y') this.isCombine = true;
           let now = new Date();
           let hf, mf, ht,mt ;
           if( this.promotion.validTimeFrom ===0)
           {
             hf=mf=0;
           }
           else{
             let str= this.promotion.validTimeFrom.toString();
             let min = str.substr(-2);
             let hou = str.substr(0, min.length);
             hf=hou;
             mf= min;
           }
           if(  this.promotion.validTimeTo ===0)
           {
             ht=mt=0;
           }
           else{
             let str= this.promotion.validTimeTo.toString();
             let min = str.substr(-2);
             let hou = str.substr(0, min.length);
             ht=hou;
             mt= min;
           }
           let timeF: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), hf, mf); 
           this.validTimeFrom = timeF;
           let timeT: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), ht, mt); 
           this.validTimeTo = timeT;
            
       }
       else
       {
         this.alertifyService.warning('get detail promotion id: ' + this.promotionId + ' failed. Message: ' + response.message);
       }
     })
   }
   validTimeFrom: any;
   validTimeTo: any;
   leftPad(number, targetLength) {
     var output = number + '';
     while (output.length < targetLength) {
         output = '0' + output;
     }
     return output;
   }
   savePromotion()
   {
     debugger;
     // let promotion = new PromotionViewModel();
     this.promotion.promoBuys = this.buyLines;
     this.promotion.promoGets = this.getLines;
     this.promotion.companyCode = this.authService.storeSelected().companyCode;
     let hF = this.validTimeFrom.getHours();
     let mF = this.validTimeFrom.getMinutes();
     let hT = this.validTimeTo.getHours();
     let mT = this.validTimeTo.getMinutes();
 
     this.promotion.validTimeFrom = parseInt(this.leftPad(hF,2) + this.leftPad(mF, 2));
     this.promotion.validTimeTo = parseInt(this.leftPad(hT,2) + this.leftPad(mT, 2));
     if(this.isMon===true) { this.promotion.isMon = 'Y'; 
     } else { this.promotion.isMon = 'N'; }
     if(this.isTue===true) { this.promotion.isTue = 'Y'; 
     } else { this.promotion.isTue = 'N'; }
     if(this.isWed===true) { this.promotion.isWed = 'Y'; 
     } else { this.promotion.isWed = 'N'; }
     if(this.isThu===true) { this.promotion.isThu = 'Y'; 
     } else { this.promotion.isThu = 'N'; }
     if(this.isFri===true) { this.promotion.isFri = 'Y'; 
     } else { this.promotion.isFri = 'N'; }
     if(this.isSat===true) { this.promotion.isSat = 'Y'; 
     } else { this.promotion.isSat = 'N'; }
     if(this.isSun===true) { this.promotion.isSun = 'Y'; 
     } else { this.promotion.isSun = 'N'; }
     if(this.isCombine===true) { this.promotion.isCombine = 'Y'; 
     } else { this.promotion.isCombine = 'N'; }
     if(this.isActive===true) { this.promotion.status = 'Y'; 
     } else { this.promotion.status = 'N'; }
     debugger;
     this.promotionService.saveEntity(this.promotion).subscribe((response: any)=>{
        if(response.success)
        {
          this.alertifyService.success('save promotion completed successfully');
        }
        else
        {
         this.alertifyService.warning('save promotion failed. Message: ' + response.message);
        }
     });
     
   }
   loadPromotionType()
   {
      this.promotionService.getPromotionsType().subscribe((response)=>{
       this.promtionType = response;
      });
   }
   loadItemList()
   {
     this.itemService.GetItemWithoutPriceList(this.authService.getCurrentInfor().companyCode,'','','','','','','').subscribe((response: any)=>{
       this.itemList = response.data;
      });
   }
   addNewPromotion()
   {
    this.router.navigate(["admin/promotion/setup"]);
   }
   addRowBuy()
   {
    setTimeout(x=> { 
      this.buytt.instance.addRow();
    },300 );
     
   }
   addRowGet()
   {
    setTimeout(x=> { 
      this.gett.instance.addRow();
    },300 );
     
   }
   onItemBuySelectionChanged(selectedRowKeys, cellInfo,event, e, dropDownBoxComponent) {
     debugger;
     console.log(cellInfo);
     cellInfo.setValue(selectedRowKeys[0]);
     
     if(selectedRowKeys.length > 0) {
         dropDownBoxComponent.close();
       
         let code = event.selectedRowsData[0].itemCode;
         let name = event.selectedRowsData[0].itemName;
         let uom= event.selectedRowsData[0].uomCode;
         // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
         this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineCode', code); 
         this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineName', name);  
         this.buytt.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);  
       
     }
     
   }
   onItemGetSelectionChanged(selectedRowKeys, cellInfo,event, e, dropDownBoxComponent) {
     debugger;
     console.log(cellInfo);
     cellInfo.setValue(selectedRowKeys[0]);
     
     if(selectedRowKeys.length > 0) {
         dropDownBoxComponent.close();
       
         let code =event.selectedRowsData[0].itemCode;
         let name = event.selectedRowsData[0].itemName;
         let uom= event.selectedRowsData[0].uomCode;
         // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
         this.gett.instance.cellValue(cellInfo.rowIndex, 'lineCode', code); 
         this.gett.instance.cellValue(cellInfo.rowIndex, 'lineName', name);  
         this.gett.instance.cellValue(cellInfo.rowIndex, 'lineUom', uom);  
       
     }
     
   }

}
