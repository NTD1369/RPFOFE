import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { MWICustomerModel } from 'src/app/_models/mwi/customer';
import { AuthService } from 'src/app/_services/auth.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-promotion-search',
  templateUrl: './management-promotion-search.component.html',
  styleUrls: ['./management-promotion-search.component.scss']
})
export class ManagementPromotionSearchComponent implements OnInit {
  @Input() isCombine=null;
  @Input() isMulti=false;
  promotionList: any;
  promotionSelected: any;
  selectedKey = []; 
  allMode: string;
  checkBoxesMode: string;
  promtionType: any;
  customerType: any = [
    { name: 'All', value:''},
    { name: 'Customer Code', value:'C'},
    { name: 'Customer Group', value:'G'},
    
  ];
  discountType: any = [
    { name: 'All', value:''},
    { name: 'Percent', value:'percent'},
    { name: 'Amount', value:'amount'},
    
  ]; 
  isSAP = false;
  mode="single"

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @Output() dataSelected = new EventEmitter<any[]>();
  constructor(private promotionService: PromotionService, private authService: AuthService, private alertifyService: AlertifyService) { }
  selectPromotion()
  {
    debugger;
    let dataSelected =  this.dataGrid.instance.getSelectedRowsData();
    this.dataSelected.emit(dataSelected);
  }
  ngOnInit() {
    if(this.isMulti===true)
    {
      this.mode= "multiple";
    }
    else
    {
      this.mode= "single";
    }
    
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.loadPromotionType();
    this.loadList();
  }
  loadPromotionType()
  {
     this.promotionService.getPromotionsType().subscribe((response)=>{
      this.promtionType = response;
      this.promtionType.unshift({ typeName: "-- All --", promoType: "" });
     });
  }
  searchPromotion(promoId,promoName, promotype, customerType, validDateFrom, validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, status)
  {
    //, , customerType, validDateFrom, validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, status
     
     let comp= this.authService.storeSelected().companyCode;
   
    let IsCombine = "";
    // if(this.isCombine===false)
    // {
    //   IsCombine="N";
    // }
    if(this.isCombine===true)
    {
      IsCombine="Y";
    }
    if(promotype === null || promotype===undefined){promotype = ""}
    
    if(promoId === null || promoId===undefined) {promoId = ""}
    if(promoName === null || promoName===undefined) {promoName = ""}
    if(customerType === null || customerType===undefined) {customerType = ""}
    if(validDateFrom === null || validDateFrom===undefined) {validDateFrom = ""}
    if(validDateTo === null || validDateTo===undefined) {validDateTo = ""}


    if(validTimeFrom === null || validTimeFrom===undefined) {validTimeFrom = ""}
    if(validTimeTo === null || validTimeTo===undefined) {validTimeTo = ""}
    
    if(isMon === null || isMon===undefined || isMon === false) {isMon = ""}
    if(isTue === null || isTue===undefined|| isTue === false) {isTue = ""}
    if(isWed === null || isWed===undefined|| isWed === false) {isWed = ""}
    if(isThu === null || isThu===undefined|| isThu === false) {isThu = ""}
    if(isFri === null || isFri===undefined|| isFri === false) {isFri = ""}
    if(isSat === null || isSat===undefined|| isSat === false) {isSat = ""}
    if(isSun === null || isSun===undefined|| isSun === false) {isSun = ""}
    if(IsCombine === null || IsCombine===undefined) {IsCombine = ""} 
    let statusX ="";
    
    if(status===true)
    {
      statusX="Y";
    }
     
 


    this.promotionService.searchPromotion(comp, promoId, promotype, promoName, customerType, '', validDateFrom, 
    validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, IsCombine, statusX).subscribe((response: any)=>{
       if(response.success==true)
       {
        debugger;
        this.promotionList = response.data;
        let sapmodels= this.promotionList.filter(x=>x?.sapBonusBuyId !== '' && x?.sapPromoId !== ''  );
        if(sapmodels!==null && sapmodels!==undefined && sapmodels?.length > 0)
        {
          this.isSAP= true;
        }
       }
       else
       {
        this.alertifyService.warning('load data failed. Message: ' + response.message);
       }
    
    });
  }
  loadList( )
  {
    
    // let promoId, promotype, promoName, customerType, validDateFrom, 
    // validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, status ='';
    let comp= this.authService.storeSelected().companyCode;
    let IsCombine = "";
    if(this.isCombine===false)
    {
      IsCombine="N";
    }
    if(this.isCombine===true)
    {
      IsCombine="Y";
    }
    debugger;
    this.promotionService.searchPromotion(comp, '', '', '', '', '', '', 
      '', '', '', '', '', '', '', '', '', '', IsCombine, '').subscribe((response: any)=>{
       if(response.success==true)
       {
        this.promotionList = response.data;
        let sapmodels= this.promotionList.filter(x=>x?.sapBonusBuyId !== '' && x?.sapPromoId !== ''  );
        if(sapmodels!==null && sapmodels!==undefined && sapmodels?.length > 0)
        {
          this.isSAP= true;
        }
       }
       else
       {
        this.alertifyService.warning('load data failed. Message: ' + response.message);
       }
    
    });
  }

}
