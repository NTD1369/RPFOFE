/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopToolVirtualKeyboardComponent } from './shop-tool-virtual-keyboard.component';

describe('ShopToolVirtualKeyboardComponent', () => {
  let component: ShopToolVirtualKeyboardComponent;
  let fixture: ComponentFixture<ShopToolVirtualKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopToolVirtualKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopToolVirtualKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
