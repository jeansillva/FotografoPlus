describe('Navegação deslogado', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('bloqueia acesso a /portfolio e exibe aviso de login obrigatório', () => {
    cy.get('a[href="/portfolio"]').click();
    cy.contains('É necessário fazer login para acessar essa página.').should('be.visible');
  });

  it('bloqueia acesso a /schedule e exibe aviso de login obrigatório', () => {
    cy.get('a[href="/schedule"]').click();
    cy.contains('É necessário fazer login para acessar essa página.').should('be.visible');
  });

  it('navega até /login', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  });
});

