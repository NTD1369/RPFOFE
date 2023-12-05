import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DxDataGridComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AuthService } from 'src/app/_services/auth.service';
import { DivisionService } from 'src/app/_services/data/division.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-division-create',
  templateUrl: './management-division-create.component.html',
  styleUrls: ['./management-division-create.component.scss']
})
export class ManagementDivisionCreateComponent implements OnInit {

  constructor(public divisionService: DivisionService, public authService: AuthService)
  { }
  listData: any[] = [];
  listHeader: HeaderModel[] = [];
  title= "Create / Division SO";
  isLoadingData = false;
  Date = new Date();
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  filter = false;
  filterNeedDivision()
  {
    if (this.filter  !== null && this.filter !== undefined && this.filter !== true) {
      this.dataGrid.instance.clearFilter();
      
    } else {
        this.dataGrid.instance.filter(["total", "<", 'onHand']);
    }
    this.filter = !this.filter;
  }
  listHeaderShow = [];
  loadData()
  {
    this.isLoadingData = true;
    let date = this.GetDateFormat(this.Date);
    this.divisionService.Get_RPT_SOToDivision(this.authService.getCurrentInfor().companyCode, date, '', '', false).subscribe((response: any)=>{
      if(response.success)
      {
        this.isLoadingData = false;
        let rsData = response.data;
          this.listData = rsData?.data;
          this.listHeader = rsData?.header;
          // console.log('this.listHeader', this.listHeader);
          if(this.listData!==null && this.listData!==undefined && this.listData?.length > 0)
          {
            this.listHeader.forEach((element: any) => {
              let result = element.Id.includes("Division");
              if(result===false)
              {
                this.listHeaderShow.push(element);
                
              }
              
           
            });
            console.log('listHeaderShow', this.listHeaderShow);
            this.listHeader.forEach((element: any) => {
              if( element.IsAutoColumn === '1' || element.IsAutoColumn === 1)
              {
                element.IsAutoColumn = true;
              } ;
            });
            let headerAuto = this.listHeader.filter(x=>x.IsAutoColumn === true  );
           
            this.listData.forEach(lineData => {
              headerAuto.forEach(header => {
                let result = header.Id.includes("Division");
                if(result===false)
                {
                  let number =  lineData[header.Id];
                   
                  lineData[header.Id+'Division'] =number;
                  
                  let onHand = lineData.OnHand??0;
                  let totalSo = lineData.Total??0;
                  if(onHand < totalSo)
                  {
                    lineData[header.Id]= 0;
                    lineData[header.Id+'Flag'] = false ;
                  }
                }
                
              });
             
            });
 
            console.log('this.listData', this.listData);
          }
         

      } 
      else
      {
        Swal.fire({
              icon: 'warning',
              title: 'Remove item',
              text: response.message
            });
      }
    })
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  ngOnInit() {
    let date = this.GetDateFormat(this.Date);
    // this.loadData(date);
  }
  groupCus =[];
  @ViewChild('txtRemarks') txtRemarks: DxTextBoxComponent;

  saveData()
  {
   
    this.listHeader.forEach((element: any) => {
      if( element.IsAutoColumn === '1' || element.IsAutoColumn === 1)
      {
        element.IsAutoColumn = true;
      } ;
    });
    let headerAuto = this.listHeader.filter(x=>x.IsAutoColumn === true  );
    let division = { id: "", companyCode: this.authService.getCurrentInfor().companyCode, shiftId :'', storeId: '',  docDate: null, 
    createdBy:this.authService.getCurrentInfor().username,  remarks:'', status:'C', isCanceled:'N',  lines: []};
    let sttGrp = 0;
    let lines= [];
    headerAuto.forEach((header: any) => {
      let result = header.Id.includes("Division");
      if(result===false)
      {
       
        let grpX =  this.listData.filter(item=>item[header.Id] !==null && item[header.Id]!== undefined && item[header.Id] != 0);
      
      
        grpX.forEach(lineDivision => {
          sttGrp++;
          let line: any = {};
          line.id = '',
          line.lineId = sttGrp.toString();
          line.storeId= header.Id.toString();
          line.companyCode= this.authService.getCurrentInfor().companyCode;
          line.itemCode = lineDivision.ItemCode;
          line.slocId=  header.Id.toString();
          line.barCode= lineDivision.BarCode??'';
          line.uomCode= lineDivision.UOMCode??''
          line.quantity= lineDivision[header.Id];
          line.status = 'O'
          line.remark= ''; 
          line.custom1 = '';
          line.custom2 = '';
          line.custom3 = '';
          line.custom4 = '';
          line.custom5 = '';
         
          lines.push(line);
        });
        // public string Id { get; set; } 
        // public string CompanyCode { get; set; }
        // public string CompanyName { get; set; }
        // public string StoreId { get; set; }
        // public string ContractNo { get; set; }
        // public string StoreName { get; set; }
        // public string ShiftId { get; set; }
        // public string CusId { get; set; }
        // public string CusGrpId { get; set; }
        
        // public DateTime? CreatedOn { get; set; }
        // public string CreatedBy { get; set; }
        // public DateTime? ModifiedOn { get; set; }
        // public string ModifiedBy { get; set; }
        // public string Status { get; set; }
        // public string IsCanceled { get; set; }
        // public string Remarks { get; set; } 
        // public string CustomF1 { get; set; }
        // public string CustomF2 { get; set; }
        // public string CustomF3 { get; set; }
        // public string CustomF4 { get; set; }
        // public string CustomF5 { get; set; }
         
       
      } 
    });
    division.lines= lines;
    division.docDate = this.Date;
    division.remarks = this.txtRemarks.value ;
    //  let model = {header: this.listHeader, data: this.listData} 
    this.divisionService.create(division).subscribe((response: any) =>{
      if(response.success)
      {
        Swal.fire({
          icon: 'success',
          title: 'Create Division',
          text: 'Successfully Completed'
        });
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Remove item',
          text: response.message
        });
      }
    })
    // console.log('this.groupCus', this.groupCus);
     

    // console.log('af Convert', grid);
    // let data=   this.dataGrid.instance.getDataSource().items();// .getDataSource().items();  
    // console.log('listData', data);
    // Object.keys(this.listData).forEach((prop) => { this[prop] = item[prop]; });
 
    // let lineByCus = Object.keys(this.listData).where(x=>x['3001'] > 0);
    // console.log('listData', lineByCus);
    // this.listHeader.forEach(cus => {
      
 

    //    console.log(cus.Id, lineByCus);
    // });
    
  }
}
export class HeaderModel
{
  ControlType: string ='';
  GroupNum: number | null = null;
  Id: string ='';
  IsAutoColumn: boolean | null = null;
  OrderNum: number | null = null;
  Title: string =''; 
    
}

 