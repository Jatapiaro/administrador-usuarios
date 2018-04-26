import { Component, OnInit } from '@angular/core';
import { SecurityService } from './../../services/security.service';
import { ParametersService } from './../../services/parameters.service';
import { UserService } from './../../services/user.service';
import { Parameters } from './../../models/Parameters';
import { Router } from '@angular/router';
import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  /**
  * @param errors : string[] lista de errores
  * @param message : string mensaje a mostrar
  * @param once : boolean si el message debe mostrarse
  * @param user : any usuario que ha iniciado sesión
  * @param password : string el nuevo password
  * @param passwordConfirmation : string confirmación de nuevo password
  */
  public errors : string[];
  public message : string;
  public once : boolean;
  private user : any;
  public password : string;
  public passwordConfirmation : string;
  private parameters : Parameters;
  public subscription : ISubscription;

  constructor(private securityService : SecurityService,
    private parametersService : ParametersService,
    private userService : UserService,
    private router : Router) { }

  ngOnInit() {

    this.errors = [];
    this.once = true;
    this.user = this.securityService.getSession();
    this.user.passwordHistory = Object.values(this.user.passwordHistory);
    this.message = (this.user.passwordHistory.length == 1)? 'Al ser tu primer ingreso al sistema, te pedimos configurar tu contraseña' : 'Solicitaste un reseteo de contraseña, por favor ingresa tu nueva contraseña.';
    var x = this.parametersService.getParametersList();
    this.subscription = x.snapshotChanges().subscribe(item => {
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
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goToUsers() {
    this.router.navigate(['users']);
  }

  updatePassword() {
    if ( this.once ) {
      this.once = false;
    }
    this.errors = [];
    this.validatePasswordsAreFilled();
    if ( this.errors.length == 0 ) {
      this.validatePasswordMatch();
      if ( this.errors.length == 0 ) {
        this.validatePasswordRequirements();
        if ( this.errors.length == 0 ) {
          this.user.password = this.password;
          this.userService.updateUserPassword(this.user);
          this.goToUsers();
        }
      }
    }
  }

  validatePasswordsAreFilled() {
    if ( !this.password || this.password.length == 0 ) {
      this.errors.push("Debes ingresar el password");
    }
    if ( !this.passwordConfirmation || this.passwordConfirmation.length == 0 ) {
      this.errors.push("Debes ingresar la confirmación del password");
    }
  }

  validatePasswordMatch() {
    if ( this.password != this.passwordConfirmation ) {
      this.errors.push("El password y su confirmación no coinciden");
    }
  }

  validatePasswordRequirements() {
    this.errors = this.parametersService.validatePasswordRequirements(this.parameters, this.password);
  }


}
