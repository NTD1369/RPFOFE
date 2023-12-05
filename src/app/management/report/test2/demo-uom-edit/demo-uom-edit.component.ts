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
  selector: 'app-demo-uom-edit',
  templateUrl: './demo-uom-edit.component.html',
  styleUrls: ['./demo-uom-edit.component.css']
})
export class DemoUomEditComponent implements OnInit {
 @Input() model:MUom ;
 @Input() isNeww:boolean;
  @Output() outModel = new EventEmitter<any>();


  constructor() { }
  listStatus:any=[
  {name:"active",value:"A"},
  {name:"in active",value:"Y"}

]
  ngOnInit() {
   
  }
  save2(code, name, status){
    let model: MUom = new MUom();
    model.companyCode= "CP001";
    model.uomCode = code;
    model.status = status;
    model.uomName = name;
  this.outModel.emit(model);
    
  }
}
