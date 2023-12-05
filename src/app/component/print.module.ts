import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PrintRoutingModule } from './print-routing.module';

import { PrintComponent } from './print.component'; 
import { WaiverFormTemplateComponent } from './print/waiver-form-template/waiver-form-template.component';
import { WaiverFormComponent } from './print/waiver-form/waiver-form.component';
 

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
     
    // FormsModule,
    // CommonModule,
    PrintRoutingModule
  ],
  providers: [
     
  ],
})

export class PrintModule { }
