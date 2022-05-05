const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true, // need to check this unique syntax
      required: true,
      max_length: 50,
    },
    email: {
      type: String,
      unique: true, // need to check this unique syntax
      required: true,
      max_length: 50,
    },
    thoughts: [/* Array of `_id` values referencing the `Thought` model */
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      }
    ],
    friends: [/*Array of `_id` values referencing the `User` model (self-reference) */
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// creates a virtual property 'friendCount' that returns the length of the friends array
userSchema
  .virtual('friendCount')
  .get(function () {
    return this.friends.length;
  })

// Initializze the User model
const User = model('user', userSchema);

module.exports = User;
