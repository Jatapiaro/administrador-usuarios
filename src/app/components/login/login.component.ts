import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersComponent } from './../users/users.component';
import { SecurityService } from './../../services/security.service';
import { UserService } from './../../services/user.service';
import { User } from '../../models/User';
import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public username : string;
  public password : string;
  public errors : string[];
  public subscription : ISubscription;

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    this.subscription = this.securityService.verifyIfUserExists(this.username).snapshotChanges().subscribe(item => {
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["key"] = element.key;
            users.push(y as User);
        });
        if ( users.length == 0 ) {
          this.errors.push('La cuenta que ingresaste no existe');
          return;
        }
        let user = users[0];
        if ( user.isBaned ) {
          this.errors.push('La cuenta esta dada de baja');
          return;
        }
        if ( this.securityService.verifyIfPasswordIsCorrect(user, this.password) ) {
          if ( user.mustResetPassword ) {
            this.goToResetPassword();
          } else {
            this.userService.updateUserOnLogin(user);
            this.goToUsers();
          }
        } else {
          this.errors.push('Tus credenciales son incorrectas');
        }
    });
  }

  goToResetPassword() {
    this.router.navigate(['reset']);
  }

  goToUsers() {
    this.router.navigate(['users']);
  }

}
