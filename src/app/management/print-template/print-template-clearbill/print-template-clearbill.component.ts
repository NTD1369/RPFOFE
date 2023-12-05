import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';

@Component({
  selector: 'app-print-template-clearbill',
  templateUrl: './print-template-clearbill.component.html',
  styleUrls: ['./print-template-clearbill.component.scss']
})
export class PrintTemplateClearbillComponent implements OnInit {

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
    // this.PrintPage();
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
    if(lines!==null && lines!==undefined && lines?.length > 0)
    {
      var lineGroups = lines.reduce(function (obj, item) {
        
        obj[item.Grp] = obj[item.Grp] || [];
        obj[item.Grp].Grp = item.Grp;

        obj[item.Grp].push({
          Id: item.Id,
          CompanyCode: item.CompanyCode,
          StoreId: item?.StoreId,
          Type: item?.Type,
          TransId: item.TransId,
          LineNum: item.LineNum,
          Action: item.Action,
          Time: item.Time,
          Value: item?.Value,
          Result: item.Result,
          CustomF1: item.CustomF1,
          CustomF2: item.CustomF2,
          CustomF3: item?.CustomF3,
          CustomF4: item.CustomF4,
          CustomF5: item?.CustomF5,
          CustomF6: item.CustomF6,
          CustomF7: item.CustomF7,
          CustomF8:item.CustomF8,
          CustomF9: item.CustomF9,
          CustomF10: item.CustomF10,
          TerminalId: item.TerminalId,
          CreatedBy: item.CreatedBy,
          CreatedOn: item.CreatedOn

        });

        return obj;
      }, {});
      
      let responseProps = Object.keys(lineGroups);
      
      let Response = [];

      for (let prop of responseProps) {

        Response.push(lineGroups[prop]);
      }

      this.terminalGrp = Response.sort((a, b) => a.Grp !== b.Grp ? a.Grp < b.Grp ? -1 : 1 : 0);
    }
  }

}
