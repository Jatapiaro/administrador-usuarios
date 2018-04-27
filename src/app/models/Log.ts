/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 27-abril-2018
 * Fecha última modificiacion: 27-abril-2018
 * Nombre Archivo: Users.ts
 * Archivos relacionados:
    * ./services/user.service.ts
    * ./components/users/user.component.ts
    * ./components/users/login.component.ts
 * Plataforma: Windows y OsX
   * Descripción: Modelo de la clase de Logs
 * @author jatapiaro
 */


export class Log {

  /**
  * @param key : string el id del Log
  * @param type : string el tipo de evento
  * @param ip : string la ip desde la que se hizo
  * @param username : string el user que lo hizo
  * @param description : string lo que paso
  * @param timestamp : number unix timestamp de cuando sucedio
  */
  key : string;
  type : string;
  ip : string;
  username : string;
  description : string;
  timestamp : string;

}
