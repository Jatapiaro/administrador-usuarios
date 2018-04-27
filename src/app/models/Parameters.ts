/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: Parameters.ts
 * Archivos relacionados:
    * ./services/user.service.ts
    * ./components/user.component.ts
 * Plataforma: Windows y OsX
 * Descripción: Modelo de la clase de parametros
 * @author jatapiaro
 */


export class Parameters {

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
