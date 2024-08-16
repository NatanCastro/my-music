import { Injectable } from '@nestjs/common';
import SnowFlakify from 'snowflakify';

@Injectable()
export class SnowflakeService {
  private service: SnowFlakify;
  constructor() {
    this.service = new SnowFlakify();
  }

  generateId() {
    return this.service.nextId();
  }

  destructure(snowflakeId: string) {
    return this.service.destructure(snowflakeId);
  }
}
