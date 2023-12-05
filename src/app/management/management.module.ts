import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module'; 
// import { TabsModule } from 'ngx-bootstrap/tabs';
// import { ManagementItemComponent } from './management-item/management-item.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // ManagementItemSingleComponent,
    // ManagementItemComponent,
    // TabsModule.forRoot(),
    ManagementRoutingModule
  ],
  providers: [
     
  ],
})
export class ManagementModule { }
