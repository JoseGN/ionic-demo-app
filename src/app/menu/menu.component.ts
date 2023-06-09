import { Component, OnInit } from '@angular/core';
import { AuthService } from '../api-services/auth.service';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from '../api-services/storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  loginType: string;
  constructor (
    private auth: AuthService,
    private storage: StorageService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.loginType = await this.storage.getUserType();
  }

  public async navigateHome() {
    const userType = await this.storage.getUserType();
    let home = userType == 'therapist' ? 'home-therapist' : 'home';
    this.navCtrl.navigateBack(home);
  }

  public logout() {
    this.auth.logout();
    // this.auth.authenticationState.unsubscribe();
    this.navCtrl.navigateRoot('welcome');
  }

  public async presentLogoutAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Deseas cerrar tu sesión de MentalHealth?',
      backdropDismiss: false,
      buttons: [{
        text: 'Aceptar',
        cssClass: 'text-secondary',
        handler: () => this.logout()
      }, {
        text: 'Cancelar',
        cssClass: 'primary'
      }]
    });

    alert.present();
  }

}
