import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MPrepaidCard, TPrepaidCardTrans } from 'src/app/_models/prepaidcard';
import { AuthService } from 'src/app/_services/auth.service';
import { PrepaidcardService } from 'src/app/_services/data/prepaidcard.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-manament-prepaid-history',
  templateUrl: './manament-prepaid-history.component.html',
  styleUrls: ['./manament-prepaid-history.component.scss']
})
export class ManamentPrepaidHistoryComponent implements OnInit {

  
  history: TPrepaidCardTrans[];
  userParams: any = {};
  modalRef: BsModalRef;
  @Input() model: MPrepaidCard;
  isNew:boolean = false;
 
  constructor(private prepaidService: PrepaidcardService, private alertify: AlertifyService,  public authService: AuthService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute) { 
      this.customizeText= this.customizeText.bind(this);
    }
    selectedDate;
    
  ngOnInit() {
    debugger;
    // let check =  this.authService.checkRole(this.functionId , '', 'V' );
    // if(check === false)
    // {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }
    this.loadItems() ;
    
  }
  customizeText (e) {
    
    if( e.value!==null &&  e.value!== undefined)
    {
      return this.authService.formatCurrentcy( e.value);

    }
    return 0;
 };
  loadItems() {
   
    this.prepaidService.getHistoryItem(this.authService.getCurrentInfor().companyCode, this.model.prepaidCardNo).subscribe((res: any) => {
      debugger;
      if(res.success)
      {
        this.history = res.data;
        console.log(this.history );
      }
      else
      {
        this.alertify.warning(res.message);
      }
     
     
    }, error => {
      this.alertify.error(error);
    });
  }
    


}
