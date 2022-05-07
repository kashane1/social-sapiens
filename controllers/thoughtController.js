const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughtsObj) =>
        !thoughtsObj
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(thoughtsObj)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // get a single thought
  getOneThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .populate('reactions')
    .then(async (thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
    )
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    })
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thoughtData._id}}
        );
      })
      .then(async (user) =>
        !user
          // needed a small edit here, couldn't find the problem
          ? res.status(404).json({ message: 'Successfully created thought' }) 
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // update a current thought by its _id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: {thoughtText: req.body.thoughtText} },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // delete a thought by its _id
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({ message: 'Successfully removed thought' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // add a reaction to a thought
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: {reactions: req.body} },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({ message: 'Successfully added reaction to thought' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  },
  // remove a reaction from a thought
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } }, 
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({ message: 'Successfully deleted reaction from thought' })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
  }
};