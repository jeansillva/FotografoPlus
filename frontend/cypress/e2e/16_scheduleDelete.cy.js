describe('Exclusão de agendamento', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:5173/schedule');
    cy.get('#root button._deleteButton_1yadu_177', { timeout: 10000 })
      .should('exist');
  });

  it('exclui todos os agendamentos existentes com segurança', () => {
    cy.get('#root button._deleteButton_1yadu_177').each(($btn) => {
      cy.wrap($btn)
        .should('exist')               
        .should('be.visible')          
        .click({ force: true });      
    });
    cy.get('#root button._deleteButton_1yadu_177').should('not.exist');
  });
});
