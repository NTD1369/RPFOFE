import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { TEndDate, TEndDateDetail } from 'src/app/_models/enddate';
import { Item } from 'src/app/_models/item';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { EndDateVM, ShiftVM } from 'src/app/_models/viewmodel/shiftViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { EnddateService } from 'src/app/_services/data/enddate.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import saveAs from 'file-saver';
import { TBankIn } from 'src/app/_models/bankin';
import { BankinService } from 'src/app/_services/data/bankin.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-management-endofdate-details',
  templateUrl: './management-endofdate-details.component.html',
  styleUrls: ['./management-endofdate-details.component.scss']
})
export class ManagementEndofdateDetailsComponent implements OnInit {
 
  showOption="false";
  functionId="Adm_ShiftEndDate";
  header: TEndDate;
  date="";

  modalRef: BsModalRef;
  // shift: TShiftLine;
  constructor(public authService: AuthService,private shiftService: ShiftService,  private modalService: BsModalService,
    private enddateService: EnddateService,  private bankinService: BankinService,  private pickupService: PickupAmountService,
    private activedRoute: ActivatedRoute, private alertify: AlertifyService, private route: Router) { this.customizeText= this.customizeText.bind(this);}

  customizeText (e) {
    // debugger;
    if( e.value!==null &&  e.value!== undefined)
      {
        return this.authService.formatCurrentcy( e.value);
      }
      return 0;
  };
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  onExporting(e, name) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= name ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
  
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        customizeCell: function(options) {
          debugger;
            // const excelCell = options;
            const { gridCell, excelCell } = options;

            if(gridCell.rowType === 'data') {
              // debugger;
              //   excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              //   excelCell.alignment = { horizontal: 'left' };
            }
        } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
  loadGeneralSettingStore()
  {
    let result =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='DisplayAmountBeforeEndShift');
    if(result!==null && result!==undefined)
    {
      this.showOption = result.settingValue;
    }
    let pickupAmount =this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().storeId).find(x=>x.settingId==='PickupAmount');
    if(pickupAmount!==null && pickupAmount!==undefined)
    {
      this.pickupAmount = result.settingValue;
    }
  }
  openShiftList()
  {
    // end-of-date/open-shift/:companyCode/:storeId/:date
    this.route.navigate(['admin/end-of-date/open-shift/',this.header.companyCode, this.header.storeId, this.date]);
  }
  canCreate= false;
  ngOnInit() {
    // debugger;
     
    this.canCreate =  this.authService.checkRole(this.functionId , '', 'I' );
    this.activedRoute.params.subscribe(data => { 
      this.date = data['id'];
    })
    this.header = new TEndDate();
    this.header.companyCode = this.authService.getCurrentInfor().companyCode;
    this.header.storeId = this.authService.getCurrentInfor().storeId;
    this.loadGeneralSettingStore();
    this.loadData();
   
  }
  balanceCellValue(rowData)
  {
    // debugger;
    if(rowData.collectedAmount !== null && rowData.collectedAmount !== undefined && rowData.totalAmt !== null && rowData.totalAmt !== undefined)
    {
      return rowData.collectedAmount - rowData.totalAmt; 
    }
    return 0; 
  }
 lostConnectionList = [];
 @ViewChild('template', { static: false }) template;
  checkConnecttion()
  {
    this.enddateService.CheckCounterConnection(this.authService.getCurrentInfor().companyCode, "","").subscribe((checkRs: any) =>{
      if(checkRs.success)
      {
        this.EndOfDate(false);
      }
      else
      {
        this.lostConnectionList = checkRs.data;
        this.modalRef = this.modalService.show(this.template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-dialog-centered modal-sm'
        });
        if(checkRs.message)
        {
          Swal.fire({
            icon: 'warning',
            title: "Check counter connection",
             text:  checkRs.message,
          })
        }
         
      }
    }, error =>{
      Swal.fire({
        icon: 'error',
        title: "Check counter connection",
         text:  error,
      })
    })
  }
  EndOfDate(lostConnection)
  {
   
    
        const total = this.header.payments.reduce(
          (a, b) =>  b.collectedAmount + a,
          0);// subtotal + ship;
        const totalAmt = this.header.payments.reduce(
          (a, b) =>  b.totalAmt + a,
          0);// subtotal + ship;
          const totalBalance = this.header.payments.reduce(
            (a, b) =>  b.balance + a,
            0);// subtotal + ship;
            const totalItem = this.header.itemSumary.reduce(
              (a, b) =>  b.totalQty + a,
              0);// subtotal + ship;
      let message = 'Do you want to end date: ' +  this.date + ' with Collected Amount: ' +  this.authService.formatCurrentcy( total);
      if(lostConnection === true)
      {
        message = 'Do you want to end date ' +  this.date + ' with incomplete data';
      }

        Swal.fire({
          title: message,
          // text: 'End of date' + this.transform(data.date)  ,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            let store= this.authService.storeSelected();
            let model= new  TEndDate();
            model.companyCode = store.companyCode;
            model.storeId = store.storeId;
            model.date =  this.date;
            model.createBy = this.authService.getCurrentInfor().username;
            model.totalBalance = totalBalance;
            model.totalCollected = total;
            model.totalCount = totalItem;
            model.totalSales = totalAmt;
            model.payments = this.header.payments;
            let storeClient = this.authService.getStoreClient();
            if(storeClient!==null && storeClient!==undefined)
            {
              model.terminalId = this.authService.getStoreClient()?.publicIP??'';
            }
            else
            {
              model.terminalId = this.authService.getLocalIP()??'';
            } 
           
            model.taxTotal= 0;
            model.discountTotal=0;
            model.paymentTotal=0;
            model.lineItemCount=0;
            model.taxCount=0;
            model.discountCount=0;
            model.paymentCount=0;
    
            model.status ='C';
            let lines = [];
            this.header.itemSumary.forEach(Item => {
               let line= new TEndDateDetail ();
               line.itemCode = Item.itemCode;
               line.description = Item.description;
               line.uoMCode= Item.uomCode;
               line.quantity = Item.totalQty;
               line.price = Item.price;
               line.lineTotal = Item.lineTotal;
               lines.push(line);
            });
            model.lines = lines;
            this.enddateService.create(model).subscribe((response: any)=>{
              // debugger;
              if(response.success)
              {
                debugger;
                if(totalAmt !== total)
                {
                  let diff = Math.abs(totalAmt - total); 
                  Swal.fire({
                    icon: 'info',
                    title: 'End of day ' + this.date,
                    text: 'Completed successfully. Different Amount: ' + this.authService.formatCurrentcy(diff), 
                  }).then(()=>{
                    window.location.reload();
                  })
                }
                else
                {
                  Swal.fire({
                    icon: 'success',
                    title: 'End of day ' + this.date,
                    text:  "Completed successfully"
                   }).then(()=>{
                     window.location.reload();
                   })
                }
                // this.alertify.success('End of day ' +  this.date + ' completed successfully. ');
               
                // setTimeout(() => { 
                   
                // },50); 
              }
              else
              {
                // this.alertify.warning('End of day ' + this.date + ' failed. ' + response.message);
                Swal.fire({
                   icon: 'warning',
                   title: 'End of day ' + this.date + ' failed.',
                   text:  response.message
                })

                // if(response.code === 3000)
                // {
               
                //   this.lostConnectionList = response.data;
                //   this.modalRef = this.modalService.show(this.template, {
                //     ariaDescribedby: 'my-modal-description',
                //     ariaLabelledBy: 'my-modal-title',
                //     class: 'modal-dialog modal-dialog-centered modal-sm'
                //   });
                // }
                // else
                // {
    
                  
                // }
              }
            }, error =>{
              console.log('error', error);
                Swal.fire({
                  icon: 'error',
                  title: 'End of day ' + this.date + ' failed.',
                  text:  "Failed to connect System, Please try again later."
              })
            });
          
          }
        });
     
   
  }
  pickupAmt : TPickupAmount[]=[];
  loadPickupAmountLst()
  {
    debugger;
    this.pickupService.GetPickupAmountLst(this.authService.getCompanyInfor().companyCode, this.header.storeId, this.header.description, '').subscribe((response: any)=>{
      if(response.success)
      {
        this.pickupAmt = response.data;
      }
      else
      {
        this.alertify.warning(response.message) ;
        
      }

    })
  }
  bankIns : TBankIn[]=[];
  loadBankInAmountLst()
  {
    debugger;
    this.bankinService.getAll(this.authService.getCompanyInfor().companyCode, this.header.storeId, this.header.description).subscribe((response: any)=>{
      if(response.success)
      {
        this.bankIns = response.data;
      }
      else
      {
        this.alertify.warning(response.message) ;
        
      }

    })
  }
  ForceEndShift(data)
  {
    debugger;
    let shift = data;//.getCurrentShip();
    
    this.shiftService.GetEndShiftSummary( this.header.companyCode, this.header.storeId, shift.shiftId).subscribe((response: any)=>{ 
      debugger;
      if(response.success)
      {
        shift = response.data;
        if(shift.openAmt!==null && shift.openAmt!==undefined)
        {
  
        }
        else
        {
          shift.openAmt = 0;
        }
        if(this.header.status!=='C')
        {
          this.header.payments.forEach(payment => {
            payment.collectedAmount =  0;
          });
        }
      
      }
      else
      {
        this.alertify.warning(response.message);
      }
     
      
    });
  const total = shift.collectedAmount;
  
  //  .payments.reduce(
  //   (a, b) =>  b.collectedAmount + a,
  //   0); 
  const totalAmt = shift.totalAmt;
  // .reduce(
  //   (a, b) =>  b.totalAmt + a,
  //   0); 
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to end shift with Collected Amount: ' +  this.authService.formatCurrentcy( total),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) { 
      shift.endAmt = total; 
      shift.shiftTotal = total + shift.openAmt;
      shift.status = 'C';
      shift.modifiedBy = this.authService.getCurrentInfor().username;
      this.shiftService.EndShiftNew(shift).subscribe(
          (response: any) => {
            // debugger;
            if(response.success)
            {
              if(totalAmt !== total)
              {
                let diff = Math.abs(totalAmt - total); 
                Swal.fire({
                  icon: 'info',
                  title: 'Different Amount: ' + this.authService.formatCurrentcy(diff), 
                  
                })
              }
              setTimeout(() => {
              
                this.alertify.success("End shift " +shift.shiftId+ " completed successfully!");
                
              }, 50);
            
            }
            else
            {
            
              this.alertify.warning(response.message); 
            }
          
          },
          (error) => {
            this.alertify.error(error);
          }
        );
      }
    });
    
  }
  showOpenClick = false;
  editorPreparing(e) {
    debugger;
    if(e?.row!==null && e?.row!==undefined)
    {
      let rowdata = e.row.data;
      debugger;
      if(e.parentType === "dataRow" && e.dataField === "collectedAmount" && rowdata!== null && rowdata!==undefined && rowdata.status === 'C') {
          e.editorOptions.readOnly =  true;
          e.editorOptions.cancel = true;
      }
    } 
  }
  pickupAmount="false";
  loadData()
  {
    let store= this.authService.storeSelected();  
    // let now = new Date();
    // let month =  now.getMonth()+1;
    // if(month === 13)
    // {
    //   month= 1;
    // }
    // let dateFormat= now.getFullYear() +"/"+ month + "/" + now.getDate();
    this.enddateService.endDateSummary(store.companyCode, store.storeId, this.date ).subscribe((response: any)=>{ 
      debugger;
      // console.log(response.data)
      this.header = response.data;
      this.header.payments.forEach(payment => {
        if(payment.status === 'C' || (payment.collectedAmount !== null && payment.collectedAmount !== undefined && payment.collectedAmount !== 0 ))
        {
          payment.canEdit = false;
        }
        
       });
       let openList = this.header.payments.filter(x=>x.status !== 'C');
       if(openList!==null && openList!==undefined && openList.length > 0)
       {
        this.showOpenClick = true;
       }
       if(this.pickupAmount === "true")
       {
         this.loadPickupAmountLst();
         this.loadBankInAmountLst();
       }
      
      console.log(this.header);
    });
  }

}
