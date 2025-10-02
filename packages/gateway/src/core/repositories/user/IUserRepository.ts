import { OAuthUserDataResponse, UserData } from '../../entities/user/user-data'
import { RegisterUserResponse } from '../../../application/usecases/userRegister/register-user'
import { User } from '@prisma/client'

export interface IUserRepository {
  findAllUsers: () => Promise<UserData[]>
  findUserByEmail: (email: string) => Promise<UserData | null>
  add: (user: UserData) => Promise<void>
  exists: (email: string) => Promise<boolean>
  updatePassword(userId: string, newPassword: string): Promise<void>;
  findUserByGoogleId(googleId: string): Promise<OAuthUserDataResponse | null>;
}

export interface UserRepository2 {
  create(data: UserData): Promise<RegisterUserResponse>;
}

