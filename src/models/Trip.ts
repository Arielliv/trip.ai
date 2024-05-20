/* v8 ignore start */
import { Schema, Document, Types, models, model } from 'mongoose';
import { LocationType, Role, TransportationType, Visibility } from '@/models/constants';
import { Address, Coordinate, Permission } from '@/models/shared/types';

export interface ITrip {
  _id?: string;
  name: string;
  participants_ids: Types.ObjectId[];
  permissions: Permission[];
  locations: TripLocation[];
  locations_order: Types.ObjectId[];
  visibility: Visibility;
  transportations: Transportation[];
  reviews: Review[];
}

export interface ITripDto {
  owner: Types.ObjectId;
  name: string;
  participants_ids: Types.ObjectId[];
  locations: TripLocation[];
  locations_order: Types.ObjectId[];
  visibility: Visibility;
  transportations: Transportation[];
  reviews: Review[];
}

export interface Transportation {
  origin: Types.ObjectId;
  destination: Types.ObjectId;
  type: TransportationType;
}

export interface TripLocation {
  location: Types.ObjectId; // Reference to a Location document
  time: {
    start: Date;
    end: Date;
  };
  note: string;
  ticket: string; // Trip-specific URL or document identifier
}

export interface Review {
  user_id: Types.ObjectId;
  rate: number;
  description: string;
  images: string[]; // Array of image URLs
}

const TripLocationSchema: Schema = new Schema({
  location: { type: Types.ObjectId, ref: 'Location', required: true },
  time: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  note: { type: String },
  ticket: { type: String },
});

const TripSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: Types.ObjectId, required: true },
  participants_ids: [{ type: Types.ObjectId }],
  locations: [TripLocationSchema],
  locations_order: [{ type: Types.ObjectId }],
  visibility: { type: String, enum: Object.values(Visibility), required: true },
  transportations: [
    {
      origin: { type: Types.ObjectId, required: true },
      destination: { type: Types.ObjectId, required: true },
      type: { type: String, enum: Object.values(TransportationType), required: true },
    },
  ],
  reviews: [
    {
      user_id: { type: Types.ObjectId, required: true },
      rate: { type: Number, required: true },
      description: { type: String, required: true },
      images: [{ type: String }],
    },
  ],
});

const Trip = models.Trip || model<ITrip>('Trip', TripSchema);
export default Trip;

/* v8 ignore stop */
