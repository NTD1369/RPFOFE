import { Component, Input, OnInit } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-image-company',
  templateUrl: './upload-image-company.component.html',
  styleUrls: ['./upload-image-company.component.scss']
})
export class UploadImageCompanyComponent implements OnInit {

  @Input() CompanyCode="";
 
  @Input() ImagePath="";
  public imagePath;
  imgURL: any;
  public message: string;
  isEdit=false;
  file: any;
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      this.isEdit=true;
    }
    this.file= files[0];
  }
  // @Output() storeSelected = new EventEmitter<any>();
  
  // apiUrl= environment.apiUrl;
  apiUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  imageUrl= environment.imageUrl;
  cancelChange()
  {
    this.isEdit=false;
    if(this.ImagePath!==null && this.ImagePath!==undefined && this.ImagePath.toString()!=="" && this.ImagePath.toString()!=="undefined")
    {
      // this.imgURL=this.apiUrl + this.imageUrl + this.ImagePath;
      // this.imgURL=this.imageUrl + this.ImagePath;
      this.imgURL=this.apiUrl + this.imageUrl + this.ImagePath;
      this.imgURL = this.imgURL.replace("api/wwwroot","");
    }
    else
    {
      this.imgURL=null;
    }
    // this.imgURL=this.apiUrl + this.imageUrl +  this.ImagePath;
  }
  saveChange()
  { 
    this.companyService.logoUpdate(this.CompanyCode,   this.file).subscribe((response: any)=>{
       console.log(response);
       if(response.success)
       {
        this.alertify.warning("update avarta completed successfully.");
        this.isEdit=false;
       }
       else
       {
         this.imgURL= this.ImagePath;
         this.alertify.warning(response.message);
         this.isEdit=false;
       }
    }, error=>{
      console.log(error);
    });
    // this.storeSelected.emit(this.file); 
  }
  constructor(private companyService: CompanyService, private alertify: AlertifyService, public env: EnvService) { }

  ngOnInit() {
    debugger
    if(this.ImagePath!==null && this.ImagePath!==undefined && this.ImagePath.toString()!=="" && this.ImagePath.toString()!=="undefined")
    {
      this.imgURL=this.apiUrl + this.imageUrl + this.ImagePath;
      // this.imgURL= this.imageUrl + this.ImagePath;
      this.imgURL = this.imgURL.replace("api/wwwroot","");
    }
    else
    {
      this.imgURL=null;
    }
  }

}
