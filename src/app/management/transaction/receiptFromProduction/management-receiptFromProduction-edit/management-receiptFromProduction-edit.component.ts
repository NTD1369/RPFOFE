import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TReceiptfromProductionLine } from 'src/app/_models/viewmodel/receiptFromProduction';
import { AuthService } from 'src/app/_services/auth.service';
import { ReceiptFromProductionService } from 'src/app/_services/data/receiptFromProduction.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { status } from 'src/environments/environment';

@Component({
  selector: 'app-management-receiptFromProduction-edit',
  templateUrl: './management-receiptFromProduction-edit.component.html',
  styleUrls: ['./management-receiptFromProduction-edit.component.css']
})
export class ManagementReceiptFromProductionEditComponent implements OnInit {

  constructor(public authService: AuthService,private alertifyService: AlertifyService,
    private receiptFromProduction : ReceiptFromProductionService,private router: Router,private route: ActivatedRoute ) { }

    lines:TReceiptfromProductionLine[];

  dateFormat="";
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

  issueId: string;
  docStatus: any[] = status.InventoryDocument;


  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.route.params.subscribe(data => {
      this.issueId = data['id'];
      console.log("this.issue",this.issueId);
    })
    this.loadReceiptEdit();

  }

dataReceiptEdit;
loadReceiptEdit(){
  let store = this.authService.storeSelected();

this.receiptFromProduction.getOrderById(this.issueId,store.companyCode,store.storeId).subscribe((reponse:any)=>{
  if(reponse.success){
    this.dataReceiptEdit = reponse.data;
    console.log("this.dataReceiptEdit",this.dataReceiptEdit);
    this.lines = reponse.data.lines

  }

  else{
    this.alertifyService.warning(reponse.message);

  }
})
}


PrintDetail(data) {
  debugger
  console.log("data", data);
  this.router.navigate(["admin/receiptfromProduction/print", data.invtid]).then(() => {
    // window.location.reload();
  });
}


}
