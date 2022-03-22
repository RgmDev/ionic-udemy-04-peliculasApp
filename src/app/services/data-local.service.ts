import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PeliculaDetalle } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;
  private peliculas: PeliculaDetalle[] = [];

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController
  ) { 
    this.init();
    this.cargarFavoritos();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  guardarPelicula(pelicula: PeliculaDetalle) {
    let existe = false;
    let mensaje = '';
    for( const peli of this.peliculas ) {
      if(peli.id === pelicula.id) {
        existe = true;
        break;
      }
    }
    if(existe) {
      this.peliculas = this.peliculas.filter( peli => {
        peli.id !== pelicula.id
        mensaje = 'Eliminado de favoritos';
      })
    } else {
      this.peliculas.push(pelicula);
      mensaje = 'Agregado a favoritos';
    }
    this.storage.set('peliculas', this.peliculas);
    this.presentToast(mensaje);

    return !existe;
  }

  async cargarFavoritos() {
    const peliculas = await this.storage.get('peliculas');
    this.peliculas = peliculas || [];
    return this.peliculas;
  }

  async existePeliculas(id) {
    await this.cargarFavoritos();
    const existe = this.peliculas.find( peli => peli.id === id);
    return (existe) ? true : false;   
  }

}
