import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { auth } from '@/auth';
import { HttpStatusCode } from 'axios';
import OpenAI from 'openai';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Authentication required' }, { status: HttpStatusCode.Unauthorized });
    }

    const owner_id = session.user.id;
    console.log('owner_id', owner_id);
    const tripDetails: GenerateTripFormData = await req.json();

    if (!tripDetails) {
      return NextResponse.json({ message: 'Missing trip details' }, { status: HttpStatusCode.BadRequest });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare the chat conversation with OpenAI
    const messages: any[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: formatPrompt(tripDetails) },
    ];

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      messages: messages,
    };

    // real code
    // const response = await openai.chat.completions.create(params);

    // stub answer for development
    const response = {
      choices: [
        {
          message: {
            content: {
              name: 'City Style Exploration of Japan',
              locations: [
                {
                  location_id: 'tokyo',
                  dateRange: ['2024-07-01', '2024-07-07'],
                  duration: {
                    value: 7,
                    timeUnit: 'days',
                  },
                  additionalInfo: 'Explore the vibrant city of Tokyo',
                  cost: 1500,
                  connectedLocationData: {
                    name: 'Tokyo',
                    note: 'Experience the blend of tradition and modernity',
                    type: 'City',
                    googlePlaceId: 'ChIJ51cu8IcbXWARiRtXIothAS4',
                    formattedAddress: 'Tokyo, Japan',
                    placeTypes: ['locality', 'political'],
                    coordinates: {
                      lat: 35.6895,
                      lon: 139.6917,
                    },
                    mapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJ51cu8IcbXWARiRtXIothAS6',
                    links: ['https://www.gotokyo.org/en/'],
                    businessStatus: 'Operational',
                    imageUrl: 'https://example.com/tokyo.jpg',
                  },
                },
                {
                  location_id: 'kyoto',
                  dateRange: ['2024-07-08', '2024-07-14'],
                  duration: {
                    value: 7,
                    timeUnit: 'days',
                  },
                  additionalInfo: 'Visit historic temples and traditional tea houses',
                  cost: 1200,
                  connectedLocationData: {
                    name: 'Kyoto',
                    note: 'Experience the ancient capital of Japan',
                    type: 'City',
                    googlePlaceId: 'ChIJB4GkMCJLGGARbzZ8g-H-Ah4',
                    formattedAddress: 'Kyoto, Japan',
                    placeTypes: ['locality', 'political'],
                    coordinates: {
                      lat: 35.0116,
                      lon: 135.7681,
                    },
                    mapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJB4GkMCJLGGARbzZ8g-H-Ah4',
                    links: ['https://kyoto.travel/en'],
                    business_status: 'Operational',
                    imageUrl: 'https://example.com/kyoto.jpg',
                  },
                },
                {
                  location_id: 'osaka',
                  dateRange: ['2024-07-15', '2024-07-21'],
                  duration: {
                    value: 7,
                    timeUnit: 'days',
                  },
                  additionalInfo: "Experience Osaka's food scene and vibrant nightlife",
                  cost: 1300,
                  connectedLocationData: {
                    name: 'Osaka',
                    note: 'Known for its modern architecture and street food',
                    type: 'City',
                    googlePlaceId: 'ChIJm7pJVxuQAGAR_f2uZNu2v1E',
                    formattedAddress: 'Osaka, Japan',
                    placeTypes: ['locality', 'political'],
                    coordinates: {
                      lat: 34.6937,
                      lon: 135.5023,
                    },
                    mapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJm7pJVxuQAGAR_f2uZNu2v1E',
                    links: ['https://osaka-info.jp/en'],
                    businessStatus: 'Operational',
                    imageUrl: 'https://example.com/osaka.jpg',
                  },
                },
              ],
            },
          },
        },
      ],
    };

    console.log('openAi response', response);

    const suggestedTrip = response.choices[0].message.content;

    return NextResponse.json(
      {
        suggestedTrip,
        message: 'Your Trip has been generated',
      },
      { status: HttpStatusCode.Created },
    );
  } catch (error) {
    console.error('Failed to generate your trip:', error);

    return NextResponse.json(
      // @ts-ignore
      { message: 'Failed to generate your trip', error: error.toString() },
      { status: HttpStatusCode.InternalServerError },
    );
  }
};

const formatPrompt = (tripDetails: GenerateTripFormData): string => {
  return `Plan a trip based on the following details:
        - Destination: ${tripDetails.whereTo}
        - Duration: ${tripDetails.howLong}
        - Number of people: ${tripDetails.howMany}
        - Trip style: ${tripDetails.whatStyle}
        
        Generate a detailed trip plan that includes suggested locations with dates, activities, and potential costs.
        the answer should be returned in a json structured format.
        Example of the JSON structure:
    {
        "name": "Cultural Exploration of Italy",
        "locations": [
            {
                "location_id": "example_id",
                "dateRange": ["2024-07-01", "2024-07-04"],
                "duration": {"value": 3, "timeUnit": "days"},
                "additionalInfo": "Visiting historical sites and museums",
                "cost": 300,
                "connectedLocationData": {
                    "name": "Colosseum",
                    "googleName": "Colosseo",
                    "note": "Book tickets in advance",
                    "type": "Historical",
                    "googlePlaceId": "ChIJ2V-Mo4H-3RQRiolHnKV3v0I",
                    "formattedAddress": "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
                    "placeTypes": ["tourist_attraction"],
                    "coordinates": {"lat": 41.8902, "lon": 12.4922},
                    "address": {
                        "street": "Piazza del Colosseo, 1",
                        "city": "Rome",
                        "state": "Rome",
                        "country": "Italy",
                        "postalCode": "00184"
                    },
                    "mapsUrl": "https://www.google.com/maps/place/?q=place_id:ChIJ2V-Mo4H-3RQRiolHnKV3v0I",
                    "links": ["https://www.coopculture.it/en/heritage.cfm?id=2"],
                    "businessStatus": "Operational",
                    "imageUrl": "https://example.com/image.jpg"
                }
            }
        ]
    }
        `;
};
