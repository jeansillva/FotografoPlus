describe('Acesso à página de atualização de credenciais já logado', () => {
  const baseUrl = 'http://localhost:5173';
  const user = {
    email: 'jeancy@teste.com',
    password: 'Foto@@',
  };

  before(() => {
    cy.login(user);
  });

  it('visita /update-credentials já autenticado', () => {
    cy.visit(`${baseUrl}/update-credentials`);

    cy.get('#root [name="currentPassword"]').should('exist');
    cy.get('#root [name="newPassword"]').should('exist');
    cy.get('#root [name="repeatPassword"]').should('exist');

    cy.url().should('include', '/update-credentials');

    cy.contains(/credenciais|senha|atualizar/i).should('be.visible');
  });
});