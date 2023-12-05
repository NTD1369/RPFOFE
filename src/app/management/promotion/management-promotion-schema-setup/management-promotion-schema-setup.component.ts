import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SSchemaLine } from 'src/app/_models/promotion/promotionchemaline';
import { PromotionViewModel } from 'src/app/_models/promotion/promotionViewModel';
import { SchemaViewModel } from 'src/app/_models/promotion/schemaViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { PromotionService } from 'src/app/_services/promotion/promotion.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-promotion-schema-setup',
  templateUrl: './management-promotion-schema-setup.component.html',
  styleUrls: ['./management-promotion-schema-setup.component.scss']
})
export class ManagementPromotionSchemaSetupComponent implements OnInit {
  schemaLine: SSchemaLine[]=[];
  schema: SchemaViewModel;
  modalRef: BsModalRef;
  isEdit= false;
  schemaId="";
  statusOptions = [
    {
      value: "Y", name: "Active",
    },
    {
      value: "N", name: "Inactive",
    },
  ];
  chainOptions = [
    {
      value: "Y", name: "Allow Chain",
      
    },
    {
      value: "N", name: "Combine",
    },
  ];
  constructor(private authService: AuthService,  private promotionService: PromotionService,  private modalService: BsModalService,
     private alertifyService: AlertifyService, private route: ActivatedRoute) 
  {
    this.schema = new SchemaViewModel();
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  functionId="Adm_PromotionSchema";

  ngOnInit() {
    debugger;
    this.route.params.subscribe(data => {
      // debugger;
      this.schemaId = data['id'];
      this.isEdit= true;
    });
   //  this.promotionId='PICP00100000001';
    if(this.schemaId !== "" && this.schemaId !== null && this.schemaId !== undefined)
    { 
      this.loadSchmema();
    }
    if(this.isEdit)
    {
      this.canUpdate =  this.authService.checkRole(this.functionId , '', 'E' ); 
    }
    else  
    {
      this.canUpdate =  this.authService.checkRole(this.functionId , '', 'I' );
    }
     
  }
  canUpdate= false;
  loadSchmema()
  {
   
    this.promotionService.getSchema(this.authService.storeSelected().companyCode, this.schemaId ).subscribe((response: any)=>{
      debugger;
      if(response.success===true)
      {
        this.schema= response.data;
        this.schemaLine = response.data.schemaLines;
      }
      else
      {
        this.alertifyService.warning('failed to load data')
      }
       
    })
    
  }
  @ViewChild('dataGrid' , { static: false}) dataGrid;  
  applyPromotion(event: PromotionViewModel[])
  {
    debugger;
    // console.log(this.dataGrid.instance.totalCount());
    let stt: number= this.dataGrid.instance.totalCount() + 1; 
    let single=Array.from(event).filter(x=>x.promoType.toString() !=='Total Bill');
    let total=Array.from(event).filter(x=>x.promoType.toString() ==='Total Bill');
     
    Array.from(single).forEach((item: any)=>{
       const line = new SSchemaLine();
       line.lineNum = stt;
       line.promoId = item.promoId;
       line.description = item.promoName;
       line.promoTypeName = item.promoType;
       line.priority = stt;
       line.isApply = 'Y';
       this.schemaLine.push(line);
       stt++;
    });
    Array.from(total).forEach((item: any)=>{
      const line = new SSchemaLine();
      line.lineNum = stt;
      line.promoId = item.promoId;
      line.description = item.promoName;
      line.promoTypeName = item.promoType;
      line.priority = stt;
      line.isApply = 'Y';
      this.schemaLine.push(line);
      stt++;
   });
    this.modalRef.hide();
    // this.promotionList = event;
  }
  saveSchema()
  {
    debugger;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        let comp=this.authService.storeSelected().companyCode; 
        this.schema.SchemaLines= this.schemaLine;
        this.schema.companyCode = comp;
        this.schema.createdBy = this.authService.decodeToken?.unique_name;
        if(this.schema.status===undefined || this.schema.status===null ||this.schema.status==="" )
        {
          this.schema.status = 'Y';
        }
        if(this.schema.allowChain===undefined || this.schema.allowChain===null ||this.schema.allowChain==="" )
        {
          this.schema.allowChain = 'Y';
        }
        this.promotionService.saveSchema(this.schema).subscribe((response: any)=>{
           if(response.success=== true)
           {
            // debugger;
            this.alertifyService.success('save completed successfully.');
            window.location.reload();
           }
           else
           {
             this.alertifyService.warning('insert failed. Message: ' + response.message)
           }
        });
      }
    });
   
  }
}
