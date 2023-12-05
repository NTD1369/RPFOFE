import {
    Directive,
    Input,
    HostBinding,
    HostListener,
    OnInit,
    OnDestroy,
    ViewChild,
    Output,
    EventEmitter,
    ElementRef,
  } from '@angular/core';
import { KeyboardService } from './virtual-keyboard.service';
   
  
  @Directive({
    selector: '[appKeyboardKey]',
  })
  export class KeyboardKeyDirective implements OnInit, OnDestroy {
    private _values: string[];
    private isShifted: boolean;
    private isAlt: boolean;
    private isEnter: boolean;
    private numbericKeyboard: boolean;
    @Input('appKeyboardKey') values: string;
    
    @HostBinding('innerText') currentValue: string;
  
    constructor(private keyboard: KeyboardService, private _elementRef: ElementRef) { }
    // @Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

    // @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
    //   const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    //   if (!clickedInside) {
    //     this.clickOutside.emit(null);
    //   }
    // }
    ngOnInit() {
    //    debugger;
      this._values = this.values.split(' ');
      this.currentValue = this._values[0];
  
      this.keyboard.shiftChanged.subscribe((shift) => {
        this.isShifted = shift;
        this.updateCurrentValue();
      });
      
      this.keyboard.numbericKeyboardChanged.subscribe((keyboard) => {
        this.numbericKeyboard = keyboard;
        this.updateCurrentValue();
      });
      this.keyboard.altChanged.subscribe((alt) => {
        this.isAlt = alt;
        this.updateCurrentValue();
      });
      // this.keyboard.altChanged.subscribe((enter) => {
      //   this.isEnter = enter;
      //   this.updateCurrentValue();
      // });

    }
  
    ngOnDestroy() {

      // Vì unsubscribe không được khi chuyển page nên tạm thời sẽ đóng lại, sau này gom lại thành 1 page sẽ mở ra lại để unsub
      // console.log('unsubscribe');
      
      // this.keyboard.shiftChanged.unsubscribe();
      // this.keyboard.altChanged.unsubscribe();
      // this.keyboard.numbericKeyboardChanged.unsubscribe();
      // if(this.keyboard.enter)  
      // {
      //   console.log("enter");
      // }
      // else
      // {
      //   console.log("destroy");
      // }
      
        
    }
  
    updateCurrentValue() {
      if (!this.isAlt) {
        if (!this.isShifted) {
          this.currentValue = this._values[0];
        } else {
          this.currentValue = this._values[0].toUpperCase();
        }
      } else {
        if (!this.isShifted) {
          this.currentValue = this._values[1];
        } else {
          this.currentValue = this._values[2];
        }
      }
    }
  
    @HostListener('click')
    onClick() {
      this.keyboard.fireKeyPressed(this.currentValue);
    }
  }
  