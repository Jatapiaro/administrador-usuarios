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
