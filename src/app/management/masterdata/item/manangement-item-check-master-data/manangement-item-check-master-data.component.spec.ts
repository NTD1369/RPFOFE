/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManangementItemCheckMasterDataComponent } from './manangement-item-check-master-data.component';

describe('ManangementItemCheckMasterDataComponent', () => {
  let component: ManangementItemCheckMasterDataComponent;
  let fixture: ComponentFixture<ManangementItemCheckMasterDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManangementItemCheckMasterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManangementItemCheckMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
