describe('Acesso à página de portfólio já logado', () => {
  const baseUrl = 'http://localhost:5173';
  const user = {
    email: 'jeancy@teste.com',
    password: 'Foto@@',
  };

  before(() => {
    // Faz login e injeta o token no localStorage
    cy.login(user);
  });

  it('visita /portfolio já autenticado', () => {
    // Visita diretamente a rota do portfólio
    cy.visit(`${baseUrl}/portfolio`);

    // Verifica se a página carregou corretamente
    cy.contains(/portfólio|portfolio|fotos|imagens/i, { timeout: 8000 }).should('be.visible');

    // Garante que está na rota correta e não foi redirecionado
    cy.url().should('include', '/portfolio');

  });
});