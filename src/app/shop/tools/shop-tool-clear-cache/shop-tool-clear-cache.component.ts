import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxSelectBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-tool-clear-cache',
  templateUrl: './shop-tool-clear-cache.component.html',
  styleUrls: ['./shop-tool-clear-cache.component.scss']
})
export class ShopToolClearCacheComponent implements OnInit {
  // @Input() modalRef;

  prefixes: string[] = ['Custom','Item','Promotion','Schema'];
    statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  constructor(private authSerrvice: AuthService, public modalRef: BsModalRef, private commonService: CommonService) {
   
  }


  @ViewChild('txtKey', { static: false }) txtKey: DxTextBoxComponent;
  @ViewChild('txtPrefix', { static: false }) txtPrefix: DxTextBoxComponent;
  @ViewChild('ddlPrefix', { static: false }) ddlPrefix: DxSelectBoxComponent;

  ngOnInit() {
  
    
  }
 
  onValueChanged (e) {
    const previousValue = e.previousValue;
    const newValue = e.value;
    debugger;
    if(newValue==='Custom')
    {
      setTimeout(() => {
        this.txtPrefix.value = "";
        this.txtPrefix.instance.focus();
      }, 10); 
    }
    if(newValue==='Item')
    {
      setTimeout(() => {
        this.txtPrefix.value = "Item"; 
      }, 10); 
    }
    if(newValue==='Promotion')
    {
      setTimeout(() => {
        this.txtPrefix.value = "Promotion";  
      }, 10); 
    }
    if(newValue==='Schema')
    {
      setTimeout(() => {
        this.txtPrefix.value = "Schema";  
      }, 10); 
    }
    // Event handling commands go here
  }
  clearData()
  {
    let key = this.txtKey.value;
    let prefix = this.txtPrefix.value;
    if(key === null || key ===undefined || key?.length <= 0)
    {
      key = "";
    }
    if(prefix === null || prefix ===undefined || prefix?.length <= 0)
    {
      prefix = "";
    }
    debugger; 
    let message = "";
    if( key === "" &&  prefix === "" )
    {
       
      message = 'Do you clear all cache';
    }
    else
    {
      if(key?.length > 0)
      {
        message = 'Do you clear cache with key: ' + key;
      }
      if(prefix?.length > 0)
      {
        if(message?.length > 0)
        {
          message += ' and prefix: ' + prefix;
        }
        else
        {
          message = 'Do you clear cache with prefix: ' + prefix;
        }
      }
    }
    // else
    // {
      
    // }
    
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
          // this.commonService.ClearCache(key, Prefix);
          this.commonService.ClearCache(key, prefix).subscribe((response: any)=>{
            let iconShow = 'success';
            if(response.success)
            { 
              Swal.fire({
                icon: 'success',
                title: "Clear Cache" ,
                html: response.message
              }).then(()=>{
                setTimeout(() => {
                  sessionStorage.setItem('fnbItems', null);
                  sessionStorage.removeItem("fnbItems");
                }, 10);
                setTimeout(() => {
                  window.location.reload();
                }, 15);
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
    })
    
  }
}
