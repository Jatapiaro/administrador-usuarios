/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 27-abril-2018
 * Nombre Archivo: Parameters.ts
 * Archivos relacionados:
    * ./services/user.service.ts
    * ./components/user.component.ts
 * Plataforma: Windows y OsX
 * Descripción: Modelo de la clase de parametros
 * @author jatapiaro
 */


export class Parameters {

  /**
  * @param firebaseKeykey : string el id de la configuracion
  * @param passwordLength : number el tamaño minimo del password
  * @param passwordMustHaveNumbers : boolean si el password debe tener al menos un numero
  * @param passwordMustHaveSpecialCharacters : boolean si el password debe tener al menos un caracter especial
  * @param passwordMustHaveLowerCaseLetters : boolean si el password debe tener al menos una letra minuscula
  * @param passwordMustHaveUpperCaseLetters : boolean si el password debe tener al menos una letrra mayuscula

  * @param accountLength : number el tamaño minimo de la cuenta
  * @param accountCanHaveNumbers : boolean si la cuenta puede tener numeros
  * @param accountCanHaveUpperCaseLetters : boolean si la cuenta puede tener mayusculas
  * @param accountCanHaveUndescores : boolean si la cuenta permite undescrores

  * @param maxLoginAttempts : number cuantos intentos tiene para ingresar
  * @param maxPasswordHistory : number cuantos passwords se guardaran
  * @param maxInactivityPeriod : number cuanto tiempo se mantendrá la sesión por inactividad
  */

  firebaseKey : string;

  passwordLength : number = 5;
  passwordMustHaveNumbers : boolean = true;
  passwordMustHaveSpecialCharacters : boolean = true;
  passwordMustHaveLowerCaseLetters : boolean = true;
  passwordMustHaveUpperCaseLetters : boolean = true;

  accountLength : number = 5;
  accountCanHaveNumbers : boolean = true;
  accountCanHaveUpperCaseLetters : boolean = true;
  accountCanHaveUndescores : boolean = true;

  maxLoginAttempts : number = 3;
  maxPasswordHistory : number = 3;
  maxInactivityPeriod : number = 5;

}
