import {
  Global,
  Inject,
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from "@nestjs/common";
import { createDb, type Database } from "@repo/database";
import { DRIZZLE } from "./database.tokens";

function createConnection(): Database | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim().length === 0) {
    Logger.warn(
      "DATABASE_URL is empty; identity persistence is in-memory",
      "DatabaseModule",
    );
    return null;
  }
  return createDb(url);
}

@Injectable()
class DrizzleShutdown implements OnApplicationShutdown {
  constructor(@Inject(DRIZZLE) private readonly db: Database | null) {}

  async onApplicationShutdown(): Promise<void> {
    const client = this.db?.$client;
    if (client && typeof client.end === "function") {
      await client.end();
    }
  }
}

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: createConnection,
    },
    DrizzleShutdown,
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
