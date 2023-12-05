import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MMovementType } from 'src/app/_models/movementtype';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovementtypeService {



  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
   
  constructor( private http: HttpClient, public env: EnvService ) { } 

  getAll(): Observable<MMovementType[]> {
    return this.http.get<MMovementType[]>(this.baseUrl + 'MovementType/GetAll');
  }
   
  getItem(code): Observable<MMovementType> {
    return this.http.get<MMovementType>(this.baseUrl + 'MovementType/GetByCode?code=' + code);
  }
  
   
  create(model: MMovementType) {
    
    return this.http.post(this.baseUrl + 'MovementType/create', model );
  }

    
  update(model: MMovementType) {
    
    return this.http.put(this.baseUrl + 'MovementType/update', model);
  }
  
  
  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'MovementType/delete' + Id );
  }
 

}
