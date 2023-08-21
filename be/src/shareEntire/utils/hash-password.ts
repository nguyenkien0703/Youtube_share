import { generateSaltRound } from "./random-number";
import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) =>  {
    const saltRound =await   generateSaltRound();
    return await  bcrypt.hash(password, saltRound);

}