/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManangementCurrencyRoundingoffComponent } from './manangement-currency-roundingoff.component';

describe('ManangementCurrencyRoundingoffComponent', () => {
  let component: ManangementCurrencyRoundingoffComponent;
  let fixture: ComponentFixture<ManangementCurrencyRoundingoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManangementCurrencyRoundingoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManangementCurrencyRoundingoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
