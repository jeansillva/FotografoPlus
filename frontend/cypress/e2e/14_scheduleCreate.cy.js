import 'cypress-file-upload';

describe('Agendamento de sessão no portfólio', () => {
  const user = {
    name: 'Jean',
    email: 'jeancy@teste.com',
    password: 'Foto@@',
  };

  beforeEach(() => {
    cy.login(user);
    cy.visit('http://localhost:5173/schedule');
  });

  it('cria um novo agendamento com sucesso', () => {
    cy.get('#root button._addButton_1yadu_61').click();
    cy.get('#root input[type="date"]').click();
    cy.get('#root input[type="date"]').type('2002-10-21');
    cy.get('#root input[type="text"]').click();
    cy.get('#root input[type="text"]').type('Fotos Casamento');
    cy.get('#root textarea').click();
    cy.get('#root textarea').clear();
    cy.get('#root textarea').type('Dia Especial');
    cy.get('#root button._saveButton_1yadu_351').click();
  });
});

it('schedule2', function() {
  cy.visit('http://localhost:5173/schedule')
});

it('updateSchedule', function() {
  cy.visit('http://localhost:5173/schedule')
});
