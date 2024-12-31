describe('Logga In och Registrera Tester', () => {
  beforeEach(() => {
    cy.visit('/public/index.html');
  });

  it('Tester att logga in med giltiga uppgifter', () => {
    cy.get('#login-tab').click();

    cy.get('#username').type('testuser');
    cy.get('#password').type('testpassword');

    cy.get('button[type="submit"]').contains('Logga In').click();

    cy.get('#login-error-message').should('not.be.visible');
  });

  it('Tester att registrera med giltiga uppgifter', () => {
    cy.get('#register-tab').click();

    cy.get('#reg-username').type('nyanvändare');
    cy.get('#reg-password').type('starktpassword');
    cy.get('#confirm-password').type('starktpassword');

    cy.get('button[type="submit"]').contains('Registrera').click();

    cy.get('#register-error-message').should('not.be.visible');
  })

  it('Visar felmeddelande vid ogiltiga inloggningsuppgifter', () => {
    cy.get('#login-tab').click();

    cy.get('#username').type('felanvändare');
    cy.get('#password').type('felpassword');

    cy.get('button[type="submit"]').contains('Logga In').click();
  });
});