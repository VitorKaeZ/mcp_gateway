export interface UserData {
    id?: string,
    email: string,
    firstname: string,
    lastname: string ,
    password?: string | null,
    googleId?: string | null,
}

export interface UserDataLoginRequest {
    email: string,
    password: string
}
export interface UserDataLoginResponse {
    id: string | undefined,
    email: string,
    firstname: string,
    lastname: string,
    token: string,
}
export interface UserDataCreateResponse {
    email: string;
    firstname: string;
    lastname: string;
}

export interface OAuthUserData {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    picture?: string;
    token?: string;
    googleId?: string;
  }

  export interface OAuthUserDataResponse {
    id: string;
    googleId?: string | null
    email: string;
    firstname: string;
    lastname: string;
  }