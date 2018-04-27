/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 27-abril-2018
 * Nombre Archivo: user.service.ts
 * Archivos relacionados:
    * ./../components/*
    * ./../models/User.ts
 * Plataforma: Windows y OsX
   * Descripción: Servicio para encryptar y manejar sesion
 * @author jatapiaro
 */

import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as moment from 'moment';
import { User } from '../models/User';

@Injectable()
export class SecurityService {

  private userList: AngularFireList<any>;

  constructor(private firebase :AngularFireDatabase) {
  }

  /**
  * Guarda la sesión
  * @param user : any el usuario que se va a guardar como sesión
  */
  setSession( user : any ) {
    localStorage.setItem('userSession', JSON.stringify(user));
  }

  /**
  * Regresa el objeto de sesión
  * @return el usuario de sesión
  */
  getSession() {
    if ( localStorage.getItem('userSession') ) {
      return JSON.parse(localStorage.getItem('userSession'));
    }
  }

  /**
  * Genera un nuevo password encriptado
  * utilizando bcrypt con 10 vueltas
  * @param password : string el password a regresar
  * @return password encriptado con su salt
  */
  generatePassword( password : String ) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  /**
  * Verifica que un usuario exista usando su username
  * @param username : string el username a buscar
  * @return boolean si existe el usuario en la bd
  */
  verifyIfUserExists( username : string ) {
    return this.userList = this.firebase.list('users', ref =>
      ref.orderByChild('username').equalTo(username));
  }

  /**
  * Valida que un password ingresado sea correcto y coincida con el de la bd
  * @param password : string el password ingresado
  * @param userPassword : string el password cifrado guardado en la bd
  * @return boolean si el password coincide
  */
  validPassword( password : string, userPassword : string ) {
    let salt = userPassword.substring(0, 29);
    let validPassword = bcrypt.compareSync(password, userPassword);
    return validPassword;
  }

  /**
  * Valida que un password ingresado sea correcto y coincida con el de la bd
  * @param user : User el usuario que quiere ingresar
  * @param password : string el password ingresado
  * @return boolean si puede ngresar al sistema
  */
  verifyIfPasswordIsCorrect( user : User, password : string ) {
    let validPassword = this.validPassword(password, user.password);
    if ( validPassword ) {
      localStorage.setItem('userSession', JSON.stringify(user));
    }
    return validPassword;
  }

  /**
  * Limpia la sesión
  */
  logout () {
    localStorage.clear();
  }

}
