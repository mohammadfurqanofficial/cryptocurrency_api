import { NextResponse } from 'next/server';

export async function GET(req) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    console.log('Cron job triggered at:', new Date().toISOString());

  // Call your API endpoint
  try {
    const response = await fetch(`${process.env.API_URL}/coins/save-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      },
    });

    if (response.ok) {
        console.log('Save history successful');
        return NextResponse.json({ message: 'Success' });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error saving coin history:', errorData);
      return NextResponse.json({ error: 'Failed to save coin history' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error fetching API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
