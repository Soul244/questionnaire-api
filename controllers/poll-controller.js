const mongoose = require('mongoose');
const Poll = require('../models/poll');
const Participant = require('../models/participant');
const _ = require('lodash');
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
  const pollModel = new Poll(CreatePostObject(req.body));
  console.log(pollModel)
  pollModel
    .save()
    .then((poll) => {
      res.status(201).json({
        poll,
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

exports.Copy_Poll = (req, res)=>{
  console.log(req.params._id)
  Poll.findOne({
    _id: req.params._id,
  })
  .exec()
  .then((poll) => {
    if (poll.length < 1) {
      res.statusMessage = 'Anket bulunamadi';
      return res.status(204).end();
    }
    poll._id= new mongoose.Types.ObjectId();
    const pollModel = new Poll(_.pickBy(poll, (val, key) => key !== '__v'));
    pollModel
    .save()
    .then((savedPoll) => {
      console.log(savedPoll);
      res.status(201).json({
        poll: savedPoll,
        message: 'Anket Kopyası Kaydedildi',
      });
    }).catch((error) => {
      console.log(error);
      res.status(500).json({
        error,
      });
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      error,
    });
  });
}

exports.Get_Polls = (req, res) => {
  const { _id } = req.user;
  const {page} = req.params;
  const perPage = 3
  Poll.find({
    user: _id,
  })
    .limit(perPage)
    .skip(perPage*page)
    .sort({
      createdAt: -1,
    })
    .exec()
    .then((polls) => {
      Poll.countDocuments({user:_id}, (err,count)=>{
          res.status(200).json({
          polls: polls,
          pageCount: Math.ceil(count/(perPage))-1
        });
      })
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
