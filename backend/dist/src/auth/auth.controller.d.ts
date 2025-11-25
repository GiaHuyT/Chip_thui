import { PrismaService } from '../prisma/prisma.service.js';
declare class RegisterDto {
    name: string;
    email?: string;
    phone?: string;
    password: string;
}
declare class LoginDto {
    identifier: string;
    password: string;
}
declare class ForgotDto {
    email?: string;
    phone?: string;
}
export declare class AuthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(body: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            name: string;
            createdAt: Date;
        };
    }>;
    login(body: LoginDto): Promise<{
        error: string;
        message?: undefined;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: string;
            name: string;
        };
        error?: undefined;
    }>;
    forgot(body: ForgotDto): {
        message: string;
    };
}
export {};
