/* v8 ignore start */
import { Schema, Document, Types, models, model } from 'mongoose';
import { LocationType, Role, Visibility } from '@/models/constants';
import { Address, Coordinate, Permission } from '@/models/shared/types';

// Expanded to include more Google Maps data
export interface ILocation {
  trips: Types.ObjectId[];
  name: string; // Consider this for a human-friendly name, e.g., "Eiffel Tower"
  note: string;
  type: LocationType;
  googlePlaceId: string; // Google Maps Place ID
  formattedAddress: string; // Full address in a readable format
  placeTypes: string[]; // Google Maps place types
  coordinates: Coordinate;
  address: Address;
  visibility: Visibility;
  user_id: Types.ObjectId;
  permissions: Permission[];
  mapsUrl: string; // URL to the Google Maps page
  businessStatus: string; // Operational status of the business
}

const LocationSchema: Schema = new Schema({
  trips: [{ type: Types.ObjectId, ref: 'Trip' }],
  name: { type: String, required: true },
  note: { type: String },
  type: { type: String, enum: Object.values(LocationType), required: true },
  googlePlaceId: { type: String, required: true },
  formattedAddress: { type: String, required: true },
  placeTypes: [{ type: String }],
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  // Assuming address is still relevant, but consider if formattedAddress suffices
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  visibility: { type: String, enum: Object.values(Visibility), required: true },
  user_id: { type: Types.ObjectId, required: true },
  permissions: [
    {
      user_id: { type: Types.ObjectId, required: true, ref: 'User' },
      role: { type: String, enum: Object.values(Role), required: true },
    },
  ],
  mapsUrl: { type: String },
  businessStatus: { type: String },
});

const Location = models.Location || model<ILocation>('Location', LocationSchema);
export default Location;

/* v8 ignore stop */
