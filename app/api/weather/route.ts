import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weatherService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'jakarta';

    console.log(`Fetching weather data for: ${location}`);
    
    const weatherData = await WeatherService.getWeatherData(location);

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error in weather API route:', error);
    
    // Return fallback data dengan status 200
    const location = new URL(request.url).searchParams.get('location') || 'jakarta';
    const fallbackData = WeatherService.getFallbackWeatherData(location);

    return NextResponse.json(fallbackData);
  }
}

export const dynamic = 'force-dynamic';