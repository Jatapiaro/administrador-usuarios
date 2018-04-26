import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Parameters } from '../models/Parameters';
import { SecurityService } from './security.service';

@Injectable()
export class ParametersService {

  private parametersList: AngularFireList<any>;

  constructor(private firebase : AngularFireDatabase,
    private securityService : SecurityService) {
    this.parametersList = this.firebase.list('parameters');
  }

  getParametersList() {
    return this.parametersList;
  }

  uploadFirstParameters() {
    this.parametersList.push({
      passwordLength: 8,
      passwordMustHaveNumbers: true,
      passwordMustHaveSpecialCharacters: true,
      passwordMustHaveLowerCaseLetters : true,
      passwordMustHaveUpperCaseLetters : true,
      accountLength : 6,
      accountCanHaveNumbers : true,
      accountCanHaveUpperCaseLetters : true,
      accountCanHaveUndescores : true,
      maxLoginAttempts : 3,
      maxPasswordHistory : 3,
    })
  }

  validatePasswordRequirements( parameters : Parameters, passwordHistory : string[], password : string  ) {
    let errors = [];
    if ( password.length < parameters.passwordLength ) {
      errors.push(`La contraseña debe tener al menos ${parameters.passwordLength} caracteres`);
    }
    if ( parameters.passwordMustHaveLowerCaseLetters ) {
      if ( !/[a-z]/.test(password) ) {
        errors.push("La contraseña debe tener al menos una letra minúscula");
      }
    }
    if ( parameters.passwordMustHaveUpperCaseLetters ) {
      if ( !/[A-Z]/.test(password) ) {
        errors.push("La contraseña debe tener al menos una letra mayúscula");
      }
    }
    if ( parameters.passwordMustHaveNumbers ) {
      if (  !/\d/.test(password) ) {
        errors.push("La contraseña debe tener al menos un número");
      }
    }
    if ( parameters.passwordMustHaveSpecialCharacters ) {
      if ( !this.checkSpecialCharacters(password) ) {
        errors.push("La contraseña debe tener al menos un carácter especial *|,\":<>[]{}`\';()@&$#%");
      }
    }
    for ( let i = 0; i<passwordHistory.length && i<parameters.maxPasswordHistory; i++ ) {
      if ( this.securityService.validPassword(password, passwordHistory[i]) ) {
        errors.push(`Debes introducir una contraseña que no hayas usado ${parameters.maxPasswordHistory} veces antes`);
        break;
      }
    }
    return errors;
  }

  private checkSpecialCharacters( password  : string ) {
    var splChars = "*|,\":<>[]{}`\';()@&$#%";
    for (var i = 0; i < password.length; i++) {
      if (splChars.indexOf(password.charAt(i)) != -1){
        return true;
      }
    }
    return false;
  }

}
