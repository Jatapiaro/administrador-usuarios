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

  getData() {
    return this.logList;
  }

  pushLog(log : Log) {
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
