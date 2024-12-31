describe('Logga in via formuläret', () => {
  beforeEach(() => {
    cy.visit('/public/index.html');
  });

  it('logga in med giltiga uppgifter', () => {
    cy.intercept('POST', '/login', { fixture: 'loginSuccess.json' }).as('loginRequest');

    cy.get('#login-tab').click();
    cy.get('#username').type('testuser');
    cy.get('#password').type('testpassword');
    cy.get('button[type="submit"]').contains('Logga In').click();

    // Vänta på nätverksanrop och verifiera
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/loggedInPage');
  });

  it('Visar felmeddelande vid ogiltiga inloggningsuppgifter', () => {
    cy.intercept('POST', '/login', { fixture: 'loginFail.json' }).as('loginRequest');

    cy.get('#login-tab').click();
    cy.get('#username').type('felanvändare');
    cy.get('#password').type('felpassword');
    cy.get('button[type="submit"]').contains('Logga In').click();

    // Vänta på nätverksanrop och verifiera
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 400);
    cy.get('#login-error-message').should('be.visible').and('contain.text', 'Fel användarnamn eller lösenord');
  });
});

describe('Registrera via formuläret', () => {
  beforeEach(() => {
    cy.visit('/public/index.html');
  });

  it('Registrera med giltiga uppgifter', () => {
    cy.intercept('POST', '/register', { fixture: 'registerSuccess.json' }).as('registerRequest');

    cy.get('#register-tab').click();
    cy.get('#reg-username').type('testuser');
    cy.get('#reg-password').type('testpassword');
    cy.get('#confirm-password').type('testpassword');
    cy.get('button[type="submit"]').contains('Registrera').click();

    // Vänta på nätverksanrop och verifiera
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);
    cy.get('#register-error-message').should('not.be.visible');
  });

  it('Visar felmeddelande vid upptaget användarnamn', () => {
    cy.intercept('POST', '/register', { fixture: 'registerUsernameTaken.json' }).as('registerRequest');

    cy.get('#register-tab').click();
    cy.get('#reg-username').type('testuser');
    cy.get('#reg-password').type('testpassword');
    cy.get('#confirm-password').type('testpassword');
    cy.get('button[type="submit"]').contains('Registrera').click();

    // Vänta på nätverksanrop och verifiera
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 400);
    cy.get('#register-error-message').should('be.visible').and('contain.text', 'Användarnamnet är redan upptaget');
  });

  it('Visar felmeddelande vid för kort lösenord', () => {
    cy.get('#register-tab').click();
    cy.get('#reg-username').type('testuser');
    cy.get('#reg-password').type('test');
    cy.get('#confirm-password').type('test');
    cy.get('button[type="submit"]').contains('Registrera').click();
    cy.get('#register-error-message').should('be.visible').and('contain.text', 'Lösenordet är för kort');
  });

  it('Visar felmeddelande vid icke matchande lösenord', () => {
    cy.get('#register-tab').click();
    cy.get('#reg-username').type('testuser');
    cy.get('#reg-password').type('testpassword');
    cy.get('#confirm-password').type('felconfirm');
    cy.get('button[type="submit"]').contains('Registrera').click();
    cy.get('#register-error-message').should('be.visible').and('contain.text', 'Lösenorden matchar inte');
  });
});