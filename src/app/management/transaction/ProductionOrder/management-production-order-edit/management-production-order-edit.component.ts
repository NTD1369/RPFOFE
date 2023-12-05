import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TGoodsIssueHeader } from 'src/app/_models/goodissue';
import { TGoodsReceiptHeader } from 'src/app/_models/goodreceipt';
import { TProductionOrderLine } from 'src/app/_models/viewmodel/productionOrder';
import { AuthService } from 'src/app/_services/auth.service';
import { ProductOrderService } from 'src/app/_services/data/product-order.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GoodreceiptService } from 'src/app/_services/transaction/goodreceipt.service';
import { GoodsissueService } from 'src/app/_services/transaction/goodsissue.service';

@Component({
  selector: 'app-management-production-order-edit',
  templateUrl: './management-production-order-edit.component.html',
  styleUrls: ['./management-production-order-edit.component.css']
})
export class ManagementProductionOrderEditComponent implements OnInit {

  constructor(private goodreceiptService: GoodreceiptService,private goodissueService: GoodsissueService,private router: Router, private modalService: BsModalService,private route: ActivatedRoute,public authService: AuthService,private alertifyService: AlertifyService,private productionService: ProductOrderService) { }
  mode: string;
  issueId: string;
  listProduct:TProductionOrderLine[];
  modalRef: BsModalRef;



  goodReceiptList:TGoodsReceiptHeader[];
  goodIssueList:TGoodsIssueHeader[];

  openModal( purchaseId: string, template: TemplateRef<any>) {
    this.goodreceiptService.getGoodsReceiptList("","","","","","","").subscribe((res:any)=>{
      if(res.success){
        this.goodReceiptList = res.data.filter(x=>x.refId === purchaseId)
        console.log("this.goodReceiptList",this.goodReceiptList);
      }else{
        this.alertifyService.warning(res.message);
      }
    })

    this.goodissueService.getGoodsIssueList("","","","","","","").subscribe((res:any)=>{
      if(res.success){
        this.goodIssueList = res.data.filter(x=>x.refId === purchaseId)
      }
    })


    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  
  ngOnInit() {

    this.route.params.subscribe(data => {
      // console.log("data-edit",data);
      this.mode = data['m'];
      this.issueId = data['id'];
    })
    this.loadItemProduct()
  }




dataItemProduct
loadItemProduct(){
  let store = this.authService.storeSelected();
  this.productionService.getOrderById(this.issueId,store.companyCode,store.storeId).subscribe((res:any)=>{
    if(res.success){
      this.dataItemProduct = res.data;
      console.log(" this.dataItemProduct", this.dataItemProduct);
      this.listProduct = res.data.lines
    }else{
      this.alertifyService.warning(res.message)
    }
  })
}

PrintDetail(data) {
  debugger
  console.log("data", data);
  this.router.navigate(["admin/productionorder/print", data.purchaseId]).then(() => {
    // window.location.reload();
  });
}
}
