import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { SecurityService } from './security.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import * as moment from 'moment';

@Injectable()
export class UserService {

  private userList: AngularFireList<any>;

  constructor( private firebase :AngularFireDatabase,
    private securityService : SecurityService) {
    this.userList = this.firebase.list('users');
  }

  banUser( user : User ) {
    this.userList.update(user.key, {
      banedDate: moment().unix(),
      isBaned: true
    });
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
      position: user.position,
      profile: user.profile,
      username: user.username,
    });
  }

  updateUser( user : User ) {
    this.userList.update(user.key, {
      name: user.name,
      lastName: user.lastName,
      position: user.position,
      profile: user.profile
    });
  }

  updateUserActivity( user : any ) {
    this.userList.update(user.key, {
      lastActivity:  moment().unix()
    });
  }

  updateUserOnLogin( user : User ) {
    this.userList.update(user.key, {
      lastActivity:  moment().unix(),
      lastLogin: moment().unix(),
      isOnline: true,
    });
  }

  updateUserPassword( user : any ) {
    if ( user.mustResetPassword ) {
      user.mustResetPassword = false;
    }
    user.passwordHistory.unshift(this.securityService.generatePassword(user.password));
    this.securityService.setSession(user);
    this.userList.update(user.key, {
      lastLogin: moment().unix(),
      password: user.passwordHistory[0],
      passwordHistory: user.passwordHistory,
      mustResetPassword: user.mustResetPassword,
    });
  }

}
