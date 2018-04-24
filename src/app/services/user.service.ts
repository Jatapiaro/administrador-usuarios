import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'

@Injectable()
export class UserService {

  private userList: AngularFireList<any>;

  constructor( private firebase :AngularFireDatabase ) {
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
    this.userList.push({
      name: user.name,
      lastName: user.lastName,
      position: user.position,
      username: user.username,
      password: user.password,
    });
  }

}
