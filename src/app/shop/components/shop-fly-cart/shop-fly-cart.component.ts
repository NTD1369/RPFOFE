import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
@Component({
  selector: 'app-shop-fly-cart',
  templateUrl: './shop-fly-cart.component.html',
  styleUrls: ['./shop-fly-cart.component.scss'],
  animations: [
    trigger('balloonEffect', [
      state('initial', style({
        backgroundColor: 'green',
        transform: 'scale(1)'
      })),
      state('final', style({
        backgroundColor: 'red',
        transform: 'scale(1.5)'
      })),
      transition('final=>initial', animate('1000ms')),
      transition('initial=>final', animate('1500ms'))
    ]),
    trigger('rotatedState', [
      state('initial', style({ transform: 'rotate(0)' })),
      state('final', style({ transform: 'rotate(-360deg)' })),
      transition('rotated => default', animate('2000ms ease-out')),
      transition('default => rotated', animate('2000ms ease-in'))
    ]),
    trigger('fadeInOut', [
      state('void', style({
        transform: 'rotate(-360deg)',
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
    trigger('changeDivSize', [
      state('initial', style({
        backgroundColor: 'green',
        width: '10px',
        height: '10px'
      })),
      state('final', style({
        backgroundColor: 'red',
        width: '400px',
        height: '400px'
      })),
      transition('initial=>final', animate('450ms')),
      transition('final=>initial', animate('400ms'))
    ]),
  ]
})
export class ShopFlyCartComponent implements OnInit {

  constructor(private route: Router) { }
  currentState = 'initial';
  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    debugger;
    if(this.currentState === 'initial')
    {
      var imgClone = document.getElementById('wrapperFly');     
      imgClone.style.opacity = "0"; 
    }
    else
    {
      var imgClone = document.getElementById('wrapperFly');     
      imgClone.style.opacity = "1";
      imgClone.style.bottom = "115px";
      imgClone.style.pointerEvents = "auto";
    
      
      // var icon = document.getElementsByClassName('shopping-cart')[0];  
      // icon.classList.add('rotate');

      
    }
   
  }
  
  ngOnInit() {
    
  }

}
