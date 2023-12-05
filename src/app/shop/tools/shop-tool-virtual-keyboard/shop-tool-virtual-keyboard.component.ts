import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Keyboard from "simple-keyboard";
@Component({
  selector: 'app-shop-tool-virtual-keyboard',
  templateUrl: './shop-tool-virtual-keyboard.component.html',
  styleUrls: ['./shop-tool-virtual-keyboard.component.scss']
})
export class ShopToolVirtualKeyboardComponent implements OnInit {

  @Input() layout= "default";
  
  @Output() outEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() { 
 
  }
  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      layout: {
        numberic: ["1 2 3",
            "4 5 6",
            "7 8 9",
            "0 . {bksp}"
        ],
        default: [
          "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
          "{tab} q w e r t y u i o p [ ] \\",
          "{lock} a s d f g h j k l ; ' {enter}",
          "{shift} z x c v b n m , . / {shift}",
          ".com @ {space}"
        ],
        shift: [
          "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
          "{tab} Q W E R T Y U I O P { } |",
          '{lock} A S D F G H J K L : " {enter}',
          "{shift} Z X C V B N M < > ? {shift}",
          ".com @ {space}"
        ]
      },
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
    this.keyboard.setOptions({
      layoutName: this.layout
    });
  }
  enter()
  {
    this.outEvent.emit(this.value); 
  }
  value = "";
  keyboard: Keyboard;
  
  onChange = (input: string) => {
    this.value = input;
    console.log("Input changed", input);
     
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();

    if(button === "{enter}")
    {
      this.enter();
    }
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => { 
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";
    // let shiftToggle = currentLayout === "default" ? "numberic" : "shift";
    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };


}
