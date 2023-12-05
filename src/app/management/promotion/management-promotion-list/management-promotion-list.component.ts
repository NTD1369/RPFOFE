import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SPromoHeader } from 'src/app/_models/promotion/promotionheader';
import { AuthService } from 'src/app/_services/auth.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-promotion-list',
  templateUrl: './management-promotion-list.component.html',
  styleUrls: ['./management-promotion-list.component.scss']
})
export class ManagementPromotionListComponent implements OnInit {
  dateFormat = "";
  functionId = "Adm_Promotion";
  promotionList: SPromoHeader[];
  lguAdd: string = "Add";
  promtionType: any;
  readonly allowedPageSizes = [5, 10, 'all'];
  display:number =20;

  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];

  displayMode = 'full';
  customerType: any = [
    { name: 'All', value:''},
    { name: 'Customer Code', value:'C'},
    { name: 'Customer Group', value:'G'},
    
  ];
  statusOptions: any = [
    { name: 'All', value:''},
    { name: 'Active', value:'A'},
    { name: 'Inactive', value:'I'},
    
  ];
  discountType: any = [
    { name: 'All', value:''},

    { name: 'Percent', value:'percent'},
    { name: 'Amount', value:'amount'},
    
  ]; 
  isCombine=null;
  showMore = false;
  
  loadPromotionType()
  {
     this.promotionService.getPromotionsType().subscribe((response)=>{
      this.promtionType = response;
      // this.promtionType.unshift({ typeName: "-- All --", promoType: "" });

     });
  }
  constructor(public authService: AuthService, private promotionService: PromotionService, private alertifyService: AlertifyService
    , private router: Router) {
      this.customizeText = this.customizeText.bind(this);
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
    this.loadPromotionType();
  }

  ngOnInit() {
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.loadList();
  }
  customizeText(e) {
    // debugger;
    if (e.value !== null && e.value !== undefined) {
      return this.authService.formatCurrentcy(e.value);

    }
    return 0;
  };
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.newPromotion.bind(this)
        }
      });
    }
  }

  newPromotion() {
    this.router.navigate(["admin/promotion/setup"]);
  }
  delPromotion(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this promotion',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.promotionService.removePromotion(data.data.promoId, this.authService.storeSelected().companyCode).subscribe((response: any) => {
          // debugger;
          if (response.success) {
            // debugger;
            this.alertifyService.success('Remove promotion ' + data.data.promoId + ' completed successfully. ');
            this.loadList();
          }
          else {
            this.alertifyService.warning('Remove promotion failed. Message: ' + response.message);
          }
        });

      }
    });
  }
  viewDetail(data) {
    // debugger;
    this.router.navigate(["admin/promotion", "edit", data.data.promoId]);
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  }
  isSAP = false;
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  searchPromotion(promoId,promoName, promotype, customerType, validDateFrom, validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, status)
  {
    //, , customerType, validDateFrom, validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, status
     
     let comp= this.authService.storeSelected().companyCode;
   
    let IsCombine = "";
    
    if(this.isCombine===true)
    {
      IsCombine="Y";
    }
    if(promotype === null || promotype===undefined){promotype = ""}
    
    if(promoId === null || promoId===undefined) {promoId = ""}
    if(promoName === null || promoName===undefined) {promoName = ""}
    if(customerType === null || customerType===undefined) {customerType = ""}
    if(validDateFrom === null || validDateFrom===undefined) {validDateFrom = ""}
    else
    {
      validDateFrom = this.GetDateFormat(validDateFrom);
    }
    if(validDateTo === null || validDateTo===undefined) {validDateTo = ""}
    else
    {
      validDateTo = this.GetDateFormat(validDateTo);
    }
    let now = new Date();
    let hf, mf, ht, mt;
    debugger;
    if(validTimeFrom === null || validTimeFrom===undefined) {validTimeFrom = ""}
    else
    {
      if (validTimeFrom === 0) {
        hf = mf = 0;
      }
      else {
        let str = validTimeFrom.toString();
        if (str.length === 1) {
          str = "000" + str;
        }
        if (str.length === 2) {
          str = "00" + str;
        }
        if (str.length === 3) {
          str = "0" + str;
        }
        let min = str.substr(-2);
        let hou = str.substr(0, min.length);
        hf = hou;
        mf = min;
      }
      let timeF: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), hf, mf);
       validTimeFrom = timeF;
    }
    if(validTimeTo === null || validTimeTo===undefined) {validTimeTo = ""}
    else
    {
      if (validTimeTo === 0) {
        ht = mt = 0;
      }
      else {
        let str = validTimeTo.toString();
        if (str.length === 1) {
          str = "000" + str;
        }
        if (str.length === 2) {
          str = "00" + str;
        }
        if (str.length === 3) {
          str = "0" + str;
        }
        let min = str.substr(-2);
        let hou = str.substr(0, min.length);
        ht = hou;
        mt = min;
      }
  
      let timeT: Date = new Date(now.getFullYear(), now.getMonth(), now.getDay(), ht, mt);
       validTimeTo = timeT;
    }
  
   
   
  
    
    if(isMon === null || isMon===undefined ) {isMon = ""}
    else
    {
      if(isMon === false ) 
      {
        isMon = "N";
      }
      else
      {
        isMon = "Y";
      }
    }
    if(isTue === null || isTue===undefined ) {isTue = ""}
    else
    {
      if(isTue === false ) 
      {
        isTue = "N";
      }
      else
      {
        isTue = "Y";
      }
    }
    if(isWed === null || isWed===undefined) {isWed = ""} else
    {
      if(isWed === false ) 
      {
        isWed = "N";
      }
      else
      {
        isWed = "Y";
      }
    }
    if(isThu === null || isThu===undefined ) {isThu = ""}else
    {
      if(isThu === false ) 
      {
        isThu = "N";
      }
      else
      {
        isThu = "Y";
      }
    }
    if(isFri === null || isFri===undefined ) {isFri = ""}else
    {
      if(isFri === false ) 
      {
        isFri = "N";
      }
      else
      {
        isFri = "Y";
      }
    }
    if(isSat === null || isSat===undefined ) {isSat = ""}else
    {
      if(isSat === false ) 
      {
        isSat = "N";
      }
      else
      {
        isSat = "Y";
      }
    }
    if(isSun === null || isSun===undefined) {isSun = ""}else
    {
      if(isSun === false ) 
      {
        isSun = "N";
      }
      else
      {
        isSun = "Y";
      }
    }
    if(IsCombine === null || IsCombine===undefined) {IsCombine = ""} 
    let statusX ="";
    if(status === null || status===undefined ) {status = ""}
    if(status===true || status==='A')
    {
      statusX="Y";
    }
    if(status===false || status==='I')
    {
      statusX="N";
    }
 


    this.promotionService.searchPromotion(comp, promoId, promotype, promoName, customerType, '', validDateFrom, 
    validDateTo, validTimeFrom, validTimeTo, isMon, isTue, isWed, isThu, isFri, isSat, isSun, IsCombine, statusX).subscribe((response: any)=>{
       if(response.success==true)
       {
        debugger;
        this.promotionList = response.data;
        this.promotionList= this.promotionList.slice(0,this.display);
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
  loadList() {
    let comp = this.authService.storeSelected().companyCode;
    this.promotionService.searchPromotion(comp, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '').subscribe((response: any) => {
      if (response.success == true) {
        // debugger;
        this.promotionList = response.data;
        this.promotionList= this.promotionList.slice(0,this.display);
        let sapmodels = this.promotionList.filter(x => x?.sapBonusBuyId !== '' && x?.sapPromoId !== '');
        if (sapmodels !== null && sapmodels !== undefined && sapmodels?.length > 0) {
          this.isSAP = true;
        }
      }
      else {
        this.alertifyService.warning('load data failed. Message: ' + response.message);
      }

    });
  }
  changedisplay(e){
    debugger
    this.display = e.value;
  }
}
