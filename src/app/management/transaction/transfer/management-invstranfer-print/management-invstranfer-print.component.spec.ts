/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementInvtranfePrintComponent } from './management-invstranfer-print.component';

describe('ManagementInventoryPostingPrintComponent', () => {
  let component: ManagementInvtranfePrintComponent;
  let fixture: ComponentFixture<ManagementInvtranfePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementInvtranfePrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInvtranfePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
