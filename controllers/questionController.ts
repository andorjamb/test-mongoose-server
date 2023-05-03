import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { IQuestion, Category, Question } from "../models/template";

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const qusetions: IQuestion = await Question.find({}).select("-__v").lean();

    res.status(200).json(qusetions);
  } catch (error) {
    res.status(500).json("error");
    console.log(error);
  }
};

export const getQuestionId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const questions = await Question.findOne({ _id: id }).select("-__v").lean();

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json("error");
    console.log(error);
  }
};

export const addQuestion = async (req: Request, res: Response) => {
  try {
    const httpData = req.body;
    const primaryKey = uuidv4();

    const data: IQuestion = {
      _id: primaryKey,
      category: httpData.category,
      question: httpData.question,
      createdBy: httpData.createdBy,
      type: httpData.type,
      active: true,
      createdOn: new Date(),
    };

    const q = await new Question(data).save();
    if (q) {
      const updateResult = await Category.updateOne(
        { _id: httpData.category },
        { $push: { questions: primaryKey } }
      ).exec();
      console.log("Update result:", updateResult);
    }
    console.log(q);
    res.status(200).json("saved");
  } catch (error) {
    res.status(500).json("error");
    console.log(error);
  }
};
