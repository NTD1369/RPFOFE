/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmUomComponent } from './dm-uom.component';

describe('DmUomComponent', () => {
  let component: DmUomComponent;
  let fixture: ComponentFixture<DmUomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmUomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmUomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
