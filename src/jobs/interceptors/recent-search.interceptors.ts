import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  of,
  tap,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { RecentSearchService } from '../services/recent-search.service';
import { Job } from '../interfaces/job.interface';

@Injectable()
export class RecentSearchInterceptor implements NestInterceptor {
  constructor(private readonly recentSearchService: RecentSearchService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<Job[]>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const { query, token } = request.query;

    const cachedRecentList = this.recentSearchService.findByTokenAndQuery(
      token,
      query,
    );

    if (cachedRecentList.length) {
      console.log('Cached List');
      const recentList = cachedRecentList.reduce(
        (accList: Job[], cachedResult) => {
          accList.push(...cachedResult.list);
          return accList;
        },
        [],
      );
      return of(recentList);
    }

    return next.handle().pipe(
      timeout(5000),
      tap((list: Job[]) => {
        if (token && query?.trim().length) {
          this.recentSearchService.addRecentSerach(token, query, list);
        }
      }),

      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => new ServiceUnavailableException());
      }),
    );
  }
}
