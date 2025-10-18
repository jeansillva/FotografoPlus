describe('Acesso à página de registro sem login', () => {
  const baseUrl = 'http://localhost:5173';

  it('navega até /register a partir da home', () => {
    cy.visit(baseUrl);

    // Clica no botão Login do menu
    cy.get('#navbarNav a[href="/login"]').click();

    // Clica no link Registrar dentro da tela de login
    cy.get('#root a[href="/register"]').click();

    // Verifica se está na página certa
    cy.url().should('include', '/register');

    // Verifica se os campos que devem aparecer estão visíveis
    cy.get('#root [name="name"]').should('exist');
    cy.get('#root [name="email"]').should('exist');
    cy.get('#root [name="password"]').should('exist');

    // Vai verificar a presença de texto ou título
    cy.contains(/cadastro|registre|criar conta/i).should('be.visible');
  });
});
