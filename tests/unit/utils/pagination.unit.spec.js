import { jest } from '@jest/globals'

const prismaMock = new Proxy({}, {
    get(target, prop) {
        if (!(prop in target)) {
            target[prop] = { count: jest.fn() }
        }
        return target[prop]
    }
})

jest.unstable_mockModule('../../../src/config/prismaClient.js', () => ({
    prisma: prismaMock
}))

const { pagination } = await import('../../../src/utils/pagination.js')
const { prisma } = await import('../../../src/config/prismaClient.js')

describe('Testes de pagination', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Deve retornar a paginação correta com valores padrão', async () => {
        prisma.user.count.mockResolvedValue(25)

        const result = await pagination('user')

        expect(result).toEqual({
            skip: 0,
            take: 10,
            totalPaginas: 3,
            paginaAtual: 1
        })
    })

    it('Deve calcular corretamente para a página 2 e limite 5', async () => {
        prisma.user.count.mockResolvedValue(25)

        const result = await pagination('user', 2, 5)

        expect(result).toEqual({
            skip: 5,
            take: 5,
            totalPaginas: 5,
            paginaAtual: 2
        })
    })

    it('Deve limitar a página à última existente', async () => {
        prisma.user.count.mockResolvedValue(15)

        const result = await pagination('user', 10, 5)

        expect(result).toEqual({
            skip: 10,
            take: 5,
            totalPaginas: 3,
            paginaAtual: 3
        })
    })

    it('Deve aplicar limites máximos ao limite', async () => {
        prisma.user.count.mockResolvedValue(200)

        const result = await pagination('user', 1, 999)

        expect(result.take).toBe(100)        // foi limitado a 100
        expect(result.totalPaginas).toBe(2)  // 200 / 100
    })

    it('Deve garantir que a página mínima seja 1', async () => {
        prisma.user.count.mockResolvedValue(50)

        const result = await pagination('user', -5, 10)

        expect(result.paginaAtual).toBe(1)
    })
})
