import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { IQCategory, Category } from "../models/template";

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category: IQCategory = await Category.find({}).select("-__v").lean();
    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const httpData = req.body;
    const data: IQCategory = {
      _id: uuidv4(),
      categoryName: httpData.name,
      description: httpData.description,
      questions: httpData.questions,
      createdBy: httpData.createdBy,
      categoryStatus: true,
      createdOn: new Date(),
    };

    const q = await new Category(data).save();
    if (q) {
      return res.status(200).json("saved");
    } else {
      return res.status(501).json("failed to save");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
};
