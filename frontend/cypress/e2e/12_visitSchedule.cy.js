describe('Acesso à página de agendamentos já logado', () => {
  const baseUrl = 'http://localhost:5173';
  const user = {
    email: 'jeancy@teste.com',
    password: 'Foto@@',
  };

  before(() => {
    cy.login(user);
  });

  it('visita /schedule já autenticado', () => {
    cy.visit(`${baseUrl}/schedule`);
    cy.contains(/agendamentos|schedule|novo/i, { timeout: 8000 }).should('be.visible');
    cy.url().should('include', '/schedule');
  });
});

it('schedule', function() {
  cy.visit('http://localhost:5173/schedule')
  
});