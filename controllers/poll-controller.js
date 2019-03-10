const Poll = require('../models/poll');
const Participant = require('../models/participant');
const {
  CreatePostObject,
} = require('../utils');

exports.Get_Poll = (req, res) => {
  Poll
    .findOne({
      slug: req.params.slug,
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
  Poll
    .find({
      slug: req.body.slug,
    })
    .exec()
    .then((filteredPoll) => {
      if (filteredPoll.length >= 1) {
        res.statusText = 'Bu slug kullanılıyor';
        return res.status(500).json();
      }
      const poll = new Poll(CreatePostObject(req.body));
      poll
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
    });
};

exports.Get_All_Polls = (req, res) => {
  const perPage = 10;
  const {
    page,
  } = req.params;
  let count = 0;
  Poll.count({}, (err, countItems) => {
    count = countItems;
  });
  Poll
    .find()
    .select('name desc slug user createdAt')
    .populate('user', '_id email')
    .limit(perPage)
    .skip(perPage * page)
    .sort({
      createdAt: -1,
    })
    .exec()
    .then((polls) => {
      res.status(200).json({
        polls,
        count,
      });
    })
    .catch((error) => {
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
          message: 'Anketleri Getirdik...',
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
