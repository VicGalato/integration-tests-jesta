import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Swagger Petstore API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://petstore3.swagger.io/api/v3';

  let idPet = faker.number.int({
    min: 100000,
    max: 999999999
  });

  const nomePet = `Peixe-${faker.string.alphanumeric(8)}`;
  const nomePetAtualizado = `Peixe-Gigante-${faker.string.alphanumeric(8)}`;

  p.request.setDefaultTimeout(90000);

  beforeAll(() => {
    p.reporter.add(rep);
  });

  describe('Pets', () => {

    // =========================================
    // POST - CADASTRAR
    // =========================================

    it('Cadastra um novo peixe', async () => {
      await p
        .spec()
        .post(`${baseUrl}/pet`)
        .withHeaders('monitor', false)
        .withJson({
          id: idPet,
          category: {
            id: 1,
            name: 'Peixes'
          },
          name: nomePet,
          photoUrls: [
            'https://exemplo.com/peixe.jpg'
          ],
          tags: [
            {
              id: 1,
              name: 'pesca'
            }
          ],
          status: 'available'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'object',
          properties: {
            id: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            photoUrls: {
              type: 'array'
            },
            status: {
              type: 'string'
            }
          },
          required: [
            'id',
            'name',
            'photoUrls'
          ]
        });
    });


    // =========================================
    // GET - BUSCAR PELO ID
    // =========================================

    it('Busca o peixe cadastrado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/pet/${idPet}`)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: idPet,
          name: nomePet,
          status: 'available'
        });
    });


    // =========================================
    // PUT - ALTERAR
    // =========================================

    it('Atualiza o peixe cadastrado', async () => {
      await p
        .spec()
        .put(`${baseUrl}/pet`)
        .withHeaders('monitor', false)
        .withJson({
          id: idPet,
          category: {
            id: 1,
            name: 'Peixes'
          },
          name: nomePetAtualizado,
          photoUrls: [
            'https://exemplo.com/peixe-grande.jpg'
          ],
          tags: [
            {
              id: 1,
              name: 'recorde'
            }
          ],
          status: 'sold'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: idPet,
          name: nomePetAtualizado,
          status: 'sold'
        });
    });


    // =========================================
    // GET - CONFIRMAR ALTERAÇÃO
    // =========================================

    it('Confirma que o peixe foi atualizado', async () => {
      await p
        .spec()
        .get(`${baseUrl}/pet/${idPet}`)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: idPet,
          name: nomePetAtualizado,
          status: 'sold'
        });
    });


    // =========================================
    // GET - BUSCAR POR STATUS
    // =========================================

    it('Busca animais pelo status available', async () => {
      await p
        .spec()
        .get(`${baseUrl}/pet/findByStatus`)
        .withHeaders('monitor', false)
        .withQueryParams('status', 'available')
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array'
        });
    });


    // =========================================
    // GET - PET INEXISTENTE
    // =========================================

    it('Busca um peixe inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrl}/pet/999999999999999`)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.NOT_FOUND);
    });


    // =========================================
    // DELETE - EXCLUIR
    // =========================================

    it('Exclui o peixe cadastrado', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/pet/${idPet}`)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.OK);
    });


    // =========================================
    // GET - CONFIRMAR EXCLUSÃO
    // =========================================

    it('Confirma que o peixe foi excluído', async () => {
      await p
        .spec()
        .get(`${baseUrl}/pet/${idPet}`)
        .withHeaders('monitor', false)
        .expectStatus(StatusCodes.NOT_FOUND);
    });

  });

  afterAll(() => {
    p.reporter.end();
  });
});