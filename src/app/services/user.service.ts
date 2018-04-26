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
      blocked: false,
      createdAt: moment().unix(),
      isOnline: false,
      lastActivity: 0,
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
      lastActivity:  moment().unix(),
      isOnline: true,
    });
  }

}
