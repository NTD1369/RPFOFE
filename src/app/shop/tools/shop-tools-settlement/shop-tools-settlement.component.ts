import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { BankTerminalService } from 'src/app/_services/data/bank-terminal.service';
import { StorePaymentService } from 'src/app/_services/data/store-payment.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-tools-settlement',
  templateUrl: './shop-tools-settlement.component.html',
  styleUrls: ['./shop-tools-settlement.component.css']
})
export class ShopToolsSettlementComponent implements OnInit {

  constructor(private storePaymentService: StorePaymentService, private bankTerminalService: BankTerminalService , public modalRef: BsModalRef, private authService: AuthService, private alertify: AlertifyService) { }
  fatherPayment = [];
  sendBankEOD(bankname)
  {
    let bank= this.fatherPayment.find(x=>x.fatherId === bankname);
    let timeOut = bank?.timeOut ?? 60;
    if(timeOut === null || timeOut=== undefined || timeOut === '' || timeOut === "NaN" || timeOut === "undefined")
    {
      timeOut = 60;
    } 
    let portName = bank?.portName ?? '';
    if(portName === null || portName=== undefined || portName === '' || portName === "NaN" || portName === "undefined")
    {
      portName = '';
    } 
    if(portName==='')
    {
      Swal.fire({
        icon: 'warning',
        title: 'Settlement - Bank Terminal',
        text: "Check setup port devide of " + bankname
      });
    }
    else
    {
      this.bankTerminalService.SendPayment('9', bankname, portName, 0, "", '' ,timeOut).subscribe((response: any)=>{ 
        if(response.success)
        { 
          debugger;
          let responeData = response.data;
          if(responeData.statusCode === '00' || responeData.statusCode === '000')
          {
            Swal.fire({
              icon: 'warning',
              title: 'Settlement - Bank Terminal',
              text: "Successfully completed"
            });
          }
          else
          {
            Swal.fire({
              icon: 'warning',
              title: 'Settlement - Bank Terminal',
              text: response.message
            });
          }
      
        
        }
        else
        {
          // this.alertify.warning(response.message);
          Swal.fire({
            icon: 'warning',
            title: 'Settlement - Bank Terminal',
            text: response.message
          });
    
        }
      }, error=>{ 
        Swal.fire({
          icon: 'error',
          title: 'Settlement - Bank Terminal',
          text:  error
        });
      });
    }
   
  }
  loadBank()
  {
    let storeSelected = this.authService.storeSelected();
    let terminalId = "";
    let storeClient = this.authService.getStoreClient();
    if (storeClient !== null && storeClient !== undefined) {
      terminalId = this.authService.getStoreClient().publicIP;
    }
    else {
      terminalId = this.authService.getLocalIP();
    }
    this.storePaymentService.getByStore(storeSelected.companyCode, storeSelected.storeId, terminalId).subscribe((res: any) => {
      // debugger;
      if (res.success) {
        
          let showList = res.data;//.filter(x => x.status === "A" && x.isShow === true);
          
          let newArray = []; 
          showList.forEach(val => newArray.push(Object.assign({}, val))); 
          var  groups = showList.reduce(function (obj, item) {
       
            if(item.fatherId===null || item.fatherId === undefined || item.fatherId=== '')
            {
              item.fatherId = 'Other';
            }
            obj[item.fatherId] = obj[item.fatherId] || [];
            obj[item.fatherId].fatherId = item.fatherId;
            obj[item.fatherId].portName = item.bankCustomF1;
            obj[item.fatherId].timeOut = item?.bankCustomF2;
            let fatherItem = newArray.find(x=>x.paymentCode === item.fatherId);
            if(fatherItem!==null && fatherItem!==undefined)
            {
              obj[item.fatherId].fatherName = fatherItem.paymentDesc;
              obj[item.fatherId].orderNum = fatherItem.orderNum;
             
              if(item.paymentCode !== fatherItem.paymentCode)
              {
                // obj[item.fatherId].push({
                 
                //   paymentCode:  item?.paymentCode,
                //   companyCode:  item?.companyCode,
                //   paymentDesc:  item?.paymentDesc,
                //   forfeitCode:  item?.forfeitCode,
                //   createdBy: item?.createdBy,
                //   createdOn:  item?.createdOn,
                //   modifiedBy:  item?.modifiedBy,
                //   modifiedOn: item?.modifiedOn,
                //   status: item?.status,
                //   accountCode: item?.accountCode,
                //   isRequireRefnum: item?.isRequireRefnum,
                //   eodApply: item?.eodApply,
                //   eodCode: item?.eodCode,
                //   paymentType:  item?.paymentType,
                //   value: item?.value,
                //   rate: item?.rate,
                //   fcAmount: item?.fcAmount,
                //   currency:  item?.currency,
                //   shortName: item?.shortName,
                //   roundingMethod:  item?.roundingMethod,
                //   allowChange: item?.allowChange,
                //   rejectReturn: item?.rejectReturn,
                //   rejectVoid: item?.rejectVoid,
                //   apiUrl: item?.apiUrl,
                //   isCloseModal: item?.isCloseModal,
                //   orderNum: item?.orderNum,
                //   customF1:  item?.customF1,
                //   customF2:  item?.customF2,
                //   customF3: item?.customF3,
                //   customF4:  item?.customF4,
                //   customF5: item?.customF5,
  
                //   bankCustomF1:  item?.bankCustomF1,
                //   bankCustomF2:  item?.bankCustomF2,
                //   bankCustomF3: item?.bankCustomF3,
                //   bankCustomF4:  item?.bankCustomF4,
                //   bankCustomF5: item?.bankCustomF5,
  
                //   ///
                //   allowMix: item?.allowMix,
                //   allowRefund: item?.allowRefund,
                //   requireTerminal: item?.requireTerminal,
                //   terminalIdDefault: item?.terminalIdDefault,
                //   voucherCategory: item?.voucherCategory,
                //   isFatherShow: item?.isFatherShow,
                //   fatherId: item?.fatherId,
                //   isShow: item?.isShow,
                //   bankPaymentType: item?.bankPaymentType
                // });
              }
             
            }
            else 
            {
              // item.fatherId = 'Other';
              if(item.fatherId !== 'Other')
              {
                obj[item.fatherId].fatherName = item.fatherId;
                obj[item.fatherId].orderNum = 5;
              }
              else
              {
                obj[item.fatherId].fatherName = 'Other';
                obj[item.fatherId].orderNum = 10;
              }
            
            
                // obj[item.fatherId].push({
                 
                //   paymentCode:  item?.paymentCode,
                //   companyCode:  item?.companyCode,
                //   paymentDesc:  item?.paymentDesc,
                //   forfeitCode:  item?.forfeitCode,
                //   createdBy: item?.createdBy,
                //   createdOn:  item?.createdOn,
                //   modifiedBy:  item?.modifiedBy,
                //   modifiedOn: item?.modifiedOn,
                //   status: item?.status,
                //   accountCode: item?.accountCode,
                //   isRequireRefnum: item?.isRequireRefnum,
                //   eodApply: item?.eodApply,
                //   eodCode: item?.eodCode,
                //   paymentType:  item?.paymentType,
                //   value: item?.value,
                //   rate: item?.rate,
                //   fcAmount: item?.fcAmount,
                //   currency:  item?.currency,
                //   shortName: item?.shortName,
                //   roundingMethod:  item?.roundingMethod,
                //   allowChange: item?.allowChange,
                //   rejectReturn: item?.rejectReturn,
                //   rejectVoid: item?.rejectVoid,
                //   apiUrl: item?.apiUrl,
                //   isCloseModal: item?.isCloseModal,
                //   orderNum: item?.orderNum,
                //   customF1:  item?.customF1,
                //   customF2:  item?.customF2,
                //   customF3: item?.customF3,
                //   customF4:  item?.customF4,
                //   customF5: item?.customF5,
  
                //   bankCustomF1:  item?.bankCustomF1,
                //   bankCustomF2:  item?.bankCustomF2,
                //   bankCustomF3: item?.bankCustomF3,
                //   bankCustomF4:  item?.bankCustomF4,
                //   bankCustomF5: item?.bankCustomF5,
  
                //   ///
                //   allowMix: item?.allowMix,
                //   allowRefund: item?.allowRefund,
                //   requireTerminal: item?.requireTerminal,
                //   terminalIdDefault: item?.terminalIdDefault,
                //   voucherCategory: item?.voucherCategory,
                //   isFatherShow: item?.isFatherShow,
                //   fatherId: item?.fatherId,
                //   isShow: item?.isShow,
                //   bankPaymentType: item?.bankPaymentType
                // });
               
            }
  
            return obj;
          }, {});
          
          let responseProps = Object.keys(groups);
          
          let cashierPaymentResponse = [];
    
          for (let prop of responseProps) { 
            cashierPaymentResponse.push(groups[prop]);
          }
    
          this.fatherPayment = cashierPaymentResponse.sort((a, b) => a.orderNum > b.orderNum ? -1 : 1 );
          this.fatherPayment = this.fatherPayment.filter(x=>x.fatherId !== 'Other');
          // if(this.fatherPayment?.length < 4)
          // {
          //   if(this.fatherPayment?.length === 1)
          //   {
          //     this.fatherPayment.push({
                 
          //       fatherId:  '',
          //       fatherName:  ''
                 
          //     });
          //     this.fatherPayment.push({
                 
          //       fatherId:  '',
          //       fatherName:  ''
                 
          //     });
          //     this.fatherPayment.push({
                 
          //       fatherId:  '',
          //       fatherName:  ''
                 
          //     });
          //   }
          //   if(this.fatherPayment?.length === 2)
          //   {
          //     this.fatherPayment.push({
                 
          //       fatherId:  '',
          //       fatherName:  ''
                 
          //     });
          //     this.fatherPayment.push({
                 
          //       fatherId:  '',
          //       fatherName:  ''
                 
          //     });
          //   }
          //   if(this.fatherPayment?.length === 3)
          //   {
          //     this.fatherPayment.push({
                 
          //       fatherId:  '',
          //       fatherName:  ''
                 
          //     });
              
          //   }
          // }
          console.log('fatherPayment', this.fatherPayment);
      
      } 
      else {
        this.alertify.warning(res.message); 
      } 
    }, error => {
      // this.alertify.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Store Payment',
        text: "Can't get data"
      });
    });
  }
  ngOnInit() {
    this.loadBank();
  }

}
