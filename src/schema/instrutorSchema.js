import { z } from "zod";
import { myZ } from "../utils/zod.js";

export class instrutorSchema {
    static addInstrutorAoCurso = z.object({
        usersID: z.array(z.string())
    });
}
