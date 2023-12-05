import { Component, OnInit } from '@angular/core';
import { PrintService } from 'src/app/_services/data/print.service'; 

@Component({
  selector: 'app-management-inventory-print-template',
  templateUrl: './management-inventory-print-template.component.html',
  styleUrls: ['./management-inventory-print-template.component.css']
})
export class ManagementInventoryPrintTemplateComponent implements OnInit {

  constructor(private printService: PrintService) { }
  arrDataPrints = [];
  arrDataPrintList = [];
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
    this.GetData();
  }

  GetData() {
    this.printService.sharedParam.subscribe((response: any) => {
      if (response !== null) {
        this.arrDataPrintListNew(response);
      }
    });
  }

  arrDataPrintListNew(response) {
    // console.log("response-push", response);
    this.arrDataPrints = [];
    let arrLines = [];
    let lineTotal = 0;
    let resultStatus = this.statusOptions.filter(s => s.value.includes(response.status));
    console.log("resultStatus", resultStatus);
    if(response.lines.length > 0){
      response.lines.forEach(el => {
        lineTotal = el.price * el.quantity;
        arrLines.push({
          barCode: el.barCode,
          description:el.description,
          itemCode: el.itemCode,
          uomCode: el.uomCode,
          quantity: el.quantity,
          price: el.price,
          lineTotal : lineTotal,
          baseTransId: el.baseTransId,
          openQty: el.openQty,
        });
      });
    }
    
    this.arrDataPrints.push({
      companyCode: response.companyCode,
      createdBy: response.createdBy,
      createdOn: response.createdOn,
      invtid: response.invtid,
      isCanceled: response.isCanceled,
      status: resultStatus.length > 0 ? resultStatus[0].name : "",
      storeId: response.storeId,
      storeName: response.storeName,
      totalDiscountAmt: response.totalDiscountAmt,
      totalPayable: response.totalPayable,
      totalReceipt: response.totalReceipt,
      sumLineTotal: response.sumLineTotal,
      sumQuality: response.sumQuality,

      fromStore: response.fromStore,
      docDate: response.docDate,
      docDueDate: response.docDueDate,
      fromStoreName: response.fromStoreName,
      refInvtid: response.refInvtid,
      toStore: response.toStore,
      toStoreName: response.toStoreName,

      cardCode: response.cardCode,
      cardName: response.cardName,
      modifiedBy: response.modifiedBy,
      purchaseId: response.purchaseId,
      refTransId: response.refTransId,
      vatTotal: response.vatTotal,
      lines: arrLines,
      length: 1
    });
    this.arrDataPrintList = this.arrDataPrints[0];
    console.log("this.arrDataPrintList", this.arrDataPrintList);
    setTimeout(() => {
      // debugger;
      window.print(); 
    }, 1000);
  }
}
