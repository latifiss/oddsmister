Cypress.Commands.add('waitForPredictions', () => {
  cy.intercept('**/api/predictions/**').as('predictions');
  cy.wait('@predictions', { timeout: 15000 });
});

Cypress.Commands.add('waitForMatches', () => {
  cy.intercept('**/api/matches/**').as('matches');
  cy.wait('@matches', { timeout: 15000 });
});

Cypress.Commands.add('waitForOdds', () => {
  cy.intercept('**/api/odds/**').as('odds');
  cy.wait('@odds', { timeout: 15000 });
});

Cypress.Commands.add('selectLeague', (leagueName: string) => {
  cy.get('[data-testid="league-select"]').click();
  cy.contains('[data-testid="league-option"]', leagueName).click();
});

Cypress.Commands.add('selectMatch', (matchId: string) => {
  cy.get(`[data-testid="match-${matchId}"]`).click();
});

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Chainable<Subject = any> {
      waitForPredictions(): Chainable<void>;
      waitForMatches(): Chainable<void>;
      waitForOdds(): Chainable<void>;
      selectLeague(leagueName: string): Chainable<void>;
      selectMatch(matchId: string): Chainable<void>;
    }
  }
}