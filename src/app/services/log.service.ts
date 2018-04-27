/**
 *
 * Proyecto Final - Seguridad Informática
 * Administrador de usuarios
 * Autor: Jacobo Misael Tapia de la Rosa
 * Matricula: 1336590   Carrera: ITC-11
 * Correo Electronico: A01336590@itesm.mx
 * Fecha de creacion: 23-abril-2018
 * Fecha última modificiacion: 27-abril-2018
 * Nombre Archivo: log.service.ts
 * Archivos relacionados:
    * ./../components/*
    * ./../models/Log.ts
 * Plataforma: Windows y OsX
   * Descripción: Servicio para manejar los datos de las bitácoras en la db
 * @author jatapiaro
 */


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Log } from './../models/Log';
import * as moment from 'moment';

@Injectable()
export class LogService {

  private logList: AngularFireList<any>;

  constructor(private firebase : AngularFireDatabase,
    private http: HttpClient) {
    this.logList = this.firebase.list('logs');
  }

  /**
  * Regresa la lista de logs
  * @return AngularFireList<any>
  */
  getData() {
    return this.logList;
  }

  /**
  * Guarda un log en la db
  * @param log : Log a ser guardado
  */
  pushLog(log : Log) {
    //Obtiene la ip, una vez obtenida guarda el log
    this.http.get('https://jsonip.com').subscribe( data => {
      this.logList.push({
        type: log.type,
        ip: data['ip'],
        username: log.username,
        description: log.description,
        timestamp: moment().unix(),
      });
    })
  }

}
