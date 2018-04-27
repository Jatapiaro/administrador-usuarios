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

  updateParameters( parameters : Parameters ) {
    console.log(parameters);
    this.parametersList.update(parameters.firebaseKey, {
      passwordLength : parameters.passwordLength,
      passwordMustHaveNumbers : parameters.passwordMustHaveNumbers,
      passwordMustHaveSpecialCharacters : parameters.passwordMustHaveSpecialCharacters,
      passwordMustHaveLowerCaseLetters : parameters.passwordMustHaveLowerCaseLetters,
      passwordMustHaveUpperCaseLetters : parameters.passwordMustHaveUpperCaseLetters,
      accountLength : parameters.accountLength,
      accountCanHaveNumbers : parameters.accountCanHaveNumbers,
      accountCanHaveUpperCaseLetters : parameters.accountCanHaveUpperCaseLetters,
      accountCanHaveUndescores : parameters.accountCanHaveUndescores,
      maxLoginAttempts : parameters.maxLoginAttempts,
      maxPasswordHistory : parameters.maxPasswordHistory,
      maxInactivityPeriod: parameters.maxInactivityPeriod
    });
  }

  /**
  * Valida que el username tenga las caracteristicas asignadas
  * @param parameters : Parameters objecto de parametros a evaluar
  * @param username : string username a evaluar
  */
  validateUsernameRequirements( parameters : Parameters, username : string ) {
    let errors = [];
    if ( username.length < parameters.accountLength ) {
      errors.push(`La cuenta debe tener al menos ${parameters.accountLength} caracteres`);
    }
    if ( !parameters.accountCanHaveUpperCaseLetters ) {
      if ( /[A-Z]/.test(username) ) {
        errors.push("La cuenta no puede llevar mayúsculas");
      }
    }
    if ( !parameters.accountCanHaveUndescores ) {
      if ( username.indexOf("_") != -1 ) {
        errors.push("El nombre de usuario no puede tener guiones bajos");
      }
    }
    if ( !parameters.accountCanHaveNumbers ) {
      if ( /\d/.test(username) ) {
        errors.push("La cuenta no puede llevar números");
      }
    }
    return errors;
  }

  /**
  * Valida que un password vaya de acuerdo
  * con los parámetros definidos
  * @param parameters : Parameters objecto de parametros a evaluar
  * @param passwordHistory : string[] la lista de contraseñas previas
  * @param password : string el nuevo password
  */
  validatePasswordRequirements( parameters : Parameters, passwordHistory : string[], password : string  ) {
    let errors = [];
    if ( password.length < parameters.passwordLength ) {
      errors.push(`La contraseña debe tener al menos ${parameters.passwordLength} caracteres`);
    }
    if ( parameters.passwordMustHaveUpperCaseLetters ) {
      if ( !/[A-Z]/.test(password) ) {
        errors.push("La contraseña debe tener al menos una letra mayúscula");
      }
    }
    if ( parameters.passwordMustHaveNumbers ) {
      if ( !/\d/.test(password) ) {
        errors.push("La contraseña debe tener al menos un número");
      }
    }
    if ( parameters.passwordMustHaveSpecialCharacters ) {
      if ( !this.checkSpecialCharacters(password) ) {
        errors.push("La contraseña debe tener al menos un carácter especial +-*|,\":<>[]{}`\';()@&$#%");
      }
    }
    if ( passwordHistory.length > 0 ) {
      for ( let i = 0; i<passwordHistory.length && i<parameters.maxPasswordHistory; i++ ) {
        if ( this.securityService.validPassword(password, passwordHistory[i]) ) {
          errors.push(`Debes introducir una contraseña que no hayas usado ${parameters.maxPasswordHistory} veces antes`);
          break;
        }
      }
    }
    return errors;
  }

  private checkSpecialCharacters( password  : string ) {
    var splChars = "+-*|,\":<>[]{}`\';()@&$#%";
    for (var i = 0; i < password.length; i++) {
      if (splChars.indexOf(password.charAt(i)) != -1){
        return true;
      }
    }
    return false;
  }

}
