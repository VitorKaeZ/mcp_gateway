import { Either, left, right } from "../../../shared/either"
import { InvalidEmailError } from "./errors/invalid.email"

export class Email {
    private readonly email: string

    private constructor (email: string) {
        this.email = email
        Object.freeze(this)
    }

    static create (email: string): Either<InvalidEmailError, Email> {
        if (!Email.validate(email)) {
            return left(new InvalidEmailError(email))
        }

        return right(new Email(email))
    }

    get value () : string {
        return this.email
    }

    static validate (email: string): boolean {
        let tester = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

        if (!email) {
            return false
        }

        if (email.length > 256) {
            return false
        }

        if (!tester.test(email)) {
            return false
        }

        let [account, address] = email.split('@')
        if (account.length > 64) {
            return false
        }

        let domainParts = address.split('.')
        if (domainParts.some((part) => {
            return part.length > 63
        })) {
            return false
        }

        return true
        
    }
}