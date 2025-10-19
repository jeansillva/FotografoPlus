describe('Teste do carrossel da página inicial', () => {
  it('navega pelos slides do carrossel', () => {
    cy.visit('http://localhost:5173/');
    cy.get('#homeCarousel span.carousel-control-next-icon').click();
    cy.wait(800);
    cy.get('#homeCarousel span.carousel-control-next-icon').click();
    cy.wait(800);
    cy.get('#homeCarousel span.carousel-control-next-icon').click();
    cy.wait(800);

    cy.get('#homeCarousel span.carousel-control-prev-icon').click();
    cy.wait(800);
    cy.get('#homeCarousel span.carousel-control-prev-icon').click();
    cy.wait(800);
    cy.get('#homeCarousel span.carousel-control-prev-icon').click();
    cy.wait(800);
    cy.get('#homeCarousel span.carousel-control-prev-icon').click();
  });
});