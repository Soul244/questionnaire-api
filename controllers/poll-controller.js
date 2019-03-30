const Poll = require('../models/poll');
const Participant = require('../models/participant');
const {
  CreatePostObject,
} = require('../utils');

exports.Get_Poll = (req, res) => {
  Poll.findOne({
      _id: req.params._id,
    })
    .exec()
    .then((poll) => {
      if (poll.length < 1) {
        res.statusMessage = 'Anket bulunamadi';
        return res.status(204).end();
      }
      return res.status(200).json({
        poll,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

exports.Create_Poll = (req, res) => {
  const {poll} = req.body;
  const pollModel = new Poll(poll);
  pollModel
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Anket Kaydedildi',
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error,
      });
    });
};


exports.Get_Polls = (req, res) => {
  const { _id } = req.user;
  Poll.find({
    user: _id,
  })
    .sort({
      createdAt: -1,
    })
    .exec()
    .then((polls) => {
      if (polls.length > 0) {
        res.status(200).json({
          polls,
        });
      } else {
        res.statusMessage = 'Katilimci bulunamadi';
        res.status(204).end();
      }
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

exports.Delete_Poll = (req, res) => {
  Poll.remove({
    _id: req.params._id,
  })
    .exec()
    .then(() => res.status(200)
      .json({
        message: 'Anket Silindi',
      }))
    .then(() => {
      Participant.remove({
        pollId: req.params._id,
      })
        .exec();
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

exports.Update_Poll = (req, res) => {
  const updateOps = {};
  const options = {
    new: true,
  };
  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }
  Poll.update({
    _id: req.body._id,
  }, {
    $set: updateOps,
  }, options)
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Anket Güncellendi',
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};
