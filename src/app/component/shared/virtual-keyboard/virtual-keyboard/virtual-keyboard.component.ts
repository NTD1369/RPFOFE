import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from 'src/app/_services/common/common.service';
 
import { KeyboardService } from '../virtual-keyboard.service';

@Component({
  selector: 'app-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss']
})
export class VirtualKeyboardComponent implements OnInit {

  @HostBinding('class.shown')
  public shown: boolean;
  public enter: boolean;
  @ViewChild('insideElement', { static: false }) insideElement;
  @Input() layout = "default";
  // isNumberic: boolean = false;
  // isNumbericKeyboard$: Observable<boolean>;
  private keyboardSubscription: Subscription; 
  private numbericKeyboardSubscription: Subscription;
  constructor(private el: ElementRef,  public keyboard: KeyboardService, private _hotkeysService: HotkeysService, public commonService: CommonService) {
  //   this._hotkeysService.add(new Hotkey(['enter'], (event: KeyboardEvent): boolean => {
  //     console.log('Secret message enter on Virtual keyboard');
  //       // callback();
  //     return false;
  // }, undefined, 'Send a secret message to the console.  on Virtual keyboard'));
  }
  ngAfterViewInit(): void {
      this._hotkeysService.add(new Hotkey(['enter'], (event: KeyboardEvent): boolean => {
        console.log('Secret message enter on Virtual keyboard');
          // callback();
        return false;
    }, undefined, 'Send a secret message to the console.  on Virtual keyboard'));
  }

  // protected onDocumentClick(event: MouseEvent) {
  //   if (this.insideElement.nativeElement.contains(event.target)) {
  //     return;
  //   }
  //   console.log('Clicked outside!');
  // }
  clearValue(){

  }
  ngOnInit() {
    // debugger;
    // let virtualKey = this.commonService.getCurrentVirtualKey();
    // if(virtualKey)
    // {
     
    // }

   


    this.keyboard.enter = false;
    this.numbericKeyboardSubscription = this.keyboard.layout.subscribe(layout => {
      // this.layout = layout;
      if(layout=== 'numberic')
      {
        // debugger;
        this.keyboard.alt = true;
        this.keyboard.numbericKeyboard = true;
        // this.layout = "numberic";
      }
      else
      {
        this.keyboard.alt = false;
        this.keyboard.numbericKeyboard = false;
        // this.layout = "default";
      }
    });
    this.keyboardSubscription = this.keyboard.keyboardRequested.subscribe(show => {
      if (show) {
        this.keyboard.enter = false;
        this.shown = true;
      }
      else {
        this.shown = false;
        console.log("Keyboard Hide");
      }
    });
    // this.keyboard.altChanged.subscribe((enter) => {
    //      if(enter)
    //      {
    //         this.onEnter();
    //      }
    //      else
    //      {
    //       this.closeModal();
    //      }
         
    // });
       // this.keyboard.altChanged.subscribe((enter) => {
      //   this.isEnter = enter;
      //   this.updateCurrentValue();
      // });
  }

  ngOnDestroy() {
    this.keyboardSubscription.unsubscribe();
    // this.numbericKeyboard.unsubscribe();
    this.numbericKeyboardSubscription.unsubscribe();
     
    console.log("destroy");
  }

  onShift() {
    this.keyboard.shift = !this.keyboard.shift;
  }
  closeModal()
  {
    this.keyboard.enter = false;
    this.shown = false;
    this.keyboard.fireClearPressed();

    setTimeout(() => {
      document?.getElementById("dropdownMenuLink")?.focus();
    }, 300);
   
  }
  onAlt() {
    this.keyboard.alt = !this.keyboard.alt;
    this.keyboard.shift = false;
  }

  onBackspace() {
    this.keyboard.fireBackspacePressed();
  }
  onClearAll()
  {
     debugger;
     this.keyboard.fireContentPressed("");

  }
  onEnter() {
    this.keyboard.fireEnterPressed();
    this.keyboard.enter = true;
    this.shown = false;
    document?.getElementById("dropdownMenuLink")?.focus();
    
    // this.onMouseEvent(null);
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('click', ['$event'])
  onMouseEvent(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation(); 

    // setTimeout(() => {
    //   this.keyboard.fireEnterPressed();
    //   this.keyboard.enter = true;
    // }, 80);
  }
}
