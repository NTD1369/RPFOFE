/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagenmentImportTableInforComponent } from './managenment-import-tableInfor.component';

describe('ManagenmentImportTableInforComponent', () => {
  let component: ManagenmentImportTableInforComponent;
  let fixture: ComponentFixture<ManagenmentImportTableInforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagenmentImportTableInforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagenmentImportTableInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
