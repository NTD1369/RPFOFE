import {
    Directive,
    OnInit,
    ElementRef,
    Renderer2,
    HostListener,
    Output,
    EventEmitter
  } from "@angular/core";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
 
  import { Subscription } from "rxjs";
import { CommonService } from "src/app/_services/common/common.service";
import Swal from "sweetalert2";
import { KeyboardService } from "./virtual-keyboard.service";
  
  @Directive({
    selector: "[appOskInput]"
  })
  export class OskInputDirective implements OnInit {
    private keySubscription: Subscription;
 
    private backspaceSubscription: Subscription;
    private enterSubscription: Subscription;
    private clearSubscription: Subscription;
    private measure: HTMLElement;
    private layout ="default";


    constructor(private el: ElementRef, private keyboard: KeyboardService,  private commonService: CommonService) {
        // debugger;
        // this.commonService.setHotKeyEnter(null);
    }
    // @Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

    // @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
    //   const clickedInside = this.el.nativeElement.contains(targetElement);
    //   if (!clickedInside) {
    //     this.clickOutside.emit(null);
    //   }
    // }
    ngOnInit() {
      // TODO I'm sure there's an "Angular way" of doing this
      let thisStyle = window.getComputedStyle(this.el.nativeElement);
      // debugger;
      this.measure = null;
      this.measure = document.createElement("span");
      this.measure.style.position = "absolute";
      this.measure.style.right = "100%";
      this.measure.style.font = thisStyle.font;
      document.body.appendChild(this.measure);
    }
  
    @HostListener("focus", ['$event'])
    private onFocus(event) {
     
        // console.log($event?.srcElement?.attributes.type);
        // console.log(value);
        var target = event.target || event.srcElement || event.currentTarget;
        var idAttr = target.attributes.type;
        var value = idAttr.nodeValue;
        this.keyboard.fireContentPressed(target.value);
        this.keyboard.currentContent = target.value;// (.toString());
       this.keyboard.fireKeyboardRequested(true);
      // this.keyboard.fireNumbericKeyboardChange(false);

     

      // this.keyboard.layout.subscribe((shift) => {
      //   this.isShifted = shift;
      //   this.updateCurrentValue();
      // });
      this.subscribeToKeyboardEvents();
      
      // debugger;
      if(value==='number')
      {
          this.layout = "numberic";
          // this.keyboard.fireNumbericKeyboardChange(true);
          // this.commonService.changeNumbericVirtualKey(true);
          this.keyboard.fireLayout("numberic");
      }
      else
      {
          this.layout = "default";
          // this.keyboard.layout = "default";
          this.keyboard.fireLayout("default")
          // this.keyboard.fireNumbericKeyboardChange(false);
          // this.commonService.changeNumbericVirtualKey(false);
      }
       
     
    }
  
    @HostListener("blur")
    private onBlur() {
      this.keyboard.fireKeyboardRequested(false);
      this.keyboard.fireLayout("default");
      this.unsubscribeFromKeyboardEvents();
    }
  
    private subscribeToKeyboardEvents() {
      console.log('subscribeToKeyboardEvents');

      this.keySubscription = this.keyboard.keyPressed.subscribe(key =>
        this.onKey(key)
      );
      this.backspaceSubscription = this.keyboard.backspacePressed.subscribe(_ =>
        this.onBackspace()
      );
      this.enterSubscription = this.keyboard.enterPressed.subscribe(_ =>
        this.onEnter()
      );
      this.clearSubscription = this.keyboard.clearPressed.subscribe(_ =>
        {
          
          this.onClear();
        } 
      );
    }
   
    private unsubscribeFromKeyboardEvents() {
      console.log('unsubscribe');
      
      
      this.keySubscription.unsubscribe();
      this.backspaceSubscription.unsubscribe();
      this.enterSubscription.unsubscribe();
      this.clearSubscription.unsubscribe();

      if(this.keyboard.enter)  
      {
        debugger;
        this.onEnter();
      
      }
      else
      {
        this.onClear();
       console.log("destroy");
      }
    }
  
    private onKey(key: string) {
      // TODO Refactor this into a single method with the code in onBackspace
     
      let element = this.el.nativeElement;
      if( this.layout === "numberic")
      {
        element.type = 'text';
        element.selectionStart = element.value.length;
      } 
      let start = element.selectionStart;
      let end = element.selectionEnd;
  
    
      this.measure.textContent = element.value.substr(0, start) + key;
      element.value =
        element.value.substr(0, start) + key + element.value.substr(end);
      if(this.layout === "numberic" && key === '.')
      {

      }
      else
      {
        element.focus();
      }
    
      element.selectionStart = element.selectionEnd = start + 1;
      if( this.layout === "numberic" && key !== '.')
      {
          element.type = 'number';
      }
      this.updateScrollPosition();
    }
    
    
    private onBackspace() {
      // debugger;
      let element = this.el.nativeElement;
      if( this.layout === "numberic")
      {
        element.type = 'text';
        element.selectionStart = element.value.length;
      } 
      let start = element.selectionStart;
      let end = element.selectionEnd;
  
      if (start == 0) {
        return;
      }
  
      if (start == end) {
        start--;
      }
  
      this.measure.textContent = element.value.substr(0, start);
      element.value = element.value.substr(0, start) + element.value.substr(end);
      
      let lastchar = element.value.slice(-1);
      if(lastchar !== '.')
      {
        element.focus();
      } 
      element.selectionStart = element.selectionEnd = start;
      if( this.layout === "numberic" && lastchar !== '.')
      {
          element.type = 'number';
      }
      if( this.layout === "numberic" && element.value?.length <=0 )
      {
        element.value = "0";
      }
      this.updateScrollPosition();
    }
  
    private updateScrollPosition() {
      let element = this.el.nativeElement;
      this.keyboard.fireContentPressed(element.value);
      element.scrollLeft = this.measure.offsetWidth - (element.clientWidth - 10);
 
    }
    private onClear() {
      // TODO
      // alert("Enter");
      // this.el.nativeElement.addEventListener("keydown", function(event) {
      //   if (event.key === "Enter") {
      //       // Enter key was hit
      //   }
      //  });
      // let value =  this.keyboard.currentContentPressed.toPromise();
      // debugger;
      // this.keyboard.currentContentPressed.subscribe(value =>{
      //   console.log('value cũ', value);
      //   debugger;
       
      // });
      this.el.nativeElement.value = this.keyboard.currentContent;
    }
    private onEnter() {
      if( this.layout === "numberic")
      {
        let element = this.el.nativeElement;
        if(element.value === '' || element.value === undefined ||  element.value === null ||  element.value === '0')
        {
          Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: "Can't input zero to quantity."
          }).then(()=>{
            this.onClear();
          })  
        } 
      }
       
      // TODO
      // alert("Enter");
      // this.el.nativeElement.addEventListener("keydown", function(event) {
      //   if (event.key === "Enter") {
      //       // Enter key was hit
      //       debugger;
      //       alert("Enter by key");
      //   }
      //  });
    }
  }
  