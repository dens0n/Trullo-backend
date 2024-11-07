import mongoose, { Schema, Document } from 'mongoose';

interface IProject extends Document {
  name: string;
  tasks: mongoose.Types.ObjectId[];
}

// Project-schema
const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }], // En array med referenser till tasks
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
