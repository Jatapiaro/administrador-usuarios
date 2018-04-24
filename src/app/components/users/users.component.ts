/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: user.component.ts
 * Archivos relacionados:
    * ./user.component.css
    * ./user.component.html
 * Plataforma: Windows y OsX
 * Descripción: Controlador para el componente de usuarios
 * @author jatapiaro
 */

import { Component, OnInit } from '@angular/core';
import { User } from './../../models/User';
import { UserService } from './../../services/user.service';
import { Subject } from 'rxjs/Subject';
declare var jQuery : any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  /**
  * @param color : string variable para guardar el color del que debe verse el jumbotron
  * @param displayClass : string texto con las clases que se van a bindear al texto grande del jumbotron
  * @param displayMe : string para indicar el valor de la propiedad style.display
  * @param dtOptions : DataTables.Settings
  * @param dtTrigger : Subject<Any> variable auxiliar para que se recarge la tabla cuando hay cambios o nuevos items
  * @param leadClass : string texto con las clases que se van a bindear al texto pequeño del jumbotron
  * @param showAdministrator : boolean indica si el administrador debe ser abierto
  * @param userList : User[] lista de usuarios
  */
  color : string;
  displayClass : string;
  displayMe : string;
  dtOptions: DataTables.Settings;
  dtTrigger: Subject<any>;
  leadClass : string;
  showAdministrator : boolean;
  user : User;
  userList : User[];

  /**
  * Constructor
  * @param userService : UserService servicio para hacer las operaciones CRUD de usuarios
  */
  constructor( private userService : UserService ) {
    this.color = "my-default-color";
    this.displayClass = `display-4 ${this.color}`;
    this.leadClass = `lead ${this.color}`;
    this.dtOptions = {};
    this.dtTrigger = new Subject();
    this.showAdministrator = false;
    this.displayMe = "none";
    this.user = new User();
  }

  /**
  * Se ejecuta cuando la página carga
  */
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'first_last_numbers',
      pageLength: 10,
    };
    /*
    * Nos suscribimos a la lista de usuarios
    * en dado caso de que haya un cambio
    * actualizamos los datos
    */
    var x = this.userService.getData();
    x.snapshotChanges().subscribe(item => {
      this.userList = [];
      this.dtTrigger.next();
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["key"] = element.key;
        this.userList.push(y as User);
        console.log(this.userList);
      });
    });
  }

  /**
  * Cambia el color de texto del jumbotron
  * @param color : string nuevo color
  */
  changeJumbotronColor( color : string ) {
    this.color = color;
    this.displayClass = `display-4 ${this.color}`;
    this.leadClass = `lead ${this.color}`;
    this.toggleAdministrationPanel(false);
  }

  createUser() {
    this.userService.insertUser(this.user);
    this.user = new User();
    jQuery("#create-user-modal").modal("hide");
  }

  /**
  * Muestra u oculta el panel de administración
  * @param show : boolean si debe mostrarse o no
  */
  toggleAdministrationPanel( show : boolean ) {
    //Solo cambiamos cuando es distinto
    if ( this.showAdministrator != show  ) {
      this.showAdministrator = show;
      if ( this.showAdministrator ) {
        this.displayMe = "block";
      } else {
        this.displayMe = "none";
      }
    }
  }

  showCreateUserModal() {
    this.user = new User();
    jQuery("#create-user-modal").modal("show");
  }

}
