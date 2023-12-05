/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DemoUomComponent } from './demo-uom.component';

describe('DemoUomComponent', () => {
  let component: DemoUomComponent;
  let fixture: ComponentFixture<DemoUomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoUomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoUomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
