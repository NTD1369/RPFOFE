import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MShortcutKeyboard } from 'src/app/_models/shortcut';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {


   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, public env: EnvService) { } 
  getAll(companyCode): Observable<MShortcutKeyboard[]> {
    return this.http.get<MShortcutKeyboard[]>(this.baseUrl + 'Shortcut/GetAll?companyCode=' +companyCode);
  }
  getByFunction(companyCode, functionCode): Observable<MShortcutKeyboard> {
    return this.http.get<MShortcutKeyboard>(this.baseUrl + 'Shortcut/GetByFunction?companyCode=' +companyCode+ '&functioncode=' + functionCode);
  }
    
  getItem(companyCode, code): Observable<MShortcutKeyboard> {
    return this.http.get<MShortcutKeyboard>(this.baseUrl + 'Shortcut/GetByCode?companyCode=' +companyCode+ '&code=' + code);
  }
    
  create(model: MShortcutKeyboard) {
   
    return this.http.post(this.baseUrl + 'Shortcut/create', model );
  }

    
  update(model: MShortcutKeyboard) {
   
    return this.http.put(this.baseUrl + 'Shortcut/update', model);
  }
 
  delete(companyCode, Id: string) {
    return this.http.delete(this.baseUrl + 'Shortcut/delete?companyCode=' + companyCode + '&Id=' + Id );
  }

}
