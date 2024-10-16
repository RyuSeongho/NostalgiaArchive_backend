import mongoose from 'mongoose';
import Counter from './Counter.js';
import { Schema } from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    postGenuineId: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }],
    nickname: {
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
  },
  {
    timestamps: true, // createdAt과 updatedAt 필드가 자동으로 관리됩니다.
    toJSON: {
      transform: function(doc, ret) {
          delete ret.password;  // 응답할 때 password 필드를 제거
          delete ret.updatedAt;
          delete ret._id;
          delete ret.__v;
          delete ret.postGenuineId;
      }
    },
  }
);


CommentSchema.pre('save', async function () {
  const doc = this;
  
  if (!doc.isNew) return; // 새 문서가 아니면 패스

  try {
    // Counter 모델을 사용해 자동 증가 id 생성
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'commentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.id = counter.seq;  // 자동 증가된 id 할당
  } catch (error) {
    throw new Error('Error generating sequence ID: ' + error.message);
  }
});

const Comment = mongoose.model('Comment', CommentSchema);


export default Comment;