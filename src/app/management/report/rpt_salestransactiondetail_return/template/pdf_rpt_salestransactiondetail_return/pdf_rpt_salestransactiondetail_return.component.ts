import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { AuthService } from 'src/app/_services/auth.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';

@Component({
  selector: 'app-pdf_rpt_salestransactiondetail_return',
  templateUrl: './pdf_rpt_salestransactiondetail_return.component.html',
  styleUrls: ['./pdf_rpt_salestransactiondetail_return.component.scss']
})
export class Pdf_rpt_salestransactiondetail_returnComponent implements OnInit {

  @Input() rptModel: any;
  // @Input() poleValue: SStoreClient;
  constructor(public authService: AuthService,  private storeClient: StoreclientService, public env: EnvService) { }
  terminalGrp: any;
  @ViewChild('pdfContainer_1') pdfContainer_1: ElementRef;
  async PrintPage() {
    // console.log("PrintTemplate", this.PrintTemplate);
    // console.log(this.pdfContainer.nativeElement);
    // console.log("this.printByApp", this.printByApp);
  
        var data = this.pdfContainer_1.nativeElement.innerHTML;
       


      var versionUpdate = (new Date()).getTime();
      var myWindow = window.open('', 'my div', '');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/dev/bootstrap.min.css"/>');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/stylecustomer.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/print.css" type="text/css" />');
      myWindow.document.write('<link rel="stylesheet" href="/assets/css/printtable.css?v="'+ versionUpdate+'" type="text/css" />');
      myWindow.document.write('</head><body >');
      myWindow.document.write(data);
      myWindow.document.write('</body></html>');
      myWindow.document.close(); // necessary for IE >= 10
      // this.exportAsPDF("printDiv");

      // console.log(' myWindow.document',  myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML);
      // this.billService.testPrint( myWindow.document.getElementsByClassName("center-wrap")[0].innerHTML, "test").subscribe((response: any) =>{

      // });
      setTimeout(() => {
        console.log("print 3");
        myWindow.focus();
        let timeDelay = 100;
        // if (this.printDelay !== null && this.printDelay !== undefined && this.printDelay !== '') {
        //   timeDelay = parseInt(this.printDelay);
        // }
       
        setTimeout(() => {
          myWindow.print();
          myWindow.close();

          // if (this.poleValue === null || this.poleValue === undefined) {
          //   console.log("Pole Null")

          //   let currenInfor = this.authService.storeSelected();
          //   let localIp = this.authService.getLocalIP();
          //   this.storeClient.getById(currenInfor.companyCode, currenInfor.storeId, '', localIp, '').subscribe((response: any) => {

          //     if (response.success) {
          //       this.poleValue = response.data;
          //     }
          //   });
          //   await timer(200).pipe(take(1)).toPromise();
          // }

        }, timeDelay);

      }, 400);


    
    
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.PrintPage();
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  
  ngOnInit() {
    debugger;
    let lines = this.rptModel?.lines;
    console.log('this.rptModel', this.rptModel);
    let dateGrp = [];
    this.terminalGrp = [];
    if(lines!==null && lines!==undefined && lines?.length > 0)
    {
      
      lines.map((todo, i) => { todo.DateGrp = this.GetDateFormat(new Date(todo.createdOn)) ;  })
   
      dateGrp = lines.map(item => item.DateGrp).filter((value, index, self) => self.indexOf(value) === index);
      debugger;
      dateGrp.forEach(element => {
       
        let lineFilter= lines.filter(x=>x.DateGrp === element );
        var lineGroups = lineFilter.reduce(function (obj, item) {
        
          obj[item.counterId] = obj[item.counterId] || [];
          obj[item.counterId].counterId = item.counterId;
  
          obj[item.counterId].push({
         
            companyCode: item.companyCode,
            counterId: item?.counterId,
            barCode: item?.barCode,
            createdBy: item.createdBy,
            createdOn: item.createdOn,
            description: item.description,
            finalLineTotal: item.finalLineTotal,
            headerStatus: item?.headerStatus,
            itemCode: item.itemCode,
            itemGroupId: item.itemGroupId,
            lineId: item.lineId,
            price: item?.price,
            lineTotal: item?.lineTotal,
            approvalId: item?.approvalId,
            refTransId: item.refTransId,
            shiftId: item?.shiftId,
            storeName: item.storeName,
            storeId: item.storeId,
            transId:item.transId,
            uomCode: item.uomCode,
            remark: item.reason??'', 
            quantity: item.quantity,
            duration: item.duration,
            DateGrp:  item.DateGrp
  
          });
  
          return obj;
        }, {});
        
        let responseProps = Object.keys(lineGroups);
        
        let Response = [];
  
        for (let prop of responseProps) {
  
          Response.push(lineGroups[prop]);
        }
  
        let GrpCounter = Response.sort((a, b) => a.DateGrp !== b.DateGrp ? a.DateGrp < b.DateGrp ? -1 : 1 : 0);
        let grpX = { name: element  , lines: GrpCounter  };
        this.terminalGrp.push(grpX);
     
      });
      console.log('this.terminalGrp', this.terminalGrp);
    }
  }

}
