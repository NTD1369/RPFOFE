import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

confirm(message: string, okCallback: () => any) {
  alertify.confirm(message, function(e) {
    if (e) {
      okCallback();
    } else {}
  });
}

success(message: string) {
  alertify.success(message);
}

error(message: string) {
  alertify.error(message);
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'Limit Amount',
  //         text: response.message
  //       });
}

warning(message: string) {
  alertify.warning(message);
}

message(message: string) {
  alertify.message(message);
}

}
