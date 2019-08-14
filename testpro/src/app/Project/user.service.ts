import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/Project/user';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable()
export class UserService {
  baseURL : string = "http://localhost:60094/api/users";
  
  constructor(private http : HttpClient, private _formBuilder : FormBuilder) { }

  GetAllUsers(){
    return this.http.get<User[]>(this.baseURL);
  }

  GetUserByID(id:string){
    return this.http.get<User>(this.baseURL + "/GetUser/" + id);
  }

  GetUserByName(name:string){
    return this.http.get<User>(this.baseURL + "/GetUser/" + name);
  }

  CreateUser(user:User){
    return this.http.post<User>(this.baseURL + "/Create" , user)
  }


  updateUser(id:string, user:User)
  {
    return this.http.put<User>(this.baseURL + "/update/" + id, user);
  }


  DeleteUser(id:string){
    //var tokenHeader = new HttpHeaders({'Authorization' : 'Bearer' + localStorage.getItem('token')});
    return this.http.put<User>(this.baseURL + "/delete/" + id, "");
  }



  myFormModal = this._formBuilder.group({

    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    Name: ['', Validators.required],
    Passwords: this._formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }
    , { validator: this.comparePasswords }
  )

  });

  comparePasswords(_formBuilder: FormGroup) {
    let confirmPswrdCtrl = _formBuilder.get('ConfirmPassword');
    
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (_formBuilder.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }


  register(){
    var newRegUser = {
      UserName : this.myFormModal.value.UserName,
      Name : this.myFormModal.value.Name,
      Email : this.myFormModal.value.Email,
      Password : this.myFormModal.value.Passwords.Password
    };

    return this.http.post(this.baseURL + '/Register/', newRegUser);
  }


  login(data){
    console.log(data);
    return this.http.post(this.baseURL + '/login/', data);
    
  }

}
