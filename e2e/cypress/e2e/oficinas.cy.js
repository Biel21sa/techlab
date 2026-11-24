describe('Oficinas TechLab', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('exibe o catálogo e filtra por busca e trilha', () => {
    cy.get('[data-cy^="oficina-"]').should('have.length', 4);

    cy.get('#busca').type('Cypress');
    cy.get('#trilha').select('Qualidade');

    cy.get('[data-cy^="oficina-"]')
      .should('have.length', 1)
      .and('contain', 'Testes de interface com Cypress');
  });

  it('permite reservar, consultar e cancelar uma inscrição', () => {
    const email = `cypress-${Date.now()}@example.com`;

    cy.get('[data-cy="oficina-1"] input[name="email"]').type(email);
    cy.get('[data-cy="oficina-1"] button').click();
    cy.get('[role="status"]').should('contain', 'Inscrição confirmada.');
    cy.get('#total-inscricoes').should('have.text', '1');

    cy.get('#consultar input[name="email"]').type(email);
    cy.get('#consultar button').click();
    cy.get('#reservas').should('contain', 'Docker na prática');
    cy.intercept({
      method: 'DELETE',
      pathname: '/api/oficinas/1/inscricoes',
    }).as('cancelSignup');
    cy.get('#reservas button').click();

    cy.wait('@cancelSignup', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200);
    cy.get('#retorno-consulta').should('contain', 'Inscrição cancelada.');
    cy.get('#total-inscricoes').should('have.text', '0');
  });
});
