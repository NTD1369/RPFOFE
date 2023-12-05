import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  TReturnLine } from 'src/app/_models/viewmodel/deliveryReturn';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { DeliveryReturnService } from 'src/app/_services/transaction/deliveryService.service';

@Component({
  selector: 'app-management-transaction-deliveryReturn-edit',
  templateUrl: './management-transaction-deliveryReturn-edit.component.html',
  styleUrls: ['./management-transaction-deliveryReturn-edit.component.scss']
})
export class ManagementTransactionDeliveryReturnEditComponent implements OnInit {

  constructor(public authService: AuthService,private activedRoute: ActivatedRoute,private companyService: CompanyService, private deliveryReturnService: DeliveryReturnService, 
    private alertifyService: AlertifyService, private router: Router,private route: ActivatedRoute,) { }
  dateFormat="";
  lines : TReturnLine;
  mode:string;
  issueId:string;

  statusOptions = [
    {
      value: "O", name: "Open",
    },
    {
      value: "C", name: "Closed",
    },
    {
      value: "Canceled", name: "Canceled",
    },

  ];

  ngOnInit() {

    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.customizeText= this.customizeText.bind(this);
    this.route.params.subscribe(data => {
      // console.log("data-edit",data);
      this.mode = data['m'];
      this.issueId = data['id'];
    })
    this.loadItemdeliveryReturnService();

  }

itemDeliveryReturn;
loadItemdeliveryReturnService(){
  let store = this.authService.storeSelected();

  this.deliveryReturnService.getOrderById(this.issueId,store.companyCode,store.storeId).subscribe((response:any)=>{
    
    if(response.success){
      this.itemDeliveryReturn = response.data;
      if(this.itemDeliveryReturn.isCanceled==='Y' || this.itemDeliveryReturn.isCanceled==='C'){
        this.itemDeliveryReturn.status = 'Canceled';
      };
      console.log("this.itemDeliveryReturn",this.itemDeliveryReturn);
      this.lines = response.data.lines
      console.log("line",this.lines);

    }else{
      this.alertifyService.warning(response.message)
    }
  })
}
customizeText (e) {
  // debugger;
   if( e.value!==null &&  e.value!== undefined)
   {
     return this.authService.formatCurrentcy( e.value);

   }
   return 0;
};

PrintDetail(data) {
  debugger
  console.log("data", data);
  this.router.navigate(["admin/deliveriReturn/print", data.purchaseId]).then(() => {
    // window.location.reload();
  });
}




}
