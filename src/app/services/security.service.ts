import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import * as moment from 'moment';
import { User } from '../models/User';

@Injectable()
export class SecurityService {

  private userList: AngularFireList<any>;
  private users : User[];

  constructor(private firebase :AngularFireDatabase) {
  }

  generatePassword( password : String ) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    //let answ = bcrypt.compareSync("jkljahsdhjksadhjklasdsdfkjdsfjñksdajkladsjkfsjkadsajkfsajkdlsjklafkjdejkljahsdhjksadhjklasdsdfkjdsfjñksdajkladsjkfsjkadsajkfsajkdlsjklafkjdejkljahsdhjksadhjklasdsdfkjdsfjñksdajkladsjkfsjkadsajkfsajkdlsjklafkjde", hash);
    //console.log(salt + " : " +salt.length + " -> "+hash + " : "+answ);
    return hash;
  }

  login( password : string ) {
    this.userList = this.firebase.list('users');

  }

  logout () {
    localStorage.clear();
  }

}
