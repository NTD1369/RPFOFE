import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MHoliday } from 'src/app/_models/holiday'; 
import { MImage } from 'src/app/_models/image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {


 
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  
  item: any = {};
 
  
  getImage(companyCode, type,  code, phone): Observable<MImage[]> {
    return this.http.get<MImage[]>(this.baseUrl + 'image/GetImage?companyCode=' + companyCode + '&Type=' + type+ '&code=' + code+ '&phone=' + phone);
  }
   
    
  create(model: MImage) {
    
    return this.http.post(this.baseUrl + 'image/create', model );
  }

    
  update(model: MImage) {
  
    return this.http.put(this.baseUrl + 'image/update', model);
  } 
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'image/delete' + Id );
  }
 
}
