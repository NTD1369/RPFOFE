import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopHeaderComponent } from './shop-header/shop-header.component';
import { ShopLeftMenuComponent } from './shop-left-menu/shop-left-menu.component';
import { ShopItemSingleComponent } from './shop-item-single/shop-item-single.component';
import { ItemService } from '../_services/data/item.service';
import { ItemListResolver } from '../_resolve/item-list.resolver';
import { NgToggleModule } from 'ng-toggle-button';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
    // ShopHeaderComponent,
    // ShopLeftMenuComponent,
    ShopRoutingModule,
  ],
  providers: [
    
    ItemService,
    ItemListResolver
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ShopModule { }
