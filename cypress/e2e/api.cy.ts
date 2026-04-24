describe('API Endpoints', () => {
  it('should fetch matches data', () => {
    cy.request('/api/matches?date=2026-04-24')
      .its('status')
      .should('equal', 200);
  });

  it('should handle rate limiting gracefully', () => {
    cy.intercept('/api/odds/**', (req) => {
      req.reply({
        statusCode: 429,
        body: { error: 'Rate limit exceeded' }
      });
    }).as('rateLimit');
    
    cy.visit('/odds');
    cy.wait('@rateLimit');
    cy.contains('Rate limit exceeded').should('be.visible');
  });
});