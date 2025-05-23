import { Injectable } from '@nestjs/common';
import { JOBS } from './jobs-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JobsService {
  constructor(private readonly configService: ConfigService) {
    const Port = this.configService.get<string>('PORT');
    const ssl = this.configService.get<string>('ssl', 'on');
    console.log(Port);
    console.log(ssl);
  }

  search(query: string) {
    if (!query || !query?.trim().length) {
      return JOBS;
    }

    const searchKey = query.toLowerCase();

    if (!isNaN(+searchKey)) {
      throw new Error('Query key must be a string');
    }

    const jobs = JOBS.filter((job) => {
      const title = job.title.toLowerCase();
      const loc = job.location.toLowerCase();

      return title.includes(searchKey) || loc.includes(searchKey);
    });

    if (searchKey.includes('so')) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(jobs), 7000);
      });
    }

    return jobs;
  }
}
