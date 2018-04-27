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
import { Parameters } from './../../models/Parameters';
import { UserService } from './../../services/user.service';
import { SecurityService } from './../../services/security.service';
import { ParametersService } from './../../services/parameters.service';
import { Subject } from 'rxjs/Subject';
import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";
import * as moment from 'moment';
declare var jQuery : any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  /**
  * @param color : string variable para guardar el color del que debe verse el jumbotron
  * @param currentPassword : string variable con el password actual apra actualizar
  * @param displayClass : string texto con las clases que se van a bindear al texto grande del jumbotron
  * @param displayMe : string para indicar el valor de la propiedad style.display
  * @param dtOptions : any
  * @param dtTrigger : Subject<Any> variable auxiliar para que se recarge la tabla cuando hay cambios o nuevos items
  * @param errors : string[] arreglo con errores para desplegar en caso de ser necesario
  * @param leadClass : string texto con las clases que se van a bindear al texto pequeño del jumbotron
  * @param loaded : boolean si la página ya ha recibido los datos de usuarios
  * @param logedUser : any el id del usuario que está conectado
  * @param messages : string[] mensajes auxiliares
  * @param messagesP : string[] mensajes para paramteros
  * @param parameters : Parameters lista de parametros de cuenta y contraseña
  * @param parametersAux : Parameters lista de parametros de cuenta y contraseña auxiliar
  * @param password : string variable para cambiar o restear password
  * @param passwordReset : string variable para cambiar o resetear password y confirmar
  * @param showAdministrator : boolean indica si el administrador debe ser abierto
  * @param user : User modelo para hacer el binding de datos
  * @param userList : User[] lista de usuarios
  */
  color : string;
  currentPassword : string;
  displayClass : string;
  displayMe : string;
  dtOptions: any;
  dtTrigger: Subject<any>;
  errors : string[];
  leadClass : string;
  loaded : boolean;
  logedUser : any;
  messages : string[];
  messagesP : string[];
  parameters : Parameters;
  parametersAux : Parameters;
  password : string;
  passwordConfirmation : string;
  showAdministrator : boolean;
  user : User;
  userList : User[];

  public subscription : ISubscription;
  public subscription2 : ISubscription;
  public once : boolean;

  /**
  * Constructor
  * @param userService : UserService servicio para hacer las operaciones CRUD de usuarios
  */
  constructor( private userService : UserService,
    private securityService : SecurityService,
    private router : Router,
    private parametersService : ParametersService) {

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
            columns: [ 0, 1, 2, 3, 4, 5, 6, 7 ]
          }
        }
      ],
    };
    this.loaded = false;
    this.parametersAux = new Parameters();
    this.errors = [];
    this.user = new User();
    this.user.profile = 0;
    this.messagesP = [];
    this.messages = [];
    this.password = "";
    this.passwordConfirmation = "";
    this.currentPassword = "";
    this.once = true;
  }

  /**
  * Se ejecuta cuando la página carga
  */
  ngOnInit() {

    if ( !localStorage.getItem('userSession') ) {
      this.logout();
    } else {
      this.logedUser = this.securityService.getSession();
    }

    /*
    * Nos suscribimos a la lista de usuarios
    * en dado caso de que haya un cambio
    * actualizamos los datos
    */
    let x = this.userService.getData();
    this.subscription = x.snapshotChanges().subscribe(item => {
      this.loaded = true;
      this.userList = [];
      this.dtTrigger.next();
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["key"] = element.key;
        this.userList.unshift(y as User);
      });
    });

    var w = this.parametersService.getParametersList();
    this.subscription2 = w.snapshotChanges().subscribe(item => {
      let parametersList = [];
      item.forEach(element => {
        var z = element.payload.toJSON();
        z["firebaseKey"] = element.key;
        parametersList.push(z as Parameters);
      });
      if ( parametersList.length == 0 ) {
        this.parametersService.uploadFirstParameters();
      } else {
        this.parameters = parametersList[0];
        if ( this.once ) {
          this.once = false;
          this.checkInactivity();
        }
      }
    });

  }

  ngOnDestroy() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
    if ( this.subscription2 ) {
      this.subscription2.unsubscribe();
    }
  }


  /*--------------------------------
  * Métodos para crear usuario
  * --------------------------------*/

  /**
  * Se llama cuando se da click en el botón para crear
  * un usuario en el modal de creación
  */
  createUser() {
    this.validateUserCreationErrors(true);
    if ( this.errors.length == 0 ) {
      if ( this.validateIfUsernameIsNotUsed() ) {
        this.errors = this.parametersService.validateUsernameRequirements(this.parameters, this.user.username);
        if ( this.errors.length == 0 ) {
          this.errors = this.parametersService.validatePasswordRequirements(this.parameters,
            this.user.passwordHistory,
            this.user.password);
          if ( this.errors.length == 0 ) {
            this.storeUserInFirebase();
          }
        }
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
    for ( let user of this.userList ) {
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
    this.user.remainingAttempts = this.parameters.maxLoginAttempts;
    this.userService.insertUser(this.user);
    this.user = new User();
    this.errors = [];
    jQuery("#create-user-modal").modal("hide");
  }



  /*--------------------------------
  * Métodos para actualizar usuario
  * --------------------------------*/

  /**
  * Se llama cuando se da click al botón de nuevo usuario
  * desplegando el modal para la creación
  */
  showCreateUserModal() {
    this.user = new User();
    this.user.passwordHistory = [];
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


  /*--------------------------------
  * Métodos para modificar password
  * --------------------------------*/

  /**
  * Se llama cuando se da click al botón de cambiar contraseña
  * desplegando el modal para el cambio
  */
  showChangePasswordModal() {
    this.logedUser = this.securityService.getSession();
    this.errors = [];
    this.password = "";
    this.currentPassword = "";
    this.passwordConfirmation = "";
    jQuery("#change-password-modal").modal("show");
  }

  changePassword() {
    this.errors = [];
    if ( this.currentPassword.length == 0 ) {
      this.errors.push("Debes ingresar tu password actual");
    }
    if ( this.password.length == 0 ) {
      this.errors.push("Debes ingresar el nuevo password");
    }
    if ( this.passwordConfirmation.length == 0 ) {
      this.errors.push("Debes ingresar la confirmación del nuevo password");
    }
    if ( this.password != this.passwordConfirmation ) {
      this.errors.push("El nuevo password y su confirmación no coinciden");
    }
    if ( this.errors.length == 0 ) {
      let valid = this.securityService.validPassword(this.currentPassword, this.logedUser.password);
      if ( valid ) {
        this.errors = this.parametersService.validatePasswordRequirements(
          this.parameters,
          this.logedUser.passwordHistory,
          this.password
        );
        for ( let er of this.errors ) {
          er = er.replace("La contraseña", "La nueva contraseña ");
        }
        if ( this.errors.length == 0 ) {
          this.logedUser.password = this.password;
          this.userService.updateUserPasswordSimple(this.logedUser);
          this.pushMessage("La contraseña se ha cambiado exitosamente");
          jQuery("#change-password-modal").modal("hide");
        }
      } else {
        this.errors.push("Tu password actual no es correcto");
      }
    }
  }

  /**
  * Se llama cuando se da click al botón de cambiar contraseña
  * desplegando el modal para el cambio
  */
  showResetPasswordModal(index : number) {
    this.user = new User();
    this.user = this.userList[index];
    this.user.passwordHistory = Object.values(this.user.passwordHistory);
    this.errors = [];
    this.password = "";
    this.passwordConfirmation = "";
    jQuery("#reset-password-modal").modal("show");
  }

  resetPassword() {
    this.errors = [];
    if ( this.password.length == 0 ) {
      this.errors.push("Debes ingresar el nuevo password");
    }
    if ( this.passwordConfirmation.length == 0 ) {
      this.errors.push("Debes ingresar la confirmación del nuevo password");
    }
    if ( this.password != this.passwordConfirmation ) {
      this.errors.push("El nuevo password y su confirmación no coinciden");
    }
    if ( this.errors.length == 0 ) {
      this.errors = this.parametersService.validatePasswordRequirements(
        this.parameters,
        this.user.passwordHistory,
        this.password
      );
      console.log(this.errors);
      console.log(this.user.passwordHistory);
      if ( this.errors.length == 0 ) {
        this.logedUser.password = this.password;
        this.userService.resetPassword(this.user, this.password, this.parameters.maxLoginAttempts);
        this.pushMessage("La contraseña se ha reseteado");
        jQuery("#reset-password-modal").modal("hide");
      }
    }
  }

  /*--------------------------------
  * Métodos para modificar parametros
  * --------------------------------*/

  saveParametersData() {
    this.errors = [];
    this.messagesP = [];
    if ( !Number.isInteger(this.parametersAux.accountLength) ) {
      this.errors.push("El tamaño de la cuenta debe ser un número entero");
    }
    if ( this.parametersAux.accountLength < 5 || this.parametersAux.accountLength > 16 ) {
      this.errors.push("El tamaño de la cuenta debe estar entre 5 y 16");
    }
    if ( !Number.isInteger(this.parametersAux.passwordLength) ) {
      this.errors.push("El tamaño de la contraseña debe ser un número entero");
    }
    if ( this.parametersAux.passwordLength < 5 || this.parametersAux.passwordLength > 12 ) {
      this.errors.push("El tamaño de la contraseña debe estar entre 5 y 12");
    }
    if ( !Number.isInteger(this.parametersAux.maxPasswordHistory) ) {
      this.errors.push("El número histórico de contraseñas debe ser un entero");
    }
    if ( this.parametersAux.maxPasswordHistory <= 0 ) {
      this.errors.push("El número histórico de contraseñas debe de almenos 1");
    }
    if ( !Number.isInteger(this.parametersAux.maxLoginAttempts) ) {
      this.errors.push("El número de intentos de acceso debe ser un entero");
    }
    if ( this.parametersAux.maxLoginAttempts <= 0 ) {
      this.errors.push("El número de intentos de acceso debe ser de almenos 1");
    }
    if ( !Number.isInteger(this.parametersAux.maxInactivityPeriod) ) {
      this.errors.push("El número de minutos de inactivdad debe ser un entero");
    }
    if ( this.parametersAux.maxInactivityPeriod <= 0 ) {
      this.errors.push("El número de minutos de inactividad debe ser al menos de 1");
    }
    if ( this.errors.length == 0 ) {
      this.updateParametersInFirebase();
    }
  }

  updateParametersInFirebase() {
    this.parametersService.updateParameters(this.parametersAux);
    this.pushMessage("Los parámetros han sido actualizados");
    jQuery("#parameters-modal").modal("hide");
    for ( let user of this.userList ) {
      this.userService.updateUserRemainingAttempts(user, this.parametersAux.maxLoginAttempts);
    }
  }

  showParametersModal() {
    this.errors = [];
    this.messagesP = [];
    this.setParametersAuxData();
    jQuery("#parameters-modal").modal("show");
  }

  private setParametersAuxData() {
    this.parametersAux = new Parameters();
    this.parametersAux.firebaseKey = this.parameters.firebaseKey;
    this.parametersAux.accountCanHaveNumbers = this.parameters.accountCanHaveNumbers;
    this.parametersAux.accountCanHaveUndescores = this.parameters.accountCanHaveUndescores;
    this.parametersAux.accountCanHaveUpperCaseLetters = this.parameters.accountCanHaveUpperCaseLetters;
    this.parametersAux.accountLength = this.parameters.accountLength;
    this.parametersAux.maxLoginAttempts = this.parameters.maxLoginAttempts;
    this.parametersAux.maxPasswordHistory = this.parameters.maxLoginAttempts;
    this.parametersAux.passwordLength = this.parameters.passwordLength;
    this.parametersAux.passwordMustHaveLowerCaseLetters = this.parameters.passwordMustHaveLowerCaseLetters;
    this.parametersAux.passwordMustHaveNumbers = this.parameters.passwordMustHaveNumbers;
    this.parametersAux.passwordMustHaveSpecialCharacters = this.parameters.passwordMustHaveSpecialCharacters;
    this.parametersAux.passwordMustHaveUpperCaseLetters = this.parameters.passwordMustHaveUpperCaseLetters;
    this.parametersAux.maxInactivityPeriod = this.parameters.maxInactivityPeriod;
  }

  /*--------------------------------
  * Métodos auxiliares
  * --------------------------------*/

  unlockUser( index : number ) {
    let user = this.userList[index];
    this.userService.unlockUser(user, this.parameters.maxLoginAttempts);
  }

  logout() {
    console.log(this.parameters);
    this.userService.logout(this.logedUser);
    this.securityService.logout();
    this.router.navigate(['home']);
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

  pushMessage( message : string ) {
    this.messages = [];
    this.messages.push(message);
    setTimeout(() => {
      this.messages = [];
    }, 2500);
  }

  /**
  * Verifica si el usuario ya está inactivo
  * para cerrar su sesión
  */
  private checkInactivity() {
    this.logedUser = this.securityService.getSession();
    let lastActivity = moment.unix(this.logedUser.lastActivity);
    let now = moment(new Date());
    if ( now.diff(lastActivity, 'minutes') >= this.parameters.maxInactivityPeriod ) {
      console.log("cerrar sesión -> diferencia: "+now.diff(lastActivity, 'minutes'));
      this.userService.logoutUserDueToInactivity(this.logedUser);
      this.securityService.logout();
      jQuery("#inactivity-dialog").modal("show");
    }
    setTimeout(() => {
      this.checkInactivity();
    }, 60000);
  }

}
