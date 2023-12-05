/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SetupNewStoreComponent } from './setup-new-store.component';

describe('SetupNewStoreComponent', () => {
  let component: SetupNewStoreComponent;
  let fixture: ComponentFixture<SetupNewStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupNewStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupNewStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
