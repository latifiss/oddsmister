// app/test-live/page.tsx
import LiveScoreBoard from '@/components/livescore';

export default function TestLivePage() {
  // Use a real fixture ID from your API
  // Example: Premier League match (you can change this)
  const TEST_FIXTURE_ID = 1517272; // Replace with an actual fixture ID from your data
  
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Live Score Test Page</h1>
      <p>Testing live updates for fixture ID: {TEST_FIXTURE_ID}</p>
      
      <div style={{
        background: '#f5f5f5',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h2>Live Score Component</h2>
        <LiveScoreBoard fixtureId={TEST_FIXTURE_ID} />
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h3>How it works:</h3>
        <ul>
          <li>✅ Connects to SSE stream for real-time updates</li>
          <li>✅ Backend polls API-Football every 60 seconds</li>
          <li>✅ Updates push to browser every 5 seconds</li>
          <li>✅ Auto-reconnects if connection drops</li>
        </ul>
      </div>
    </div>
  );
}