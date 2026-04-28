import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => nanoid(10),
    },
  },
  { timestamps: true }
);

const Group = mongoose.model('Group', groupSchema);
export default Group;
