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
      .then(res.json(users))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  }
};