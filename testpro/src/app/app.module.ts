import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component';
import { UsersListComponent } from './Project/users-list/users-list.component';
import { UserService } from 'src/app/Project/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatTableModule, MatMenuModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { CustomFormsModule } from 'ng2-validation';
import { RegisterationComponent } from './Project/registeration/registeration.component'
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './Project/login/login.component';
import { AuthorizationsGuard } from 'src/app/Project/authorizations.guard';
import { AuthorizationsInterceptor } from 'src/app/Project/authorizations.interceptor';



const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  },
  { path: 'register', component: RegisterationComponent },
  { path: 'login', component: LoginComponent },

  { path: 'user', component: UsersListComponent ,canActivate:[AuthorizationsGuard]},

  {
    path: '**',
    redirectTo: '/register',
    pathMatch: 'full'
  }

]


@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    RegisterationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    CustomFormsModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    CommonModule,
    ToastrModule.forRoot()
  ],
  providers: [UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthorizationsInterceptor,
    multi: true
  }],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
