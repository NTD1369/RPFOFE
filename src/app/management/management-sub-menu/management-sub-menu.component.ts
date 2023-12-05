import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-management-sub-menu',
  templateUrl: './management-sub-menu.component.html',
  styleUrls: ['./management-sub-menu.component.scss']
})
export class ManagementSubMenuComponent implements OnInit {
  @Input() isShown: boolean;
  @Input() listSub: any[] = [];
  constructor(private authService: AuthService) { }

  ngOnInit() {
  
    // this.listSub = JSON.parse(localStorage.getItem("permissions")) ;
    // debugger;
    // this.listSub = this.listSub.filter(x=>x.ParentId === "Adm_MORE" && x.V === 1); 
   
    //&& x.V === 1

  }
  close()
  {
    this.isShown = !this.isShown;
  }
}
