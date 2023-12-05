/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PdfCollectionDailyComponent } from './pdf-collection-daily.component';

describe('PdfCollectionDailyComponent', () => {
  let component: PdfCollectionDailyComponent;
  let fixture: ComponentFixture<PdfCollectionDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfCollectionDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfCollectionDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
