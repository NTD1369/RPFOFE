/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementInventoryPostingPrintComponent } from './management-inventory-posting-print.component';

describe('ManagementInventoryPostingPrintComponent', () => {
  let component: ManagementInventoryPostingPrintComponent;
  let fixture: ComponentFixture<ManagementInventoryPostingPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementInventoryPostingPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInventoryPostingPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
