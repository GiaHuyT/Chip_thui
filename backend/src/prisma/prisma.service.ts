import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Optionally enable detailed logging for development
  constructor() {
    // Create a PG adapter using DATABASE_URL
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? '' });
    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async findUserByEmail(email: string) {
    return this.user.findUnique({ where: { email } });
  }

  async findUserByPhone(phone: string) {
    return this.user.findUnique({ where: { phone } });
  }

  async createUser(params: {
    name: string;
    email: string | null;
    phone: string | null;
    passwordHash: string;
  }) {
    return this.user.create({
      data: params,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  }
}
