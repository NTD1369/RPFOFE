import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintwaiverService {

  private paramSource = new BehaviorSubject(null);
  sharedParam = this.paramSource.asObservable();
  constructor() { }

  changeParam(param: any[]) {
    console.log("param-waiver",param);
    this.paramSource.next(param)
  }
}
