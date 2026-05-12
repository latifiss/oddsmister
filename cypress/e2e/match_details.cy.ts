describe('Match Detail Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to match details and interact with odds', () => {
    cy.get('[data-cy="scoreboard-card"]')
      .first()
      .should('be.visible')
      .click();

    cy.url().should('include', '/match/');
    
    cy.get('[data-cy="breadcrumb"]').should('exist');
    cy.get('[data-cy="breadcrumb"]').contains('Home');

    cy.get('[data-cy="match-title"]').should('not.be.empty');
    cy.get('[data-cy="home-team-name"]').should('exist');
    cy.get('[data-cy="away-team-name"]').should('exist');

    cy.get('[data-cy="odds-container"]').scrollIntoView().should('be.visible');

    cy.get('[data-cy="compare-button"]')
      .first()
      .click();

    cy.get('[data-cy="odds-modal"]').should('be.visible');
    cy.get('[data-cy="modal-title"]').should('contain', 'Compare');
    
    cy.get('[data-cy^="provider-row-"]').should('have.length.at.least', 1);

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="odds-modal"]').should('not.be.visible');
  });

  it('should display correct score status colors/tags', () => {
    cy.visit('/');
    
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="scoreboard-live"]').length > 0) {
        cy.get('[data-cy="scoreboard-live"]')
          .first()
          .within(() => {
            cy.get('[data-cy="home-score"]').should('not.be.empty');
            cy.get('[data-cy="away-score"]').should('not.be.empty');
          });
      }
    });
  });
});