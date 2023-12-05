import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-header',
  templateUrl: './management-header.component.html',
  styleUrls: ['./management-header.component.scss']
})
export class ManagementHeaderComponent implements OnInit {
  countries: any[] = [ 
    {name: 'Vietnamese', code: 'vi', flag:'vn'},
    {name: 'United States', code: 'en', flag:'gb'}
  ];
  @Output() sideRightShow = new EventEmitter<any>();
  selectedCountry: any;
  showSide()
  {
    this.sideRightShow.emit(false); 
  }
  constructor(public authService: AuthService,  public translate: TranslateService ,private alertify: AlertifyService, private router: Router) { 

    translate.addLangs(['en', 'vi']); 
    if (localStorage.getItem('language')) {   
      const browserLang = localStorage.getItem('language');   
      translate.use(browserLang.match(/en|vi/) ? browserLang : 'en');   
    } else {  

      localStorage.setItem('language', 'en');   
      translate.setDefaultLang('en');  
      translate.use('en');   
    }  
    if(translate.currentLang===undefined || translate.currentLang === null)
    {
      translate.currentLang = 'en';
    }
    this.selectedCountry = this.countries.find(x=>x.code===translate.currentLang);

  }

  ngOnInit() {
  }
  
  switchLang(lang) {
    debugger;
    let codeLang= lang.changedOptions.value;
    localStorage.setItem('language', codeLang);  
    this.translate.use(codeLang);
    this.selectedCountry = this.countries.find(x=>x.code===codeLang);
  }
  logout()
  {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // this.authService.decodeToken = null;
    // this.authService.currentUser = null;
    // this.router.navigate(['/login']);
    this.authService.logout();
  }

}
