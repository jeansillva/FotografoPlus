describe('Registro de usuário', () => {
  const apiUrl = 'http://localhost:3000/api/auth';
  const unique = Date.now();
  const userData = {
    name: 'Jean Carlos',
    email: `jeancy+${unique}@teste.com`,
    password: 'Foto@@',
  };

  before(() => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/test/users`,
      body: { email: userData.email },
      failOnStatusCode: false,
    });
  });

  after(() => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/test/users`,
      body: { email: userData.email },
      failOnStatusCode: false,
    });
  });

  it('valida campos obrigatórios e registra corretamente', () => {
    cy.visit('http://localhost:5173');

    cy.get('#navbarNav a[href="/login"]').click();
    cy.get('#root a[href="/register"]').click();

    cy.get('#root [name="email"]').should('have.attr', 'required');
    cy.get('#root [name="password"]').should('have.attr', 'required');

    cy.get('#root [name="name"]').type(userData.name);
    cy.get('#root button[type="submit"]').click();
    cy.url().should('include', '/register');
 
    cy.get('#root [name="email"]').type(userData.email);
    cy.get('#root button[type="submit"]').click();
    cy.url().should('include', '/register');

    cy.get('#root [name="password"]').type(userData.password);
    cy.get('#root button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/portfolio');
  });
});