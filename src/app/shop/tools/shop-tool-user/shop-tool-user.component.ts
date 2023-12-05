import { templateSourceUrl } from '@angular/compiler';
import { Route } from '@angular/compiler/src/core';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shop-tool-user',
  templateUrl: './shop-tool-user.component.html',
  styleUrls: ['./shop-tool-user.component.scss']
})
export class ShopToolUserComponent implements OnInit {
  countries: any[] = [
    { name: 'Vietnamese', code: 'vi', flag: 'vn' },
    { name: 'United States', code: 'en', flag: 'gb' }
  ];
  selectedCountry: any;
  @Output() outEvvent = new EventEmitter<any>();
  @Input() shortCut = false;
  public modalRef: BsModalRef;
  constructor(private basketService: BasketService, private modalService: BsModalService, private commonService: CommonService, private alertify: AlertifyService, private route: Router,
    public authService: AuthService, public translate: TranslateService) {
    translate.addLangs(['en', 'vi']);
    if (localStorage.getItem('language')) {
      const browserLang = localStorage.getItem('language');
      translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');
    } else {

      localStorage.setItem('language', 'en');
      translate.setDefaultLang('en');
      translate.use('en');
    }
    if (translate.currentLang === undefined || translate.currentLang === null) {
      translate.currentLang = 'en';
    }
    this.selectedCountry = this.countries.find(x => x.code === translate.currentLang);
  }
  switchLang(lang) {
    // debugger;
    let codeLang = lang.changedOptions.value;
    localStorage.setItem('language', codeLang);
    this.translate.use(codeLang);
    this.selectedCountry = this.countries.find(x => x.code === codeLang);
  }
  ngOnInit() {
  
    // console.log("xx");
    // console.log("shortCut", this.shortCut);
    
  }
  
  ngAfterViewInit(): void {
  
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
     
    // this.loadShortCuts();
    // console.log(this.ghi++);
     
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('des');
    setTimeout(()=>{
      // this.shortcuts = [];
      this.commonService.TempShortcuts$.subscribe((data: any)=>{ 
        // debugger;
        this.commonService.changeShortcuts(data, true);
        // data = data.filter(x=>x.label === "Closed User Tab" || x.label === "Logout");
        // console.log('data temp return',data);
       
        // this.sttGhi=0;
      })
      // debugger;
      // this.tempShortcuts = this.tempShortcuts.toArray().filter(x=>x.label !== "Closed User Tab" && x.label !== "Logout");
      
    },10)
  }
  shortcuts: ShortcutInput[] = [];  
  tempShortcuts:any;

  ghi = 0;
  loadShortCuts()
  {
    // setTimeout(()=>{
    //   let X: any;
    //   this.commonService.Shortcuts$.subscribe((data: any)=>{ 
    //     debugger;
    //      if(this.ghi === 0 && data?.length > 2)
    //      {
          
    //       X = data;
    //       this.ghi =1;
    //       var newArray = []; 
    //       this.tempShortcuts = X.forEach(val => newArray.push(Object.assign({}, val))); 
    //        console.log('this.tempShortcuts', this.tempShortcuts);
    //      }
        
    //   })
     
    // }, 10)
    setTimeout(()=>{
      let X: any;
      
      if(this.tempShortcuts===null || this.tempShortcuts===undefined || this.tempShortcuts?.length <= 0)
      {
        debugger;
        this.commonService.Shortcuts$.subscribe((data: any)=>{ 
          debugger; 
            X = data; 
            var newArray = []; 
            X.forEach(val => newArray.push(Object.assign({}, val))); 
            this.tempShortcuts = newArray;
            this.commonService.changeTempShortcuts(this.tempShortcuts);
            
             console.log('this.tempShortcuts', this.tempShortcuts); 
        })
      }
       
    }, 10)
    // this.shortcuts=[];
    setTimeout(()=>{
      this.shortcuts.push(   
        {
          key: ["backspace"],
          label: "Closed User Tab",
          description: "Closed User Tab",
          command: (e) => {
            this.outEvvent.emit(true); 
          },
          preventDefault: true
        },
        {
          key: ["ctrl + x"],
          label: "Logout" ,
          description: "Logout",
          allowIn: [AllowIn.Textarea, AllowIn.Input],  
          command: (e) => { 
             this.logout();
          },
          preventDefault: true
        },
      )
      var newArray = []; 
      this.shortcuts.forEach(val => newArray.push(Object.assign({}, val))); 
      this.commonService.changeShortcuts(null, true);
      // console.log('this.shortcuts X', this.shortcuts);
      setTimeout(() => {
        console.log('this.shortcuts X', newArray);
        this.commonService.changeShortcuts(newArray, true);
      }, 40);
      //
    },20)

   
  }
  selectStore() { 
    let basket = this.basketService.getCurrentBasket();
    if(basket!==null && basket!==undefined && basket?.items!==null && basket?.items!==undefined && basket?.items?.length > 0)
    {
      Swal.fire({
        icon: 'error',
        title: 'Warning',
        text: "Your shopping cart is not complete, please complete your order"
      });
    }
    else  
    {

      localStorage.setItem('storeSelected', null);
      localStorage.setItem('loadProgress', null);
      localStorage.removeItem('loadProgress');
      localStorage.removeItem('storeSelected');
      localStorage.removeItem('formatConfig');
      localStorage.removeItem('basket_id');
      localStorage.removeItem('generalSetting');
      localStorage.removeItem('maxValueCurrency');
      localStorage.removeItem('shopMode');
      localStorage.removeItem('invoice');
      localStorage.removeItem('CRMSystem');
      localStorage.removeItem('defaultCustomer');
      localStorage.removeItem("shift");
      this.route.navigate(['/shop']).then(() => {
        window.location.reload();
      })
    }
  }
  logout() {
    let basket = this.basketService.getCurrentBasket();
    if(basket!==null && basket!==undefined && basket?.items!==null && basket?.items!==undefined && basket?.items?.length > 0)
    {
      Swal.fire({
        icon: 'error',
        title: 'Warning',
        text: "Your shopping cart is not complete, please complete your order"
      });
    }
    else  
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          // localStorage.removeItem('token');
          // localStorage.removeItem('user');
          // localStorage.clear();
          // this.authService.decodeToken = null;
          // this.authService.currentUser = null;
          this.authService.logout();
          this.basketService.customer$ = null;
          this.basketService.basket$ = null;
  
        }
      });
    }
   
  }

  public openModal(template: TemplateRef<any>) {
 
    setTimeout(() => {
      // const initialState = {
      //   isNew: isNew, ariaDescribedby: 'my-modal-description',
      //   ariaLabelledBy: 'my-modal-title',
      //   class: 'modal-dialog modal-dialog-centered modal-sm'
      // };
        // this.modalService.show(template);
        this.outEvvent.emit(true);
        this.modalRef = this.modalService.show(template, { animated: true,
          keyboard: true,
          backdrop: true,
          ignoreBackdropClick: false, 
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title', 
          class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'});
          // modalRefX.content.outEvent.subscribe((response: any) => {
          //   modalRefX.hide();
               
          // });
          
      // this.modalRef = this.modalService.show(template, {
      //   ariaDescribedby: 'my-modal-description',
      //   ariaLabelledBy: 'my-modal-title', 
      //   class: 'modal-dialog modal-dialog-centered modal-sm'
      // });
    });
    // this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

   
}
