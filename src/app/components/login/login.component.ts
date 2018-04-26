import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersComponent } from './../users/users.component';
import { SecurityService } from './../../services/security.service';
import { UserService } from './../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public username : string;
  public password : string;
  public errors : string[];

  constructor( private router : Router,
    private securityService : SecurityService,
    private userService : UserService) {
      this.errors = [];
    }

  ngOnInit() {
    if ( localStorage.getItem('userSession') ) {
      this.goToUsers();
    }
  }

  login() {
    this.errors = [];
    if ( !this.username || this.username.length == 0 ) {
      this.errors.push('Necesitas introducir la cuenta');
    }
    if ( !this.password || this.password.length == 0 ) {
      this.errors.push('Necesitas introducir el password');
    }
    this.makeFirebaseLogin();
  }

  makeFirebaseLogin() {
    let users = []
    this.securityService.verifyIfUserExists(this.username).snapshotChanges().subscribe(item => {
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["key"] = element.key;
            users.push(y as User);
        });
        if ( users.length == 0 ) {
          this.errors.push('La cuenta que ingresaste no existe');
        }
        let user = users[0];
        if ( this.securityService.verifyIfPasswordIsCorrect(user, this.password)) {
          this.userService.updateUser(user);
          this.goToUsers();
        } else {
          this.errors.push('Tus credenciales son incorrectas');
        }
    });
  }

  goToUsers() {
    this.router.navigate(['users']);
  }

}
