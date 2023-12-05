import { Injectable } from '@angular/core'; 
// import { HubConnection } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { AlertifyService } from '../system/alertify.service';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr'; 
import { EnvService } from 'src/app/env.service';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonService } from './common.service';
import { take } from 'rxjs/operators';
import { timer } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection: HubConnection;
  // baseUrl = environment.apiUrl + "";
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor(private alerttifyService: AlertifyService , private commonService: CommonService, public authService: AuthService,  private http: HttpClient,   public env: EnvService) { }
  async connectHub()
  {
    // debugger;
    // this.commonService.changeSystemCheck(true);
    let token=  localStorage.getItem('token');
    let storeClient = this.authService.getStoreClient();
    let type= "login";
    let deviceId= "login";
    if(storeClient!==null && storeClient!==undefined)
    {
       deviceId = this.authService.getStoreClient().publicIP;
    }
    else
    {
      deviceId = this.authService.getLocalIP();
    }
    
   
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/api/pushNotification?token=&type=" + type + "&CounterId=" + deviceId,  {
      accessTokenFactory: () => {
        return token;
      },
    } ).build(); 
      this.hubConnection.start().then(() => {
        this.commonService.changeSystemCheck(false);
        console.log("connection started");
      }).catch(err => { 
        // debugger;
        this.commonService.changeSystemCheck(false);
        console.log(err)
      } 
      
      );

      this.hubConnection.onclose(() => {
        // debugger;
        setTimeout(() => {
          // debugger;
          this.hubConnection.start().then(() => {
            // debugger;
            console.log("connection started");
          }).catch(err => console.log(err));
        }, 5000);
      });
      this.hubConnection.on("clientMethodName", (data) => {
        // debugger;
        console.log(data);
        this.commonService.changeSystemCheck(false);
      });
      this.hubConnection.on("publicMessageMethodName", (data) => {
        // debugger;
        console.log(data);
        this.commonService.changeSystemCheck(false);
      });
      this.hubConnection.on("privateMessageMethodName", (data) => {
        // debugger;
        console.log(data);
        this.commonService.changeSystemCheck(false);
      });
      this.hubConnection.on("CheckStatusUser", (data) => {
        // debugger;
        console.log(data);
        this.commonService.changeSystemCheck(false);
        this.hubConnection.invoke("ResponseDataFromClient", this.authService.getCurrentInfor().username , deviceId , data).catch(err => console.log(err));
      });
      this.hubConnection.on("WelcomeMethodName", (data) => {
        // debugger;
        console.log(data);
        this.commonService.changeSystemCheck(false);
        this.hubConnection.invoke("GetDataFromClient", "user id", data).catch(err => console.log(err));
      });
      this.hubConnection.on("OnlineMethodName", (data) => {
        this.commonService.changeSystemCheck(false);
        Swal.fire({
          icon: 'warning',
          title: 'User still online',
          text: "User still online in another counter. Please try again with another user"
        }).then(()=>{
           this.authService.logout();
        }) 
       
      });
      // await timer(1500).pipe(take(1)).toPromise();   
  }
  public stopConnection() {
    this.hubConnection.start().then(() => {
      console.log("stopped");
    }).catch(err => console.log(err));
  }
 
  
}
