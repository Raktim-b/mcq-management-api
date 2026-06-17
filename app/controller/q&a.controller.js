const answerModel = require("../model/answerModel");
const categoryModel = require("../model/categoryModel");
const questionModel = require("../model/questionModel");
const httpStatusCode = require("../utils/httpStatusCode");

class QAController {
  async createCategory(req, res) {
    try {
      const { categoryName } = req.body;
      if (!categoryName) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }
      const existingCategory = await categoryModel.findOne({
        categoryName,
      });
      if (existingCategory) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Category already exists",
        });
      }
      const category = new categoryModel({
        categoryName,
      });

      const result = await category.save();

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "created Successfully",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCategory(req, res) {
    try {
      const users = await categoryModel.find({
        isDeleted: false,
      });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "category fetched successfully",
        data: users,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async createQuestion(req, res) {
    try {
      const { question, options, correctAnswer, categories } = req.body;

      if (!question || !options || !correctAnswer || !categories) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existingQuestion = await questionModel.findOne({
        question,
        isDeleted: false,
      });

      if (existingQuestion) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Question already exists",
        });
      }

      const newQuestion = new questionModel({
        question,
        options,
        correctAnswer,
        categories,
        createdBy: req.user.id,
      });

      const result = await newQuestion.save();

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Question created successfully",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getQuestions(req, res) {
    try {
      const questions = await questionModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
          },
        },
        {
          $unwind: "$createdBy",
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Questions fetched successfully",
        data: questions,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getQuestionsByCategory(req, res) {
    try {
      const { categoryName } = req.query;

      const questions = await questionModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
          },
        },
        { $unwind: "$categories" },
        {
          $match: {
            "categories.categoryName": categoryName,
            isDeleted: false,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async submitAnswer(req, res) {
    try {
      const userId = req.user.id;
      const { questionId, selectedAnswer } = req.body;

      const question = await questionModel.findById(questionId);

      if (!question) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Question not found",
        });
      }

      const isCorrect = question.correctAnswer === selectedAnswer;

      const answer = new answerModel({
        userId,
        questionId,
        selectedAnswer,
        isCorrect,
      });
      await answer.save();
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: isCorrect ? "Correct Answer" : "Wrong Answer",
        data: {
          selectedAnswer,
          isCorrect,
        },
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new QAController();
