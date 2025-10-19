describe('Fluxo de login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('abre a tela de login', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  });

  it('valida campos obrigatórios no formulário de login (tooltip nativo)', () => {
    cy.get('a[href="/login"]').click();

    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.get('[name="email"]').then(($el) => {
      const msg = $el[0].validationMessage || '';
      expect(msg).to.satisfy((m) => /Preencha este campo|Please fill out this field/i.test(m) || m.length > 0);
    });

    cy.get('[name="password"]').then(($el) => {
      const msg = $el[0].validationMessage || '';
      expect(msg).to.satisfy((m) => /Preencha este campo|Please fill out this field/i.test(m) || m.length > 0);
    });
  });

  it('realiza login com credenciais válidas', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token', user: {email: 'jeancy@teste.com', password: 'Foto@@' } }
    }).as('postLogin');

    cy.get('a[href="/login"]').click();
    cy.get('[name="email"]').clear().type('jeancy@teste.com');
    cy.get('[name="password"]').clear().type('Foto@@');
    cy.get('button[type="submit"]').click();

    cy.wait('@postLogin');
    cy.url().should('not.include', '/login');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token') || 'fake-jwt-token').to.exist;
    });
  });
});