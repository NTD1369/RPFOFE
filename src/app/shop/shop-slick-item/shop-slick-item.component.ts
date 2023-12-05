import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core'; 
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SwiperComponent } from 'ngx-useful-swiper';
import { Item } from 'src/app/_models/item';
import { SwiperOptions } from 'swiper';
import { ShopItemDetailComponent } from '../tools/shop-item-detail/shop-item-detail.component';

@Component({
  selector: 'app-shop-slick-item',
  templateUrl: './shop-slick-item.component.html',
  styleUrls: ['./shop-slick-item.component.scss']
})
export class ShopSlickItemComponent implements OnInit {
  @Input() items: Item[];
  @Input() settingDisplay;
  @Input()  poleDisplay="false";
  @Input()  poleDisplayType="";
  display= false;
  itemShow: Item[];
  item: Item = new Item();
  modalRef: BsModalRef; 
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngAfterViewChecked() {
    // you could also do this after a service call of some sort
    this.finishedLoading.emit(true);
  }
  constructor(private modalService: BsModalService) { }
  pageSize = 8;
  totalSlde =10; 
  @HostListener("window:resize", [])
  public onResize() {
    this.detectScreenSize();
  }
  
  public ngAfterViewInit() {
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
        this.pageSize = 6;
      }
      if(width >= 1200)
      {
        this.pageSize = 6;
      }
      if(width >= 1430)
      {
        this.pageSize = 12;
      } 
      
  }
  
    // this.innerWidth = window.innerWidth;
  
  
  pagedItems(selectedIndex)
  {
    // debugger;
    // if(selectedIndex === 1 || selectedIndex === 0  || selectedIndex < 0 || selectedIndex === null || selectedIndex === undefined)
    // {
    //   selectedIndex = 3;
    // }
    console.log('selectedIndex', selectedIndex);
    if(this.items!==null && this.items!==undefined)
    {
      let totalItem = this.items.length;
      console.log('totalItem', totalItem);
      console.log('this.pageSize', this.pageSize);
      this.totalSlde = totalItem / this.pageSize; 
      console.log('this.totalSld', this.totalSlde);
      let countIndex =Math.round(selectedIndex)   * this.pageSize + this.pageSize;
      let fromIndex = 0;
      this.itemShow = this.items.slice(fromIndex , countIndex);
    }
  
    //  console.log(this.itemShow);
  }
  settingLocal;
  ngOnInit() {
  
    if(this.settingDisplay!==null && this.settingDisplay!==undefined)
    {
      this.settingLocal = this.settingDisplay;
    }
    else
    {
      this.settingLocal =  JSON.parse(sessionStorage.getItem("fnbSettingDisplay"));
    }


    this.config = {
      pagination: { 
        el: '.swiper-pagination', 
        clickable: true 
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      // initialSlide: 3,
      // preloadImages: false,
      // lazy: {
      //   //  tell swiper to load images before they appear
      //   loadPrevNext: true,
      //   // amount of images to load
      //   loadPrevNextAmount: 8,
      //   loadOnTransitionStart : true,
      // },
      // createElements: true,
      // observer: true,
      // observeParents: true,
      // freeMode: true,
      // watchSlidesVisibility: true,
      // watchSlidesProgress: true,
      on: {
        slideChange: () => {
          // console.log('slideChange Event: Active Slide Index = ', this.usefulSwiper.swiper.activeIndex);
          let value = 1;
          // debugger;
          // if(this.usefulSwiper.swiper.activeIndex > this.MaxActiveIndex)
          // {
          //   this.MaxActiveIndex = this.usefulSwiper.swiper.activeIndex;
          // }
          // if( this.MaxActiveIndex > this.usefulSwiper.swiper.activeIndex)
          // {
  
          // }
          // else
          // {
          //   if(this.usefulSwiper.swiper.activeIndex > this.pageSize)
          //   {
          //     value =this.usefulSwiper.swiper.activeIndex / (this.pageSize / 2);
          //   } 
          //   value +=2;
           
          // }
          let swiper: any = this.usefulSwiper.swiper;
          let index: any = swiper?.snapIndex ;
          if(index===null || index===undefined)
          {
            index = 0;
          }
          let selectedIndex =  index + 1;
          this.pagedItems(selectedIndex);
  
        },
        slideChangeTransitionEnd: () => {
          // console.log('slideChange Event');
        }
      },
  
      spaceBetween: 10,
      direction: "horizontal",
      slidesPerView:  this.settingLocal.find(x=>x.breakpoint === 1 ).slidesPerView,
      slidesPerColumn: this.settingLocal.find(x=>x.breakpoint === 1 ).slidesPerColumn,
      slidesPerGroup: this.settingLocal.find(x=>x.breakpoint === 1 ).slidesPerGroup,
      // lazy: true,
      slidesPerColumnFill: 'row',
      breakpoints: {
        // when window width is >= 320px
        576: {
          slidesPerView: this.settingLocal.find(x=>x.breakpoint === 576 ).slidesPerView,  
          slidesPerGroup: this.settingLocal.find(x=>x.breakpoint === 576 ).slidesPerGroup,  
          slidesPerColumn: this.settingLocal.find(x=>x.breakpoint === 576 ).slidesPerColumn,  
        },
        // when window width is >= 480px
        768: {
          slidesPerView: this.settingLocal.find(x=>x.breakpoint === 768 ).slidesPerView,  
          slidesPerGroup: this.settingLocal.find(x=>x.breakpoint === 768 ).slidesPerGroup,  
          slidesPerColumn: this.settingLocal.find(x=>x.breakpoint === 768 ).slidesPerColumn,  
          slidesPerColumnFill: 'row',
        },
        // when window width is >= 640px
        991: {
          slidesPerView: this.settingLocal.find(x=>x.breakpoint === 991 ).slidesPerView,  
          slidesPerGroup: this.settingLocal.find(x=>x.breakpoint === 991 ).slidesPerGroup,  
          slidesPerColumn: this.settingLocal.find(x=>x.breakpoint === 991 ).slidesPerColumn,  
          slidesPerColumnFill: 'row',
        },
        1200: {
          slidesPerView: this.settingLocal.find(x=>x.breakpoint === 1200 ).slidesPerView,  
          slidesPerGroup: this.settingLocal.find(x=>x.breakpoint === 1200 ).slidesPerGroup,  
          slidesPerColumn: this.settingLocal.find(x=>x.breakpoint === 1200 ).slidesPerColumn,  
          slidesPerColumnFill: 'row',
        },
        1430: {
          slidesPerView: this.settingLocal.find(x=>x.breakpoint === 1430 ).slidesPerView,  
          slidesPerGroup: this.settingLocal.find(x=>x.breakpoint === 1430 ).slidesPerGroup,  
          slidesPerColumn: this.settingLocal.find(x=>x.breakpoint === 1430 ).slidesPerColumn,  
          slidesPerColumnFill: 'row',
        }
      }
  
       
    };  
    this.pagedItems(2);

  }
  slickInit(e) {
    // console.log('slick initialized');  console.log(e);
  }
  itemDisplay(event)
  { 
    this.item = event;
    const initialState = {
      item:  this.item, title: 'Item Detail',
    };
    this.modalRef = this.modalService.show(ShopItemDetailComponent, {initialState});
  }
  breakpoint(e) {
    // console.log('breakpoint');
    // console.log(e);
  }
 
  afterChange(e) {
    // console.log('afterChange'); console.log(e);
  }
  @ViewChild('usefulSwiper', { static: false }) usefulSwiper: SwiperComponent;
  nextSlide() {
    this.usefulSwiper.swiper.slideNext();
  }

  previousSlide() {
    this.usefulSwiper.swiper.slidePrev();
  }
  MaxActiveIndex = 0;
  slideToThis(index) {
    this.usefulSwiper.swiper.slideTo(index);
  }
  selectedIndex= 1;
  config: SwiperOptions ;

  beforeChange(e) {
    // console.log('beforeChange'); console.log(e);
  }
  
  // slideConfig = {
  //   "slidesToShow": 4,
  //   "slidesToScroll": 4,
  //   "rows": 2,
  //   "nextArrow": "<a class='nav-btn next-slide' style='z-index: 999;'><i class='far fa-arrow-alt-circle-right fa-3x'></i></a>",
  //   "prevArrow": "<a class='nav-btn prev-slide' style='z-index: 999;'><i class='far fa-arrow-alt-circle-left fa-3x'></i></a>",
  //   "dots": true,
  //   "infinite": false,
  //   "lazyLoad": "ondemand",
  //   variableWidth: false, 
   
  //   // mobileFirst:true,//add this one
  //   "responsive": [
  //     {
  //       breakpoint: 1430,
  //       settings: {
  //         slidesToShow: 4,
  //         slidesToScroll: 4,
  //       },
  //     },
  //     {
  //       breakpoint: 1200,
  //       settings: {
  //         slidesToShow: 4,
  //         slidesToScroll: 4,
  //         rows:3
  //       },
  //     },
  //     {
  //       breakpoint: 991,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //       },
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //       },
  //     },
  //     {
  //       breakpoint: 576,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // };
 
  
}
 
export class ResponsiveSlickModel {
  breakpoint: number | null=null;
  // slidesToShow: number | null=null;
  // slidesToScroll: number | null=null;
  // rows: number | null=null;
  slidesPerView: number | null=null;
  slidesPerGroup: number | null=null;
  slidesPerColumn: number | null=null;

  detected?: boolean | null = false;
} 