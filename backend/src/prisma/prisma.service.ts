
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const adapter = connectionString ? new PrismaPg(new Pool({ connectionString })) : undefined;
    super(adapter ? { adapter } as any : undefined);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
