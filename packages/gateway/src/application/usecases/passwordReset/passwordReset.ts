import { UserDataLoginRequest } from '../../../core/entities/user/user-data'
import { Either } from '../../../shared/either'
import { InvalidEmailError } from '../../../core/entities/user/errors/invalid.email'
import { UserDataLoginResponse } from '../../../core/entities/user/user-data'
import { InvalidPasswordError } from '../../../core/entities/user/errors/invalid.password'

export interface PasswordResetInterface {
    token: string, 
    newPassword: string
}

export type PasswordResetResponse = Either<InvalidEmailError | InvalidPasswordError, { message: string }>


export interface PasswordReset {
    passwordResetOnService: (password: PasswordResetInterface) => Promise<PasswordResetResponse>
}