import { ITemplate, Template } from "../models/template";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const searchTemplate = async (template: string): Promise<number> => {
  const data = await Template.find({}).lean();
  console.log(data);
  return data.length;
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates: ITemplate[] = await Template.find({})
      .populate({
        path: "categories",
        select: "-__v -_id",
        populate: {
          path: "questions",
          select: "-__v",
        },
      })
      .exec();
    res.status(200).json(templates);
  } catch (error) {
    console.log(error);
    res.status(500).json("server responded with an error");
  }
};

export const getActiveTemplate = async (req: Request, res: Response) => {
  try {
    // Find the active template
    const template = await Template.findOne({ active: true })
      .select("-__v")
      .populate({
        path: "categories",
        select: "-__v -_id",
        populate: {
          path: "questions",
          select: "-__v",
          //  match: {"question.active":true },
        },
      })
      .exec();
    // Send the template data in the response
    res.status(200).json(template);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const addTemplate = async (req: Request, res: Response) => {
  const httpData: ITemplate = req.body;
  const primaryKey = uuidv4();

  const newTemplate: ITemplate = {
    _id: primaryKey,
    templateTitle: httpData.templateTitle,
    instructions: httpData.instructions,
    createdOn: new Date(),
    categories: httpData.categories,
    createdBy: "",
    active: true,
  };

  try {
    // Find the active template

    const template = await new Template(newTemplate).save();
    if (template) {
      const needDefault = (await searchTemplate(primaryKey)) >= 1;
      if (needDefault) {
        const setDefault = await Template.updateMany(
          { _id: { $ne: primaryKey } },
          { active: false }
        );
        if (setDefault.modifiedCount === 0) {
          return res.status(403).json("failed to set template as default");
        }
        return res.status(200).json("saved and set as default");
      }
    } else {
      res.status(501).send("saving failed");
    }
    // Send the template data in the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/// set default template

export const setDefaultTemplate = async (req: Request, res: Response) => {
  const httpData: String = req.params.id;

  if (!httpData) {
    res.status(404).json("Post data not found or empty");
    return;
  }

  try {
    // Find the active template

    const template = await Template.updateOne(
      { _id: httpData },
      { active: true }
    );
    if (template.modifiedCount !== 0) {
      const result = await Template.updateMany(
        { _id: { $ne: httpData } },
        { active: false }
      );

      if (result.modifiedCount === 0) {
        res.status(403).json("failed to remove other template as default");
      } else {
        res.status(200).json("template set as default");
      }
    }

    // Send the template data in the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
