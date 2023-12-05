import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MUser } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/data/user.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  currentPassword: string = "";
  confirmPassword: string = '';
  newPassword: string = '';
  errnewPassword: string = "";
  errconfirmPassword: string = "";
  errcurrentPassword: string = "";
  infosuccess = "";
  @Output() outEvent = new EventEmitter<any>();
  public showSuccess: boolean;
  public showError: boolean;

  editForm: FormGroup;
  constructor(public authService: AuthService,    private alertify: AlertifyService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    debugger;
  }

  checkEmpty() {
    if (this.currentPassword == '') {
      this.errcurrentPassword = "Please enter Current password";
    } else {
      this.checkPass();
    }
    if (this.newPassword == '') {
      this.errnewPassword = "Please enter New Password";
    } else {
      this.errnewPassword = '';
    }
    if (this.confirmPassword == '') {
      this.errconfirmPassword = "Please enter Confirm Password";
    } else {
      if (this.newPassword !== this.confirmPassword) {
        this.errconfirmPassword = "Confirm password does not match";
      } else {
        this.errconfirmPassword = '';
      }
    }
  }

  changePass() {
    this.checkEmpty();

    let getUser = localStorage.getItem("user");
    let parseJson = JSON.parse(getUser);
    console.log("id user", parseJson);
    if (this.confirmPassword != '' && this.newPassword != '') {
      let id = parseJson.userId;
      this.userService.getItem(this.authService.getCurrentInfor().companyCode, id).subscribe((response: any) => {
        if(response.success)
        {
          // this.items = response.data;
          response.data.password = this.confirmPassword;
          this.userService.update(response.data).subscribe(async (response: MUser) => {
            if (response !== null && response !== undefined) {
              console.log("response", response);
              this.infosuccess = "Change account successfully";
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          });
        }
        else
        {
          this.alertify.warning(response.message);
        }
        
      });
    }
  }
  closeModel()
  {
    this.outEvent.emit(true);
  }

  checkPass() {
    let model = new checkLogin();

    let getUser = localStorage.getItem("user");
    let parseJson = JSON.parse(getUser);
    model.userName = parseJson.username;
    model.password = this.currentPassword;

    console.log("this.model", model);
    this.authService.login(model).subscribe(next => {
      // console.log("nexr", next);
      this.errcurrentPassword = '';
    }, error => {
      this.errcurrentPassword = "Current password does not match";
    });
   
  }
}

export class checkLogin {
  userName: string = '';
  password: string = '';
}
