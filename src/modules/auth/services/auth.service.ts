import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../../employees/services/employees.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly employeesService: EmployeesService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.employeesService.validateCredentials({
      email: dto.email,
      password: dto.password,
    });

    if (!user?.sub) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.sub, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async changePassword(userId: string | undefined, dto: ChangePasswordDto) {
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.employeesService.changePassword({ userId, dto });
  }
}
