import { Component, OnInit } from '@angular/core';
import { ThumbnailsPosition } from 'ng-gallery';
import { ReportService } from 'src/app/_services/common/report.service';

@Component({
  selector: 'app-rpt_dash_salestransactiondetails',
  templateUrl: './rpt_dash_salestransactiondetails.component.html',
  styleUrls: ['./rpt_dash_salestransactiondetails.component.css']
})
export class Rpt_dash_salestransactiondetailsComponent implements OnInit {

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.loadDashboard();
  }
  loadDashboard()
  {
   
    this.reportService.Get_Dash_SaleDetailTransactionByTop('CP001', '1001','','','Amount','', 10).subscribe((response: any) =>{
      debugger;
      if(response.success)
      {
        console.log(response.data);
      }
      else
      {
         console.log(response.message);
      }
    });
  }
}
