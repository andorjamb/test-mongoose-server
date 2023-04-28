import { Request, Response } from "express";
import { Template, ITemplate } from "../interfaces/interfaces";


export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates: ITemplate[] = await Template.find({})
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

export const addTemplate = async(body:ITemplate)=>{
  console.log(body) //debugging
  const newTemplate = new Template(body);
  try {
    await newTemplate.save()
    .then(result => console.log('doc saved'))
  } catch (err) {
    console.log(err)
  }
}

