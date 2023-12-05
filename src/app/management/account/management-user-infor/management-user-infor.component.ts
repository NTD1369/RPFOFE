import { Component, OnInit } from '@angular/core';
import { MCompany } from 'src/app/_models/company';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';

@Component({
  selector: 'app-management-user-infor',
  templateUrl: './management-user-infor.component.html',
  styleUrls: ['./management-user-infor.component.scss']
})
export class ManagementUserInforComponent implements OnInit {
  companies: MCompany[]=[];
  constructor(private companyService: CompanyService, private authServie: AuthService) { }

  ngOnInit() {
    this.loadCompanyInfor();
  }
  loadCompanyInfor()
  {
    this.companyService.getItem(this.authServie.getCurrentInfor().companyCode).subscribe((response: any)=>{
       this.companies.push(response.data)
       console.log(this.companies);
    });
  }

}
