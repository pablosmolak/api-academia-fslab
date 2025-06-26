import { bucketsMinio } from "../utils/enums.js";
import minioClient from "./minioConfig.js";
import { prisma } from "./prismaClient.js";
import bcrypt from "bcryptjs";
import { gruposEnum } from "../utils/enums.js";

export async function verificarMinio() {
    await minioClient.listBuckets(async (err, buckets) => {
        if (err) {
            console.error("Configure corretamente as credenciais do MinIO no arquivo ENV!")
            process.exit(1);
        }

        const bucketsExistentes = buckets.map(bucket => bucket.name)

        Object.values(bucketsMinio).forEach(async (bucket) => {
            if (!bucketsExistentes.includes(bucket)) {
                await minioClient.makeBucket(bucket, 'us-east-1', (err) => {
                    if (err) {
                        console.error(`Erro: ${err.message}, ao criar o bucket ${bucket}!`)
                        console.error(err)
                        process.exit(1);
                    }

                    console.log(`Bucket ${bucket} criado com sucesso!`)
                })
            }
        })
    })
}

export async function verificarGrupos() {
    const grupos = await prisma.grupo.count()

    if (grupos === 0) {
        const grupos = [
            {
                nome: gruposEnum.ADM
            },
            {
                nome: gruposEnum.Alunos
            },
            {
                nome: gruposEnum.Professores
            }
        ]

        for (let grupo of grupos) {

            const grupoCreate = await prisma.grupo.create({
                data: grupo,
            });

            console.log('Grupo criado: ', grupoCreate.nome);
        }
    }
}

export async function verificarAdministradorPadrao() {
    const email = process.env.LOGIN_ADMINISTRADOR_PADRAO
    const senha = process.env.SENHA_ADMINISTRADOR_PADRAO

    if (!email || !senha) {
        console.error("Configure corretamente as credenciais do usuário administrador padrão no arquivo ENV!")
        process.exit(1);
    }

    const usuario = await prisma.usuario.count({
        where: {
            email: email
        }
    })

    if (usuario === 0) {
        const grupoId = await prisma.grupo.findFirst({
            where: {
                nome: { in: [gruposEnum.ADM] },
            },
            select: { id: true },
        });


        await prisma.usuario.create({
            data: {
                nome: "Administrador",
                senha: bcrypt.hashSync(senha, 10),
                emailVerificado:true,
                email: email,
                grupoId: grupoId.id
            }
        })

        console.log("Usuário administrador criado com sucesso!")
    }
}