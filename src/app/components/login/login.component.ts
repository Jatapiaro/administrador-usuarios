import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersComponent } from './../users/users.component';
import { SecurityService } from './../../services/security.service';
import { ParametersService } from './../../services/parameters.service';
import { Parameters } from './../../models/Parameters';
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
  private parameters : Parameters;
  private maxLoginAttempts : number;
  private consumedAttempts : number;
  private once : boolean;

  public subscription : ISubscription;
  public subscription2 : ISubscription;

  constructor( private router : Router,
    private securityService : SecurityService,
    private userService : UserService,
    private parametersService : ParametersService) {
      this.errors = [];
      this.once = true;
    }

  ngOnInit() {
    if ( localStorage.getItem('userSession') ) {
      this.goToUsers();
    }
    var x = this.parametersService.getParametersList();
    this.subscription2 = x.snapshotChanges().subscribe(item => {
      let parametersList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["firebaseKey"] = element.key;
        parametersList.push(y as Parameters);
      });
      if ( parametersList.length == 0 ) {
        this.parametersService.uploadFirstParameters();
      } else {
        this.parameters = parametersList[0];
        if ( this.once ) {
          this.maxLoginAttempts = this.parameters.maxLoginAttempts;
        }
      }
    });
  }

  ngOnDestroy() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
    if ( this.subscription2 ) {
      this.subscription2.unsubscribe();
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
    let users = [];
    let justOnce = true;
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
        if ( user.blocked ) {
          this.errors.push('La cuenta esta bloqueada, contacta al administrador');
          return;
        }
        if ( user.isOnline ) {
          this.errors.push('Ya tienes una cuenta activa en un dispositivo');
          return;
        }
        if ( this.securityService.verifyIfPasswordIsCorrect(user, this.password) ) {
          if ( user.mustResetPassword ) {
            this.goToResetPassword();
          } else {
            this.userService.updateUserOnLogin(user, this.parameters.maxLoginAttempts);
            this.goToUsers();
          }
        } else {
          if ( justOnce ) {
            justOnce = false;
            this.maxLoginAttempts = user.remainingAttempts - 1;
            if ( this.maxLoginAttempts == 0 ) {
              this.userService.updateUserAsBlocked(user);
              this.errors.push("Tu cuenta ha sido bloqueada, pide al administrador que resetee tu contraseña o que te desbloquee");
            } else {
              this.userService.updateUserOnLoginFail(user);
              this.errors.push(`Tus credenciales son incorrectas, te quedan ${this.maxLoginAttempts} intentos`);
            }
          }
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
