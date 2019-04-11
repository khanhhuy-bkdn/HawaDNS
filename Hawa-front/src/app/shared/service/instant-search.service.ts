import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import { SessionService } from "./session.service";
import { ApiService } from "./api.service";
@Injectable()
export class InstantSearchService {
    constructor(
        private apiService: ApiService,
    ) { }

    search(baseUrl: string, terms: Observable<string>) {
        return terms
            .pipe(
                debounceTime(600),
                distinctUntilChanged()
            )
            .switchMap(term => this.searchEntries(baseUrl + term));
    }

    searchWithFilter(
        baseUrl: string,
        terms: Observable<string>,
        urlFilterParams: URLSearchParams
    ) {
        return terms
            .debounceTime(600)
            .distinctUntilChanged()
            .switchMap(term => {
                return this.searchEntries(baseUrl + term, urlFilterParams)
            }
            );
    }

    searchEntries(
        url: string,
        urlFilterParams: URLSearchParams = new URLSearchParams()
    ) {
        return this.apiService
            .get(url, urlFilterParams)
            .map(response => response.result);
    }
}
