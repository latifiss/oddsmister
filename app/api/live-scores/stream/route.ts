// app/api/live-scores/stream/route.ts
import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis
const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fixtureId = searchParams.get('fixtureId');
  
  if (!fixtureId) {
    return new Response('Fixture ID required', { status: 400 });
  }

  const id = parseInt(fixtureId);

  // Create SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      let interval: NodeJS.Timeout;
      let isActive = true;
      
      // Function to send updates
      const sendUpdate = async () => {
        if (!isActive) return;
        
        try {
          // Read from Redis cache - this already returns a parsed object!
          const match = await redis.get(`live:${id}`);
          
          if (!isActive) return;
          
          if (match) {
            // match is already an object, no need to parse!
            const eventData = {
              fixtureId: (match as any).fixture.id,
              status: (match as any).fixture.status.short,
              minute: (match as any).fixture.status.elapsed,
              homeScore: (match as any).goals.home,
              awayScore: (match as any).goals.away,
              timestamp: Date.now(),
            };
            
            try {
              controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
              console.log(`Sent update for match ${id}: ${eventData.homeScore}-${eventData.awayScore}`);
            } catch (enqueueError) {
              console.error('Failed to enqueue:', enqueueError);
              isActive = false;
            }
          } else {
            // No data yet, send placeholder
            try {
              controller.enqueue(`data: ${JSON.stringify({ 
                fixtureId: id, 
                status: 'loading', 
                message: 'Waiting for match data...' 
              })}\n\n`);
            } catch (enqueueError) {
              console.error('Failed to enqueue placeholder:', enqueueError);
              isActive = false;
            }
          }
        } catch (error) {
          console.error('SSE error:', error);
          if (isActive) {
            try {
              controller.enqueue(`data: ${JSON.stringify({ 
                fixtureId: id, 
                status: 'error', 
                message: 'Error fetching live data' 
              })}\n\n`);
            } catch (enqueueError) {
              console.error('Failed to enqueue error message:', enqueueError);
              isActive = false;
            }
          }
        }
      };
      
      // Send initial update
      await sendUpdate().catch(console.error);
      
      // Set up interval to push updates every 5 seconds
      interval = setInterval(() => {
        sendUpdate().catch(console.error);
      }, 5000);
      
      // Clean up on connection close
      const cleanup = () => {
        isActive = false;
        if (interval) clearInterval(interval);
        try {
          controller.close();
        } catch (closeError) {
          // Ignore close errors if already closed
        }
      };
      
      request.signal.addEventListener('abort', cleanup);
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}