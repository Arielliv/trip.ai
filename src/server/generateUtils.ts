import axios from 'axios';
import OpenAI from 'openai';
import { GenerateTripFormData } from '@/app/hooks/useGenerateTripForm';
import { ITrip } from '@/models/Trip';

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

    if (!response.data.places || response.data.places.length === 0) {
      throw new Error(`No places found, res: ${JSON.stringify(response)}`);
    }

    if (!response.data.places[0].photos || response.data.places[0].photos.length == 0) {
      if (response.data.places && response.data.places.length > 0) {
        return {
          googlePlaceId: response.data.places[0].id,
          imageUrl: '',
        };
      } else {
        throw new Error(`No places found, res: ${JSON.stringify(response)}`);
      }
    } else {
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
        throw new Error(`No places found, res: ${JSON.stringify(response)}`);
      }
    }
  } catch (error) {
    console.error('Error fetching Google Place ID:', error);
    throw error;
  }
};

export const generateTrip = async (tripDetails: GenerateTripFormData): Promise<ITrip> => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  // Prepare the chat conversation with OpenAI
  const messages: any[] = [
    { role: 'system', content: 'You are a helpful traveler assistant.' },
    { role: 'user', content: formatPrompt(tripDetails) },
  ];

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
    messages: messages,
  };

  // real code
  const response = await openai.chat.completions.create(params);

  console.log('openAi response', JSON.stringify(response));
  // @ts-ignore
  return JSON.parse(response.choices[0].message.content) as unknown as ITrip;
};

const formatPrompt = (tripDetails: GenerateTripFormData): string => {
  return `Plan a trip based on the following details:
        - Destination: ${tripDetails.whereTo}
        - Duration: ${tripDetails.howLong}
        - Number of people: ${tripDetails.howMany}
        - Trip style: ${tripDetails.whatStyle}
        
        Generate a detailed trip plan that includes suggested locations with dates, activities, and potential costs.
        the answer should be returned in a json structured format.
        you can should strive to create a list of places, that will include restaurants, hotels, recommended attractions and general locations.
        Please elaborate on each location in the "additionalInfo" field.
        Each location should get a considerable time duration in the "duration" field.
        Example of the JSON structure:
    {
        "name": "Cultural Exploration of Italy",
        "locations": [
            {
                "location_id": "example_id",
                "dateRange": ["2024-07-01", "2024-07-04"],
                "duration": {"value": 3, "timeUnit": "days"},
                "additionalInfo": "Visiting historical sites and museums",
                "visibility": "public",
                "cost": 300,
                "visibility": "public",
                "connectedLocationData": {
                    "name": "Colosseum",
                    "googleName": "Colosseo",
                    "note": "Book tickets in advance",
                    "type": "general",
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
