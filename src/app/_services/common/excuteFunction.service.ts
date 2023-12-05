import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { EnvService } from 'src/app/env.service';
import { SStoreClient } from 'src/app/_models/storeclient';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { BankTerminalService } from '../data/bank-terminal.service';
import { StoreService } from '../data/store.service';
import { StoreclientService } from '../data/storeclient.service';
import { AlertifyService } from '../system/alertify.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ExcuteFunctionService {
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  host = environment.production === true ? this.env.host : environment.host;
  constructor(private http: HttpClient,  public env: EnvService , public bankTerminalService: BankTerminalService ,public storeClientService: StoreclientService , public authService: AuthService , public commonService: CommonService ,  private alertify: AlertifyService) { }
  getStoreClient() : SStoreClient
  {
    let poleSetup = localStorage.getItem("poleSetup");
    let result = null;
    if(poleSetup!==null && poleSetup!==undefined)
    {
      result = JSON.parse(poleSetup);
    }
    if(result===null || result===undefined)
    {
      let currenInfor = this.authService.getCurrentInfor();
      let localIp =  this.authService.getLocalIP();
        this.storeClientService.getById(currenInfor.companyCode , currenInfor.storeId, '', localIp ,'').subscribe((response: any)=>{
        if(response.success)
        { 
          result = response.data; 
        }
      });
    }
    return result;
  }
  sendBankEOD()
  {
    this.bankTerminalService.SendPayment('9', '', '', 0, "", '' , 90).subscribe((response: any)=>{ 
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
  openDrawer()
  {
    let storeClient = this.getStoreClient();
    if(storeClient!==null && storeClient!==undefined)
    {
      if(storeClient?.printName?.length > 0)
      {
        setTimeout(() => {
          this.commonService.OpenDrawer(storeClient?.printName, "").subscribe((response: any)=>{
            if(response.success)
            {
              Swal.fire({
                icon: 'success',
                title: 'Open Drawer',
                text: "Open Drawer Successfully Completed."
              });
            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: response.message
              });
            }
          },  (error) => {
            // this.basketService.changeBasketResponseStatus(true);
            // console.log("error Order");
              // this.alertify.error(error);
              Swal.fire({
                icon: 'error',
                title: 'Error - (Internal error)',
                text: "Can't complete progress please try again or contact to support team"
              });
            }
          );
        }, 200)
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: "Name of device is null."
        });
      }
      
    }
    else
    {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: "Client Information can't find"
      });
    }
  }
  clearCache(key, prefix)
  {
    this.commonService.ClearCache(key, prefix).subscribe((response: any)=>{
      let iconShow = 'success';
      if(response.success)
      { 
        Swal.fire({
          icon: 'success',
          title: "Clear Cache" ,
          html: response.message
        });
      }
      else
      {
       
        Swal.fire({
          icon: 'warning',
          title: "Clear Cache" ,
          html: response.message
        });
      }
      
    },  (error) => {
      // this.basketService.changeBasketResponseStatus(true);
      console.log("error", error);
        // this.alertify.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error - (Internal error)',
          text: "Can't complete progress please try again or contact to support team"
        });
      }
    );
  }
}
