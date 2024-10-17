import { applyZodInitialConfig } from "../utils/zod.js";

let didCallInitialConfig = false;
// Tem que chamar esse arquivo antes de tudo. não importa qual entrypoint seja
// Chamar duas vezes não tem efeito
export const zodConfig = async () => {
    if(didCallInitialConfig) return;
    didCallInitialConfig = true;

    // Configuração do Zod, para traduzir os erros de validação
    applyZodInitialConfig();
};
