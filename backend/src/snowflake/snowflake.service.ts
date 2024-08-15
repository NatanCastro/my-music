import { Injectable } from '@nestjs/common';
import { SnowflakeId } from 'snowflake-id';

@Injectable()
export class SnowflakeService extends SnowflakeId {
  constructor() {
    super();
  }
}
