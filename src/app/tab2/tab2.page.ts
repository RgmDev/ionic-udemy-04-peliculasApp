import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../components/detalle/detalle.component';
import { Pelicula } from '../interfaces/interfaces';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  textoBuscar = '';
  ideas: string[] = ['Spiderman', 'Avengers', 'El señor de los anillos', 'Dirty Dancing'];
  peliculas: Pelicula[] = [];
  searching: boolean = false;

  constructor(
    private moviesService: MoviesService,
    private modalCtrl: ModalController
  ) {}

  buscar(event) {
    const txt = event.detail.value;
    if(!txt){
      this.peliculas = [];
      return;
    }
    this.searching = true;
    this.moviesService.buscarPelicula(txt)
      .subscribe( resp => {
        console.log(resp)
        this.peliculas = resp['results'];
        this.searching = false;
      })
  }

  async verDetalle(id: string) { 
    const modal = await this.modalCtrl.create({
      component: DetalleComponent,
      componentProps: {
        id
      }
    });
    modal.present();
  }

}
