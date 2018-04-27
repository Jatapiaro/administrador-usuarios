import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { SecurityService } from './security.service';
import { LogService } from './log.service';
import { Log } from './../models/Log';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import * as moment from 'moment';

@Injectable()
export class UserService {

  private userList: AngularFireList<any>;
  private eventoDeAcceso = "Evento de acceso";
  private eventoDeModificacion = "Modificación de usuario";
  private eventoDeCreacion = "Creación de usuario";

  constructor( private firebase :AngularFireDatabase,
    private securityService : SecurityService,
    private logService : LogService) {
    this.userList = this.firebase.list('users');
  }

  logout(user : any) {
    this.userList.update(user.key, {
      isOnline: false,
    });
    this.sendLog(`La cuenta ${user.username} cerró sesión`, user.username, this.eventoDeAcceso);
  }

  logoutUserDueToInactivity( user : any ) {
    this.userList.update(user.key, {
      isOnline: false,
    });
    this.sendLog(`La cuenta ${user.username} cerró sesión debido a inactividad`, user.username, this.eventoDeAcceso);
  }

  banUser( user : User ) {
    this.userList.update(user.key, {
      banedDate: moment().unix(),
      isBaned: true
    });
    let who = this.securityService.getSession();
    this.sendLog(`La cuenta ${who.username} baneo la cuenta ${user.username}`, user.username, this.eventoDeCreacion);
  }

  /**
  * Regresa la lista de usuarios
  * @return userList con los usuarios guardados en la base de datos
  */
  getData() {
    return this.userList;
  }

  insertUser( user : User ) {
    user.passwordHistory = [];
    user.passwordHistory.push(this.securityService.generatePassword(user.password));
    let who = this.securityService.getSession();
    this.sendLog(`La cuenta ${who.username} creo la cuenta ${user.username} con los siguientes datos: [${JSON.stringify(user)}]`, user.username, this.eventoDeCreacion);
    return this.userList.push({
      banedDate: 0,
      blocked: false,
      createdAt: moment().unix(),
      isBaned: false,
      isOnline: false,
      lastActivity: 0,
      lastLogin: 0,
      lastName: user.lastName,
      mustResetPassword: true,
      name: user.name,
      password: user.passwordHistory[0],
      passwordHistory: user.passwordHistory,
      remainingAttempts: user.remainingAttempts,
      position: user.position,
      profile: user.profile,
      username: user.username,
    });
  }

  resetPassword( user : User, password : string, remainingAttempts : number) {
    user.passwordHistory = Object.values(user.passwordHistory);
    user.passwordHistory.unshift(this.securityService.generatePassword(password));
    this.userList.update(user.key, {
      passwordHistory: user.passwordHistory,
      password: user.passwordHistory[0],
      blocked: false,
      remainingAttempts: remainingAttempts,
      mustResetPassword: true,
    });
    let who = this.securityService.getSession();
    this.sendLog(`La cuenta ${who.username} reseteo el password de la cuenta ${user.username}`, user.username, this.eventoDeModificacion);
  }

  unlockUser( user : User, remainingAttempts : number ) {
    this.userList.update(user.key, {
      blocked: false,
      remainingAttempts: remainingAttempts
    });
    let who = this.securityService.getSession();
    this.sendLog(`La cuenta ${who.username} desbloqueo la cuenta ${user.username}`, user.username, this.eventoDeModificacion);
  }

  updateUser( user : User ) {
    this.userList.update(user.key, {
      name: user.name,
      lastName: user.lastName,
      position: user.position,
      profile: user.profile
    });
    let who = this.securityService.getSession();
    this.sendLog(`La cuenta ${who.username} actualizo la cuenta ${user.username}: [${JSON.stringify(user)}]`, user.username, this.eventoDeModificacion);
  }

  updateUserActivity( user : any ) {
    user.lastActivity = moment().unix();
    this.securityService.setSession(user);
    this.userList.update(user.key, {
      lastActivity:  user.lastActivity
    });
  }

  updateUserOnLogin( user : User, remainingAttempts : number ) {
    user.remainingAttempts = remainingAttempts;
    user.passwordHistory = Object.values(user.passwordHistory);
    user.lastLogin = moment().unix();
    user.lastActivity = moment().unix();
    user.isOnline = true;
    this.securityService.setSession(user);
    this.userList.update(user.key, {
      lastActivity:  user.lastActivity,
      lastLogin: user.lastLogin,
      remainingAttempts: user.remainingAttempts,
      isOnline: true,
    });
    this.sendLog(`Inicio de sesión exitoso con la cuenta ${user.username}`, user.username, this.eventoDeAcceso);
  }

  updateUserRemainingAttempts(user : User, remainingAttempts : number ) {
    this.userList.update(user.key, {
      remainingAttempts:remainingAttempts,
    });
  }

  updateUserOnLoginFail( user : User ) {
    user.remainingAttempts = user.remainingAttempts - 1;
    this.userList.update(user.key, {
      remainingAttempts: user.remainingAttempts,
    });
  }

  updateUserAsBlocked( user : User ) {
    this.userList.update(user.key, {
      blocked: true,
      remainingAttempts: 0,
    });
  }

  updateUserPassword( user : any ) {
    if ( user.mustResetPassword ) {
      user.mustResetPassword = false;
    }
    user.passwordHistory.unshift(this.securityService.generatePassword(user.password));
    user.password = user.passwordHistory[0];
    user.lastLogin = moment().unix();
    user.lastActivity = moment().unix();
    this.securityService.setSession(user);
    this.userList.update(user.key, {
      lastLogin: user.lastLogin,
      password: user.passwordHistory[0],
      passwordHistory: user.passwordHistory,
      mustResetPassword: user.mustResetPassword,
      lastActivity: moment().unix(),
    });
    this.sendLog("Se actualizo el password de la cuenta "+user.username+" al ser la primera vez o una recuperación de contraseña", user.username, this.eventoDeAcceso);
  }

  updateUserPasswordSimple( user : any ) {
    user.passwordHistory.unshift(this.securityService.generatePassword(user.password));
    user.password = user.passwordHistory[0];
    user.lastActivity = moment().unix();
    this.securityService.setSession(user);
    this.userList.update(user.key, {
      lastActivity: user.lastActivity,
      password: user.passwordHistory[0],
      passwordHistory: user.passwordHistory,
    });
    this.sendLog("El usuario con cuenta "+user.username+" actualizo su password", user.username, this.eventoDeAcceso);
  }


  private sendLog(description : string, username : string, type : string) {
    let l = new Log();
    l.description = description;
    l.type = type;
    l.username = username;
    this.logService.pushLog(l);
  }

}
