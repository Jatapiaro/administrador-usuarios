/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 23-abril-2018
 * Nombre Archivo: password.pipe.ts
 * Archivos relacionados:
    * ./components/users/user.component.html
 * Plataforma: Windows y OsX
   * Descripción: Pipe, le quita al password mostrado las notas
   * de encripción
 * @author jatapiaro
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'password'
})
export class PasswordPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return value.substring(29);
  }

}
