describe('Atualização de credenciais do usuário', () => {
  const apiUrl = 'http://localhost:3000/api/auth';
  const unique = Date.now();
  const user = {
    name: 'Jean',
    email: `jeancy+${unique}@teste.com`,
    password: 'Foto@@',
  };

  const generateNewPassword = () => {
    const base = ['Foto', 'Image', 'Pic', 'Lens', 'Cam'];
    const symbols = ['@', '#', '##', '@@'];
    const word = base[Math.floor(Math.random() * base.length)];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const num = Math.floor(10 + Math.random() * 90);
    return `${word}${symbol}${num}`;
  };

  let newPassword;

  before(() => {
    cy.request('POST', `${apiUrl}/register`, { ...user }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });

  beforeEach(() => {
    newPassword = generateNewPassword();

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

  it('atualiza a senha com sucesso', () => {
    cy.get('#root [name="currentPassword"]').type(user.password);
    cy.get('#root [name="newPassword"]').type(newPassword);
    cy.get('#root [name="repeatPassword"]').type(newPassword);
    cy.get('#root div._loginPage_t7fxq_5').click();
    cy.get('#root button[type="submit"]').click();

    cy.contains('Credenciais atualizadas com sucesso!', { timeout: 10000 })
      .should('be.visible');
    user.password = newPassword;
    
    cy.writeFile('cypress/fixtures/updatedUser.json', {
      email: user.email,
      password: newPassword,
    });
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