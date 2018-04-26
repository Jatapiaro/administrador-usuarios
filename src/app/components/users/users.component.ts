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
  * @param loaded : boolean si la página ya ha recibido los datos de usuarios
  * @param logedUser : any el id del usuario que está conectado
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
  loaded : boolean;
  logedUser : any;
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
    this.dtOptions = {
      aoColumnDefs: [{ bSortable: false, aTargets: [8] }],
      pagingType: 'first_last_numbers',
      pageLength: 10,
      retrieve: true,
      pagination: true,
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'excelHtml5',
          text: 'Exportar a Excel',
          exportOptions: {
            columns: [ 0, 1 ]
          }
        }
      ],
    };
    this.loaded = false;
  }

  /**
  * Se ejecuta cuando la página carga
  */
  ngOnInit() {

    this.logedUser = this.securityService.getSession();
    console.log(this.logedUser);

    /*if ( !localStorage.getItem('userSession') ) {
      this.logout();
    }*/

    /*
    * Nos suscribimos a la lista de usuarios
    * en dado caso de que haya un cambio
    * actualizamos los datos
    */
    let x = this.userService.getData();
    x.snapshotChanges().subscribe(item => {
      this.loaded = true;
      this.userList = [];
      this.dtTrigger.next();
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["key"] = element.key;
        this.userList.unshift(y as User);
      });
    });
  }

  banUser(index : number) {
    this.userService.banUser(this.userList[index]);
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
    this.validateUserCreationErrors(true);
    if ( this.errors.length == 0 ) {
      if ( this.validateIfUsernameIsNotUsed() ) {
        this.storeUserInFirebase();
      }
    }
  }

  /**
  * Validamos que los datos esten correctos
  */
  validateUserCreationErrors( onCreation : boolean ) {
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
    if ( onCreation ) {
      if ( !this.user.username || this.user.username.length == 0 ) {
        this.errors.push("Debes introducir la cuenta");
      }
      if ( !this.user.password|| this.user.password.length == 0 ) {
        this.errors.push("Debes introducir una contraseña");
      }
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

  updateUser() {
    this.validateUserCreationErrors(false);
    if ( this.errors.length == 0 ) {
      this.updateUserInFirebase();
    }
  }

  /**
  * Actualiza el usuario en la base de datos
  * Además actualiza la última interacción del usuario que realizó
  * la operación
  */
  private updateUserInFirebase() {
    this.userService.updateUser(this.user);
    this.userService.updateUserActivity(this.logedUser);
    this.user = new User();
    this.errors = [];
    jQuery("#update-user-modal").modal("hide");
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
      } else {
        this.displayMe = "none";
      }
    }
  }

  /**
  * Se llama cuando se da click al botón de nuevo usuario
  * desplegando el modal para la creación
  */
  showCreateUserModal() {
    this.user = new User();
    this.errors = [];
    jQuery("#create-user-modal").modal("show");
  }

  /**
  * Se llama cuando se da click al botón de actualizar usuario
  * desplegando el modal para la actualización
  */
  showUpdateUserModal(index : number) {
    this.user = new User();
    /*
    * Copiamos el contenido del usuario deseado
    * en una nueva variable, de este modo, si se cancela
    * la edición no se modifican los datos del usuario listado
    * en la tabla
    */
    let selectedUser = this.userList[index];
    this.user.key = selectedUser.key;
    this.user.username = selectedUser.username;
    this.user.name = selectedUser.name;
    this.user.lastName = selectedUser.lastName;
    this.user.position = selectedUser.position;
    this.user.profile = selectedUser.profile;
    this.errors = [];
    jQuery("#update-user-modal").modal("show");
  }

  logout() {
    this.securityService.logout();
    this.router.navigate(['home']);
  }

}
