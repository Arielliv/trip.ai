/* v8 ignore start */
import { Schema, Types, models, model } from 'mongoose';
import { LocationType, Role, Visibility } from '@/models/constants';
import { Address, Coordinate, Permission } from '@/models/shared/types';

export interface ILocation {
  _id?: string;
  trips: Types.ObjectId[];
  name: string;
  googleName: string;
  note?: string;
  type?: LocationType;
  googlePlaceId: string;
  formattedAddress: string;
  placeTypes?: string[];
  coordinates: Coordinate;
  address: Address;
  visibility: Visibility;
  permissions: Permission[];
  mapsUrl?: string;
  links?: string[];
  businessStatus?: string;
  imageUrl?: string;
}

export interface ITripDto {
  trips: Types.ObjectId[];
  name: string;
  googleName: string; // New: Name from Google Places
  note?: string;
  type?: LocationType;
  googlePlaceId: string; // Google Maps Place ID
  formattedAddress: string;
  placeTypes?: string[]; // Types from Google Places
  coordinates: Coordinate;
  address: Address;
  visibility: Visibility;
  user_id: Types.ObjectId;
  permissions: Permission[];
  mapsUrl?: string; // URL to the Google Maps page
  links?: string[]; // New: Array of additional links, e.g., the website
  businessStatus?: string; // New: Optional business status
  imageUrl: string; // URL to the image of the location
}

const LocationSchema: Schema = new Schema({
  trips: [{ type: Types.ObjectId, ref: 'Trip' }],
  name: { type: String, required: true },
  googleName: { type: String, required: true }, // Added
  note: { type: String },
  type: { type: String, enum: Object.values(LocationType), required: true },
  googlePlaceId: { type: String, required: true },
  formattedAddress: { type: String, required: true },
  placeTypes: [{ type: String }],
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
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
  links: [{ type: String }], // Added
  businessStatus: { type: String }, // Added as optional
  imageUrl: { type: String },
});

const Location = models.Location || model<ILocation>('Location', LocationSchema);
export default Location;

/* v8 ignore stop */
