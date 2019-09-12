import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;

    constructor(private _http: Http){
      this.url = GLOBAL.url;
    }

    signUp(userToLogin, getHash = null){

      if(getHash != null){
        userToLogin.getHash = getHash;
      };

      let json = JSON.stringify(userToLogin);
      let params = json;

      let headers = new Headers({'Content-Type':'application/json'});

      //consulta al metodo login del api
      console.log(this.url+'login');
      return this._http.post(this.url+'login', params, {headers: headers})
        .map(res => res.json());
    }

    getIdentity(){
      let identity = JSON.parse(localStorage.getItem('identity')); //string to js

      if(identity = 'undefined'){
        this.identity = null;
      }
      this.identity = identity;
      return this.identity;
    }

    getToken(){
      let token = JSON.parse(localStorage.getItem('token'));

      if(token = 'undefined'){
        this.token = null;
      }

      this.token = token;
      return this.token;
    }

}
