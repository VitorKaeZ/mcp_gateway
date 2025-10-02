import { UserData } from "./user-data";
import { Either, left, right } from "../../../shared/either";
import { Email } from "./email";
import { InvalidEmailError } from "./errors/invalid.email";
import { InvalidNameError } from "./errors/invalid.name";
import { InvalidPasswordError } from "./errors/invalid.password";
import { Name } from "./name";
import { Password } from "./password";


export class User {
    public readonly firstname: Name
    public readonly lastname: Name
    public readonly email: Email
    public readonly password: Password

    private constructor (firstname: Name, lastname: Name, email: Email, password: Password) {
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
        this.password = password
        Object.freeze(this)
    }

    static create (userData: UserData): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> {
        const firstnameOrError: Either<InvalidNameError, Name> = Name.create(userData.firstname)
        const lastnameOrError: Either<InvalidNameError, Name> = Name.create(userData.lastname)
        const emailOrError: Either<InvalidEmailError, Email> = Email.create(userData.email)
        const passwordOrError: Either<InvalidPasswordError, Password> = Password.create(userData.password || '')

        if (firstnameOrError.isLeft()) {
            return left(firstnameOrError.value)
        }

        if (lastnameOrError.isLeft()) {
            return left(lastnameOrError.value)
        }

        if (emailOrError.isLeft()) {
            return left(emailOrError.value)
        }

        if (passwordOrError.isLeft()) {
            return left(passwordOrError.value)
        }

        const firstname: Name = firstnameOrError.value
        const lastname: Name = lastnameOrError.value
        const email: Email = emailOrError.value
        const password: Password = passwordOrError.value

        return right(new User(firstname, lastname, email, password))
    }
}