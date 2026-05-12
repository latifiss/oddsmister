describe('Home Page - Livescore Feed', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('Desktop View', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it('should display the sidebar with major leagues', () => {
      cy.get('aside, [class*="Sidebar"]').should('be.visible');
      cy.contains('Premier League').should('be.visible');
    });

    it('should filter matches when a league is clicked in sidebar', () => {
      cy.contains('Premier League').click();
      
      cy.get('[class*="LeagueName"]').each(($el) => {
        cy.wrap($el).should('contain', 'Premier League');
      });
    });

    it('should navigate dates using the DaySelector', () => {
      cy.get('[class*="DaySelector"]').find('button').last().click();
      
      cy.url().should('include', 'date=');
    });

    it('should display the Predictions sidebar on the right', () => {
      cy.contains('Predictions').should('be.visible');
      cy.get('[class*="PredictionsContainer"]').should('exist');
    });
  });

  context('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-xr');
    });

    it('should show the Bottom Navigation Bar', () => {
      cy.get('[class*="BottomTabs"]').should('be.visible');
    });

    it('should switch between Matches and Predictions tabs', () => {
      cy.contains('Predictions').click();
      cy.get('[class*="FeedContainer"]').should('not.exist');
      cy.get('[class*="PredictionsContainer"]').should('be.visible');

      cy.contains('Matches').click();
      cy.get('[class*="FeedContainer"]').should('be.visible');
    });

    it('should show the horizontal league tab row', () => {
      cy.get('[class*="MobileTabRow"]').should('be.visible');
      cy.get('[class*="MobileTabRow"]').should('have.css', 'overflow-x', 'auto');
    });
  });

  context('Match Display', () => {
    it('should render match details correctly', () => {
      cy.get('[class*="LeagueSection"]').first().within(() => {
        cy.get('img').should('have.attr', 'src');
        cy.get('[class*="ScoreBoard"]').should('exist');
      });
    });

    it('should handle "No matches available" state', () => {
      cy.visit('/?date=2030-01-01');
      cy.contains('No matches available for this date').should('be.visible');
    });
  });
});