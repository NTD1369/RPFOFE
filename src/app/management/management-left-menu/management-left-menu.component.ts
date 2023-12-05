import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-left-menu',
  templateUrl: './management-left-menu.component.html',
  styleUrls: ['./management-left-menu.component.scss']
})
export class ManagementLeftMenuComponent implements OnInit {
  countries: any[] = [ 
    {name: 'Vietnamese', code: 'vi', flag:'vn'},
    {name: 'United States', code: 'en', flag:'gb'}
  ];
  @Output() sideRightShow = new EventEmitter<any>();
  selectedCountry: any;
  showSubMenu: boolean = false;
  menuList: any[];
  subList: any[];
  isShowMore = false;  
  showSide()
  {
    this.sideRightShow.emit(true); 
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

  
  switchLang(lang) {
    // debugger;
    let codeLang= lang.changedOptions.value;
    localStorage.setItem('language', codeLang);  
    this.translate.use(codeLang);
    this.selectedCountry = this.countries.find(x=>x.code===codeLang);
  }

  ngOnInit() {
    let permissions = JSON.parse(localStorage.getItem("permissions")) ;
    // debugger;
    this.menuList = permissions.filter(x=>x.ParentId === "AdminPage" && x.V === 1 && x.ControlId === null && x.functionId!=="Adm_MORE"); 
    this.subList = permissions.filter(x=>x.ParentId === "Adm_MORE" && x.ControlId === null && x.V === 1); 
    if(permissions.some(x=>x.ParentId === "AdminPage" && x.V === 1 && x.ControlId === null && x.functionId ==="Adm_MORE"))
    {
        this.isShowMore= true;
        
    }
  }
  toggleSubMenu(event: any)
  {
    // debugger; 
    this.showSubMenu  = !this.showSubMenu;
  }

}
