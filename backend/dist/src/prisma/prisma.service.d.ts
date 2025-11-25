import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    constructor();
    onModuleInit(): Promise<void>;
    findUserByEmail(email: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findUserByPhone(phone: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createUser(params: {
        name: string;
        email: string | null;
        phone: string | null;
        passwordHash: string;
    }): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        name: string;
        createdAt: Date;
    }>;
}
