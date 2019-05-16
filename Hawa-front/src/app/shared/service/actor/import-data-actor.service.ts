import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ImportDataActorService {

  constructor(
    private apiService: ApiService,
  ) { }

  importDataActor(file: File) {
    const url = `import/actor`;
    const formData = new FormData();
    formData.append('File', file);
    return this.apiService.postFile(url, formData)
      .map(response => (response && response.result) && {
        importRows: response.result.importRows,
        updateRows: response.result.updateRows,
      });
      // .share();
  }
}
