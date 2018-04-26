import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Parameters } from '../models/Parameters';

@Injectable()
export class ParametersService {

  private parametersList: AngularFireList<any>;

  constructor(private firebase :AngularFireDatabase) {
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

  validatePasswordRequirements( parameters : Parameters, password : string  ) {
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
