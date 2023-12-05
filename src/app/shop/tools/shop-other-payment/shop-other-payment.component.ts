import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { SwiperComponent } from 'ngx-useful-swiper';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { CommonService } from 'src/app/_services/common/common.service';
import { ShortcutService } from 'src/app/_services/data/shortcut.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-shop-other-payment',
  templateUrl: './shop-other-payment.component.html',
  styleUrls: ['./shop-other-payment.component.scss']
})
export class ShopOtherPaymentComponent implements OnInit {

  @Input() payments: MPaymentMethod[];
  @Input() title: string = "Other Payment";
  payment: MPaymentMethod;
  pageSize = 9;
  itemShow: MPaymentMethod[];
  @Output() outPayment = new EventEmitter<MPaymentMethod>();
  innerWidth: any;


  constructor(private alertify: AlertifyService, private shortcutService: ShortcutService, private commonService: CommonService) { }
  @ViewChild('usefulSwiper', { static: false }) usefulSwiper: SwiperComponent;
  nextSlide() {
    this.usefulSwiper.swiper.slideNext();
  }
  componentName = "OtherPayment";
  shortcuts: ShortcutInput[] = [];
  previousSlide() {
    this.usefulSwiper.swiper.slidePrev();
  }
  MaxActiveIndex = 0;
  totalSlde = 10;
  slideToThis(index) {
    this.usefulSwiper.swiper.slideTo(index);
  }
  selectedIndex = 1;
  loadShortcut() {
    for (let i = 1; i <= this.pageSize; i++) {
      this.shortcuts.push(
        {
          key: ["f" + i],
          label: "Payment " + i,
          description: "Payment " + i,
          command: (e) => {

            let payments = this.getItemCurrentPage();
            debugger;
            let selectedPayment = payments[i - 1];
            if (selectedPayment !== undefined && selectedPayment !== undefined) {
              this.selectPayment(selectedPayment);
              console.log(this.payment);
            }

            // selectedIndex
          },
          preventDefault: true
        }
      )
    }
    this.shortcuts.push(
      {
        key: ["pageup"],
        label: "",
        description: "",
        command: (e) => {
          this.previousSlide();
        },
        preventDefault: true
      },
      {
        key: ["pagedown"],
        label: "",
        description: "",
        command: (e) => {
          this.nextSlide();
        },
        preventDefault: true
      },
      {
        key: ["backspace"],
        label: "",
        description: "",
        command: (e) => {
          this.closeModal();
        },
        preventDefault: true
      }
    )

    this.commonService.changeShortcuts(this.shortcuts, true);
  }
  // config: SwiperOptions = {
  //   pagination: {
  //     el: '.swiper-pagination',
  //     clickable: true
  //   },
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev'
  //   },
  //   // initialSlide: 3,
  //   // preloadImages: false,
  //   // lazy: {
  //   //   //  tell swiper to load images before they appear
  //   //   loadPrevNext: true,
  //   //   // amount of images to load
  //   //   loadPrevNextAmount: 8,
  //   //   loadOnTransitionStart : true,
  //   // },
  //   // createElements: true,
  //   // observer: true,
  //   // observeParents: true,
  //   // freeMode: true,
  //   // watchSlidesVisibility: true,
  //   // watchSlidesProgress: true,
  //   on: {
  //     slideChange: () => {
  //       // console.log('slideChange Event: Active Slide Index = ', this.usefulSwiper.swiper.activeIndex);
  //       let value = 1;
  //       console.log('activeIndex', this.usefulSwiper.swiper.activeIndex);
  //       if (this.usefulSwiper.swiper.activeIndex > this.MaxActiveIndex) {
  //         this.MaxActiveIndex = this.usefulSwiper.swiper.activeIndex;
  //       }
  //       if (this.MaxActiveIndex > this.usefulSwiper.swiper.activeIndex) {

  //       }
  //       else {
  //         if (this.usefulSwiper.swiper.activeIndex > this.pageSize) {
  //           value = this.usefulSwiper.swiper.activeIndex / (this.pageSize / 2);
  //         }
  //         value += 2;

  //         this.pagedItems(value);
  //       }


  //     },
  //     slideChangeTransitionEnd: () => {
  //       // console.log('slideChange Event');
  //     }
  //   },

  //   spaceBetween: 10,
  //   direction: "horizontal", //vertical  //horizontal
  //   slidesPerView: 3,
  //   slidesPerColumn: 3,
  //   slidesPerGroup: 3,
  //   mousewheel: true,
  //   scrollbar: false,
  //   // lazy: true,
  //   slidesPerColumnFill: 'row',
  //   // breakpoints: {
  //   //   // when window width is >= 320px
  //   //   576: {
  //   //     slidesPerView: 1, 
  //   //     slidesPerColumn: 1,
  //   //     slidesPerGroup: 1,
  //   //   },
  //   //   // when window width is >= 480px
  //   //   768: {
  //   //     slidesPerView: 3,  
  //   //     slidesPerGroup: 3,
  //   //     slidesPerColumn: 2,
  //   //     slidesPerColumnFill: 'row',
  //   //   },
  //   //   // when window width is >= 640px
  //   //   991: {
  //   //     slidesPerView: 3,  
  //   //     slidesPerGroup: 3,
  //   //     slidesPerColumn: 2,
  //   //     slidesPerColumnFill: 'row',
  //   //   },
  //   //   1200: {
  //   //     slidesPerView: 3,  
  //   //     slidesPerGroup: 3,
  //   //     slidesPerColumn: 2,
  //   //     slidesPerColumnFill: 'row',
  //   //   },
  //   //   1430: {
  //   //     slidesPerView: 4,  
  //   //     slidesPerGroup: 4,
  //   //     slidesPerColumn: 2,
  //   //     slidesPerColumnFill: 'row',
  //   //   }
  //   // }


  // };
  itemCurrrentpage: MPaymentMethod[] = [];

  getItemCurrentPage() {
    if (this.payments !== null && this.payments !== undefined) {

      let x = 3;
      if(this.pageSize%2===0)
      {
        x = 2;
      }
      
      // let selectedIndex = (this.usefulSwiper.swiper.activeIndex / x) + 1;
      let swiper: any = this.usefulSwiper.swiper;
      let index: any = swiper?.snapIndex ;
      if(index===null || index===undefined)
      {
        index = 0;
      }
      let selectedIndex =  index + 1;
      // this.totalSlde = totalItem / this.pageSize; 
      debugger;
      let currentPageStartIndex = Math.round(selectedIndex) * this.pageSize - this.pageSize;
      let currentPageEndIndex = Math.round(selectedIndex) * this.pageSize;
      let payments = this.payments.slice(currentPageStartIndex, currentPageEndIndex);

      console.log("payments display", payments );
      return payments;
    }
  }
  pagedItems(selectedIndex) {
    // debugger;
    // if(selectedIndex === 1 || selectedIndex === 0  || selectedIndex < 0 || selectedIndex === null || selectedIndex === undefined)
    // {
    //   selectedIndex = 3;
    // }
    if (this.payments !== null && this.payments !== undefined) {
     debugger;

      let totalItem = this.payments.length;
      console.log("totalItem", totalItem);
      this.totalSlde = totalItem / this.pageSize;
      console.log("totalSlde", this.totalSlde);

      let countIndex = Math.round(selectedIndex) * this.pageSize + this.pageSize;
      console.log("countIndex", countIndex);

      let fromIndex = 0;

      this.itemShow = this.payments.slice(fromIndex, countIndex);
      console.log("itemShow", this.itemShow);
    }

    //  console.log(this.itemShow);
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    console.log("this.innerWidth", this.innerWidth);
    
    this.payment = new MPaymentMethod();
    this.detectScreenSize();
    
    this.pagedItems(2);

    
  }

  closeModal() {
    this.payment.isCloseModal = true;
    this.outPayment.emit(this.payment);
  }
  selectPayment(payment: MPaymentMethod) {
    this.payment = payment;
    this.payment.isCloseModal = false;
    this.outPayment.emit(this.payment);
  }

  ngAfterViewInit() {
    this.loadShortcut();
   
  }

  public onResize() {
    this.detectScreenSize();
  }
  
  private detectScreenSize() {
      const height = window.innerHeight;
      const width = window.innerWidth;
      if(width >= 576)
      {
        this.pageSize = 1;
      }
      if(width >= 768)
      {
        this.pageSize = 6;
      }
      if(width >= 991)
      {
        this.pageSize = 9;
      }
      if(width >= 1200)
      {
        this.pageSize = 6;
      }
      if(width >= 1430)
      {
        this.pageSize = 8;
      }
       console.log('this.pageSize Payment', this.pageSize);
  }

  config: SwiperOptions = {
    pagination: { 
      el: '.swiper-pagination', 
      clickable: true 
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    on: {
      slideChange: () => {
        let value = 1;
       
        if(this.usefulSwiper.swiper.activeIndex > this.MaxActiveIndex)
        {
          this.MaxActiveIndex = this.usefulSwiper.swiper.activeIndex;
        }
        if( this.MaxActiveIndex > this.usefulSwiper.swiper.activeIndex)
        {

        }
        else
        {
          if(this.usefulSwiper.swiper.activeIndex > this.pageSize)
          {
            value =this.usefulSwiper.swiper.activeIndex / (this.pageSize / 2);
          } 
          value +=2;
          this.pagedItems(value);
        }
       

      },
      slideChangeTransitionEnd: () => {
        // console.log('slideChange Event');
      }
    },

    spaceBetween: 10,
    direction: "horizontal",
    slidesPerView: 4,
    slidesPerColumn: 2,
    slidesPerGroup: 4,
    // lazy: true,
    slidesPerColumnFill: 'row',
    breakpoints: {
      // when window width is >= 320px
      576: {
        slidesPerView: 1, 
        slidesPerColumn: 1,
        slidesPerGroup: 1,
      },
      // when window width is >= 480px
      768: {
        slidesPerView: 3,  
        slidesPerGroup: 3,
        slidesPerColumn: 2,
        slidesPerColumnFill: 'row',
      },
      // when window width is >= 640px
      991: {
        slidesPerView: 3,  
        slidesPerGroup: 3,
        slidesPerColumn: 3,
        slidesPerColumnFill: 'row',
      },
      1200: {
        slidesPerView: 3,  
        slidesPerGroup: 3,
        slidesPerColumn: 2,
        slidesPerColumnFill: 'row',
      },
      1430: {
        slidesPerView: 4,  
        slidesPerGroup: 4,
        slidesPerColumn: 2,
        slidesPerColumnFill: 'row',
      }
    }

     
  }; 
}
