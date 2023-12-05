/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WaiverFormComponent } from './waiver-form.component';

describe('WaiverFormComponent', () => {
  let component: WaiverFormComponent;
  let fixture: ComponentFixture<WaiverFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiverFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
