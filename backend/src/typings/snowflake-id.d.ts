declare module 'snowflake-id' {
  export declare class SnowflakeId {
    constructor(
      options: {
        seq?: number;
        mid?: number;
        offset?: number;
      } = {},
    );
    generate(): string;
  }
}
