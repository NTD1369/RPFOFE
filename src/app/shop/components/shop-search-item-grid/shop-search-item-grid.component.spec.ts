/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSearchItemGridComponent } from './shop-search-item-grid.component';

describe('ShopSearchItemGridComponent', () => {
  let component: ShopSearchItemGridComponent;
  let fixture: ComponentFixture<ShopSearchItemGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopSearchItemGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSearchItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
