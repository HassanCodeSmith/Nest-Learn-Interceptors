import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { JobsService } from '../services/jobs.service';
import { RecentSearchService } from '../services/recent-search.service';
import { RecentSearchInterceptor } from '../interceptors/recent-search.interceptors';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly recentSearchService: RecentSearchService,
  ) {}

  @Get('search')
  @UseInterceptors(RecentSearchInterceptor)
  search(@Query('query') query: string) {
    // throw new Error('Something went wrong.');
    if (query?.length > 5) {
      throw new Error('Query key lenght cannot be higher than 5');
    }

    return this.jobsService.search(query || '');
  }

  @Get('recent-search')
  public getRecentSearch(@Query('token') token: string) {
    return this.recentSearchService.find(token);
  }
}
