import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { TEmployeeSalesTargetSummary } from 'src/app/_models/salestarget';
import { AuthService } from 'src/app/_services/auth.service';
import { SalarySummaryService } from 'src/app/_services/data/salary-summary.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-target-summary',
  templateUrl: './management-target-summary.component.html',
  styleUrls: ['./management-target-summary.component.scss']
})
export class ManagementTargetSummaryComponent implements OnInit {

  constructor(private salarySummaryService: SalarySummaryService, public authService: AuthService, private alertService: AlertifyService) { }

  fromDate: Date;
  toDate: Date;
  dateFormat="";
  list: TEmployeeSalesTargetSummary[] = [];
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  status = "";
  loadDataSimulate(fromDate, toDate)
  {
    let xFrom = this.GetDateFormat(fromDate);
    let xTo = this.GetDateFormat(toDate);
    let currentInfor = this.authService.getCurrentInfor();
    this.salarySummaryService.getItems(currentInfor.companyCode, '', '', xFrom, xTo, 'Position' ).subscribe((response: any)=>{
      if(response.success)
      {
          this.list = response.data;
          this.status = response.message;
      }
      else
      {
         this.alertService.warning(response.message);
      }
    })
  }
  lineTotalCellValue(rowData) {
    let rs = 0;
    if(rowData.lineTotal!== null && rowData.lineTotal!== undefined)
    {
      rs =rowData.lineTotal;
    }
    if (rowData.commisionValue !== null && rowData.salary !== null) {
      rs = parseFloat(rowData.commisionValue)  +  parseFloat(rowData.salary);
    } 
    return rs??0;
  }
  createSummary()
  {  
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {  
        let username =  this.authService.getCurrentInfor().username;
        let companyCode = this.authService.getCurrentInfor().companyCode;
        this.list.forEach(line => {
          line.createdBy = username;
          line.companyCode = companyCode;
        });
        this.salarySummaryService.createList(this.list).subscribe((response: any)=>{
          if(response.success)
          {
              this.list = response.data;
          }
          else
          {
            this.alertService.warning(response.message);
          }
        })
    }})
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    // else{
      var d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth(); 
      const lastDay =  new Date(year, month +1, 0).getDate();

      this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
      this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
      // this.route
      // this.loadItems("","","admin","","");
      debugger;
      // this.loadControl();
      // let xFrom = this.GetDateFormat(this.fromDate);
      // let xTo = this.GetDateFormat(this.fromDate);
      // this.loadDataSimulate(xFrom, xTo); 
    // }
   
  }

}
