const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// this is my first attempt at reactionCount
// const reactionCount = async () =>
//   Thought.reactions.aggregate() // this line is weird to me, might need to take out .reactions
//     .count('reactionCount')
//     .then((numberOfReactions) => numberOfReactions);

// this will be my 2nd attempt at reactionCount
const reactionCount = async (thoughtId) =>
  Thought.aggregate([
    // only include the given thought by using $match
    { $match: { _id: ObjectId(thoughtId) } },
    {
      $group: {
        _id: ObjectId(thoughtId),
        numberOfReactions: { $sum: '$reactions' },
      },
    },
  ]);


// need to start here and change all the user stuff to thought stuff.
// might be some small differences when it comes to the reactions? because we arent passing in :reactionId

module.exports = {
  // get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtsObj = {
          thoughts,
          // reactionCount: await reactionCount(),
        };
        return thoughtsObj;
      })
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
    .then(async (thought) => {
      const thoughtObj = {
        thought,
        reactionCount: await reactionCount(),
      };
      return res.json(thoughtObj);
    })
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
          { _id: req.params.userId },
          { $addToSet: { thoughts: thoughtData._id}}
        );
      })
      .then((thought) => res.json(thought))
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
      { $set: {createdAt: Date.now} },
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
      { $pull: { reactions: { reactionId: req.params.reactionId } } }, // i think this is a special case, and i dont need the friendId object there
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