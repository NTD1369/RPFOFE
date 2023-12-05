import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_guard/auth.guard';
import { PrintComponent } from './print.component'; 
import { WaiverFormTemplateComponent } from './print/waiver-form-template/waiver-form-template.component';
import { WaiverFormComponent } from './print/waiver-form/waiver-form.component';

const routes: Routes = [{
  // path: '', component: PrintComponent, 
  // canActivate: [AuthGuard],  runGuardsAndResolvers: 'always',
  // children: [
  //   { path: 'waiver-form', component: WaiverFormComponent},
  //   { path: 'waiver-form-template', component: WaiverFormTemplateComponent},
  // ]
}
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule { }
 