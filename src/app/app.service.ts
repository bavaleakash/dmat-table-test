import { Injectable } from '@angular/core';
import * as file1 from '../assets/movies';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    movies: any;

    constructor() {
        this.movies = [...file1.movies];
    }

    getAllMovies() {
        return this.movies;
    }

    getMovieById(id) {
        return this.movies.find(m => id === m.id.toString());
    }
}
