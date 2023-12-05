import { Component, OnInit } from '@angular/core';
import { ShipDivisionService } from 'src/app/_services/data/ship-division.service';
import { AuthService } from 'src/app/_services/auth.service';
import Swal from 'sweetalert2';
import { TShippingDivisionHeader, TShippingDivisionLine } from 'src/app/_models/ship-division';
import { ActivatedRoute } from '@angular/router';
import { ShippingService } from 'src/app/_services/data/shipping.service';



@Component({
  selector: 'app-management-ship-division-detail',
  templateUrl: './management-ship-division-detail.component.html',
  styleUrls: ['./management-ship-division-detail.component.scss']
})
export class ManagementShipDivisionDetailComponent implements OnInit {
  title="Ship Division";
  date = new Date();
  model: TShippingDivisionHeader ;
  mode= "";
  id= "";
  // lines: TShippingDivisionLine[] = [] ;
  shippings = [];
  constructor(public shipDivisionService: ShipDivisionService, private activatedRoute: ActivatedRoute, private shippingService: ShippingService, 
    public authService: AuthService) { 
      this.model= new TShippingDivisionHeader();
    }
  isLoadingData = false;
  ngOnInit() 
  { 
    this.activatedRoute.params.subscribe(data => {
      // debugger;
      this.mode = data['m'];
      if (this.mode === undefined || this.mode === null || this.mode === "") {
        this.mode = 'create';
      }
      this.id = data['id']; 
    });
    if( this.mode === 'create')
    {
      this.model.docDate = new Date();
    }
    this.loadShipping();
    this.loadData(); 
  }
  loadShipping()
  {
    this.shippingService.getAll(this.authService.getCurrentInfor().companyCode,"").subscribe((response: any) =>{
      if(response.success)
      { 
        this.shippings = response.data;
        console.log('this.shippings', this.shippings);
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Shiping Data',
          text: response.message
        });
      }
    });
  }
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  loadData()
  {
    if(this.mode==='create'  || this.mode==='setup'    )
    {
      let data = this.GetDateFormat(this.date);
      this.isLoadingData = true;
      this.shipDivisionService.GetDivisionToShip(this.authService.getCurrentInfor().companyCode, '', data).subscribe((response: any) =>{
        if(response.success)
        {
          this.isLoadingData = false;
          this.model.lines = response.data;
          // console.log('this.lines', this.lines);
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Ship Division',
            text: response.message
          });
        }
      })
    }
    else
    {
      
      this.shipDivisionService.getByCode(this.authService.getCurrentInfor().companyCode, this.id).subscribe((response: any) =>{
        if(response.success)
        {
          this.isLoadingData = false;
          //  let responeX =  
           this.model = response.data;
           console.log(' this.model',  this.model);
          // console.log('this.lines', this.lines);
        }
        else
        {
          this.isLoadingData = false;
          Swal.fire({
            icon: 'warning',
            title: 'Ship Division',
            text: response.message
          });
        }
      })
    }
    
  }
  saveData()
  {
    if(this.mode === 'setup')
    {
      this.model.createdBy = this.authService.getCurrentInfor().username;
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
      // this.model.lines = this.lines;
      this.model.docDate= this.date;
      this.shipDivisionService.create(this.model).subscribe((response: any) =>{
        if(response.success)
        {
          Swal.fire({
            icon: 'success',
            title: 'Ship Division',
            text: 'Successfully Completed'
          });
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Ship Division',
            text: response.message
          });
        }
      })
    }
    else
    {  
      this.model.modifiedBy = this.authService.getCurrentInfor().username;
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
      // this.model.lines = this.lines;
      this.model.docDate= this.date;
      this.shipDivisionService.update(this.model).subscribe((response: any) =>{
        if(response.success)
        {
          Swal.fire({
            icon: 'success',
            title: 'Ship Division',
            text: 'Successfully Completed'
          });
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Ship Division',
            text: response.message
          });
        }
      })
    }
    
  }
}
