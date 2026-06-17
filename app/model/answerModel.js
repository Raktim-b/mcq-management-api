const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const answerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedAnswer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
const answerModel = mongoose.model("answer", answerSchema);
module.exports = answerModel;
