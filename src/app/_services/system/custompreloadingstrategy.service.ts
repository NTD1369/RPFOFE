import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustompreloadingstrategyService implements PreloadingStrategy {
  // preload(route: Route, loadMe: () => Observable<any>): Observable<any> {
    
  //   if (route.data && route.data['preload']) {
  //     var delay:number=route.data['delay']
  //     console.log('preload called on '+route.path+' delay is '+delay);
  //     return timer(delay).pipe(
  //       flatMap( _ => { 
  //         console.log("Loading now "+ route.path);
  //         return loadMe() ;
  //       }));
  //   } else {
  //     console.log('no preload for the path '+ route.path);
  //     return of(null);
  //   }
  // }
  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    // debugger;
    const loadRoute = (delay) => delay > 0 ? timer(delay*1000).pipe(map(() => fn())) : fn();
    if (route.data && route.data.preload) {
      const delay = route.data.loadAfterSeconds ? route.data.loadAfterSeconds : 0;
      console.log(delay);
      return loadRoute(delay);
    }
    return of(null);
  }
  // preload(route: Route, fn: () => Observable<any>): Observable<any> {
  //   if (route.data && route.data.preload) {
  //     return fn();
  //   }
  //   return of(null);
  // }
}

 
