/* v8 ignore start */
import { Schema, Document, Types, models, model } from 'mongoose';

interface User extends Document {
  first_name: string;
  last_name: string;
  image: string; // URL to the user's image
  default_trip: Types.ObjectId; // Reference to the user's default trip
}

const UserSchema: Schema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  image: { type: String, required: true },
  default_trip: { type: Types.ObjectId, ref: 'Trip' }, // Reference to the Trip model
  trips: [{ type: Types.ObjectId, ref: 'Trip' }],
  locations: [{ type: Types.ObjectId, ref: 'Location' }],
});

const User = models.User || model<User>('User', UserSchema);
export default User;

/* v8 ignore stop */
