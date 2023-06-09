import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { AuthService } from '../api-services/auth.service';
import { environment } from "../../environments/environment";
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor (
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private auth: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let requestParams: any = {};
    if (!/(http(s?)):\/\//i.test(request.url) && request.url.indexOf('assets') == -1) {
      requestParams.url = `${ environment.API_BASE_URL }${ request.url }`;
    }
    if (this.auth.getToken()) {
      requestParams.setHeaders = {
        Authorization: `Bearer ${ this.auth.getToken() }`
      };
    }
    request = request.clone(requestParams);

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('ERROR', error);

        let data = {
          reason: error && error.error && error.error.message ? error.error.message : 'Error al conectar al servidor. Revisa tu conexión a internet.',
          status: error.status
        };
        setTimeout(() => {
          this.presentErrorAlert(data.reason);
        }, 500);
        return throwError(error);
      })
    );

  }

  async presentErrorAlert(message) {
    const alert = await this.alertCtrl.create({
      header: 'Algo salió mal',
      message,
      backdropDismiss: false,
      buttons: [{
        text: 'Aceptar',
        cssClass: 'secondary'
      }]
    });

    alert.present();
  }
}
