import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { TPaymentHeader, TPaymentLine } from 'src/app/_models/tpayment';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { PaymentService } from 'src/app/_services/data/payment.service';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-payment-detail',
  templateUrl: './shop-payment-detail.component.html',
  styleUrls: ['./shop-payment-detail.component.scss']
})
export class ShopPaymentDetailComponent implements OnInit {
  mode ="";
  isNew = true;
  model: TPaymentHeader;
  lines: TPaymentLine[] = [];
  lguAdd: string = "Add";
  paymentMethods=[];
  customerList = [];
  loadCustomer()
  {
    this.customerService.getByCompany(this.authService.getCurrentInfor().companyCode, '').subscribe((response: any) =>{
      if(response.success)
      {
        this.customerList = response.data; 
        if(this.customerList!==null && this.customerList!==undefined && this.customerList?.length >0)
        {
          this.customerList.map((todo, i) => { todo.customerName = todo.customerId + ' - ' + todo.customerName;
          // if (todo.storeId == newRecordToUpdate.storeId){
             
          //  }
         });
        }
        console.log('this.customerList', this.customerList);
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Update payment',
          text: response.message
        });
      }
    })
  }
  constructor(public authService: AuthService, private paymentService: PaymentService, private activatedRoute: ActivatedRoute,
      private paymentMethodService: PaymentmethodService , private customerService: CustomerService , private router: Router
      ) { 
    this.model = new TPaymentHeader();
  }
  id ="";
  ngOnInit() 
  {
    this.activatedRoute.params.subscribe(data => {
      // debugger;
      this.mode = data['m'];
      if (this.mode === undefined || this.mode === null || this.mode === "") {
        this.mode = 'create';
      }
      this.id = data['id']; 
    });
    this.loadPayments();
    this.loadCustomer();
    if(this.mode === 'create')
    {
      this.model = new TPaymentHeader();
    }
    else
    {
      this.paymentService.getByCode(this.authService.getCompanyInfor().companyCode, this.id).subscribe((response: any) =>{
        if(response.success)
        {
          this.model = response.data;
          this.lines= this.model.lines;
          // Swal.fire({
          //   icon: 'success',
          //   title: 'Update',
          //   text: 'Successfully Completed'
          // }).then(()=>{
          //   window.location.reload();
          // });
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Update payment',
            text: response.message
          });
        }
      })
    }
    
  }
  loadPayments()
  {
    this.paymentMethodService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      if(response.success)
        {
          this.paymentMethods = response.data;
          console.log('this.paymentMethods', this.paymentMethods);
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Payment Method ',
            text: response.message
          });
        }
    });
  }
  // @ViewChild('dataGrid', { static: false }) dataGrid;
  addNewLine()
  {
    // setTimeout(x=> { 
    //   debugger;
    //   const element = document.getElementById('txtDocNum');
    //   element.focus();
    // },0 ); 
    setTimeout(x=> {  
      this.dataGrid.instance.addRow();
    },120 ); 
  }
  onToolbarPreparing(e) {
    // if(this.mode!=='edit')
    // {
      e.toolbarOptions.items.unshift({
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: this.lguAdd,
          onClick: this.addNewLine.bind(this)
        }
      });
    // }
      
   
  }
  listData: any[] = [];
  // listHeader: HeaderModel[] = [];
  title= "Deivision SO";
  isLoadingData = false;
  Date = new Date();
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
   
  listHeaderShow = [];
  // loadData()
  // {
  //   this.isLoadingData = true;
  //   let date = this.GetDateFormat(this.Date);
  //   this.divisionService.Get_RPT_SOToDivision(this.authService.getCurrentInfor().companyCode, date, '', '', false).subscribe((response: any)=>{
  //     if(response.success)
  //     {
  //       this.isLoadingData = false;
  //       let rsData = response.data;
  //         this.listData = rsData?.data;
  //         this.listHeader = rsData?.header;
  //         // console.log('this.listHeader', this.listHeader);
  //         if(this.listData!==null && this.listData!==undefined && this.listData?.length > 0)
  //         {
  //           this.listHeader.forEach((element: any) => {
  //             let result = element.Id.includes("Division");
  //             if(result===false)
  //             {
  //               this.listHeaderShow.push(element);
                
  //             }
              
           
  //           });
  //           console.log('listHeaderShow', this.listHeaderShow);
  //           this.listHeader.forEach((element: any) => {
  //             if( element.IsAutoColumn === '1' || element.IsAutoColumn === 1)
  //             {
  //               element.IsAutoColumn = true;
  //             } ;
  //           });
  //           let headerAuto = this.listHeader.filter(x=>x.IsAutoColumn === true  );
           
  //           this.listData.forEach(lineData => {
  //             headerAuto.forEach(header => {
  //               let result = header.Id.includes("Division");
  //               if(result===false)
  //               {
  //                 let number =  lineData[header.Id];
                   
  //                 lineData[header.Id+'Division'] =number;
                  
  //                 let onHand = lineData.OnHand??0;
  //                 let totalSo = lineData.Total??0;
  //                 if(onHand < totalSo)
  //                 {
  //                   lineData[header.Id]= 0;
  //                   lineData[header.Id+'Flag'] = false ;
  //                 }
  //               }
                
  //             });
             
  //           });
 
  //           console.log('this.listData', this.listData);
  //         }
         

  //     } 
  //     else
  //     {
  //       Swal.fire({
  //             icon: 'warning',
  //             title: 'Remove item',
  //             text: response.message
  //           });
  //     }
  //   })
  // }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  saveData()
  {
   
    // this.listHeader.forEach((element: any) => {
    //   if( element.IsAutoColumn === '1' || element.IsAutoColumn === 1)
    //   {
    //     element.IsAutoColumn = true;
    //   } ;
    // });
    // let headerAuto = this.listHeader.filter(x=>x.IsAutoColumn === true  );
    // let division = { id: "", companyCode: this.authService.getCurrentInfor().companyCode, shiftId :'', storeId: '',  docDate: null, 
    // createdBy:this.authService.getCurrentInfor().username,  remarks:'', status:'C', isCanceled:'N',  lines: []};
    // let sttGrp = 0;
    // let lines= [];
    // headerAuto.forEach((header: any) => {
    //   let result = header.Id.includes("Division");
    //   if(result===false)
    //   {
       
    //     let grpX =  this.listData.filter(item=>item[header.Id] !==null && item[header.Id]!== undefined && item[header.Id] != 0);
      
      
    //     grpX.forEach(lineDivision => {
    //       sttGrp++;
    //       let line: any = {};
    //       line.id = '',
    //       line.lineId = sttGrp.toString();
    //       line.storeId= header.Id.toString();
    //       line.companyCode= this.authService.getCurrentInfor().companyCode;
    //       line.itemCode = lineDivision.ItemCode;
    //       line.slocId=  header.Id.toString();
    //       line.barCode= lineDivision.BarCode??'';
    //       line.uomCode= lineDivision.UOMCode??''
    //       line.quantity= lineDivision[header.Id];
    //       line.status = 'O'
    //       line.remark= ''; 
    //       line.custom1 = '';
    //       line.custom2 = '';
    //       line.custom3 = '';
    //       line.custom4 = '';
    //       line.custom5 = '';
         
    //       lines.push(line);
    //     });
    //     // public string Id { get; set; } 
    //     // public string CompanyCode { get; set; }
    //     // public string CompanyName { get; set; }
    //     // public string StoreId { get; set; }
    //     // public string ContractNo { get; set; }
    //     // public string StoreName { get; set; }
    //     // public string ShiftId { get; set; }
    //     // public string CusId { get; set; }
    //     // public string CusGrpId { get; set; }
        
    //     // public DateTime? CreatedOn { get; set; }
    //     // public string CreatedBy { get; set; }
    //     // public DateTime? ModifiedOn { get; set; }
    //     // public string ModifiedBy { get; set; }
    //     // public string Status { get; set; }
    //     // public string IsCanceled { get; set; }
    //     // public string Remarks { get; set; } 
    //     // public string CustomF1 { get; set; }
    //     // public string CustomF2 { get; set; }
    //     // public string CustomF3 { get; set; }
    //     // public string CustomF4 { get; set; }
    //     // public string CustomF5 { get; set; }
         
       
    //   } 
    // });
    // division.lines= lines;
    // division.docDate = this.Date;
    //  let model = {header: this.listHeader, data: this.listData} 
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if(this.mode === 'edit')
        {
          this.model.companyCode = this.authService.getCurrentInfor().companyCode;
          this.model.modifiedBy = this.authService.getCurrentInfor().username;
          this.model.status = 'C';
          this.paymentService.update(this.model).subscribe((response: any) =>{
            if(response.success)
            {
              Swal.fire({
                icon: 'success',
                title: 'Update',
                text: 'Successfully Completed'
              }).then(()=>{
                window.location.reload();
              });
            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Update payment',
                text: response.message
              });
            }
          })
        }
        else
        {
          this.model.companyCode = this.authService.getCurrentInfor().companyCode;
          this.model.createdBy = this.authService.getCurrentInfor().username;
          this.model.transId = '';
          this.model.status = 'C';

          this.paymentService.create(this.model).subscribe((response: any) =>{
            if(response.success)
            {
              Swal.fire({
                icon: 'success',
                title: 'Create',
                text: 'Successfully Completed'
              }).then(()=>{
                // window.location.reload();
                this.router.navigate(["shop/payment", 'edit', response.message]).then(()=>{

                });
              });
            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Create payment',
                text: response.message
              });
            }
          })
        }
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
