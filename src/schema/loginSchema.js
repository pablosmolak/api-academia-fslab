import { z } from "zod";
import { myZ } from "../utils/zod.js";

export class loginSchema {
    static logar = z.object({
        email: myZ.email(),
        senha: myZ.senha()
    });
}
