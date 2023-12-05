import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MUom } from 'src/app/_models/muom';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
@Component({
  selector: 'app-demo-uom',
  templateUrl: './demo-uom.component.html',
  styleUrls: ['./demo-uom.component.css']
})
export class DemoUomComponent implements OnInit {
  listData;
  constructor(private modalService: BsModalService,private uomService: UomService,private alertify: AlertifyService,public authService: AuthService,) { }
  //model
  isNew:boolean= false;
  uom: MUom;
  modalRef: BsModalRef;

  ngOnInit() {
    this.uomService.getAll("CP001").subscribe((reponse:any)=>{
    if(reponse.success){
      this.listData = reponse.data
      console.log("reponse",this.listData);
    }else{
      console.log(this.alertify.warning);
    }
    })
    
    
  }
  OpenModal(isNew:boolean,uom:MUom,template:TemplateRef<any>){
    this.isNew = isNew;
    if(isNew){
      this.uom = new MUom
    }
    else{
      this.uom = uom
    }
    this.uom.companyCode = this.authService.getCurrentInfor().companyCode;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }
  updateModel(model){
    debugger
    if (this.isNew) {
      this.uomService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.modalRef.hide();
          // this.loadItems();
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
    else {
      this.uomService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.modalRef.hide();
          // this.loadItems();
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }

  }

}
