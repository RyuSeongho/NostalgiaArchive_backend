import mongoose from 'mongoose';
import Counter from './Counter.js';
import { Schema } from 'mongoose';
import Group from './Group.js';

const PostSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    groupGenuineId: [{
        type: Schema.Types.ObjectId,
        ref: 'Group',
    }],
    nickname: {
      type: String,
      required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    tags: {
        type: [String], // 배열이므로 타입은 String으로 설정
        default: [],
    },
    location: {
        type: String,
        required: true,
    },
    moment: {
        type: Date,
        required: true,
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
  },
  {
    timestamps: true, // createdAt과 updatedAt 필드가 자동으로 관리됩니다.
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
          delete ret.password;
          delete ret.updatedAt;
          delete ret._id;
          delete ret.__v;
          delete ret.groupGenuineId;
      }
    },
  }
);

PostSchema.pre('save', async function () {
  const doc = this;
  
  if (!doc.isNew) return; // 새 문서가 아니면 패스

  try {
    // Counter 모델을 사용해 자동 증가 id 생성
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'postId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.id = counter.seq;  // 자동 증가된 id 할당
  } catch (error) {
    throw new Error('Error generating sequence ID: ' + error.message);
  }
});

const Post = mongoose.model('Post', PostSchema);


export default Post;