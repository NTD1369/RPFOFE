import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MItemStoreListing } from 'src/app/_models/itemstorelisting';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemlistingService {


  
  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode, storeId, itemCode): Observable<MItemStoreListing[]> {
    return this.http.get<MItemStoreListing[]>(this.baseUrl + 'ItemListing/GetAll?companyCode=' + companyCode + '&storeId=' + storeId  + '&itemCode=' + itemCode);
  } 
 
  
  getItemListingStore(companyCode,  itemCode, userCode): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'ItemListing/getItemListingStore?companyCode=' + companyCode   + '&itemCode=' + itemCode  + '&userCode=' + userCode);
  }
  
  create(model: MItemStoreListing) {
     
    return this.http.post(this.baseUrl + 'ItemListing/create', model );
  }

    
  update(model: MItemStoreListing) {
    
    return this.http.put(this.baseUrl + 'ItemListing/update', model);
  }
 
  delete(model: MItemStoreListing) {
    return this.http.post(this.baseUrl + 'ItemListing/delete', model);
  }

}
