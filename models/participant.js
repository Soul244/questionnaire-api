const mongoose = require('mongoose');

const participantSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  pollId: { type: String, required: true },
  answers: [{
    questionIndex: { type: Number, required: true },
    index: { type: Number, required: true },
    hasRightAnswer: { type: Boolean, required: true },
    isTrue: { type: Boolean },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Participant', participantSchema);
