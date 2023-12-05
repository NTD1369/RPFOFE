import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { DeliveryService } from 'src/app/_services/data/delivery.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TDelivery, T_DeliveryLine } from 'src/app/_models/viewmodel/delivery';
import { ThumbnailsPosition } from 'ng-gallery';
@Component({
  selector: 'app-management-transaction-delivery-edit',
  templateUrl: './management-transaction-delivery-edit.component.html',
  styleUrls: ['./management-transaction-delivery-edit.component.css']
})
export class ManagementTransactionDeliveryEditComponent implements OnInit {

  constructor(public authService: AuthService, private deliveryService: DeliveryService, private alertifyService: AlertifyService, private router: Router,
    private route: ActivatedRoute,) { }

    mode: string;
    issueId: string;
  lines:T_DeliveryLine[];
  purchase: TDelivery;


  dateFormat="";
  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.customizeText= this.customizeText.bind(this);
    this.route.params.subscribe(data => {
      // console.log("data-edit",data);
      this.mode = data['m'];
      this.issueId = data['id'];
    })
    this.loadItem();
  }

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
  
itemDetail;

loadItem(){
  let store = this.authService.storeSelected();
  this.deliveryService.getOrderById(this.issueId,store.companyCode,store.storeId).subscribe((res:any)=>{
    debugger
   
      this.itemDetail = res.data;
      if(res.success){
        if(this.itemDetail.isCanceled==='Y' || this.itemDetail.isCanceled==='C'){
          this.itemDetail.status = 'Canceled';
  
        };
      console.log("detail",this.itemDetail);

      this.lines = res.data.lines
      console.log("line",this.lines);

    }else{
      this.alertifyService.warning(res.message)
    }
  })
}

customizeText (e) {
  debugger;
   if( e.value!==null &&  e.value!== undefined)
   {
     return this.authService.formatCurrentcy( e.value);

   }
   return 0;
};


PrintDetail(data) {
  debugger
  console.log("data", data);
  this.router.navigate(["admin/deliveri/print", data.purchaseId]).then(() => {
    // window.location.reload();
  });
}





}
