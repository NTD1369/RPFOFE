import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxButtonComponent, DxDataGridComponent, DxTextAreaComponent, DxTextBoxComponent, DxTextBoxModule } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalService } from 'ngx-bootstrap/modal';
import BarcodeScanner from 'simple-barcode-scanner';
import { EnvService } from 'src/app/env.service';
import { MReason } from 'src/app/_models/reason';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ReasonService } from 'src/app/_services/data/reason.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-approval-input',
  templateUrl: './shop-approval-input.component.html',
  styleUrls: ['./shop-approval-input.component.scss']
})
export class ShopApprovalInputComponent implements OnInit {
  @Input() title;
  @Input() permissionModel;
  @Input() callBack;
  @Input() freeApprove= false;
  @Output() outEvent = new EventEmitter<any>();
  constructor(private commonService: CommonService, private permissionService: PermissionService, private authService: AuthService,  private reasonService: ReasonService, 
    private env: EnvService, private alertifyService: AlertifyService , private modalService: BsModalService, private basketService: BasketService) { }

  @ViewChild('txtUserApprove', { static: false }) txtUserApprove: DxTextBoxComponent;
  @ViewChild('txtPassApprove', { static: false }) txtPassApprove: DxTextBoxComponent;
  @ViewChild('btnApprove', { static: false }) btnApprove: DxButtonComponent;
  @ViewChild('txtNote', { static: false }) txtNote;
  
  shortcuts: ShortcutInput[] = []; 
  production= false; 
  scannerProfile: any;
  reasonList: MReason[]= [];
  initData= false;
  reasonChange(data)
  {
    debugger;
    let value = data?.value??'' ;
    if(value!=='' && value!=='Others')
    {
      this.txtNote.value= value;
      this.txtNote.disabled = true;
    }
    else
    {
      this.txtNote.value= '';
      setTimeout(() => {
        this.txtNote.disabled = false;
        this.txtNote.instance.focus();
      }, 100);
    }
  }
  loadReasonList()
  {
     let currentInfo = this.authService.getCurrentInfor();
     this.reasonService.getAll(currentInfo.companyCode).subscribe((response: any)=>{
       this.initData = true;
       if(response.success)
       {
         this.reasonList = response.data.filter(x=>x.value !== '' && x.type ==='Approve');
       }
       else
       {
          Swal.fire({
            icon: 'warning',
            title:  'Reason List',
            text:response.message
          }).then(()=>{ 
            // this.refresh();
          });
       }
     })
  }
  initScanner()
  {
    this.scannerProfile = null;
    this.scannerProfile = BarcodeScanner();
    // this.basketService.changeBasketResponseStatus(true);
    this.scannerProfile.on( async (code, event: any) => {
      event.preventDefault();
      console.log(code); 
      var source = event.target;
      var sourceElement = event.srcElement;
      let nameOfInput = source['name'];
      let classnameOfInput = sourceElement['className'];

      setTimeout(()=>{
        this.txtCustomCode.instance.focus();
        this.txtCustomCode.value = code;
        // 
        this.approve(false, "", "", code, this.txtNote.value);
      }, 10);
      // nameOfInput === '' || nameOfInput === undefined ||nameOfInput === null ||
     
      // if( nameOfInput === 'txtQrCode' ||   classnameOfInput === 'txtQrCode')
      // {
      //   return false;
      // }
    
      
    });
  }
  inputType = "";
  loadShortCuts()
  {
    if(this.production)
    {
      this.shortcuts.push(  
        {
          key: ["enter"],
          label: "Next Step / Apply approve " ,
          description: "Next Step / Apply approve",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => { 
            setTimeout(()=>{
              this.btnApprove.instance.focus();
              if(this.selectedTab === "user")
              {
               
                this.approve(false, this.txtUserApprove.value, this.txtPassApprove.value, "", this.txtNote.value);
              }
              else
              { 
                this.approve(false, "", "", this.txtCustomCode.value, this.txtNote.value);
              } 
            }, 10);
          },
          preventDefault: true
        },
        
        {
          key: ["back"],
          label: "Back",
          description: "Back",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
            this.approve(true, '','', '',''); 
          },
          preventDefault: true
        } 
      )
      this.commonService.changeShortcuts(this.shortcuts, true);
    }
    else
    {
      this.shortcuts.push(  
        {
          key: ["enter"],
          label: "Next Step / Apply approve " ,
          description: "Next Step / Apply approve",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => { 
            this.btnApprove.instance.focus();
            if(this.inputType === "Remark")
            { 
              let value = this.txtNote.value;
              if(value===null || value === undefined || value?.length<=0)
              {
                 Swal.fire({
                  icon: 'warning',
                  title: "Input Reason/Note" ,
                  html: "Reason/Note can't null, Please input reason/note"
                  }).then(() =>{
                    this.inputType === "Remark";
                    setTimeout(() => {
                      this.txtNote.instance.focus();
                    }, 320);
                    // this.refresh();
                  });

              }
              else
              {
                this.inputType = "User";
                if(this.defaultLogin === "CustomCode")
                {
                  // this.selectTab("customCode");
                  setTimeout(() => {
                    this.tab2.nativeElement.checked = true;
                    this.selectTab('customCode');
                  }, 200);
                 
                  // setTimeout(() => { 
                  //   this.txtCustomCode.instance.focus();
                  // }, 200); 
                }
                else
                {
                  setTimeout(() => {
                    this.btnApprove.text = "Approve";
                    this.txtUserApprove.instance.focus(); 
                  }, 20);
                }
                // setTimeout(() => {
                //   this.btnApprove.text = "Approve";
                //   this.txtUserApprove.instance.focus(); 
                // }, 20);
              }
           
             
            }
            else
            {
              debugger;
              setTimeout(()=>{
                this.btnApprove.instance.focus();
                if(this.selectedTab === "user")
                { 
                  this.approve(false, this.txtUserApprove.value, this.txtPassApprove.value, "", this.txtNote.value);
                }
                else
                { 
                  this.approve(false, "", "", this.txtCustomCode.value, this.txtNote.value);
                } 
              }, 10);
            }
           
   
            // this.ouputEvent(false, true, false);
          },
          preventDefault: true
        },
        
        {
          key: ["alt + b"],
          label: "Back",
          description: "Back",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
            if(this.inputType === "User")
            {
              this.inputType = "Remark";
              setTimeout(() => { 
                this.txtNote.instance.focus(); 
              }, 20);
            }
            else
            {
              this.approve(true, '','', '','');
            }
          
          },
          preventDefault: true
        },
        {
          key: ["alt + u"],
          label: "Switch to " + (this.selectedTab === 'user' ? 'Barcode / Qrcode' : 'User') + ' mode',
          description: "Switch to " + (this.selectedTab === 'user' ? 'Barcode / Qrcode' : 'User') + ' mode',
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
            if(this.selectedTab === 'user')
            {
            
             
               this.tab2.nativeElement.checked = true;
               this.selectTab('customCode');
            }
            else
            {
              this.tab1.nativeElement.checked = true;
              this.selectTab('user');
            }
        
            
          },
          preventDefault: true
        },
        // {
        //   key: ["alt + c"],
        //   label: "Select barcode tab",
        //   description: "Select barcode tab",
        //   allowIn: [AllowIn.Textarea, AllowIn.Input],  
        //   command: (e) => {
        //     this.tab2.nativeElement.checked = true;
        //     this.selectTab('customCode');
        //   },
        //   preventDefault: true
        // },
        {
          key: ["alt + x"],
          label: "Close modal",
          description: "Close modal",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
               this.closeModal();
          },
          preventDefault: true
        },
      )
      this.commonService.changeShortcuts(this.shortcuts, true);
    }
  
   //  console.log('this.shortcuts X', this.shortcuts);
   
  }
  tmpScannerInfor: any;
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // debugger;
    // this.commonService.scannerProfile = this.tmpScannerInfor.on();
    // this.commonService.scannerProfile.on();
  }
  @ViewChild('txtCustomCode', { static: false }) txtCustomCode: DxTextBoxComponent;
  @ViewChild('tab1', { static: false }) tab1;
  @ViewChild('tab2', { static: false }) tab2;
  selectedTab = "user";
  selectTab(code)
  {
    if(code === 'customCode')
    {
      this.selectedTab = "customCode";
      this.txtCustomCode.value = '';
      setTimeout(() => {
      
        this.txtCustomCode.instance.focus();
      }, 10); 
    }
    else
    {
      this.selectedTab = "user";
      this.txtUserApprove.value = '';
      this.txtPassApprove.value = '';
      setTimeout(() => {
        this.txtUserApprove.instance.focus();
      }, 10); 
    }
  }
  loginBarcode = false;
  // reasonGrid
  @ViewChild(DxDataGridComponent, { static: false }) reasonGrid: DxDataGridComponent;
  gridSroll = 0;
  scrollUp() {
    var scrollable = this.reasonGrid.instance.getScrollable();
    scrollable.scrollBy(-50);  
  }

    scrollDown() { 
      var scrollable = this.reasonGrid.instance.getScrollable(); 
      scrollable.scrollBy(50);  
    }
    onToolbarPreparing(e) {
    
        e.toolbarOptions.items.unshift(
        {
            location: 'before',
            template: 'storeChange'
        });
       
    }
  
  ngAfterViewInit(): void {
    this.production =  environment.production;
    let loginBarcode =   this.env.barcodeLogin ?? false;
    this.loginBarcode = loginBarcode;
    
    if(loginBarcode)
    {
      this.production = false;
    }
  
    if(this.production===false)
    {
      let defaultLogin =   this.env.defaultLogin ?? "CustomCode";
      if(defaultLogin === "User")
      {
         this.selectedTab = 'user';
         this.defaultLogin = "User";
      }
      else
      {
        this.selectedTab = 'customCode';
        this.defaultLogin = "CustomCode";
      }
     
     
    }
 
    if(this.loginBarcode === false)
    {
      this.inputType = "User";
      setTimeout(() => {
        this.txtUserApprove.instance.focus();
      }, 100);
    }
    else
    {  
      setTimeout(() => {
      this.btnApprove.text = "Confirm";
      }, 100);
      setTimeout(() => {
        this.txtNote.instance.focus();
      }, 150);
  }
   

    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this.loadShortCuts();
    }); 
      
  
  }
  ngOnInit() {
    debugger;
   
    this.inputType = "Remark";
    this.loadReasonList();
    // var a = Object.assign({}, this.commonService.scannerProfile);
    // this.tmpScannerInfor = a;
    // // this.commonService.scannerProfile = null;
    // this.commonService.scannerProfile.off();
   
  }
  closeModal()
  {
    let isClose = true;
    let user = ""; let pass  = "";
    this.authService.setOrderLog("Order", "Close approve modal", "",  "");
    this.outEvent.emit({isClose , user, pass});
  }

  checkAndSetApprove(isClose, user, pass, customCode, note)
  { 
    this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, user, pass, customCode, this.permissionModel.functionId, this.permissionModel.controlId , this.permissionModel.permission).subscribe((response: any)=>{
       debugger;
      if (response.success) {
        // let note = (note ?? '');
        
        // this.basketService.changeUserApproval(user);
        if(this.freeApprove !== null && this.freeApprove!== undefined && this.freeApprove === true)
        {

        }
        else
        {
         
          let basket = this.basketService.getCurrentBasket();
          if(basket!==null && basket!==undefined)
          {
            this.basketService.changeUserApproval(user).subscribe((response) => {
  
            });
    
            if (note !== null && note !== undefined && note !== '') {
              this.basketService.changeNote(note).subscribe((response) => {
    
              });
              this.alertifyService.success('Set note successfully completed.');
            }
          }
       
        } 
        this.outEvent.emit({isClose , user, pass, customCode , note});
        // this.newOrder();
        // modalApprovalRef.hide();
      }
      else {
        // 'Clear Bill'
          Swal.fire({
            icon: 'warning',
            title:  this.permissionModel.functionName ?? this.permissionModel.functionId,
            text: response.message
          }).then(()=>{
             this.refresh();
          });
      }
    }, error =>{
      Swal.fire({
        icon: 'warning',
        title:  this.permissionModel.functionName ?? this.permissionModel.functionId,
        text: error
      }).then(()=>{ 
        this.refresh();
      });
    })
  }
  showDN =false;
  defaultLogin = "User";
  public refresh() {
    this.inputType === "Remark";
    setTimeout(() => {this.inputType = "User";}, 100);

    setTimeout(() => {
      this.selectTab(this.selectedTab);
    }, 500);
  }
  approve(isClose ,user, pass, customCode, note)
  {
    debugger;
    if(this.inputType === "Remark")
    {
      if(isClose)
      {
        let user = ""; let pass  = "";
        this.outEvent.emit({isClose , user, pass});
      }
      else
      {
        if(note?.length <= 0)
        {
          Swal.fire({
            icon: 'warning',
            title: "Input Reason/Note" ,
            html: "Reason/Note can't null, Please input reason/note"
          }).then(() =>{
            this.inputType === "Remark";
            setTimeout(() => {
              this.txtNote.instance.focus();
            }, 300);
            // this.refresh();
          });
        }
        else
        {
          this.inputType = "User";
          debugger;
          // this.showDN = true;
          if(this.defaultLogin === "CustomCode")
          {
            // this.selectTab("customCode");
            setTimeout(() => {
              this.tab2.nativeElement.checked = true;
              this.selectTab('customCode');
            }, 200);
           
            // setTimeout(() => { 
            //   this.txtCustomCode.instance.focus();
            // }, 200); 
          }
          else
          {
            setTimeout(() => {
              this.btnApprove.text = "Approve";
              this.txtUserApprove.instance.focus(); 
            }, 20);
          }
         
        }
        
      }
     
    }
    else
    {
      if(isClose)
      {
        if(this.inputType === "Remark")
        {
          this.outEvent.emit({isClose , user, pass});
        }
        else
        {
          this.inputType = "Remark";
          setTimeout(() => { 
            this.btnApprove.text = "Confirm";
            this.txtNote.instance.focus(); 
          }, 20);
        }
        
      }
      else  
      {

        if(this.selectedTab === "customCode")
        {
            if(customCode!==null && customCode!==undefined && customCode?.length > 0)
            {
              user = '';
              pass = '';
              debugger;
              this.checkAndSetApprove(isClose , user, pass, customCode , note);
              // this.outEvent.emit({isClose , user, pass, customCode, note});
               // let userApproval = customCode; 
           
              // debugger;
              // this.basketService.changeUserApproval(userApproval).subscribe((response) => {
  
              // }); 
            }
            else
            {
              Swal.fire({
                icon: 'warning',
                title: 'Input Value',
                text: "Please input barcode."
              }).then(()=>{
                this.refresh();
              });
            } 
           
        }
        else
        {
            if(user===null || user===undefined || user==='' || pass===null || pass===undefined || pass==='') 
            {
              // this.inputType = "Remark";
              Swal.fire({
                icon: 'warning',
                title: 'Input Value',
                text: "Please input user/pass."
              }).then(()=>{
                
                //  setTimeout(() => {
                //   this.inputType = "User";
                // }, 10);
                // setTimeout(() => {
                //   this.selectTab("user");
                // }, 50);
                setTimeout(() => {
                  // this.txtNote.instance.focus();
                  this.refresh();
                }, 10);
               
              });
            }
            else
            {
               // let userApproval = customCode; 
              // if (note !== null && note !== undefined && note !== '') {
              //   this.basketService.changeNote(note).subscribe((response) => {
  
              //   });
              //   this.alertifyService.success('Set note successfully completed.');
              // }
            // debugger;
            // this.basketService.changeUserApproval(userApproval).subscribe((response) => {
  
            // }); 
            this.checkAndSetApprove(isClose , user, pass, customCode , note);
              // this.outEvent.emit({isClose , user, pass, customCode , note});
            }
        }
        
      
  
        // let strSplit = user.split(' ');
     
        // if(strSplit?.length > 2)
        // {
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Input Value',
        //     text: "Wrong format."
        //   });
        // }
        // else
        // {
        //   if(strSplit?.length > 1)
        //   {
        //     user = strSplit[0];
        //     pass = strSplit[1];
        //   } 
         
        // }
        
      }
     
    }
  
  }
}
