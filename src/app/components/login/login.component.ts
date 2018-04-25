import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersComponent } from './../users/users.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public username : string;
  public password : string;

  constructor( private router : Router ) { }

  ngOnInit() {

  }

  goToUsers() {
    this.router.navigate(['users']);
  }

}
