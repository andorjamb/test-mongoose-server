import { Request, Response } from "express";
import { ITemplate, Template } from "../models/template";

export const getTemplates = async () => {
  try {
    const templates: ITemplate[] = await Template.find({})
      /*   .populate({
        path: "categories",
        populate: {
          path: "questions",
        },
      }) */
      .exec();
    return templates;
  } catch (error) {
    console.log(error);
    // res.status(500).json("server responded with an error");
  }
};

export const addTemplate = async (body: ITemplate) => {
  console.log(body); //debugging
  const newTemplate = new Template(body);
  try {
    await newTemplate.save().then((result) => console.log("doc saved"));
  } catch (err) {
    console.log(err);
  }
};

export const getActiveTemplate = async () => {
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
    return template;
  } catch (err) {
    console.error(err);
  }
};
