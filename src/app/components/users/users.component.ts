import { Component, OnInit } from '@angular/core';
import { User } from './../../models/User';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userList : User[];
  color : String;
  displayClass : String;
  leadClass : String;

  constructor( private userService : UserService ) {
    this.color = "my-default-color";
    this.displayClass = `display-4 ${this.color}`;
    this.leadClass = `lead ${this.color}`;
  }

  ngOnInit() {
    /*
    * Nos suscribimos a la lista de usuarios
    * en dado caso de que haya un cambio
    * actualizamos los datos
    */
    var x = this.userService.getData();
    x.snapshotChanges().subscribe(item => {
      this.userList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["key"] = element.key;
        this.userList.push(y as User);
        console.log(this.userList);
      });
    });
  }

  changeJumbotronColor( color : String ) {
    this.color = color;
    this.displayClass = `display-4 ${this.color}`;
    this.leadClass = `lead ${this.color}`;
  }

}
