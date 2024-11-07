import mongoose, { Schema, Document } from 'mongoose';

// Typdeklaration för User-dokumentet
interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Lagrar lösenordshashen
  role?: 'user' | 'admin'; // Rollhantering för behörigheter (ex. admin)
}

// User-schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Kom ihåg att hashning hanteras separat
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  {
    timestamps: true, // Skapar createdAt och updatedAt automatiskt
  }
);

export default mongoose.model<IUser>('User', UserSchema);
