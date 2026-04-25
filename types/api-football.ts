export interface Fixture {
    fixture: {
      id: number;
      date: string;
      status: { short: string };
    };
    league: {
      id: number;
      name: string;
      country: string;
    };
    teams: {
      home: { id: number; name: string };
      away: { id: number; name: string };
    };
  }
  
  export interface OddsResponse {
    fixture: { id: number };
    bookmakers: Array<{
      id: number;
      name: string;
      bets: Array<{
        id: number;
        name: string;
        values: Array<{
          value: string;
          odd: string;
        }>;
      }>;
    }>;
  }