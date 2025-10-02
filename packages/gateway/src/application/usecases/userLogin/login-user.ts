import { UserDataLoginRequest } from '../../../core/entities/user/user-data'
import { Either } from '../../../shared/either'
import { InvalidEmailError } from '../../../core/entities/user/errors/invalid.email'
import { UserDataLoginResponse } from '../../../core/entities/user/user-data'
import { InvalidPasswordError } from '../../../core/entities/user/errors/invalid.password'

export type LoginUserResponse = Either<InvalidEmailError | InvalidPasswordError, UserDataLoginResponse>


export interface LoginUser {
    loginUserOnService: (user: UserDataLoginRequest) => Promise<LoginUserResponse>
}