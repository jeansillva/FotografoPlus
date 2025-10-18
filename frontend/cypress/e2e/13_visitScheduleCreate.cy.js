describe('Verificação da tela de novo agendamento', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:5173/schedule');
  });

  it('abre o modal de Novo Agendamento ao clicar no botão', () => {
    cy.get('#root button._addButton_1yadu_61')
      .should('be.visible')
      .and('contain', 'Novo Agendamento');
    cy.get('#root button._addButton_1yadu_61').click();

    cy.contains('Novo Agendamento', { timeout: 5000 }).should('be.visible');
    cy.get('#root input[type="date"]').should('be.visible');
    cy.get('#root input[type="text"]').should('be.visible');
    cy.get('#root textarea').should('be.visible');
    cy.get('#root button').contains('Salvar').should('be.visible');
  });
});
