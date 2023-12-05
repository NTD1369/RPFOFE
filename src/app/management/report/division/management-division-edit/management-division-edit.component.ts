import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { TDivisionHeader } from 'src/app/_models/division';
import { AuthService } from 'src/app/_services/auth.service';
import { DivisionService } from 'src/app/_services/data/division.service';
import Swal from 'sweetalert2';
import { HeaderModel } from '../management-division-create/management-division-create.component';

@Component({
  selector: 'app-management-division-edit',
  templateUrl: './management-division-edit.component.html',
  styleUrls: ['./management-division-edit.component.scss']
})
export class ManagementDivisionEditComponent implements OnInit {

  constructor(public divisionService: DivisionService, private activatedRoute: ActivatedRoute,public authService: AuthService)
  { 
    this.model = new TDivisionHeader();
  }
  model: TDivisionHeader;
  listData: any[] = [];
  listHeader: HeaderModel[] = [];
  title= "Division / Detail";
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
    this.divisionService.getItem(this.authService.getCurrentInfor().companyCode, this.id).subscribe((response: any)=>{
      if(response.success)
      { 
        this.model= response.data;
        console.log('this.model', this.model);
        this.divisionService.getDetail(this.authService.getCurrentInfor().companyCode, this.id).subscribe((detailResponse: any)=>{
          if(detailResponse.success)
          {
            this.isLoadingData = false;
            let rsData = detailResponse.data;
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
              // let headerAuto = this.listHeader.filter(x=>x.IsAutoColumn === true  );
            
              // this.listData.forEach(lineData => {
              //   headerAuto.forEach(header => {
              //     let result = header.Id.includes("Division");
              //     if(result===false)
              //     {
              //       let number =  lineData[header.Id];
                    
              //       lineData[header.Id+'Division'] =number;
                    
              //       let onHand = lineData.OnHand??0;
              //       let totalSo = lineData.Total??0;
              //       if(onHand < totalSo)
              //       {
              //         lineData[header.Id]= 0;
              //         lineData[header.Id+'Flag'] = false ;
              //       }
              //     }
                  
              //   });
              
              // }); 
            }
         
              
          } 
          else
          {
            this.isLoadingData = false;
            Swal.fire({
                  icon: 'warning',
                  title: 'Remove item',
                  text: detailResponse.message
                });
          }
        })
      } 
      else
      {
        this.isLoadingData = false;
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
  mode = '';
  id = '';
  ngOnInit() {
    this.activatedRoute.params.subscribe(data => {
      // debugger;
      // this.mode = data['m'];
      // if (this.mode === undefined || this.mode === null || this.mode === "") {
      //   this.mode = 'setup';
      // }
      this.id = data['id']; 
    });
    // let date = this.GetDateFormat(this.Date);
   this.dateFormat = this.authService.loadFormat().dateFormat;
    this.loadData();
  }
  dateFormat = "yyyy-MM-dd";
  groupCus =[];
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
