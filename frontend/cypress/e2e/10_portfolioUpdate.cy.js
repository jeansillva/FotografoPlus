describe('Edição de foto no portfólio', () => {
  const baseUrl = 'http://localhost:5173';
  const user = {
    email: 'jeancy@teste.com',
    password: 'Foto@@',
  };

  beforeEach(() => {
    cy.login(user);
    cy.visit(`${baseUrl}/portfolio`);
  });

  it('edita título e descrição de uma foto com sucesso', () => {
    cy.get('#root .card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    cy.get('#root .card img').first().click({ force: true });
    cy.get('div[class*="modalBox"]', { timeout: 5000 }).should('be.visible');

    // Altera o título
    const novoTitulo = `Foto Cypress ${Date.now()}`;
    cy.get('input.form-control.text-center')
      .clear()
      .type(novoTitulo)
      .blur(); 

    // Altera a descrição
    const novaDescricao = 'Descrição atualizada pelo Cypress';
    cy.get('textarea.form-control')
      .clear()
      .type(novaDescricao)
      .blur(); 

    // Fecha o modal clicando no botão
    cy.get('button.btn-warning').click();

    cy.get('div[class*="modalBox"]').should('not.exist');
    cy.contains(novoTitulo).should('be.visible');
    cy.contains(novaDescricao).should('be.visible');
  });
});
