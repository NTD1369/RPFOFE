import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';
import { ManagementComponent } from './management/management.component';
import { PermissionDeniedComponent } from './shop/permission-denied/permission-denied.component';
import { AuthGuard } from './_guard/auth.guard';
import { CustompreloadingstrategyService } from './_services/system/custompreloadingstrategy.service';
import { PrintComponent } from '../app/component/print.component';
import { ShopComponentOtherDisplayComponent } from './shop/components/shop-component-other-display/shop-component-other-display.component';
import { SetupNewStoreComponent } from './setup/setup-new-store/setup-new-store.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent}, 
  { path: 'order-display', component: ShopComponentOtherDisplayComponent },
  { path: 'setup-new-store', component: SetupNewStoreComponent , },

  { path: 'admin', 
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
         loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) },
   
  { path: 'shop',   runGuardsAndResolvers: 'always',
         canActivate: [AuthGuard],
         loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) },
         
  
  { path: '', redirectTo: 'shop', pathMatch: 'full' },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
  
  // data: {preload: true, loadAfterSeconds: 55}
  // data: {preload: true, loadAfterSeconds: 55},
];
// const routes: Routes = [];
@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  // , {preloadingStrategy: CustompreloadingstrategyService}
  imports: [RouterModule.forRoot(routes ), ],
  // imports: [ , { useHash: true }
    // , { relativeLinkResolution: 'legacy' }
  //   RouterModule.forRoot(routes, {  enableTracing: false})
  // ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


