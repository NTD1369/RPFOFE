import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MUom } from 'src/app/_models/muom';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-dm-uom',
  templateUrl: './dm-uom.component.html',
  styleUrls: ['./dm-uom.component.scss']
})
export class DmUomComponent implements OnInit {

  itemUomList:MUom[]=[];
  uom:MUom;
  modalRef: BsModalRef;
  isNew = false;
  listStatus: any=[
    {name:"Active",value:"A"},
    {name:"In Active",value:"Y"}

  ]
  constructor(private uomService: UomService, private alertify: AlertifyService,private modalService: BsModalService) { }
  ngOnInit() {
    let aa='';
    console.log(aa);
    this.loadItem();
  }
  loadItem(){
    this.uomService.getAll("CP001").subscribe((rep:any)=>{
      if(rep.success){
        this.itemUomList= rep.data
        console.log("itemList",this.itemUomList);
      }else{
       this.alertify.warning(rep.message);
      }
    })
  }
taoMoiGiaoDien(template:TemplateRef<any>,uom){
  debugger;
  if(uom!== null){
    this.uom = uom;
    this.isNew = false;
  }else{
    this.uom = null;
    this.isNew = true;
  }
  debugger;
  setTimeout(() => {
    this.modalRef = this.modalService.show(template, {
      ariaDescribedby: 'my-modal-description',
      ariaLabelledBy: 'my-modal-title',
      class: 'modal-dialog modal-dialog-centered modal-sm'
    });
  });


}

saveModal(code, name,status){

  let model:MUom = new MUom()
  model.companyCode ="CP001" ;
  model.uomCode = code;
  model.uomName=name;
  model.status=status;
  model.createdBy="abc";
  if(this.isNew){
    this.uomService.create(model).subscribe((reponse:any)=>{
      if(reponse.success){
        this.alertify.success("thanh cong");
        this.modalRef.hide();
        this.loadItem();
  
      }else{
        this.alertify.warning(reponse.message);
      }
    })
  }else{
    this.uomService.update(model).subscribe((reponse:any)=>{
      if(reponse.success){
        this.alertify.success("thanh cong");
        this.modalRef.hide();
        this.loadItem();
  
      }else{
        this.alertify.warning(reponse.message);
      }
    })
  }
 


}

}