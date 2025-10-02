import { UserData, UserDataLoginRequest } from "../../../../core/entities/user/user-data"
import { IUserRepository } from "../../../../core/repositories/user/IUserRepository"
import { InvalidCredentialsError } from "../../errors/invalid-credentials-error";
import { LoginUserOnService } from "../login-user-on-service"
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');


describe('LoginUserOnService UseCase', () => {
    let userRepository: jest.Mocked<IUserRepository>
    let loginUser: LoginUserOnService
    

    beforeEach(() => {
        userRepository = {
            exists: jest.fn(),
            add: jest.fn(),
            findAllUsers: jest.fn(),
            findUserByEmail: jest.fn(),
            findUserByGoogleId: jest.fn(),
            updatePassword: jest.fn(),
        }

        loginUser = new LoginUserOnService(userRepository)
    })

    it('must log in successfully with valid email and password', async () => {
        const validUser: UserData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'hashed_password', // A senha no banco de dados estaria criptografada
          };

        userRepository.findUserByEmail.mockResolvedValue(validUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true)


        const result = await loginUser.loginUserOnService({email : 'john.doe@example.com', password: 'ValidPassword123'});


        expect(result.isRight()).toBe(true)
        expect(result.value).toMatchObject({
            email: 'john.doe@example.com',
            firstname: 'John',
            lastname: 'John',
            token: expect.any(String), // Verifica que o token existe, mas não seu valor exato
          });

    })

    it('should return error if email is not found', async () => {
        userRepository.findUserByEmail.mockResolvedValue(null);

        const result = await loginUser.loginUserOnService({email : 'john.doe@example.com', password: 'ValidPassword123'})

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(InvalidCredentialsError)
    })

    it('should return error if password is invalid', async () => {
        const validUser: UserData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'hashed_password', // Senha criptografada armazenada
        }

        userRepository.findUserByEmail.mockResolvedValue(validUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);


        const result = await loginUser.loginUserOnService({email : 'john.doe@example.com', password: 'InvalidPassword'})

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(InvalidCredentialsError)
    })
})