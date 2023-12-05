import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TGoodsIssueHeader } from 'src/app/_models/goodissue';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GoodsissueService } from 'src/app/_services/transaction/goodsissue.service';

@Component({
  selector: 'app-management-transaction-goodissue-print',
  templateUrl: './management-transaction-goodissue-print.component.html',
  styleUrls: ['./management-transaction-goodissue-print.component.scss']
})
export class ManagementGoodIssuePrintComponent implements OnInit {

  constructor(private activedRoute: ActivatedRoute, private authService: AuthService, private goodissueService: GoodsissueService,
     private companyService: CompanyService, private alertify: AlertifyService) { }

  param = "";
  version = "en";
  storeInfo = {};
  arrDataPrintList: TGoodsIssueHeader;
  date:Date =new Date;
  statusOptions = [
    {
      value: "O", name: "Open",
    },
    {
      value: "A", name: "Open",
    },
    {
      value: "C", name: "Closed",
    },
    {
      value: "P", name: "Partial",
    },
  ];

  ngOnInit() {
    this.activedRoute.params.subscribe(data => {
      this.param = data['id'];
    })
    this.version = localStorage.getItem('language');
    this.GetData();
  }

  GetData() {
    let store = this.authService.storeSelected();
    this.goodissueService.getIssue(this.param, store.storeId, store.companyCode).subscribe((response: any) => {
      if(response.success)
      {
        let resultStatus = this.statusOptions.filter(s => s.value.includes(response.data.status));
        this.arrDataPrintList = response.data;
        this.arrDataPrintList.status = resultStatus.length > 0 ? resultStatus[0].name : "";
        console.log("good issue", this.arrDataPrintList);
      }
      else
      {
        this.alertify.warning(response.message);
      }
     
    });

    this.companyService.getItem(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      this.storeInfo = response.data;
    });

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
