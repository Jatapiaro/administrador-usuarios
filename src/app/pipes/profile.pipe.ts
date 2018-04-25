import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profile'
})
export class ProfilePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return (value == 0)? 'Usuario' : 'Administrador';
  }

}
