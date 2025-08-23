import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await axios.post(`${process.env.BACKEND_URL}/contact`, body, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    });
    return NextResponse.json({ success: true, data: res.data }, { status: 200 });
  } catch (error: any) {
    console.error('Contact API error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: error.response?.status || 500 }
    );
  }
}