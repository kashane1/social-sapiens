const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

/*
GET all users
GET a single user by its _id and populated thought and friend data
POST a new user:
  example data
{
  "username": "lernantino",
  "email": "lernantino@gmail.com"
}
PUT to update a user by its _id
DELETE to remove user by its _id
BONUS: Remove a user's associated thoughts when deleted.
*/

module.exports = {
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        return res.json(users);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .then('-__v')
    .then(res.json(res)) // not sure about this res.json within the .then()
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    })
  },
  createUser(req, res) {
    User.create(req)
      .then() // still need to fill this .then
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  updateUser(req, res) {
    User.findOneAndUpdate(req)
      .then() // still need to fill this .then
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  deleteUser(req, res) {
    User.deleteOne(req.params.id)
      .then( // bonus, trying to delete thoughts created by the deleted user
        Thought.deleteMany(User.find(req.params.id).thoughts) // definitely not sure if this works
      )
      .then(console.log(`Successfully deleted user with id: ${req.params.id}`)) // not sure about this 
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  addFriend(req, res) {
    User.updateOne(req.userId, req.friendId)
      .then() // still need to fill this .then
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  removeFriend(req, res) {
    User.updateOne(req.userId, req.friendId)
      .then() // still need to fill this .then
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  }
};