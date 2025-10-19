describe('Abertura de modal de edição no portfólio', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:5173/portfolio');
  });

  it('abre o modal ao clicar em uma imagem', () => {
    // Espera o carregamento 
    cy.get('#root .card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Clica no primeiro card
    cy.get('#root .card img').first().click({ force: true });

    // Verifica o modal
    cy.get('div[class*="modalBox"]', { timeout: 5000 }).should('be.visible');
  });
});