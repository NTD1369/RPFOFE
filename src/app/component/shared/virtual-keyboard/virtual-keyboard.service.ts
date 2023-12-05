import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { multicast } from 'rxjs/operators';

@Injectable()
export class KeyboardService {
  private _shift: boolean = false;
  
  // private _layout: string = "default";
  private _alt: boolean = false;
  private _numbericKeyboard: boolean = false;
  private _enter: boolean = false;
  private _currentContent: string = ""; 
  private _keyboardRequested: Subject<boolean>; 
  private _shiftChanged: Subject<boolean>;
  private _enterChanged: Subject<boolean>;
  private _numbericKeyboardChanged: Subject<boolean>;
  private _layoutChanged: Subject<string> ;
  private _altChanged: Subject<boolean>;
  private _currentContentChanged: Subject<string>;
  private _keyPressed: Subject<string>;
  private _contentPressed: Subject<string>; 
  private _backspacePressed: Subject<void>;
  private _enterPressed: Subject<void>;
  private _clearPressed: Subject<void>;
  // private isNumbericKeyboard = new BehaviorSubject<boolean>(false);
  // NumbericKeyboard$ = this.isNumbericKeyboard.asObservable();
 


  constructor() {
    this._keyboardRequested = new Subject<boolean>();
    // this._numbericKeyboard = new Subject<boolean>();
    this._shiftChanged = new Subject<boolean>();
    this._enterChanged = new Subject<boolean>();
    this._numbericKeyboardChanged = new Subject<boolean>();
    this._layoutChanged = new Subject<string>();
    this._altChanged = new Subject<boolean>(); 
    this._keyPressed = new Subject<string>();
    this._contentPressed = new Subject<string>();
    this._currentContentChanged = new Subject<string>();
    this._backspacePressed = new Subject<void>();
    this._enterPressed = new Subject<void>();
    this._clearPressed = new Subject<void>();
    // this.numbericKeyboardChange(false); 
  }
  get enter(): boolean {
    return this._enter;
  }
  get shift(): boolean {
    return this._shift;
  }
  get numbericKeyboard(): boolean {
    return this._numbericKeyboard;
  }
  get layout() {
    return this._layoutChanged;
  }
  get currentContent(): string {
    return this._currentContent;
  }
  set currentContent(value: string) {
    this._currentContentChanged.next(this._currentContent = value);
  }
  // set layout(value:string) {
  //   this._layoutChanged.next(this._layout = value);
  // }
  set enter(value:boolean) {
    this._enterChanged.next(this._enter = value);
  }
  set shift(value:boolean) {
    this._shiftChanged.next(this._shift = value);
  }
  set numbericKeyboard(value:boolean) {
    this._numbericKeyboardChanged.next(this._numbericKeyboard = value);
  }

  get alt(): boolean {
    return this._alt;
  }

  set alt(value: boolean) {
    this._altChanged.next(this._alt = value);
  }

  get keyboardRequested() {
    return this._keyboardRequested;
  }
  // get numbericKeyboard() {
  //   return this._numbericKeyboard;
  // }
  get enterChanged() {
    return this._enterChanged;
  }

  get shiftChanged() {
    return this._shiftChanged;
  }

  get currentContentChanged() {
    return this._currentContentChanged;
  }
  get numbericKeyboardChanged() {
    return this._numbericKeyboardChanged;
  }

  get altChanged() {
    return this._altChanged;
  }

  get keyPressed() {
    return this._keyPressed;
  }
  get contentPressed() {
    return this._contentPressed;
  }
  // get currentContentPressed() {
  //   return this._currentContentPressed;
  // }
  
  get backspacePressed() {
    return this._backspacePressed;
  }

  get enterPressed() {
    return this._enterPressed;
  }
  get clearPressed() {
    return this._clearPressed;
  }
  // fireNumbericKeyboardChange(value:boolean) {
  //   // debugger;
  //   this._numbericKeyboard.next(value);
  //   // console.log('numberic', this.numbericKeyboard());
  // }
 
  fireLayout(layout: string) {
    this._layoutChanged.next(layout);
  }
  fireKeyboardRequested(show: boolean) {
    this._keyboardRequested.next(show);
  }

  fireKeyPressed(key:string) {
    this._keyPressed.next(key);
  }
  fireContentPressed(content:string) {
    this._contentPressed.next(content);
  }
  // firecurrentContentPressed(content:string) {
  //   this._currentContentPressed.next(content);
  // }
  fireBackspacePressed() {
    this._backspacePressed.next();
  }

  fireEnterPressed() {
    this._enterPressed.next();
  }
  fireClearPressed() {
    this._clearPressed.next();
  }
}