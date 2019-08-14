import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Project/user.service';

import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // myFormModel = {
  //   UserName: '',
  //   Password: ''
  // }

  formModel = {
    UserName: '',
    Password: ''
  }

  constructor(private userServiceObj: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    if (localStorage.getItem('token') != null)
    this.router.navigateByUrl('/user');
  }

  onSubmit(formData: NgForm) {
    console.log("formData -> " + formData);
    this.userServiceObj.login(formData.value).subscribe(
      (respose: any) => {
        localStorage.setItem('token', respose.token);
        console.log("inside login");
        this.router.navigateByUrl('/user');
      },
      (err: any) => {
        if (err.status == 400)
          this.toastr.error('Incorrect username or password.', 'Authentication failed.');
        else
          console.log(err);
      }
    )

  }

}
