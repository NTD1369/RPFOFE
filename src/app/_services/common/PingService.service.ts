// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// // import { Observable, Subject } from 'rxjs';
// import {Observable, Subject} from 'rxjs/Rx';
// @Injectable({
//   providedIn: 'root'
// })

// export class PingServiceService {
//   pingStream: Subject<number> = new Subject<number>();
//   ping: number = 0;
//   url: string = "https://cors-test.appspot.com/test";

//   constructor(private _http: HttpClient) {
//     Observable.interval(5000)
//       .subscribe((data) => {
//         let timeStart: number = performance.now();

//         this._http.get(this.url)
//           .subscribe((data) => {
//             let timeEnd: number = performance.now();

//             let ping: number = timeEnd - timeStart;
//             this.ping = ping;
//             this.pingStream.next(ping);
//           });
//       });
//   }

// }
