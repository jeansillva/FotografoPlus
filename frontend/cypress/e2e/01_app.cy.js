describe('App basic load', () => {
  it('carrega a aplicação e tem conteúdo no body', () => {
    cy.visit('/');
    cy.get('body').invoke('text').should('not.be.empty');
  });
});
