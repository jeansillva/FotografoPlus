import 'cypress-file-upload';

describe('Upload de imagem no portfólio', () => {
  const user = {
    name: 'Jean',
    email: 'jeancy@teste.com',
    password: 'Foto@@',
  };

  beforeEach(() => {
    // Faz login
    cy.login(user);
    cy.visit('http://localhost:5173/portfolio');
    cy.url({ timeout: 10000 }).should('include', '/portfolio');
  });

  it('envia uma imagem com sucesso', () => {
    cy.get('#root label.fw-bold').click(); 

    // Seleciona o input e faz o upload da imagem
    const fileName = 'foto_teste.jpg'; 
    cy.get('#root input[type="file"]').attachFile(fileName);
  });
});
