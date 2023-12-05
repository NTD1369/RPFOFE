import { Observable, Subject } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Inject, Injectable } from '@angular/core';

// Key used to access status in local storage
const STATUS_STORAGE_KEY = 'status_test';
 
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storageStatus = new Subject<string>();
  constructor (
    @Inject(LOCAL_STORAGE)
    private storage: StorageService)
  {}

  watchStorage(): Observable<any> {
    return this.storageStatus.asObservable();
  }

  // Set Method
  public setStatus(status) {
    this.storage.set(STATUS_STORAGE_KEY, status);
    this.storageStatus.next('changed'); // tell subscribers storage status is updated
  }

  // Get Method
  public getStatus() {
    return this.storage.get(STATUS_STORAGE_KEY);
  }

}
