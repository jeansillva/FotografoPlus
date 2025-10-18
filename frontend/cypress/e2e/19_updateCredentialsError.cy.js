describe('Validação de erros ao atualizar credenciais', () => {
  const apiUrl = 'http://localhost:3000/api/auth';
  const unique = Date.now();
  const user = {
    name: 'Jean',
    email: `jeancy+${unique}@teste.com`,
    password: 'Foto@@',
  };

  before(() => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/register`,
      body: user,
    }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });

  beforeEach(() => {
    cy.request('POST', `${apiUrl}/login`, {
      email: user.email,
      password: user.password,
    }).then((res) => {
      const { token, user: loggedUser } = res.body;
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(loggedUser));

      cy.visit('http://localhost:5173/update-credentials');
    });
  });

  // Senha atual incorreta
  it('mostra erro ao informar senha atual incorreta', () => {
    cy.get('#root [name="currentPassword"]').type('Errada@@');
    cy.get('#root [name="newPassword"]').type('NovaSenha@@');
    cy.get('#root [name="repeatPassword"]').type('NovaSenha@@');
    cy.get('#root button[type="submit"]').click();

    cy.contains('Senha atual incorreta.').should('be.visible');
  });

  // Novas senhas não conferem
  it('mostra erro quando as novas senhas não conferem', () => {
    cy.get('#root [name="currentPassword"]').type(user.password);
    cy.get('#root [name="newPassword"]').type('NovaSenha@@');
    cy.get('#root [name="repeatPassword"]').type('Diferente@@');
    cy.get('#root button[type="submit"]').click();

    cy.contains('As novas senhas não conferem.').should('be.visible');
  });

  // Senha atual ausente
  it('mostra erro quando a senha atual não é informada', () => {
    cy.get('#root [name="newPassword"]').type('NovaSenha@@');
    cy.get('#root [name="repeatPassword"]').type('NovaSenha@@');
    cy.get('#root button[type="submit"]').click();

    cy.contains('Informe a senha atual para alterar a senha.').should('be.visible');
  });

  // Nova senha muito curta
  it('mostra erro quando a nova senha tem menos de 6 caracteres', () => {
    cy.get('#root [name="currentPassword"]').type(user.password);
    cy.get('#root [name="newPassword"]').type('123');
    cy.get('#root [name="repeatPassword"]').type('123');
    cy.get('#root button[type="submit"]').click();

    cy.contains('A nova senha deve ter pelo menos 6 caracteres.').should('be.visible');
  });

  after(() => {
    cy.request({
      method: 'DELETE',
      url: `${apiUrl}/test/users`,
      body: { email: user.email },
      failOnStatusCode: false,
    });
  });
});
