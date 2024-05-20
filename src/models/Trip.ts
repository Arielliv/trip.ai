/* v8 ignore start */
import { Schema, Types, models, model } from 'mongoose';
import { Role, TransportationType, Visibility } from '@/models/constants';
import { Permission } from '@/models/shared/types';
import { ILocation } from '@/models/Location';

export interface IFullTrip {
  _id?: string;
  name: string;
  participants_ids: Types.ObjectId[];
  permissions: Permission[];
  locations: IFullLocationInTrip[];
  visibility: Visibility;
  transportations: Transportation[];
  reviews: Review[];
}

export interface IFullLocationInTrip {
  connectedLocationData: ILocation;
  id?: string;
  dateRange: Date[];
  duration?: {
    value: number;
    timeUnit: string;
  };
  additionalInfo?: string;
  cost?: number;
}

export interface ITrip {
  _id?: string;
  name: string;
  participants_ids: Types.ObjectId[];
  permissions: Permission[];
  locations: ILocationInTrip[];
  visibility: Visibility;
  transportations: Transportation[];
  reviews: Review[];
}

export interface ILocationInTrip {
  location_id?: string | ILocation; // Reference to a Location document
  id?: string;
  dateRange: Date[];
  duration?: {
    value: number;
    timeUnit: string;
  };
  additionalInfo?: string;
  cost?: number;
}

export interface ITripDto {
  owner_id: Types.ObjectId;
  name: string;
  participants_ids: Types.ObjectId[];
  permissions: Permission[];
  locations: LocationInTrip[];
  visibility: Visibility;
  transportations: Transportation[];
  reviews: Review[];
}

export interface Transportation {
  origin: Types.ObjectId;
  destination: Types.ObjectId;
  type: TransportationType;
}

export interface LocationInTrip {
  location_id: Types.ObjectId; // Reference to a Location document
  id: string;
  dateRange: Date[];
  duration: {
    value: number;
    timeUnit: string;
  };
  additionalInfo: string;
  cost: number;
}

export interface Review {
  user_id: Types.ObjectId;
  rate: number;
  description: string;
  images: string[]; // Array of image URLs
}

const LocationInTripSchema: Schema = new Schema({
  location_id: { type: Types.ObjectId, ref: 'Location', required: true },
  id: { type: String, required: true },
  dateRange: [{ type: Date }, { type: Date }],
  duration: {
    value: { type: Number },
    timeUnit: { type: String },
  },
  additionalInfo: { type: String },
  cost: { type: Number },
});

const TripSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner_id: { type: Types.ObjectId, required: true },
  participants_ids: [{ type: Types.ObjectId }],
  locations: [LocationInTripSchema],
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
