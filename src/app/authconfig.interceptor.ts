import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
// import { AuthService } from "./_services/auth.service";
import { EnvService } from "./env.service";
import { environment } from "src/environments/environment";
 

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    baseUrl = environment.production === true ? this.env.apiMWIUrl : environment.apiMWIUrl;
    constructor( public env: EnvService) { }
    // private authService: AuthService, 
    intercept(req: HttpRequest<any>, next: HttpHandler) {
         
        const authToken = localStorage.getItem("token");
        let url = req.url.toString(); 
       
        let kq =  url.includes(this.baseUrl); 
        let kq1 =  url.includes("api/auth/login"); 
        // console.log('baseUrl', this.baseUrl);
        // console.log('authToken', authToken);
        // console.log('url', url);
        // console.log('kq', kq);
        // console.log('kq1', kq1);
        if(kq===false && kq1===false)
        {
            
            req = req.clone({
                setHeaders: {
                    Authorization: "Bearer " + authToken
                }
            });
        }  
        return next.handle(req);
    }
}