import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MCustomerGroup } from 'src/app/_models/customer';
import { MPriceList, MPriorityPriceList } from 'src/app/_models/mpricelist';
import { MPrepaidCard } from 'src/app/_models/prepaidcard';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomergroupService } from 'src/app/_services/data/customergroup.service';
import { PricelistService } from 'src/app/_services/data/pricelist.service';
import { PriotypricelistService } from 'src/app/_services/data/priotypricelist.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { status } from 'src/environments/environment';
@Component({
  selector: 'app-management-prioty-price-list',
  templateUrl: './management-prioty-price-list.component.html',
  styleUrls: ['./management-prioty-price-list.component.css']
})
export class ManagementPriotyPriceListComponent implements OnInit {

 
  list: MPriorityPriceList[];
  userParams: any = {};
  modalRef: BsModalRef;
  model: MPriorityPriceList;
  isNew:boolean = false;
  mode="";
  remove(e)
  {
    debugger;
    let model = e.data;
    
    // this.store= this.getStoreModel(this.storeSelected);
    // model.storeId = this.storeSelected;
    this.priotypricelistService.delete(model).subscribe((response: any)=>{
      if(response.success)
      {
          this.alertify.success("Delete completed successfully");
      }
      else{
        this.alertify.warning("Delete failed: " + response.message);
      }
   });
  }
  
  save(e) {
    debugger; 
    let model = e.changes[0].data;
    // model.storeId = this.model.storeId;
    model.companyCode = this.authService.getCurrentInfor().companyCode;
    // model.currency = this.model.currency;
    if(this.mode==='E')
    {
      let check =  this.authService.checkRole(this.functionId , '', 'E' );
      if(check===true)
      {
        this.priotypricelistService.update(model).subscribe((response: any)=>{
          if(response.success)
          {
              this.alertify.success("update completed successfully");
          }
          else{
            this.alertify.warning("update failed: " + response.message);
          }
       });
      }
      else
      {
        this.alertify.success("Permission denied");
      }
       
    }
    else
    {
      let check =  this.authService.checkRole(this.functionId , '', 'I' );
      if(check===true)
      {
        this.priotypricelistService.create(model).subscribe((response: any)=>{
          debugger;
          if(response.success)
          {
              this.alertify.success("insert completed successfully");
          }
          else{
            this.alertify.warning("insert failed: " + response.message);
          }
      });
      }
      else
      {
        this.alertify.success("Permission denied.");
      }
    }
    // this.events.unshift(eventName);
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  openModal(isNew: boolean, model: MPriorityPriceList, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if(isNew)
    {
      this.model = new MPriorityPriceList();
     
    }
    else
    {
      this.model = model;
    }
    this.model.companyCode = this.authService.getCurrentInfor().companyCode;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title', 
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
 
  };
  cusGrps: MCustomerGroup[]=[];
  loadCusGrp()
  {
    this.customerGroup.getAllViewModel(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      if(response.success)
      {
        this.cusGrps = response.data; 
        console.log(this.cusGrps )
      }
      else
      {
        this.alertify.warning(response.message);
      }
      // this.cusGrps= response;
      console.log('loadCusGrp', this.cusGrps);
    })
  }
  pricelistIds: MPriceList[]=[];
  loadpricelistId()
  {
    this.pricelistService.GetAllId(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      if(response.success)
      {
        this.pricelistIds= response.data;
        // console.log("list", res);
      }
      else
      {
          this.alertify.warning(response.message);
      }
       
      console.log('loadpricelistId', this.pricelistIds);
    })
  }
  constructor(private customerGroup: CustomergroupService, private pricelistService: PricelistService, private priotypricelistService: PriotypricelistService, private alertify: AlertifyService,  private authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) { 
      this.customizeText= this.customizeText.bind(this);
    }
    selectedDate;
    
  ngOnInit() {
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    this.loadItems() ;
    this.loadCusGrp();
    this.loadpricelistId();
   
  }
  customizeText (e) {
    
    if( e.value!==null &&  e.value!== undefined)
    {
      return this.authService.formatCurrentcy( e.value);

    }
    return 0;
 };
 status = status.active;
  loadItems() {
    this.priotypricelistService.getAll(this.authService.getCurrentInfor().companyCode, '','').subscribe((res: any) => {
      if(res.success)
      {
        debugger;
        this.list = res.data;
      }
      else
      {
        this.alertify.warning(res.message);
      }
     
  //  console.log(this.cards );
    }, error => {
      this.alertify.error(error);
    });
  }
   
  getItem(item: MPrepaidCard)
  {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }

  // updateModel(model) {
  //   debugger; 
  //   if(this.isNew)
  //   {
    
  //     this.prepaidService.create(model).subscribe((response: any) => {
  //       if(response.success)
  //       {
  //         this.alertify.success('Create completed successfully'); 
  //         this.loadItems();
  //         this.modalRef.hide();
  //       }
  //       else{
  //         this.alertify.error(response.message);
  //       } 
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  //   }
  //   else{
  //     this.prepaidService.update(model).subscribe((response: any) => {
  //       if(response.success)
  //       {
  //         this.alertify.success('Update completed successfully.'); 
  //         this.modalRef.hide();
  //       }
  //       else{
  //         this.alertify.error(response.message);
  //       }
       
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  //   }
   
  // }
  functionId="Adm_PriceList";
  // @ViewChild('template' , { static: false}) template;  
  // onToolbarPreparing(e) {
  //   if(this.authService.checkRole(this.functionId , '', 'I'))
  //   {
  //     e.toolbarOptions.items.unshift( {
  //           location: 'before',
  //           widget: 'dxButton',
  //           options: {
  //               width: 136, 
  //               icon:"add", type:"success", text:"Add",
  //               onClick: this.openModal.bind(this, true, null, this.template)
  //           } 
  //       });
  //     }
  // }


}
