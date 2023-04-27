import { Request, Response } from "express";
import { Template} from "../interfaces/interfaces";
import { ITemplates } from "../interfaces/interfaces";

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates: ITemplates[] = await Template.find({})
    .populate({
      path: "categories",
      populate: {
        path: "questions"
      },
    })
      .exec();
   
    res.status(200).json(templates);
  } 
  catch (error) {
    console.log(error);
    res.status(500).json("server responded with an error");
  }
};

