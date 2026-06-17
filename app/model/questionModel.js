const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: [
      {
        type: String,
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "category",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const questionModel = mongoose.model("question", questionSchema);
module.exports = questionModel;
