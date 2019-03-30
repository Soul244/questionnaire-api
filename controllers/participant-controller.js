const Participant = require('../models/participant');
const Poll = require('../models/poll');
const { CreatePostObject } = require('../utils');

exports.Get_Participants = (req, res) => {
  Poll
    .findOne({
      _id: req.params._id,
    })
    .exec()
    .then((poll) => {
      if (poll.length < 1) {
        res.statusMessage = 'Anket bulunamadi';
        return res.status(204).end();
      }
      return poll._id;
    })
    .then((pollId) => {
      Participant.find({
        pollId,
      })
        .exec()
        .then((participants) => {
          if (participants.length > 0) {
            res.status(200).json({
              participants,
            });
          } else {
            res.statusMessage = 'Katilimci bulunamadi';
            res.status(204).end();
          }
        });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

exports.Create_Participant = (req, res) => {
  const {participant} = req.body;
  const participantModel = new Participant(participant);
  participantModel
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Kaydınız alınmıştır...',
      });
    })
    .then(() => {
      Poll.findOne({
        _id: participant.pollId,
      })
        .exec()
        .then((poll) => {
          const userAnswers = participant.answers;
          const { questions } = poll;
          // userAnswer.lenght should equals to poll.questions.lenght
          for (let i = 0; i < userAnswers.length; i += 1) {
            // Find questionIndex in poll.questions which answered by participant
            const questionIndex = questions.findIndex(question=>question._id===userAnswers[i].questionId)
            // Find answerIndex in poll.questions which answered by participant
            const answerIndex = questions[questionIndex].answers.findIndex(answer=>answer._id===userAnswers[i].answerId)
            // increase counts
            questions[questionIndex].answers[answerIndex].count+=1;
            questions[questionIndex].count += 1;
          }
          console.log(questions);
          return {
            questions,
          };
        })
        .then(({
          questions,
        }) => {
          Poll.update({
            _id: req.body.pollId,
          }, {
            $set: {
              questions,
            },
          }).exec();
        });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};
