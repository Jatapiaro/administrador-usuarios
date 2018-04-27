/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: activity.pipe.ts
 * Archivos relacionados:
    * ./components/users/user.component.html
 * Plataforma: Windows y OsX
   * Descripción: Pipe, convierte una fecha en unix a un formato leibe
   *  es decir trnasforma el texto mostrado en un html a algo que queremos
 * @author jatapiaro
 */

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'activity'
})
export class ActivityPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if ( value != 0 ) {
      let date = moment.unix(value).lang('es');
      return date.format('lll');
    }
    return "Sin Actividad";
  }

}
