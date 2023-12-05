import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { IBasket, IBasketCurrencyTotal, IBasketTotal } from 'src/app/_models/system/basket';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service'; 
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { EnvService } from 'src/app/env.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-shop-component-other-display',
  templateUrl: './shop-component-other-display.component.html',
  styleUrls: ['./shop-component-other-display.component.scss']
})
export class ShopComponentOtherDisplayComponent implements OnInit, OnDestroy {
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotal>;
  basketCurrencyTotal$: Observable<IBasketCurrencyTotal>;
  myDate = new Date();
  elem: any;
  orderNo="";
  constructor(@Inject(DOCUMENT) private document: any, private basketService: BasketService,  
  public env: EnvService, private httpClient: HttpClient, private commonService: CommonService, public authService: AuthService) { }
  updatedStatus;
  slideshowDelay = 5000;
  message = "Welcome";
  @HostListener('window:storage', ['$event'])
  onStorageChange(ev: StorageEvent) {
    // debugger;
     // console.log(ev.key);
     // console.log(ev.newValue);  
     
     if(ev.key === 'basket')
     {
      this.basket = this.basketService.getBasketLocal();
      this.basketService.calculateBasket();
      this.basket$ = this.basketService.basket$;
      this.basketTotal$ = this.basketService.basketTotal$; 
       this.basketCurrencyTotal$ = this.basketService.basketCurrencyTotal$;

     }
     if(ev.key === 'customerDisplay')
     {
       this.toggleScreen(); 
     }
    //  if(ev.key === 'customerDisplay')
    //  {
    //    window.close();
    //  }
  }

  GoInFullscreen(element) {
    debugger
    if(element.requestFullscreen)
      element.requestFullscreen().then(() =>{
          
      })
      .catch((error) => {
        this.fullScreen();
      });
    else if(element.mozRequestFullScreen)
      element.mozRequestFullScreen();
    else if(element.webkitRequestFullscreen)
      element.webkitRequestFullscreen();
    else if(element.msRequestFullscreen)
      element.msRequestFullscreen();
  }
  // IsFullScreenCurrently() {
  //   var full_screen_element = document.fullscreenElement || document?.webkitFullscreenElement || document?.mozFullScreenElement || document?.msFullscreenElement || null;
    
  //   // If no element is in full-screen
  //   if(full_screen_element === null)
  //     return false;
  //   else
  //     return true;
  // }
   ngAfterViewInit() {

      
    // this.commonService.setHotKeyToNull(); 
    // setTimeout(async () => {
    //   const screenDetails = await window.getScreenDetails();
    //   debugger;
    //   // const primaryScreen = screenDetails.screens.find(s => s.isPrimary===false);
    //   // document.documentElement.requestFullscreen({screen : primaryScreen});

    //   let fullscreenOptions: any = { navigationUI: "auto" }; 
    //   for (let s of screenDetails.screens) {
    //     console.log(`[${s.id}] ${s.left},${s.top} ${s.width}x${s.height} ` +
    //                 `isPrimary:${s.isPrimary}, isInternal:${s.isInternal}`);
    //     if (!s.isInternal)
    //       fullscreenOptions.screen = s;
    //   }
    //   document.getElementById('divShow').requestFullscreen(fullscreenOptions);
    //   // document.body.requestFullscreen();
    // }, 10);

    // var elem = document.getElementById("billPrint");
    // setTimeout(() => {
    //   debugger;
    //   if (elem.requestFullscreen) {
    //     elem.requestFullscreen();
    //   } 
    //   // else if (elem?.webkitRequestFullscreen) { /* Safari */
    //   //   elem.webkitRequestFullscreen();
    //   // } 
    //   // else if (elem?.msRequestFullscreen) { /* IE11 */
    //   //   elem.msRequestFullscreen();
    //   // }
    // }, 1000);
    // this.GoInFullscreen('#billPrint');
 
      this.fullScreen();
 
    // this.fullScreen();

    // this.detectScreenSize();
    // setInterval(()=> { this.toggleScreen();}, 1000);
  }
  mediaLink ="";
  loadSetting() {
    
    let MediaLink = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'MediaLink');
    if (MediaLink !== null && MediaLink !== undefined) {
      this.mediaLink = MediaLink.settingValue;
    } 
 
  }
  fullScreen()
  {
    // var elemX = document.getElementById("txtBillNo");
    // setTimeout(() => {
    //   elemX.focus();
    // }, 10);
   
   
    setTimeout(() => {

      this.toggleScreen();
      // var elem = document.getElementById("divShow");
      // this.GoInFullscreen(elem);
     }, 1000);
  }
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  @ViewChild('divRight') divRight: ElementRef;

  
  imageList=[];
  videoSource= "";
  heightScreen = 0;
  private detectScreenSize() {
    this.heightScreen =   window.innerHeight - (window.innerHeight * 14/100); 
  }
  // "./assets/medias/testVideo.mp4"

  toggleVideo()
  {
    this.videoplayer.nativeElement.play(); 
  }
  initCompleted= false;
  doesFileExist(urlToFile)
  {
    try
    {
      var xhr = new XMLHttpRequest();
      xhr.open('HEAD', urlToFile, false);
      xhr.send();
  
      if (xhr.status.toString() === "404") {
          console.log("File doesn't exist");
          return false;
      } else {
          console.log("File exists");
          return true;
      }
    }
    catch(e)
    {
      return false;
    }
      
  }
  readData(isFolder?)
  { 
    // debugger;
    // if(this.mediaLink!==null && this.mediaLink!==undefined && this.mediaLink?.length > 0 && isFolder!=true )
    // {
    //   let link = this.mediaLink;
      
    //   this.commonService.getMediaByLink(link).subscribe((response: any)=>{
    //     // debugger;
    //     if(response!==null && response!==undefined )
    //     { 
           
    //       if(response!==null && response!==undefined && response?.length > 0)
    //       {
    //         response.forEach(image => {
    //           // debugger;
    //            let rs = this.doesFileExist(image);
    //           //  debugger;
    //            if(rs)
    //            {
    //             this.imageList.push(image);
    //            }
    //         });
    //       }
    //       if(this.imageList==null || this.imageList===undefined || this.imageList?.length <=0)
    //       {
    //         this.readData(true);
    //       }
    //       else
    //       {
    //         console.log('this.imageList', this.imageList);
    //         this.initCompleted = true;
    //       }
        
    //     }
    //     else
    //     {
    //       this.readData(true);
    //     }

    //   }, error =>{
    //     this.readData(true);
    //   })
    // }
    // else  
    // {
      let store = this.authService.storeSelected();
      let  apiUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl; 

      this.commonService.getDirectoryFiles(store.companyCode, store.storeId, apiUrl, "Media")
      .subscribe((response: any) => { 
        // debugger;
        
        if(response.success)
        {
          if(response.data!==null && response.data!==undefined && response.data?.length > 0)
          {
             if(response.message==='video')
             {
              
               this.videoSource =  response.data[0];
              //  setTimeout(() => {
              //   this.toggleVideo();
              //  }, 200);
             }
             else
             {
              this.imageList = response.data;
             }
          }
          else
          {
            Swal.fire({
              icon: 'warning',
              title: 'Account No',
              text: 'Data not found'
            }).then(() =>{
              // this.txtAccountNo.nativeElement.focus();
              // this.txtAccountNo.nativeElement.value = '';
            }) 
          }
          
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Account No',
            text: response.message
          }).then(() =>{
            // this.txtAccountNo.nativeElement.focus();
            // this.txtAccountNo.nativeElement.value = '';
          }) 
        }
        this.initCompleted = true;
      });
    // }
  
     
  }
  basket;
  
  async openFullscreen() {
      // const screenDetails = await window.getScreenDetails();
      // debugger;
      // const primaryScreen = screenDetails.screens.find(s => s.isInternal===false);
      // document.documentElement.requestFullscreen({screen : primaryScreen}); 
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }
/* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  isFullScreen: boolean;
fullscreenmodes(event){
     this.chkScreenMode();
   }
chkScreenMode(){
     if(document.fullscreenElement){
       //fullscreen
       this.isFullScreen = true;
      
     }else{
       //not in full screen
       this.isFullScreen = false;
     }
   }
   toggleScreen()
   {
     this.chkScreenMode();
    //  debugger;
      if(this.isFullScreen)
      {
        this.closeFullscreen();
      }
      else
      {
        this.openFullscreen();
      }
   }
   @HostListener('window:beforeunload')
  onBeforeUnload() {
    // debugger;
    setTimeout(() => {
      localStorage.setItem("customerDisplay", "false");
      return false;
    });
   
}
   ngOnDestroy()
   {
    // debugger;
    
    setTimeout(() => {
      
      localStorage.setItem("customerDisplay", "false");
    }, 10);
    setTimeout(() => {
      
      window.close();
    }, 50);
   }
  ngOnInit() {
   
    this.message = "Welcome to " + this.authService.storeSelected()?.storeName??this.authService.getCompanyInfor().companyName;
    let  slideshowDelay =   this.env?.slideshowDelay??'5000'; 
    if(slideshowDelay===null || slideshowDelay===undefined || slideshowDelay === '')
    {
      slideshowDelay = '5000';
    }
    this.loadSetting();
    this.slideshowDelay = parseInt(slideshowDelay);
    localStorage.setItem("customerDisplay", "true");
    // debugger;
    this.chkScreenMode();
    this.elem = document.documentElement;

    this.detectScreenSize();
 
    this.readData();
    let storeSelected = this.authService.storeSelected();
    this.basketService.getNewOrderCode(storeSelected.companyCode, storeSelected.storeId).subscribe(data => {
              
      this.orderNo = data;
    });

    this.basket = this.basketService.getBasketLocal();
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$; 
    this.basketCurrencyTotal$ = this.basketService.basketCurrencyTotal$;

    this.basketService.calculateBasket();
  }
 

}
