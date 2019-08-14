import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Project/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css']
})
export class RegisterationComponent implements OnInit {

  constructor(private userServiceObj: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.userServiceObj.myFormModal.reset();
  }

  onSubmit() {
    this.userServiceObj.register().subscribe(
      (response : any) => {
        if (response.Succeeded) {
          this.userServiceObj.myFormModal.reset();
          this.toastr.success('New user created!', 'Registration Done!');
        }
        else {
          response.Errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                //err msg
                this.toastr.error('Username is already taken', 'Registration failed.');

                break;

              default:
                //err msg
                this.toastr.error(element.description,'Registration failed.');
                break;
            }
          });
        }
      },
      error => {
        this.toastr.error('Non user created.', 'Registration failed!');

      }
    );
  }
}
