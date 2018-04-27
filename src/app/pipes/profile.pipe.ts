/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: profile.pipe.ts
 * Archivos relacionados:
    * ./components/users/user.component.html
 * Plataforma: Windows y OsX
   * Descripción: Pipe, de acuerdo al numero de profile, despliega
   *  en la vista si es user o admon
 * @author jatapiaro
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profile'
})
export class ProfilePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return (value == 0)? 'Usuario' : 'Administrador';
  }

}
