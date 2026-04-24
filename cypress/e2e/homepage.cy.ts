describe('Home Page - Livescore Feed', () => {
  beforeEach(() => {
    // Intercept API calls if you want to mock data, 
    // otherwise it will hit your local dev server
    cy.visit('/');
  });

  context('Desktop View', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    it('should display the sidebar with major leagues', () => {
      // Check if Premier League exists in sidebar
      cy.get('aside, [class*="Sidebar"]').should('be.visible');
      cy.contains('Premier League').should('be.visible');
    });

    it('should filter matches when a league is clicked in sidebar', () => {
      // Click Premier League (ID 39 in your config)
      cy.contains('Premier League').click();
      
      // Verify URL params change
      // Note: your code uses handleCompetitionSelect which updates state and filters
      // Ensure the Feed updates to only show Premier League matches
      cy.get('[class*="LeagueName"]').each(($el) => {
        cy.wrap($el).should('contain', 'Premier League');
      });
    });

    it('should navigate dates using the DaySelector', () => {
      // Find a day in the future/past in DaySelector and click
      // Assuming DaySelector renders buttons or clickable divs
      cy.get('[class*="DaySelector"]').find('button').last().click();
      
      // Check if URL updates with the date param
      cy.url().should('include', 'date=');
    });

    it('should display the Predictions sidebar on the right', () => {
      cy.contains('Predictions').should('be.visible');
      // Ensure it renders at least some prediction items
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
      // Switch to Predictions
      cy.contains('Predictions').click();
      cy.get('[class*="FeedContainer"]').should('not.exist');
      cy.get('[class*="PredictionsContainer"]').should('be.visible');

      // Switch back to Matches
      cy.contains('Matches').click();
      cy.get('[class*="FeedContainer"]').should('be.visible');
    });

    it('should show the horizontal league tab row', () => {
      cy.get('[class*="MobileTabRow"]').should('be.visible');
      // Test horizontal scroll exists
      cy.get('[class*="MobileTabRow"]').should('have.css', 'overflow-x', 'auto');
    });
  });

  context('Match Display', () => {
    it('should render match details correctly', () => {
      // Check if team names and scores are visible
      cy.get('[class*="LeagueSection"]').first().within(() => {
        cy.get('img').should('have.attr', 'src'); // League Logo
        cy.get('[class*="ScoreBoard"]').should('exist');
      });
    });

    it('should handle "No matches available" state', () => {
      // Navigate to a date far in the future where no matches exist
      cy.visit('/?date=2030-01-01');
      cy.contains('No matches available for this date').should('be.visible');
    });
  });
});