import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Project/user.service';
import { User } from 'src/app/Project/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  providers: [UserService]
})
export class UsersListComponent implements OnInit {

  Id : string = Math.random().toString(36).substr(2, 9);
  users : User[] = [];
  newUser : User = new User(this.Id, "","", true);
  displayedColumns: string[] = ['ID','Name', 'IsActive', 'Operations'];
  

  constructor(private userServiceObj : UserService, private router : Router) { }

  ngOnInit() {
    this.userServiceObj.GetAllUsers().subscribe(a => this.users = a);
  }

  GetAllUser(){
    this.userServiceObj.GetAllUsers().subscribe(a => this.users = a);
  }

  DeleteUser(id:string){
    this.userServiceObj.DeleteUser(id).subscribe(a=>{
      this.GetAllUser();
    })
  }

  GetUserData(id: string){
    this.userServiceObj.GetUserByID(id).subscribe(a=> this.newUser = a);
  }

  addNewUser(){
    this.userServiceObj.CreateUser(this.newUser).subscribe(a => this.users.push(a));
  }

  EditUser()
  {
    this.userServiceObj.updateUser(this.newUser.Id, this.newUser).subscribe(a=>this.GetAllUser());
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
