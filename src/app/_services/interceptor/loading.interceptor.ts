import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, delay, finalize } from "rxjs/operators";
import { EnvService } from "src/app/env.service";
import { environment } from "src/environments/environment";
import { ErrorInterceptor } from "../error.interceptor";
import { AlertifyService } from "../system/alertify.service";
import { BusyService } from "../system/busy.service";
@Injectable()
export class LoadingInterceptor implements HttpInterceptor
{
     // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
    timer: number;

    constructor (private busyService: BusyService, private route: Router, public env: EnvService)
    {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // debugger;
        if (req.method === 'POST' || req.method === 'PUT') {
            this.shiftDates(req.body);
        }
        if(this.timer){
            
            clearTimeout(this.timer);
        }
        
        if(req.url.includes("version.json"))
        {

        }
        else
        {
            this.timer = window.setTimeout(() =>  this.busyService.busy(), 100);
        }
       

        // return next.handle(req).pipe(finalize(() => {
        //     this.busyService.idle();
        //     if(this.timer){
        //          clearTimeout(this.timer);
        //     }
        // }));
        // this.timer = window.setTimeout(() => {
        //     this.busyService.busy();
        //     return next.handle(req).pipe(delay(0), finalize(()=> { this.busyService.idle() }))
        // }, 1000);
        return next.handle(req).pipe(finalize(() => {
            this.busyService.idle();
            if(this.timer){
              clearTimeout(this.timer);
            }
        }));
        if(req.url === this.baseUrl + "basket/UpdateBasket" || req.url === this.baseUrl + "api/itemuom/GetByItem")
        {
            return next.handle(req).pipe(delay(0), finalize(()=> { this.busyService.idle() }))
        } 
        else
        {

            this.busyService.busy();
            return next.handle(req).pipe(delay(0), finalize(()=> { this.busyService.idle() }))
        }
      
        
    }
    GetDateFormat(date) {
        var month = (date.getMonth() + 1).toString();
        month = month.length > 1 ? month   : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
         
        var hours= (date.getHours()).toString();
        var min= (date.getMinutes()).toString();
        var sec= (date.getSeconds()).toString();
        var time = "T" +hours+min+sec;
        return   date.getFullYear()+ '-' +  month+ '-' + (day);
    }
     
    shiftDates(body) {
        console.log()
        if (body === null || body === undefined) {
            return body;
        }
    
        if (typeof body !== 'object') {
            return body;
        }
    
        for (const key of Object.keys(body)) {
            const value = body[key];
            if (value instanceof Date) {
                body[key] = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes()
                    , value.getSeconds()));
            } else if (typeof value === 'object') {
                this.shiftDates(value);
            }
        }
      }
}
export const LoadingInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true
};
