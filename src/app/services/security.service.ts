import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import * as moment from 'moment';
import { User } from '../models/User';

@Injectable()
export class SecurityService {

  private userList: AngularFireList<any>;

  constructor(private firebase :AngularFireDatabase) {
  }

  generatePassword( password : String ) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  verifyIfUserExists( username : string ) {
    return this.userList = this.firebase.list('users', ref =>
      ref.orderByChild('username').equalTo(username));
  }

  verifyIfPasswordIsCorrect( user : User, password : string ) {
    let salt = user.password.substring(0, 29);
    let validPassword = bcrypt.compareSync(password, user.password);
    if ( validPassword ) {
      localStorage.setItem('userSession', JSON.stringify(user));
    }
    return validPassword;
  }

  logout () {
    localStorage.clear();
  }

}
