const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// this is my first attempt at friendCount
const friendCount = async () =>
  User.friends.aggregate() // this line is weird to me, might need to take out .friends
    .count('friendCount')
    .then((numberOfFriends) => numberOfFriends);

// this will be my 2nd attempt at friendCount
// const friendCount = async (userId) =>
//   User.aggregate([
//     // only include the given user by using $match
//     { $match: { _id: ObjectId(userId) } },
//     {
//       $group: {
//         _id: ObjectId(userId),
//         friendCount: { $sum: '$friends' },
//       },
//     },
//   ]);


module.exports = {
  // get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const usersObj = {
          users,
          friendCount: await friendCount(),
        };
        return res.json(usersObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // get a single user
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .then('-__v')
    .populate('thoughts')
    .populate('friends')
    .then(async (user) => {
      const userObj = {
        user,
        friendCount: await friendCount(),
      };
      return res.json(userObj);
    })
    .then(async (user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
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
      { $set: {email: req.body.email} },
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
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => 
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany(
            { username: User.findOne(
              { _id: req.params.userId })
              .then((user) => { 
                return user.username; 
              })
            }
          )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({ message: 'Successfully removed user' })
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
      { $addToSet: {friends: req.body} },
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
  // remove a friend from a user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { friendId: req.params.friendId } } }, // i think this is a special case, and i dont need the friendId object there
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({ message: 'Successfully removed friend to user' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  }
};