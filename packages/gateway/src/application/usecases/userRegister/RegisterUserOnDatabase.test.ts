import { IUserRepository } from '../../../core/repositories/user/IUserRepository'

import bcrypt from 'bcryptjs'
import { RegisterUserOnDatabase } from './register-user-on-database'
import { UserData } from '../../../core/entities/user/user-data'
import { EmailAlreadyExistsError } from '../errors/email-exists-error'
import { InvalidNameError } from '../../../core/entities/user/errors/invalid.name'
import { InvalidEmailError } from '../../../core/entities/user/errors/invalid.email'
import { InvalidPasswordError } from '../../../core/entities/user/errors/invalid.password'

jest.mock('bcryptjs')

describe('RegisterUserOnDatabase UseCase', () => {
    let userRepository: jest.Mocked<IUserRepository>
    let registerUser: RegisterUserOnDatabase

    beforeEach(() => {
        userRepository = {
            exists: jest.fn(),
            add: jest.fn(),
            findAllUsers: jest.fn(),
            findUserByEmail: jest.fn(),
            findUserByGoogleId: jest.fn(),
            updatePassword: jest.fn(),
        }

        registerUser = new RegisterUserOnDatabase(userRepository)
    })

    it('must register a user successfully', async () => {
        const validUserData: UserData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'ValidPassword123'
        }

        userRepository.exists.mockResolvedValue(false);
        (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password')

        const result = await registerUser.registerUserOnDatabase(validUserData)

        expect(result.isRight()).toBe(true)
        expect(userRepository.add).toHaveBeenCalledWith({
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'hashed_password',
        })

    })

    it('should return an error when trying to register a user with an existing email', async () => {
        const userData: UserData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'ValidPassword123',
        }


        userRepository.exists.mockResolvedValue(true)


        const result = await registerUser.registerUserOnDatabase(userData)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
    })

    it('should return invalid name validation error', async () => {
        const invalidUserData: UserData = {
            firstname: 'J',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'ValidPassword123'
        }


        const result = await registerUser.registerUserOnDatabase(invalidUserData)


        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidNameError)
    })

    it('should return invalid email validation error', async () => {
        const invalidUserData: UserData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'invalid-email',
            password: 'ValidPassword123'
        }


        const result = await registerUser.registerUserOnDatabase(invalidUserData)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidEmailError)
    })

    it('should return invalid password validation error', async () => {
        const invalidUserData: UserData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: '123'
        }

        const result = await registerUser.registerUserOnDatabase(invalidUserData)

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidPasswordError)
    })
})