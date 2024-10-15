import mongoose from 'mongoose';
import Counter from './Counter.js';

const GroupSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    imageUrl: {
      type: String,
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
    badges: {
      type: [String], // 배열이므로 타입은 String으로 설정
      default: [],
    },
    postCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    introduction: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt과 updatedAt 필드가 자동으로 관리됩니다.
    toJSON: {
      transform: function(doc, ret) {
          delete ret.password;  // 응답할 때 password 필드를 제거
      }
  }
  }
);

GroupSchema.pre('save', async function () {
  const doc = this;
  
  if (!doc.isNew) return; // 새 문서가 아니면 패스

  try {
    // Counter 모델을 사용해 자동 증가 id 생성
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'groupId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.id = counter.seq;  // 자동 증가된 id 할당
  } catch (error) {
    throw new Error('Error generating sequence ID: ' + error.message);
  }
});

const Group = mongoose.model('Group', GroupSchema);


export default Group;