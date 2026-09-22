import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Aula prática - DummyJSON', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://dummyjson.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('DummyJSON - Produtos', () => {
    // ==========================================
    // GET - Buscar todos os produtos
    // ==========================================
    it('GET - Deve listar os produtos', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          products: []
        });
    });

    // ==========================================
    // GET - Buscar produto pelo ID
    // ==========================================
    it('GET - Deve buscar o produto de ID 1', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 1
        });
    });

    // ==========================================
    // POST - Criar produto
    // ==========================================
    it('POST - Deve criar um novo produto', async () => {
      await p
        .spec()
        .post(`${baseUrl}/products/add`)
        .withJson({
          title: 'Teclado Gamer',
          price: 250,
          description: 'Teclado mecânico RGB'
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          title: 'Teclado Gamer',
          price: 250,
          description: 'Teclado mecânico RGB'
        });
    });

    // ==========================================
    // PUT - Atualizar produto
    // ==========================================
    it('PUT - Deve atualizar o produto de ID 1', async () => {
      await p
        .spec()
        .put(`${baseUrl}/products/1`)
        .withJson({
          title: 'Teclado Gamer Atualizado',
          price: 350
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 1,
          title: 'Teclado Gamer Atualizado',
          price: 350
        });
    });
  });
});
