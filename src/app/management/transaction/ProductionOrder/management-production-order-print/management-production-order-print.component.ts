import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TProductionOrderLine } from 'src/app/_models/viewmodel/productionOrder';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { ProductOrderService } from 'src/app/_services/data/product-order.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-production-order-print',
  templateUrl: './management-production-order-print.component.html',
  styleUrls: ['./management-production-order-print.component.css']
})
export class ManagementProductionOrderPrintComponent implements OnInit {

  constructor(public authService: AuthService,private companyService: CompanyService,private alertifyService: AlertifyService,
    private activedRoute: ActivatedRoute,private productionService: ProductOrderService) { }



  version = "en";
  param = "";

  companyName: string = '';
  line:TProductionOrderLine;
  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.param = data['id'];
    })
  this.loadProductPrint();

  }


dataProductPrint;
loadProductPrint(){
  let store = this.authService.storeSelected();

  this.productionService.getOrderById(this.param,store.companyCode,store.storeId).subscribe((response : any)=>{
    if(response.success){
      this.dataProductPrint = response.data;
      this.line = response.data.lines;
      console.log("this.dataProductPrint ",this.dataProductPrint );
      this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
        this.companyName = response.data.companyName;
        console.log("companyName",this.companyName);
  
      });
    }else{
      this.alertifyService.warning(response.message)
    }
  })
}

switchVersion() {
  if (this.version === 'vi') {
    this.version = 'en';
  }
  else {
    this.version = 'vi';
  }
}


PrintPage() {
  window.print();
}




}
