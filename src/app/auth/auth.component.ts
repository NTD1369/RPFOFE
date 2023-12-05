import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/system/alertify.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isNameFocus: boolean = false; 
  isPassFocus: boolean = false; 
  decodeToken: any = {};
  currentUser: User;
  // const inputs = document.querySelectorAll(".input");
  model: any = {};
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }
  
  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(next => {
      
      this.alertify.success("Logged in successfully");
      this.clearCache();
      this.router.navigate(['/admin']);
    }, error => {
      console.log('Failed to login');
      this.alertify.error(error);
    });
  }

  clearCache()
  {
    localStorage.removeItem('storeSelected');
    localStorage.removeItem('permissions');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('formatConfig');
    localStorage.removeItem('basket_id');
    localStorage.removeItem('generalSetting');
    localStorage.removeItem('denomination');
    localStorage.removeItem('storeCurrency'); 
    localStorage.removeItem('maxValueCurrency');
    localStorage.removeItem('shopMode');
    localStorage.removeItem('invoice');
    localStorage.removeItem('CRMSystem');
    localStorage.removeItem('defaultCustomer');
    localStorage.removeItem('isShowMenu');
    localStorage.removeItem('displayMode');
    localStorage.removeItem('mainshortcut');
    localStorage.removeItem('basket');
    
    localStorage.removeItem('denomination');
    localStorage.removeItem('shift');
    localStorage.removeItem('loadProgress');
    localStorage.removeItem('voidreturnSetting');
    localStorage.removeItem('storeCurrency');
    localStorage.removeItem('maxValueCurrency');

    localStorage.removeItem('appTheme');
    localStorage.removeItem('visitorId');
    localStorage.removeItem('companyInfor'); 
    localStorage.removeItem('GetDisallowance'); 

   
    // localStorage.clear();
    this.decodeToken = null;
    this.currentUser = null;

  }

  onFocus(txt: any)
  {
    let IdFocus = txt.id;
    let IdValue = txt.value;
    if(IdFocus === 'txtName' && IdValue ==='')
    {
       this.isNameFocus = !this.isNameFocus;
    }
    if(IdFocus === 'txtPassword' && IdValue ==='')
    {
       this.isPassFocus = !this.isPassFocus;
    }
    // debugger;

  }
}
