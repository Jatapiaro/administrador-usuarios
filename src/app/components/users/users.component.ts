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
import { Router } from '@angular/router';
import { User } from './../../models/User';
import { UserService } from './../../services/user.service';
import { SecurityService } from './../../services/security.service';
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
  * @param dtOptions : any
  * @param dtTrigger : Subject<Any> variable auxiliar para que se recarge la tabla cuando hay cambios o nuevos items
  * @param errors : string[] arreglo con errores para desplegar en caso de ser necesario
  * @param leadClass : string texto con las clases que se van a bindear al texto pequeño del jumbotron
  * @param showAdministrator : boolean indica si el administrador debe ser abierto
  * @param user : User modelo para hacer el binding de datos
  * @param userList : User[] lista de usuarios
  */
  color : string;
  displayClass : string;
  displayMe : string;
  dtOptions: any;
  dtTrigger: Subject<any>;
  errors : string[];
  leadClass : string;
  showAdministrator : boolean;
  user : User;
  userList : User[];

  /**
  * Constructor
  * @param userService : UserService servicio para hacer las operaciones CRUD de usuarios
  */
  constructor( private userService : UserService,
    private securityService : SecurityService,
    private router : Router) {
    this.color = "my-default-color";
    this.displayClass = `display-4 ${this.color}`;
    this.leadClass = `lead ${this.color}`;
    this.dtOptions = {};
    this.dtTrigger = new Subject();
    this.errors = [];
    this.showAdministrator = false;
    this.displayMe = "none";
    this.user = new User();
  }

  /**
  * Se ejecuta cuando la página carga
  */
  ngOnInit() {

    /*if ( !localStorage.getItem('userSession') ) {
      this.logout();
    }*/

    this.dtOptions = {
      pagingType: 'first_last_numbers',
      pageLength: 10,
      retrieve: true,
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        'excel'
      ]
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
        this.userList.unshift(y as User);
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

  /**
  * Se llama cuando se da click en el botón para crear
  * un usuario en el modal de creación
  */
  createUser() {
    this.validateUserCreationErrors();
    if ( this.errors.length == 0 ) {
      if ( this.validateIfUsernameIsNotUsed() ) {
        this.storeUserInFirebase();
      }
    }
  }

  /**
  * Validamos que los datos esten correctos
  */
  validateUserCreationErrors() {
    this.errors = [];
    if ( !this.user.name || this.user.name.length == 0 ) {
      this.errors.push("Debes introducir el nombre");
    }
    if ( !this.user.lastName || this.user.lastName.length == 0 ) {
      this.errors.push("Debes introducir el apellido");
    }
    if ( !this.user.position || this.user.position.length == 0 ) {
      this.errors.push("Debes introducir el puesto");
    }
    if ( !this.user.profile ) {
      this.errors.push("Debes seleccionar un tipo de perfil");
    }
    if ( !this.user.username || this.user.username.length == 0 ) {
      this.errors.push("Debes introducir la cuenta");
    }
    if ( !this.user.password|| this.user.password.length == 0 ) {
      this.errors.push("Debes introducir una contraseña");
    }
  }

  /**
  * Checamos que el username no este siendo usado
  */
  validateIfUsernameIsNotUsed() {
    for ( let user of  this.userList ) {
      if ( this.user.username == user.username ) {
        this.errors.push("La cuenta ya está siendo usada");
        return false;
      }
    }
    return true;
  }

  /**
  * Envía el usuario a firebase
  */
  storeUserInFirebase() {
    this.userService.insertUser(this.user);
    this.user = new User();
    this.errors = [];
    jQuery("#create-user-modal").modal("hide");
  }

  /**
  * Muestra u oculta el panel de administración
  * @param show : boolean si debe mostrarse o no
  */
  toggleAdministrationPanel( show : boolean ) {
    if ( this.showAdministrator != show  ) {
      this.showAdministrator = show;
      if ( this.showAdministrator ) {
        this.displayMe = "block";
        jQuery(".buttons-excel").each(function() {
          $(this).html("Exportar a Excel");
        });
      } else {
        this.displayMe = "none";
      }
    }
  }

  /**
  * Se llama cuando se da clcik al botón de nuevo usuario
  * desplegando el modal para la creación
  */
  showCreateUserModal() {
    this.user = new User();
    this.errors = [];
    jQuery("#create-user-modal").modal("show");
  }

  logout() {
    this.securityService.logout();
    this.router.navigate(['home']);
  }

}
