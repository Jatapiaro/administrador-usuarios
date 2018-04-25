/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: user.ts
 * Archivos relacionados:
    * ./services/user.service.ts
    * ./components/user.component.ts
 * Plataforma: Windows y OsX
 * Descripción: Modelo de la clase usuario
 * @author jatapiaro
 */


export class User {
  /**
  * @param blocked : boolean si la cuenta esta bloqueada
  * @param createdAt : number timestamp en unix con la fecha y hora de creación
  * @param isOnline : boolean si la cuenta esta siendo usada
  * @param key : string el id del usuario
  * @param lastActivity : number unix timestamp con la fecha de última actividad del usuario
  * @param lastName : string apellido del usuario
  * @param mustResetPassword : boolean si el usuario debe cambiar su contraseña al iniciar sesión
  * @param name : string nombre del usuario
  * @param password : string contraseña actual
  * @param passwordHistory : string[] lista de las constraseñas que se han usado para esta cuenta
  * @param position : string el puesto del usuario
  * @param profile : number si es admin o usuario
  * @param username : string el username del usuario
  */
  blocked : boolean
  createdAt : number;
  isOnline : string;
  key : string;
  lastActivity : number;
  lastName : string;
  mustResetPassword : boolean;
  name : string;
  password : string;
  passwordHistory : string[];
  position : string;
  profile : number;
  username : string;
}
