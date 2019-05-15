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
  const participant = new Participant(CreatePostObject(req.body));
  participant
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
          const userAnswers = req.body.answers;
          const { questions } = poll;
          // userAnswer.lenght should equals to poll.questions.lenght
          for (let i = 0; i < questions.length; i += 1) {
            // increase counts
            const {questionIndex, answerIndex} =userAnswers[i];
            questions[questionIndex].answers[answerIndex].count+=1;
            questions[questionIndex].count += 1;
          }
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
      console.log(error);
      res.status(500).json({
        error,
      });
    });
};
