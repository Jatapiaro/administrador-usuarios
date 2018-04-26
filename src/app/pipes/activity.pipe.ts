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
