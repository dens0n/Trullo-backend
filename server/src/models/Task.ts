import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
  title: string;
  description: string;
  status: 'to-do' | 'in progress' | 'blocked' | 'done';
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  finishedBy?: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['to-do', 'in progress', 'blocked', 'done'],
      default: 'to-do',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    finishedBy: { type: Date },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITask>('Task', TaskSchema);
