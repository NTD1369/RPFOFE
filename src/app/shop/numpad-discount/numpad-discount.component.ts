import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumpadDiscountParam } from 'src/app/_models/system/numpadDiscountParam';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { DenominationService } from 'src/app/_services/data/denomination.service';
import { MDenomination } from 'src/app/_models/denomination';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/_services/common/common.service';
import { truncate } from 'fs';

@Component({
  selector: 'app-numpad-discount',
  templateUrl: './numpad-discount.component.html',
  styleUrls: ['./numpad-discount.component.scss']
})
export class NumpadDiscountComponent implements OnInit {
  @Input() model: NumpadDiscountParam; 
  @Output() amount = new EventEmitter<any>();
  discountAmount: string= "";
  isPercentSelected:boolean = true;
  isAmountSelected:boolean = true;
  currentValue: string ="";
  constructor(private alertify: AlertifyService, private commonService: CommonService, private denominationService: DenominationService,
     private authService: AuthService) { 
     
     }
  storeSelected: MStore;
  denoList: MDenomination[]=[];
  shortcuts: ShortcutInput[] = [];  
  shortcuts$: Observable<ShortcutInput[]>;
  DiscountNumberPad$: Observable<string>;
  ngAfterViewInit() {
    // console.log('this.isLoadShortCut', this.isLoadShortCut);
    // this.loadShortcuts();
    // if(this.shortCutModel!==null && this.shortCutModel!==undefined && this.shortCutModel?.type?.length > 0)
    // {
   
    //   console.log('this.shortCutModel',this.shortCutModel);

    // }
  }

  loadShortcuts()
  {

    this.shortcuts.push( 
     
      {
        key: ["alt + p"],
        label: "Discount Percent" ,
        description: "Discount Percent",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          this.toggleMedthod('Discount Percent')
        },
        preventDefault: true
      },
      {
        key: ["alt + a"],
        label: "Discount Amount" ,
        description: "Discount Amount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          this.toggleMedthod('Discount Amount')
        },
        preventDefault: true
      },
      {
        key: ["alt + c"],
        label: "Clear Discount" ,
        description: "Clear Discount",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          this.reset();
        },
        preventDefault: true
      },
       
      {
        key: ["f1"],
        label: "Discount 1" ,
        description: "Discount 1",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          debugger;
          // this.toggleMedthod('Discount Percent')
          if(this.isPercentSelected)
          {
            this.pressDiscountKey('5', true, true);
          }
          else
          {
            this.pressDiscountKey(this.denoList[0]?.value, true, true) ;
          }
        },
        preventDefault: true
      },
      
      {
        key: ["f2"],
        label: "Discount 2" ,
        description: "Discount 2",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          if(this.isPercentSelected)
          {
            this.pressDiscountKey('10', true, true);
          }
          else
          {
            this.pressDiscountKey(this.denoList[1]?.value, true, true) ;
          }
        },
        preventDefault: true
      },
      
      {
        key: ["f3"],
        label: "Discount 3" ,
        description: "Discount 3",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          if(this.isPercentSelected)
          {
            this.pressDiscountKey('15', true, true);
          }
          else
          {
            this.pressDiscountKey(this.denoList[2]?.value, true, true) ;
          }
        },
        preventDefault: true
      },
      {
        key: ["f4"],
        label: "Discount 4" ,
        description: "Discount 4",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          // debugger;
          if(this.isPercentSelected)
          {
            this.pressDiscountKey('100', true, true);
          }
          else
          {
            this.pressDiscountKey(this.denoList[3]?.value, true, true) ;
          }
        },
        preventDefault: true
      },
    )
    // let sht= this.commonService.getShortcutsTonull(false);
    // this.shortcuts.push(...sht);
    setTimeout(() => {  
      this.commonService.changeShortcuts(this.shortcuts); 
    }, 100);
  }

  loadDenomination()
  {
    this.denominationService.getAll(this.authService.storeSelected().currencyCode).subscribe((response: any)=>{
      if(response.success)
      { 
        this.denoList= response.data.filter(x=>x.showOnDiscount===true);
        if(this.denoList===null || this.denoList===undefined || this.denoList?.length === 0)
        {
          let length =response.data.length;
          if (response.data.length > 4) {
            length = 4;
          }
          // debugger;
          this.denoList= response.data.slice(0, length);;
        }
      }
      else
      {
         
        this.alertify.warning(response.message);
      }
      
    })
  }
  ngOnInit() {
    // debugger;
    this.DiscountNumberPad$= this.commonService.DiscountNumberPad$;
    this.DiscountNumberPad$.subscribe((data: any) =>{
      //  console.log("dataDiscountNumberPad", data);
        let typeOfAction = data;
        // debugger;
        switch(typeOfAction) { 
            case 'ChangeToDiscountPercent': { 
              //statements; 
              this.toggleMedthod('Discount Percent')
              break; 
            } 
            case 'ChangeToDiscountAmount': { 
              //statements; 
              this.toggleMedthod('Discount Amount')
              break; 
            } 
            case 'Reset': { 
              //statements; 
              this.reset();
              break; 
            }
            case 'Discount1': { 
            //statements; 
            if(this.isPercentSelected)
            {
              this.pressDiscountKey('5', true, true);
            }
            else
            {
              this.pressDiscountKey(this.denoList[0]?.value, true, true) ;
            }
              break; 
            }
            case 'Discount2': { 
              //statements; 
              if(this.isPercentSelected)
              {
                this.pressDiscountKey('10', true, true);
              }
              else
              {
                this.pressDiscountKey(this.denoList[1]?.value, true, true) ;
              }
              break; 
            }
            case 'Discount3': { 
              //statements; 
              if(this.isPercentSelected)
              {
                this.pressDiscountKey('15', true, true);
              }
              else
              {
                this.pressDiscountKey(this.denoList[2]?.value, true, true) ;
              }
              break; 
            }
            case 'Discount4': { 
              //statements; 
              
              if(this.isPercentSelected)
              {
                this.pressDiscountKey('100', true, true);
              }
              else
              {
                this.pressDiscountKey(this.denoList[3]?.value, true, true) ;
              }
              break; 
            }
            // case 'Discount5': { 
            //   //statements; 
            //   break; 
            // }
            // case 'Discount2': { 
            //   //statements; 
            //   break; 
            // }
            default: { 
              //statements; 
              break; 
            } 
        } 
    })
    this.storeSelected = this.authService.storeSelected();
    console.log("this.storeSelected",this.storeSelected);
    this.loadDenomination();
    
    if(this.model!==null && this.model!==undefined)
    {
      if(this.model.isClear)
      {
        this.discountAmount ="";
      }
      if(this.model.type==="")
      {
        this.model.type = 'Discount Percent';
        this.isPercentSelected = true;
        this.isAmountSelected = false;
      }
      if(this.model.type === 'Discount Amount')
      {
        this.isAmountSelected = true;
        this.isPercentSelected = false;
      }
      else
      {
  
        this.isPercentSelected = true;
        this.isAmountSelected = false;
      }
    }
   
  }
  toggleMedthod(method:string )
  {
    // debugger;
    if(method!==undefined && method!==null && method!=='' && this.model !==undefined && this.model!==null)
    {
      // debugger;
      
      this.model.type = method;
      if(method === 'Discount Amount')
      {
        this.isAmountSelected = true;
        this.isPercentSelected = false;
      }
      if(method === 'Discount Percent')
      {
        this.isPercentSelected = true;
        this.isAmountSelected = false;
      }
      this.pressDiscountKey("0",true);
    }
    
  }
  closeNumPad()
  {
    this.model.isClose=true;
    this.amount.emit(this.model); 
  }
  deleteOnekey()
  {
    // debugger;
    this.model.value = this.model.value.substring(0, this.model.value.length - 1);
    if(this.model.type === 'Discount Percent' && parseFloat(this.model.value)  > 100)
    {

    }
    else
    {
       if(this.model.value === "") 
       {
        this.model.value = "0";
       }
      this.discountAmount = this.model.value;//+= key; 
      this.model.value =this.discountAmount;
      this.amount.emit(this.model); 
    }
    
  }
  reset()
  {
    this.toggleMedthod(this.model.type);
  }
  pressDiscountKey(key: string, replace?: boolean, isfastClick?: boolean )
  {
    // debugger;
    let newvalue= this.discountAmount + key;
    if(isfastClick)
    {
      newvalue = key;
    }
    // if(this.model.isFastClick)
    // {
    //   this.amountCharge = "";
    // }
    // if(this.amountCharge === null || this.amountCharge === undefined)
    // {
    //   this.amountCharge = "";
    // }
    // this.model.isFastClick = false;
    
    if(replace===true)
    {
      newvalue = key;
    }
    
    if(this.model.type === 'Discount Percent' && parseFloat(newvalue)  > 101)
    {
       this.alertify.warning("Discount value more than this line");
    }
    else
    {
      if(this.model.type === null || this.model.type === undefined)
      {
        this.model.type = 'Discount Percent';
      }
      this.discountAmount = newvalue;//+= key; 
      this.model.value = this.discountAmount;
      this.model.replace = replace;
      this.model.isFastClick = isfastClick;
      this.amount.emit(this.model); 
    }
   
    // debugger;
  }
}
