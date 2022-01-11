import bcrypt from 'bcrypt'
import { salt_rounds } from '../config/security.js'

export class ClientHashedPassword {
    #password: string
    constructor(password: string) {
        this.#password = password
    }

    async serverHashed(): Promise<ServerHashedPassword> {
        const hash = await bcrypt.hash(this.#password, salt_rounds);
        return new ServerHashedPassword(hash);
    }
    compareWithServer(password: ServerHashedPassword): Promise<boolean> {
        return bcrypt.compare(this.#password, password.password)
    }
}

export class ServerHashedPassword {
    #password: string
    constructor(password: string) {
        this.#password = password
    }

    get password(): string {
        return this.#password
    }
}