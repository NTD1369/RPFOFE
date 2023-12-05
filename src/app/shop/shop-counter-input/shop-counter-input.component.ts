import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxTextBoxComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SStoreClient } from 'src/app/_models/storeclient';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StoreclientService } from 'src/app/_services/data/storeclient.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-counter-input',
  templateUrl: './shop-counter-input.component.html',
  styleUrls: ['./shop-counter-input.component.scss']
})
export class ShopCounterInputComponent implements OnInit {

  @ViewChild('txtFingerId', { static: false }) txtFingerId: DxTextBoxComponent;
  @ViewChild('txtCounterId', { static: false }) txtCounterId: DxTextBoxComponent;

  @ViewChild('txtMessage', { static: false }) txtMessage: DxTextBoxComponent;
  @ViewChild('txtMessage2', { static: false }) txtMessage2: DxTextBoxComponent;
  
  constructor(private authService: AuthService, private route: ActivatedRoute, private commonService: CommonService, 
    private storeService: StoreService,  private modalService: BsModalService, 
    private counterService: StoreclientService,private alertifyService: AlertifyService, private routeNav: Router) { }
  // counterId="";
  // fingerId="";
  currentCounter : SStoreClient;
  url="";
  editableCounters = [];
  modalRef: BsModalRef;
  // onCustomItemCreating(args)
  // {
  //   const newValue = args.text;
  //   this.editableCounters.unshift(newValue);
  //   args.customItem = newValue;
  // }
  currenInfor;
  loadStoreClient(storeId)
  {
    
    this.counterService.getAll(this.currenInfor.companyCode, storeId, '','').subscribe((response: any)=>{
      if(response.success)
      {
        if(response.data!==null && response.data !==undefined && response.data?.length > 0)
        {
          response.data.forEach(element => {
            if(element?.publicIP?.length > 0)
            {
              this.editableCounters.push( { publicIP: element?.publicIP??'', localIP: element.localIP??''});
            }
           });
        }
        else
        {
          if(this.currentCounter.publicIP?.length > 0)
          {
            this.editableCounters.push( { publicIP: this.currentCounter.publicIP, localIP: this.currentCounter.localIP??''} );
          }
        }
        console.log('editableCounters', this.editableCounters);
      }
      else 
      {
        this.alertifyService.warning(response.message);
      }
    })
  }
  @ViewChild('template', { static: false }) template;
  openModal(template: TemplateRef<any>)
  {
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }
  selectCounter(data)
  {
    debugger;
    this.modalRef.hide();
    // this.currenInfor.publicIP = data.publicIP;
    setTimeout(() => {
      this.currentCounter.localIP = data.localIP;
      this.currentCounter.publicIP = data.publicIP;
    }, 20);
  }
  ngOnInit() {
    debugger;
    this.currenInfor = this.authService.getCurrentInfor();
    this.loadStore();
    this.loadStoreClient(this.authService.storeSelected().storeId);
    this.loadPoleParities();
    this.loadPoleName();

    this.route.params.subscribe(data => {
      this.url = data['url']; 
    })
     let localIp =  this.authService.getLocalIP();
     this.currentCounter = this.authService.getStoreClient();
     console.log(this.currentCounter);
     debugger;
     if(this.currentCounter!== null && this.currentCounter!==undefined )
     {
      // this.counterId = this.currentCounter.publicIP;
      // this.fingerId = this.currentCounter.localIP;
     }
     else
     {
        this.currentCounter = new SStoreClient();
        this.currentCounter.localIP = localIp;
        this.currentCounter.companyCode = this.authService.storeSelected().companyCode;
        this.currentCounter.storeId = this.authService.storeSelected().storeId;
        this.currentCounter.status= 'A';
        this.currentCounter.publicIP = "";
     }
     
     let poleSetting = this.getPole();
     if(poleSetting!==null && poleSetting!==undefined)
     {
        this.currentCounter.poleName = poleSetting.poleName;
        this.currentCounter.poleBaudRate = poleSetting.poleBaudRate;
        this.currentCounter.poleDataBits = poleSetting.poleDataBits;
        this.currentCounter.poleParity = poleSetting.poleParity;
        this.currentCounter.printSize = poleSetting.printSize;
        this.currentCounter.printName = poleSetting.printName;
     }

  }

  getPole() : SStoreClient
  {
    let poleSetup = localStorage.getItem("poleSetup");
    let result = null;
    if(poleSetup!==null && poleSetup!==undefined)
    {
      result = JSON.parse(poleSetup);
    }
    return result;
  }
  storeOptions= [];
  loadStore(){
    debugger;
    this.storeService.getByUserWithStatus(this.authService.decodeToken?.unique_name).subscribe((response: any) => {
     // debugger;
      if(response.success)
      {
       response.data.forEach(item => {
        //  let data = {name:item.storeName,value:item.storeId}
         let data = {
          // name: item.status === 'I' ? item.storeName + " (Inactive)" : item.storeName, 
          name: item.status === 'I' ? item.storeId + ' - ' + item.storeName + " (Inactive)" : item.storeId + ' - ' + item.storeName, 
          value:item.storeId
       }
         this.storeOptions.push(data);
       });;
       this.storeOptions.unshift({name:'All',value:''});
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
     
      // this.storeList = response;
      // console.log(this.storeList);
    });
}
  lockFingerId = false;
  checkInputCounter()
  {
    let result = true;
    if(this.currentCounter.publicIP === "" || this.currentCounter.publicIP === null || this.currentCounter.publicIP === undefined)
    {
      result = false;
      Swal.fire({
        icon: 'warning',
        title: 'Counter Id',
        text: "Please input Counter Id" 
      }).then(()=>{
        setTimeout(() => {
          this.txtCounterId.instance.focus();
        }, 100);
       
      });
   
    }
    if(this.currentCounter.localIP === "" || this.currentCounter.localIP === null || this.currentCounter.localIP === undefined)
    {
      result = false;
      Swal.fire({
        icon: 'warning',
        title: 'Finger Id',
        text: "Please input Finger Id " 
      }).then(()=>{
        setTimeout(() => {
          this.txtFingerId.instance.focus();
        }, 100);
       
      });
    }
    return  result;
  }
  poleNames=[];
  printSizes=[
    'None',
    '57', '80'
  ];
  poleParities=[];
  checkPoleConnect()
  {
    let message= this.txtMessage.value;
    let message2= this.txtMessage2.value;
    
    debugger;
    this.commonService.PoleShowMess(this.currentCounter?.poleName?.toString(), this.currentCounter?.poleBaudRate?.toString() ,this.currentCounter?.poleParity?.toString(), '', '', '', this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId, this.currentCounter.publicIP, message, message2).subscribe((response: any)=>{
      if(response.success)
      {
        this.alertifyService.success("Connect pole display completed successfully.");
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  loadPoleName()
  {
    this.commonService.PoleGetPortName().subscribe((response: any)=>{
      if(response.success)
      {

        this.poleNames = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  loadPoleParities()
  {
    this.commonService.PoleGetPortNameParity().subscribe((response: any)=>{
      if(response.success)
      {
        this.poleParities = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  setPoleSetting()
  {
    this.currentCounter.id =   this.currentCounter?.id?.toString();
    this.currentCounter.poleBaudRate  = this.currentCounter?.poleBaudRate?.toString();
    this.currentCounter.poleName  = this.currentCounter?.poleName?.toString();
    this.currentCounter.poleParity  = this.currentCounter?.poleParity?.toString();
    this.currentCounter.printSize  = this.currentCounter?.printSize?.toString();
    this.currentCounter.printName  = this.currentCounter?.printName?.toString();
    debugger;
    this.counterService.update(this.currentCounter).subscribe((response: any)=>{
      if(response.success)
      {
        localStorage.setItem("poleSetup", JSON.stringify(this.currentCounter));
        this.alertifyService.success("Set pole display completed successfully.");
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
    });
  }
  setDevice()
  { 
    debugger;
  
    if(this.checkInputCounter())
    {
      let shopmode = this.authService.getShopMode();
      this.counterService.getById(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, '', 
        this.currentCounter.localIP, this.currentCounter.publicIP ).subscribe((response: any)=>{
        if(response.success && response.data!==null && response.data!==undefined)
        {
          debugger; 
          localStorage.setItem('storeClient', JSON.stringify(response.data));
          if(this.url!==null && this.url!==undefined && this.url!=='')
          { 
            this.routeNav.navigate([this.url]).then(() => {
              window.location.reload();
            });
          }
          else
          {
            if (shopmode === 'FnB') {
    
              let ShopModeData = this.authService.getGeneralSettingStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'ShopMode');
              if (ShopModeData!==null && ShopModeData!==undefined  ) {
                if(ShopModeData.customField1?.length > 0 && ShopModeData.customField1 === 'Table')
                {
                  this.routeNav.navigate(["shop/placeInfo", this.authService.storeSelected().storeId]).then(()=>{
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  });
                }
                else
                {
                  this.routeNav.navigate(['/shop/order']).then(() => {
                    window.location.reload();
                  });
                } 
              }
              else
              {
                this.routeNav.navigate(['/shop/order']).then(() => {
                  window.location.reload();
                });
              }
            
            }
            if (shopmode === 'FnBTable') {
              
              this.routeNav.navigate(["shop/placeInfo", this.authService.storeSelected().storeId]).then(()=>{
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              });
               
             
            
            }
            if (shopmode === 'Grocery') {
    
              this.routeNav.navigate(['/shop/order-grocery']).then(() => {
                window.location.reload();
              });
            }
          }
         
         
  
        }
        else
        {

          Swal.fire({
            title: 'Are you sure?',
            text: "Don't matching data. Do you want add counter Id ",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              // debugger;
              // this.newOrder();
              this.counterService.create(this.currentCounter).subscribe((response: any)=>{
                if(response.success)
                {
                  localStorage.setItem('storeClient', JSON.stringify(this.currentCounter));
                  if(this.url!==null && this.url!==undefined && this.url!=='')
                  {
                    this.routeNav.navigate([this.url]).then(() => {
                      window.location.reload();
                    });
                  }
                  else
                  {
                    if (shopmode === 'FnB') {
            
                      this.routeNav.navigate(['/shop/order']).then(() => {
                        window.location.reload();
                      });
                    }
                    if (shopmode === 'Grocery') {
            
                      this.routeNav.navigate(['/shop/order-grocery']).then(() => {
                        window.location.reload();
                      });
                    }
                  }
                
                 
         
                }
                else
                {
                  this.alertifyService.warning(response.message);
                }
              })
            }
          });
       
        }
      })
      
    }
   
     
  }
}
