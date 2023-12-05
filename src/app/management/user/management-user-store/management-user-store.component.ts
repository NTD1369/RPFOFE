import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MUserStore } from 'src/app/_models/muserstore';
import { MStore } from 'src/app/_models/store';
import { MUser } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service'; 
import { StoreService } from 'src/app/_services/data/store.service';
import { UserService } from 'src/app/_services/data/user.service';
import { UserstoreService } from 'src/app/_services/data/userstore.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-user-store',
  templateUrl: './management-user-store.component.html',
  styleUrls: ['./management-user-store.component.scss']
})
export class ManagementUserStoreComponent implements OnInit {

  
  @Input() model: MUser;  
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
 
  storeList: MStore[];
  constructor(private userService: UserService ,  private authService: AuthService, private storeService: StoreService, private userstoreService: UserstoreService,
      private alertifyService: AlertifyService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
 
  ngOnInit() {
      
      this.loadStoreByUser();
    
    
  }
  loadStoreByUser()
  {
     debugger;
    this.storeService.getByUserWithStatus(this.model.username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeList = response.data;
        console.log(this.storeList);
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
     
      // this.storeList= response;
    });
  }
  update(e) { 
    debugger;
    let  userStore= new  MUserStore();
    userStore.storeId = e.storeId;
    userStore.userId = this.model.userId;
    this.userstoreService.update(userStore).subscribe((response: any)=>{
      if(response.success)
      {
        this.alertifyService.success('Update completed successfully');  
        this.loadStoreByUser();
      }
      else{
        this.alertifyService.error(response.message);
      } 
     })
    // this.model.companyCode = "CP001";
    // this.model.createdBy = this.authService.decodeToken?.unique_name;
    // if(this.model.status=== null || this.model.status===undefined || this.model.status === "")
    //   this.model.status = this.statusOptions[0].value;
     
    // this.outModel.emit(this.model); 
  }
   
}
