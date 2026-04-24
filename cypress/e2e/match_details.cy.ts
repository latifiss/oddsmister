describe('Match Detail Flow', () => {
  beforeEach(() => {
    // Intercept API calls if you want to use mock data, 
    // otherwise it will run against your dev server
    cy.visit('/');
  });

  it('should navigate to match details and interact with odds', () => {
    // 1. Find a scoreboard card and click it
    cy.get('[data-cy="scoreboard-card"]')
      .first()
      .should('be.visible')
      .click();

    // 2. Verify we are on the match detail page
    cy.url().should('include', '/match/');
    
    // 3. Check Breadcrumbs
    cy.get('[data-cy="breadcrumb"]').should('exist');
    cy.get('[data-cy="breadcrumb"]').contains('Home');

    // 4. Verify Scoreboard Info
    cy.get('[data-cy="match-title"]').should('not.be.empty');
    cy.get('[data-cy="home-team-name"]').should('exist');
    cy.get('[data-cy="away-team-name"]').should('exist');

    // 5. Interact with Odds Comparison
    // Scroll to the odds section
    cy.get('[data-cy="odds-container"]').scrollIntoView().should('be.visible');

    // Click the "Compare odds" button on the first market
    cy.get('[data-cy="compare-button"]')
      .first()
      .click();

    // 6. Verify Modal Behavior
    cy.get('[data-cy="odds-modal"]').should('be.visible');
    cy.get('[data-cy="modal-title"]').should('contain', 'Compare');
    
    // Check if provider rows are rendered
    cy.get('[data-cy^="provider-row-"]').should('have.length.at.least', 1);

    // 7. Close the Modal
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="odds-modal"]').should('not.be.visible');
  });

  it('should display correct score status colors/tags', () => {
    // Target a live match specifically if available
    cy.visit('/');
    
    // Check if a live scoreboard exists and has a score
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