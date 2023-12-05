import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxNumberBoxComponent, DxTextBoxComponent } from 'devextreme-angular';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-pickup-amount-input',
  templateUrl: './shop-pickup-amount-input.component.html',
  styleUrls: ['./shop-pickup-amount-input.component.scss']
})
export class ShopPickupAmountInputComponent implements OnInit {
  @Input() isNew; 
  @Input() isView; 
  reasonFilterList;
  @Input() model: TPickupAmount;
  @Output() outPickUp = new EventEmitter<any>();
  pickupAmount: any={};
  @ViewChild('txtUserApprove', { static: false }) txtUserApprove: DxTextBoxComponent;
  @ViewChild('txtPassApprove', { static: false }) txtPassApprove: DxTextBoxComponent;
  @ViewChild('txtAmount', { static: false }) txtAmount: DxNumberBoxComponent;

  
  constructor( private pickupService: PickupAmountService, private commonService: CommonService, private shiftService: ShiftService , public modalRef: BsModalRef ,
     private alertifyService: AlertifyService, public authService: AuthService) { }
  storeSelected: MStore;
  formatStr= "#,##0.######";
  setfortStr()
  {
    let format = this.authService.loadFormat();
    debugger;
    let newFm ="";
    if(format!==null && format!==undefined)
    {
       
      if(format.thousandFormat?.length > 0)
      {
        newFm += "#" + format.thousandFormat +"##0";
      }
      if(format.decimalFormat?.length > 0)
      {
        newFm += format.decimalFormat +"######";
      }
       
       
    }
    if(newFm?.length > 0)
    {
      this.formatStr = newFm;
    }
  }
  ngOnInit() {
    this.setfortStr();
    // this.storeSelected = this.authService.storeSelected();
    // this.model.companyCode = this.storeSelected.companyCode;
    // this.model.storeId = this.storeSelected.storeId;
    // if(this.shiftService.getCurrentShip()?.shiftId !== null && this.shiftService.getCurrentShip()?.shiftId !== undefined && this.shiftService.getCurrentShip()?.shiftId !== '' )
    // {
    //   this.model.shiftId = this.shiftService.getCurrentShip().shiftId;
    // }
    // else
    // {
    //   this.model.shiftId = "";
    // }
    
    // let storeClient = this.authService.getStoreClient();
    // this.model.pickupBy = this.pickupBy;
    // if(storeClient!==null && storeClient!==undefined)
    // {
    //   this.model.counterId = this.authService.getStoreClient().publicIP;
    // }
    // else
    // {
    //   this.model.counterId = this.authService.getLocalIP();
    // }
    
  }
  shortcuts: ShortcutInput[] = []; 
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.txtAmount.instance.focus();
      // this.btnApprove.text = "Confirm";
    },10);
    setTimeout(() => {
      this.loadShortCuts();
      // this.btnApprove.text = "Confirm";
    },30);
  }
  loadShortCuts()
  {
    
      this.shortcuts.push(  
        {
          key: ["enter"],
          label: "Submit" ,
          description: "Submit",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => { 
             this. applyReason();
          },
          preventDefault: true
        },
        
        {
          key: ["alt + x"],
          label: "Close modal",
          description: "Close modal",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => {
               this.cancel();
          },
          preventDefault: true
        },
      )
      this.commonService.changeShortcuts(this.shortcuts, true);
   
   
  }
  reasonText='';
  onReasonChanged(reason)
  {
    debugger;
    this.reasonText = reason.value;
  }
  cancel()
  {
    this.pickupAmount.isClose = true;
    this.outPickUp.emit(this.pickupAmount);
  }
  applyReason()
  { 
    if(this.model?.amount === null || this.model?.amount === undefined)
    {
      Swal.fire({
        icon: 'warning',
        title: 'Input Value',
        text: "Please input pickup amount."
      }).then(()=>{
        setTimeout(() => {
          this.txtAmount.instance.focus();
        }, 10);
       
      });
    }
    else
    {
      this.pickupAmount.isClose = false;
      this.pickupAmount = this.model;
      
      this.outPickUp.emit(this.pickupAmount);
    }
   
  }

}
