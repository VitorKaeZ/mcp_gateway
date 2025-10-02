import { UserData } from "../../../core/entities/user/user-data";
import { User } from "../../../core/entities/user/user";
import { Either, left, right } from "../../../shared/either";
import { InvalidNameError } from "../../../core/entities/user/errors/invalid.name";
import { InvalidEmailError } from "../../../core/entities/user/errors/invalid.email";
import { InvalidPasswordError } from "../../../core/entities/user/errors/invalid.password";
import bcrypt from "bcryptjs"
import { RegisterUserResponse, RegisterUser } from "./register-user";
import { IUserRepository } from "../../../core/repositories/user/IUserRepository";
import { EmailAlreadyExistsError } from "../errors/email-exists-error";
import { UserDataCreateResponse } from "../../../core/entities/user/user-data";


export class RegisterUserOnDatabase implements RegisterUser{
    private userRepository: IUserRepository
    constructor(userRepo: IUserRepository){
        this.userRepository = userRepo
    }

    async registerUserOnDatabase(userData: UserData): Promise<RegisterUserResponse> {
        const useOrError: Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> = User.create(userData)
        if (useOrError.isLeft()) {
            return left(useOrError.value)
        }

        console.log("antes do user")
        const user: User = useOrError.value
        console.log(user)
        const exists = await this.userRepository.exists(user.email.value)
        console.log("depois do exists", exists)
        if (exists) {
            return left(new EmailAlreadyExistsError());
        }

        console.log(user)
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(user.password.value, salt)

        await this.userRepository.add({ firstname: user.firstname.value, lastname: user.lastname.value, email: user.email.value, password: passwordHash })
        
        const response: UserDataCreateResponse = {
            email : user.email.value,
            firstname : user.firstname.value,
            lastname : user.lastname.value
        }
    
        return right(response)
    }
}

