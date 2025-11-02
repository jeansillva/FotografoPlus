describe('Edição de agendamento', () => {
  const baseUrl = 'http://localhost:5173';
  const user = {
    email: 'jeancy@teste.com',
    password: 'Foto@@',
  };

  beforeEach(() => {
    cy.login(user);
    cy.visit(`${baseUrl}/schedule`);
  });

  it('edita um agendamento existente com sucesso', () => {
    cy.get('#root button._editButton_1yadu_153').first().click();
    
    cy.get('#root input[type="date"]').click(); 
    cy.get('#root input[type="text"]').click().clear().type('Fotos Badminton');

    cy.get('#root div._modalBox_1yadu_229').click(); 

    cy.get('#root textarea').clear().type('Evento Esportivo');
    cy.get('#root div._modalBox_1yadu_229').click();

    cy.get('#root button._saveButton_1yadu_351').click();
  });
});