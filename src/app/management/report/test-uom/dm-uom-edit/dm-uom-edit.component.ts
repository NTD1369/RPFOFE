import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsComponentRef } from 'ngx-bootstrap/component-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MUom } from 'src/app/_models/muom';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-dm-uom-edit',
  templateUrl: './dm-uom-edit.component.html',
  styleUrls: ['./dm-uom-edit.component.scss']
})
export class DmUomEditComponent implements OnInit {

  listData;
  //đóng mở model
  modalRef: BsModalRef;
  //trạng thái status
  listStatus: any=[
    {name:"Active",value:"A"},
    {name:"In Active",value:"Y"}

  ]
//kiểm tra id có chưa..nếu chưa là tạo mới, có rồi là view
  isNew = false;
  
  uom:MUom;
  constructor(private alertService: AlertifyService,private uomService:UomService,private modalService: BsModalService) { }

  ngOnInit() {
    this.loadItemData()
  }
  loadItemData(){
    this.uomService.getAll("CP001").subscribe((response:any)=>{
      if(response.success){
        this.listData = response.data
        console.log("dataList",this.listData);
      }else{
        this.alertService.warning(response.message)
      }
    })
  }
  taoMoiModal(template:TemplateRef<any>,uomMoi){
    
    if(uomMoi!==null){
      this.uom = uomMoi
      this.isNew=false
    }else{
      this.uom = null;
      this.isNew=true
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }
  saveModal(code,name,status){
let model:MUom = new MUom()
model.companyCode = "CP001";
model.uomCode=code;
model.uomName=name;
model.status=status;
console.log("companyCode",model.companyCode);
console.log("uomCode",model.uomCode);
console.log("uomName",model.uomName);
console.log("status",model.status);
if(this.isNew){
  this.uomService.create(model).subscribe((reponse:any)=>{
    if(reponse.success){
      this.alertService.success("thanh cong");
      this.modalRef.hide();
      this.loadItemData();
    }else{
      this.alertService.warning(reponse.message);
    }
  })
}else{
  this.uomService.update(model).subscribe((reponse:any)=>{
    if(reponse.success){
      this.alertService.success("thanh cong");
      this.modalRef.hide();
      this.loadItemData();
     
    }else{
      this.alertService.warning(reponse.message);
    }
  })
}
}
delele(model) {
  this.uomService.delete(model.uomCode).subscribe((response: any) => {
    if (response.success) {
      this.alertService.success('Create completed successfully');
      this.modalRef.hide();
      this.loadItemData();
    }
    else {
      this.alertService.error(response.message);
    }
  }, error => {
    this.alertService.error(error);
  });
}


}

