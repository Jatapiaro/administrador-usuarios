/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: status.pipe.ts
 * Archivos relacionados:
    * ./components/users/user.component.html
 * Plataforma: Windows y OsX
   * Descripción: Pipe, dado algunos datos del usuario, nos da su status en
   *  el istema
 * @author jatapiaro
 */

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  /**
  * Regresa el estado actual de un usuario
  * @param args : any datos del usuario
  * @param online : boolean si el usuario está en línea
  */
  transform(online: boolean, args:any): string {
    if ( args.isBaned ) {
      return "Dado de baja el " + moment.unix(args.banedDate).lang('es').format('lll');
    }
    if ( args.blocked ) {
      return "Bloqueado";
    }
    return (online)? 'En línea' : 'Desconectado';
  }

}
