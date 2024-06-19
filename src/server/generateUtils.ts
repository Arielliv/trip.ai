import axios from 'axios';
import OpenAI from 'openai';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';
import { ChatCompletion } from 'openai/src/resources/chat/completions';

export const getGooglePlaceIdAndAdditionalData = async (
  locationAddress: string,
): Promise<{ googlePlaceId: string; imageUrl: string }> => {
  const data = {
    textQuery: locationAddress,
  };
  const searchTextHeaders = {
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos',
    'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  };

  const mediaHeaders = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  };

  try {
    const response = await axios.post('https://places.googleapis.com/v1/places:searchText', data, {
      headers: searchTextHeaders,
    });
    const mediaName = response.data.places[0].photos[0].name;

    const mediaResponse = await axios.get(`https://places.googleapis.com/v1/${mediaName}/media`, {
      params: {
        maxHeightPx: 1000,
        maxWidthPx: 1000,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        skipHttpRedirect: true,
      },
      headers: mediaHeaders,
    });
    if (response.data.places && response.data.places.length > 0 && mediaResponse.data.photoUri) {
      return {
        googlePlaceId: response.data.places[0].id,
        imageUrl: mediaResponse.data.photoUri,
      };
    } else {
      throw new Error('No places found');
    }
  } catch (error) {
    console.error('Error fetching Google Place ID:', error);
    throw error;
  }
};

export const generateTrip = async (tripDetails: GenerateTripFormData): Promise<ChatCompletion> => {
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
            visibility: 'public',
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
                  type: 'general',
                  googlePlaceId: 'ChIJ51cu8IcbXWARiRtXIothAS4',
                  formattedAddress: 'Tokyo, Japan',
                  placeTypes: ['locality', 'political'],
                  coordinates: {
                    latitude: 35.6895,
                    longitude: 139.6917,
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
                  type: 'general',
                  googlePlaceId: 'ChIJB4GkMCJLGGARbzZ8g-H-Ah4',
                  formattedAddress: 'Kyoto, Japan',
                  placeTypes: ['locality', 'political'],
                  coordinates: {
                    latitude: 35.0116,
                    longitude: 135.7681,
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
                  type: 'general',
                  googlePlaceId: 'ChIJm7pJVxuQAGAR_f2uZNu2v1E',
                  formattedAddress: 'Osaka, Japan',
                  placeTypes: ['locality', 'political'],
                  coordinates: {
                    latitude: 34.6937,
                    longitude: 135.5023,
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
  // @ts-ignore
  return response;
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
                "visibility": "public",
                "connectedLocationData": {
                    "name": "Colosseum",
                    "googleName": "Colosseo",
                    "note": "Book tickets in advance",
                    "type": "General",
                    "googlePlaceId": "ChIJ2V-Mo4H-3RQRiolHnKV3v0I",
                    "formattedAddress": "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
                    "placeTypes": ["tourist_attraction"],
                    "coordinates": {"latitude": 41.8902, "longitude": 12.4922},
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
    and the type is one of those:
    enum LocationType {
      General = 'general',
      Hotel = 'hotel',
      Restaurant = 'restaurant',
    }
        `;
};
