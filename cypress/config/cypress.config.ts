import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      // Initialize code coverage
      codeCoverageTask(on, config);

      // Define Node-side tasks (Terminal logging)
      on('task', {
        log(message: unknown) {
          console.log(message);
          return null;
        },
        error(message: unknown) {
          console.error(message);
          return null;
        },
        table(message: unknown) {
          console.table(message);
          return null;
        },
      });

      // Browser launch modification
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push(
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          );
        }

        if (browser.name === 'chrome') {
          launchOptions.args.push('--auto-open-devtools-for-tabs');
        }

        return launchOptions;
      });

      // Node-level spec event
      on('after:spec', (spec, results) => {
        if (results?.video) {
          console.log(`Video saved: ${results.video}`);
        }
      });

      // Always return the config object
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  env: {
    API_URL: 'http://localhost:3000/api',
    TEST_LEAGUE_ID: '39',
    TEST_MATCH_ID: '123456',
    coverage: false,
  },

  experimentalStudio: true,
  reporter: 'spec',

  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  downloadsFolder: 'cypress/downloads',
  trashAssetsBeforeRuns: true,
});