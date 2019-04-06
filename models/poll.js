const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  css: { type: String },
  js: { type: String },
  name: { type: String, required: true },
  desc: { type: String },
  lastDesc: { type: String },
  selectableLastMessages: [{
    type: { type: String },
    content: { type: String },
  }],
  questions: [{
    type: { type: String },
    content: { type: String },
    desc: { type: String },
    count: { type: Number, default: 0 },
    rightAnswerIndex: { type: Number, default: null },
    answers: [{
      type: { type: String },
      content: { type: String },
      desc: { type: String },
      count: { type: Number, default: 0 },
    }],
  }],
  settings: {
    hasAnswerAutoChangeTime: { type: Boolean },
    hasAnswerTime: { type: Boolean },
    hasAnswerPercent: { type: Boolean },
    hasPollTime: { type: Boolean },
    answerAutoChangeTime: { type: String },
    answerTime: { type: String },
    pollTime: { type: String },
    showType: { type: String },
    isPollActive: { type: String },
    type: { type: String },
    userDataCollectType: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Poll', pollSchema);
