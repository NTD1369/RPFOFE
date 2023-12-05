import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ProductOrderService } from 'src/app/_services/data/product-order.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-production-order-list',
  templateUrl: './management-production-order-list.component.html',
  styleUrls: ['./management-production-order-list.component.css']
})
export class ManagementProductionOrderListComponent implements OnInit {

  constructor( public authService: AuthService,private alertifyService: AlertifyService,private router: Router,private productionService: ProductOrderService) { }



  status:string='';
  key:string = '';
  fromDate: Date;
  toDate: Date;
  ngOnInit() {
    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const nowDate = d.getDay();
    const lastDay =  new Date(year, month +1, 0).getDate();
    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    // this.fromDate = new Date();
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
  }



loadProductItem;
loadProduct(){
  let fromvl= null;  let tovl= null;
  if(this.fromDate===null||this.fromDate===undefined)
  {
    this.fromDate=null;
  }
  if(this.toDate===null||this.toDate===undefined)
  {
    this.toDate=null;
  }
  if(this.fromDate!=null)
  {
    fromvl=this.GetDateFormat(this.fromDate);
  }
  if(this.toDate!=null)
  {
    tovl= this.GetDateFormat(this.toDate);
  }
  let comp = this.authService.storeSelected();

  this.productionService.getByType(comp.companyCode,comp.storeId,"",fromvl,tovl,this.key,this.status).subscribe((response:any)=>{
    if(response.success){
      this.loadProductItem = response.data;
      console.log("this.loadProductItem",this.loadProductItem);
    }else{
      this.alertifyService.warning(response.message)
    }
  })

}
GetDateFormat(date) {
  var month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
}

moveDetail(data){
  debugger
  this.router.navigate(["admin/productionOrder",'edit',data.data.purchaseId]);
  // this.router.navigate(["admin/pronOrder/", 'e', data.data.purchaseId]);
  }
  PrintProductOrder(data) {
    debugger
    console.log("data", data);
    this.router.navigate(["admin/productionorder/print", data.data.purchaseId]).then(() => {
      // window.location.reload();
    });
  }
  
}

