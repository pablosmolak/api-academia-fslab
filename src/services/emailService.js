import { apiFetch } from "../utils/apiFetch.js";

const nomeAPI = "FS-Mail";
export class EmailService {
    static async sendEmail(options = {}) {
        if(!options.subject || !options.to || !options.template || !options.data) {
            throw new Error("TENTOU ENVIAR E-MAIL, MAS FALTAM DADOS: "+ options);
        }

        const emailOptions = {
            "subject": options.subject,
            "from": process.env.FS_MAIL_ADDRESS,
            "to": Array.isArray(options.to) ? options.to : [options.to],
            "cc": options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
            "bcc": options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
            "template": options.template,
            "data": options.data,
            "track_links": true
        };

        if(!process.env.FS_MAIL_API_URL || !process.env.FS_MAIL_API_KEY || !process.env.FS_MAIL_ADDRESS) {
            console.error("TENTOU ENVIAR E-MAIL, MAS NÃO ESTÁ CONFIGURADO: ", emailOptions);
            return;
        }

        
        if(process.env.DEBUGLOG === "true")
            console.log("E-mail enviando...", JSON.stringify(emailOptions, null, 2));
        
        let response = await apiFetch(nomeAPI, process.env.FS_MAIL_API_URL, process.env.FS_MAIL_API_KEY,
            "POST", "/emails", emailOptions
        );

        if(process.env.DEBUGLOG === "true")
            console.log("E-mail enviado:", response);

        return response;
    }

    static async cadastrarTemplate(nome, conteudo) {
        let response = await apiFetch(nomeAPI, process.env.FS_MAIL_API_URL, process.env.FS_MAIL_API_KEY,
            "PUT", `/templates/${nome}/?format=MJML`, conteudo, "text/plain"
        );
        
        if(process.env.DEBUGLOG === "true"){
           console.log("Template cadastrado:", response);
        }

        return response;
    }
}


