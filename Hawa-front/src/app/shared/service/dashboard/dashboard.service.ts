import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Statistic } from '../../model/dashboard/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private apiService: ApiService
  ) { }

  // mapping thống kê cơ bản
  mappingStatistic(result: any): Statistic {
    return {
      volume: result.volume,
      area: result.area,
      actorCount: result.actorCount,
      reviewCount: result.reviewCount,
    }
  }

  // Thống kê cơ bản
  getStatistic(): Observable<Statistic> {
    const url = `statistic`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingStatistic(result);
    })
  }
}
