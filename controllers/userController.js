const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // get all users
  getUsers(req, res) {
    User.find()
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // get a single user
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .select('-__v')
    .populate('thoughts')
    .populate('friends')
    .then(async (userObj) =>
      !userObj
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(userObj)
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    })
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((userData) => res.json(userData))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // update a current user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: {username: req.body.username} },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // delete a user and remove their thoughts
  // definitely a tricky one, the deleteMany
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => 
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany(
            // { username: User.findOne( { _id: req.params.userId })
            //   .then((user) => { 
            //     return user.username; 
            //   })
            // }

            // also can try this way:
            // tried really hard to get this to work, no success
            { username: ((async) => {
              User.findOne({ _id: req.params.userId })
                .then((userData) => { return userData.username })
              })
            }
          )
          .then(res.json({ message: 'Successfully removed user' }))
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // add a friend to a user
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: {friends: req.params.friendId} },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({ message: 'Successfully added friend to user' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // delete a friend from a user
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } }, 
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({ message: 'Successfully deleted friend from user' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  }
};