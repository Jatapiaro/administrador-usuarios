import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SecurityService {

  constructor() { }

  generatePassword( password : String ) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    //let answ = bcrypt.compareSync("jkljahsdhjksadhjklasdsdfkjdsfjñksdajkladsjkfsjkadsajkfsajkdlsjklafkjdejkljahsdhjksadhjklasdsdfkjdsfjñksdajkladsjkfsjkadsajkfsajkdlsjklafkjdejkljahsdhjksadhjklasdsdfkjdsfjñksdajkladsjkfsjkadsajkfsajkdlsjklafkjde", hash);
    //console.log(salt + " : " +salt.length + " -> "+hash + " : "+answ);
    return hash;
  }

  logout () {
    localStorage.clear();
  }

}
