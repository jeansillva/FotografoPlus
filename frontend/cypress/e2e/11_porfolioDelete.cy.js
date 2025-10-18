describe('Exclusão de foto no portfólio', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:5173/portfolio');
  });

  it('abre o modal e exclui uma foto', () => {
    cy.get('#root img.card-img-top', { timeout: 10000 }).should('exist');

    // Clica na primeira foto da lista para abrir o modal
    cy.get('#root img.card-img-top').first().click();
    cy.get('.btn-outline-danger', { timeout: 5000 })
      .and('contain', 'Excluir');

    // Clica no botão Excluir
    cy.get('.btn-outline-danger').click();

    // Confirma o alerta de confirmação de exclusão
    cy.on('window:confirm', () => true);
    cy.get('.btn-outline-danger').should('not.exist');
  });
});
