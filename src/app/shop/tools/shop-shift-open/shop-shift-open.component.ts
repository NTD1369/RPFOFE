import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-shop-shift-open',
  templateUrl: './shop-shift-open.component.html',
  styleUrls: ['./shop-shift-open.component.scss']
})
export class ShopShiftOpenComponent implements OnInit {
  @Input() shift: TShiftHeader;

  @Output() shiftSelected = new EventEmitter<any>();
  // @Output() endShift = new EventEmitter<any>();
  constructor(private commonService: CommonService) { }
    
  ngAfterViewInit() {
     
    setTimeout(() => {  
      this.loadShortcut();
    }, 1100);
    
  }

  shortcuts: ShortcutInput[] = [];  
  // shortcuts$: Observable<ShortcutInput[]>;
  // tempShortcuts: ShortcutInput[] = [];  
  @ViewChild('txtAmount', { static: false }) txtAmount: ElementRef;
  ngOnDestroy() {
    this.shortcuts = []
  }
  loadShortcut()
  {
    this.shortcuts.push(
      {
        key: ["enter"],
        label: "Load Shift",
        description: "Load Shift",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          this.loadShift();
        },
        preventDefault: true
      },
      {
        key: ["alt + e"],
        label: "Cancel",
        description: "Cancel",
        allowIn: [AllowIn.Textarea, AllowIn.Input],  
        command: (e) => {
          debugger;
           this.endAndStartShift();
        },
        preventDefault: true
      },
      
    ) 
    setTimeout(() => {
      // this.isShowSC= true;
      console.log('this.shortcuts payment', this.shortcuts);
      this.commonService.changeShortcuts(this.shortcuts, true);
     
    }, 100);
  }
  ngOnInit() {
  }
  loadShift()
  {
    console.log("shift", this.shift);
    this.shiftSelected.emit({endShift: false, shift: this.shift}); 
    // this.endShift.emit(false); 
  }
  endAndStartShift()
  {
    this.shiftSelected.emit({endShift: true, shift: this.shift}); 
    // this.endShift.emit(true); 
  }
}
