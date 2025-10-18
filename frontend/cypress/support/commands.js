// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';

Cypress.Commands.add('login', (user = { name: 'Jean', email: 'jeancy@teste.com', token: 'fake-jwt-token' }) => {
  cy.window().then((win) => {
    win.localStorage.setItem('token', user.token);
    win.localStorage.setItem('user', JSON.stringify({ name: user.name, email: user.email }));
  });
});

Cypress.Commands.add('login', (user = { email: 'jeancy@teste.com', password: 'Foto@@' }) => {
  cy.request('POST', 'http://localhost:3000/api/auth/login', {
    email: user.email,
    password: user.password,
  }).then((res) => {
    const { token, user } = res.body;
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(user));
  });
});