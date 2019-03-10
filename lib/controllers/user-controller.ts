import { ICRUD } from './../interfaces/ICRUD';
const User = require('../../dist/models/user');
const mongoose = require('mongoose');

class UserController implements ICRUD {
  getOne(id: string): object {
    return (req:any, res:any) => {
      User.find({ _id: req.params.user })
        .exec()
        .then((user:object) => {
          res.status(201).json({
            user
          });
        })
        .catch((error:any) => {
          res.status(500).json({
            error
          });
        });
    };
  }
}
