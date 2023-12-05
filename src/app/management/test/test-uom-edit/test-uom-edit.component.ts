import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MUom } from 'src/app/_models/muom';
import { AuthService } from 'src/app/_services/auth.service';
import { ReportService } from 'src/app/_services/common/report.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-test-uom-edit',
  templateUrl: './test-uom-edit.component.html',
  styleUrls: ['./test-uom-edit.component.css']
})
export class TestUomEditComponent implements OnInit {

  @Input() model: MUom;
  @Input() isNew:boolean;

  @Output() outModel = new EventEmitter<any>();;


  statusList: any = [
    { name: 'active', value: 'A' }, 
    { name: 'in active', value: 'Y' },
    
    ];
  constructor( private uomService: UomService, private router: Router,  private alertify: AlertifyService,
    public authService: AuthService) { }

  ngOnInit() {
    console.log("model",this.model);
    console.log("isNew",this.isNew);
  }

  modalRef: BsModalRef;

save(code, name, status){
  let model: MUom = new MUom();
  model.companyCode= "CP001";
  model.uomCode = code;
  model.status = status;
  model.uomName = name;
  this.outModel.emit(model);
  
  
  // let model: Uom
  // if (this.isNew) {

  //   this.uomService.create(model).subscribe((response: any) => {
  //     if (response.success) {
  //       this.alertify.success('Create completed successfully');
  //       this.loadItems();
  //       this.modalRef.hide();
  //     }
  //     else {
  //       this.alertify.error(response.message);
  //     }
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
  // else {
  //   this.uomService.update(model).subscribe((response: any) => {
  //     if (response.success) {
  //       this.alertify.success('Update completed successfully.');
  //       this.modalRef.hide();
  //     }
  //     else {
  //       this.alertify.error(response.message);
  //     }

  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }
  // this.uomService.create().subscribe((response:any)=>{
  //   if(response.success){
  //     console.log("list");
  //   }
  //   else{

  //   }
  // })
}
}
