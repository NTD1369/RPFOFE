import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  @Input() CompanyCode="";
  @Input() ItemCode="";
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
    // baseUrl = environment.apiUrl;
    apiUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  imageUrl= environment.imageUrl;
  cancelChange()
  {
    this.isEdit=false;
    if(this.ImagePath!==null && this.ImagePath!==undefined && this.ImagePath.toString()!=="" && this.ImagePath.toString()!=="undefined")
    {
      this.imgURL=this.apiUrl + this.imageUrl + this.ImagePath;
    }
    else
    {
      this.imgURL=null;
    }
    // this.imgURL=this.apiUrl + this.imageUrl +  this.ImagePath;
  }
  saveChange()
  {
    // this.itemService.avartaUpdate();
    this.itemService.avartaUpdate(this.CompanyCode, this.ItemCode, this.file).subscribe((response: any)=>{
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
  constructor(private itemService: ItemService, private alertify: AlertifyService, public env: EnvService) { }

  ngOnInit() {
    debugger;
    if(this.ImagePath!==null && this.ImagePath!==undefined && this.ImagePath.toString()!=="" && this.ImagePath.toString()!=="undefined")
    {
      this.imgURL=this.apiUrl + this.imageUrl + this.ImagePath;
    }
    else
    {
      this.imgURL=null;
    }
  }

}


// import { fromEvent } from 'rxjs';
// import { pluck } from 'rxjs/operators';

//  onUploadImage(event) {
//   if (event.target.files.length > 0) {
//     const fileReader = new FileReader();
//     let imageToUpload = event.target.files.item(0);
//     this.imageToBase64(fileReader, imageToUpload)
//       .subscribe(base64image => {
//         // do something with base64 image..
//       });
//   }
// }

// imageToBase64(fileReader: FileReader, fileToRead: File): Observable<string> {
//   fileReader.readAsDataURL(fileToRead);
//   return fromEvent(fileReader, 'load').pipe(pluck('currentTarget', 'result'));
// }