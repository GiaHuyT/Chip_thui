"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const class_validator_1 = require("class-validator");
class RegisterDto {
    name;
    email;
    phone;
    password;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{9,12}$/),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
class LoginDto {
    identifier;
    password;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class ForgotDto {
    email;
    phone;
}
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.phone),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.email),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{9,12}$/),
    __metadata("design:type", String)
], ForgotDto.prototype, "phone", void 0);
let AuthController = class AuthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(body) {
        const hasContact = !!(body.email || body.phone);
        if (!hasContact) {
            throw new common_1.BadRequestException('Email or phone is required');
        }
        const existingByEmail = body.email
            ? await this.prisma.findUserByEmail(body.email)
            : null;
        const existingByPhone = body.phone
            ? await this.prisma.findUserByPhone(body.phone)
            : null;
        const existing = existingByEmail ?? existingByPhone;
        if (existing) {
            throw new common_1.BadRequestException('User already exists');
        }
        const hash = await bcryptjs_1.default.hash(body.password, 10);
        const user = await this.prisma.createUser({
            name: body.name,
            email: body.email ?? null,
            phone: body.phone ?? null,
            passwordHash: hash,
        });
        return { message: 'Registration successful', user };
    }
    async login(body) {
        const id = body.identifier?.trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
        const isPhone = !isEmail && /^\d{9,12}$/.test(id);
        if (!isEmail && !isPhone) {
            throw new common_1.BadRequestException('Invalid email or phone');
        }
        const user = isEmail
            ? await this.prisma.findUserByEmail(id)
            : await this.prisma.findUserByPhone(id);
        if (!user)
            return { error: 'User not found' };
        const ok = await bcryptjs_1.default.compare(body.password, user.passwordHash);
        if (!ok)
            return { error: 'Invalid credentials' };
        return {
            message: 'Login successful',
            user: { id: user.id, name: user.name },
        };
    }
    forgot(body) {
        const dest = body.email ? 'email' : body.phone ? 'phone' : null;
        if (!dest) {
            throw new common_1.BadRequestException('Email or phone is required');
        }
        return { message: `OTP sent to your ${dest}` };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgot", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map