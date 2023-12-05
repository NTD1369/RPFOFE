import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { MSalesPlanHeader } from 'src/app/_models/salesplan';
import { AuthService } from 'src/app/_services/auth.service';
import { SalesplanService } from 'src/app/_services/data/salesplan.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-sales-plan-edit-new',
  templateUrl: './management-sales-plan-edit-new.component.html',
  styleUrls: ['./management-sales-plan-edit-new.component.css']
})
export class ManagementSalesPlanEditNewComponent implements OnInit {
  id: string  = "";
  mode = "";
  isSave = false;
  setupType: any = [
    { name: 'Position', value:'Position'},
    // { name: 'Group', value:'Group'},
    
  ];
  commisionType: any = [
    { name: 'Amount', value:'Amount'},
    { name: 'Percent', value:'Percent'},
    // { name: 'Group', value:'Group'},
    
  ];
  setupList: any = [
    { name: 'Consultant', value:'Consultant'},
    { name: 'Implementation', value:'Implementation'},
    { name: 'Store Management', value:'StoreManagement'},
    { name: 'Area Management', value:'AreaManagement'},
    
  ];
  model: MSalesPlanHeader;
  constructor(public authService: AuthService,   private route: ActivatedRoute, private router: Router, private alertService: AlertifyService,
    private salesPlanService: SalesplanService ) { }
    dateFormat ="";
    saveModel()
    {
      debugger;
      let currentInfor = this.authService.getCurrentInfor();
     this.model.companyCode = currentInfor.companyCode;
      if(this.mode === 'e')
      { 
        this.model.modifiedBy = currentInfor.username;
        this.salesPlanService.update(this.model).subscribe((response: any) =>{
          if(response.success)
          {
            this.alertService.success("Save Sales Plan Successfully Completed.");
          }
          else
          {
            this.alertService.warning(response.message);
          }
        })
      }
      else
      { 
        this.model.createdBy = currentInfor.username;
        this.salesPlanService.create(this.model).subscribe((response: any) =>{
          if(response.success)
          {
            this.alertService.success("Save Sales Plan Successfully Completed.");
          }
          else
          {
            this.alertService.warning(response.message);
          }
        })
      }
      
    }
  ngOnInit() { 
    
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.route.params.subscribe(data => {
      this.mode = data['m'];
      this.id = data['id'];
    })
    if(this.mode==='e')
    {
      if(this.id!==null && this.id !==undefined && this.id !== '')
      {
        this.loadDetail();
      }
      else
      {
        this.alertService.warning("Id is null");
      }
     
    }
    else
    {
      this.model = new MSalesPlanHeader();
      this.model.id= "";
    }
  }
  loadDetail()
  {
    let infor = this.authService.getCurrentInfor();
    this.salesPlanService.getItem(infor.companyCode, this.id).subscribe((response: any) =>{
      if(response.success)
      {
        if(response.data!==null && response!==undefined)
        {
          this.model = response.data;
          if(this.model.lines===null || this.model.lines ===undefined)
          {
            this.model.lines = [];
          }
        }
        else
        {
          this.alertService.warning("Data not found");
        }
      }
      else
      {
        this.alertService.warning(response.message);
      }
    })
  }
}
