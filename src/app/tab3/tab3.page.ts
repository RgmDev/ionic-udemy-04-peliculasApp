import { Component, OnInit } from '@angular/core';
import { Genre, PeliculaDetalle } from '../interfaces/interfaces';
import { DataLocalService } from '../services/data-local.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page{

  peliculas: PeliculaDetalle[] = [];
  generos: Genre[] = [];
  favoritoPorGenero: any[] = [];
  
  constructor(
    private dataLocal: DataLocalService,
    private moviesServices: MoviesService
  ) {}

  async ionViewWillEnter() {
    this.peliculas =  await this.dataLocal.cargarFavoritos();
    this.generos = await this.moviesServices.cargarGeneros();
    this.pelisPorGeneros(this.generos, this.peliculas);
  }

  pelisPorGeneros(generos: Genre[], peliculas: PeliculaDetalle[]) {
    this.favoritoPorGenero = [];
    generos.forEach( genero => {
      this.favoritoPorGenero.push({
        name: genero.name,
        pelis: peliculas.filter( peli => {
          return peli.genres.find(genre => genre.id === genero.id )
        })
      })
    });
  }

}
