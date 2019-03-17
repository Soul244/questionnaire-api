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
        _id: req.body.pollId,
      })
        .exec()
        .then((poll) => {
          const userAnswers = req.body.answers;
          const { answers, questions } = poll;
          for (let i = 0; i < userAnswers.length; i += 1) {
            for (let k = 0; k < answers.length; k += 1) {
              if (userAnswers[i].questionIndex === answers[k].questionIndex) {
                if (userAnswers[i].index === answers[k].index) {
                  answers[k].count += 1;
                }
              }
            }
            questions[i].count += 1;
          }
          return {
            answers,
            questions,
          };
        })
        .then(({
          answers,
          questions,
        }) => {
          Poll.update({
            _id: req.body.pollId,
          }, {
            $set: {
              answers,
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
