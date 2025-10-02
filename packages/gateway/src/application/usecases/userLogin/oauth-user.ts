import { OAuthUserData, UserDataLoginRequest } from '../../../core/entities/user/user-data'
import { Either } from '../../../shared/either'
import { InvalidEmailError } from '../../../core/entities/user/errors/invalid.email'
import { UserDataLoginResponse } from '../../../core/entities/user/user-data'
import { InvalidPasswordError } from '../../../core/entities/user/errors/invalid.password'
import { InvalidOAuthTokenError } from '../../../core/entities/user/errors/invalid-oauth-token.error'

export type LoginUserWithOAuthResponse = Either<InvalidOAuthTokenError, OAuthUserData>


export interface LoginUserWithOAuth {
    execute: (authCode: string) => Promise<LoginUserWithOAuthResponse>
}