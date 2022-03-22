import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre, PeliculaDetalle, RespuestaCredits, RespuestaMDB } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

const URL = environment.url;
const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private popularesPage: number = 0;
  generos: Genre[] = [];

  constructor(
    private http: HttpClient
  ) { }

  private ejecutaQuery<T>( query: string) {
    query = URL + query;
    query += `&api_key=${ apiKey }&language=es&include_image_language=es`;
    return this.http.get<T>( query );
  }

  getFeatures() {
    const hoy = new Date();
    const ultimoDia = new Date( hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    const mes = hoy.getMonth() + 1;
    let mesString = mes.toString();
    if(mes < 10) {
      mesString = '0' + mes;
    }
    const inicio = `${ hoy.getFullYear() }-${ mesString }-01`;
    const fin = `${ hoy.getFullYear() }-${ mesString }-${ ultimoDia }`;
    return this.ejecutaQuery<RespuestaMDB>(`/discover/movie?primary_release_date.gte=${ inicio }&primary_release_date.lte=${ fin }`);
  }

  getPopular() {
    this.popularesPage++;
    const query = `/discover/movie?sort_by=popularity.desc&api_key=${ apiKey }&language=es&include_image_language=es&page=${ this.popularesPage }`;
    return this.ejecutaQuery<RespuestaMDB>(query);
  }

  getDetallePelicula(id: string) {
    return this.ejecutaQuery<PeliculaDetalle>(`/movie/${id}?a=1`);
  }

  getPeliculaActores(id: string) {
    return this.ejecutaQuery<RespuestaCredits>(`/movie/${id}/credits?a=1`);
  }

  buscarPelicula(txt: string) {
    return this.ejecutaQuery<RespuestaCredits>(`/search/movie?query=${txt}`);
  }

  cargarGeneros(): Promise<Genre[]> {
    return new Promise( resolve => {
      this.ejecutaQuery(`/genre/movie/list?a=1`)
        .subscribe( resp => {
          this.generos = resp['genres'];
          resolve(this.generos);
        });
    })
  }


}
