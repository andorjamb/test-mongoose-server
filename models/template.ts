import mongoose from "mongoose";

export const templateSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  templateTitle: { type: String, required: true },
  instructions: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  categories: [
    {
      category: { type: String, ref: "Category" },
      questions: [{ type: String, ref: "Question" }],
    },
  ],
  active: Boolean,
});

export interface ITemplate {
  _id: string;
  templateTitle: string;
  instructions: string;
  createdOn: Date;
  createdBy: string;
  categories: ICat_Quest[];
  active: boolean;
}

export interface ICat_Quest {
  category: string;
  questions: string[];
}

export const Template = mongoose.model<ITemplate>("Template", templateSchema);

export const CategorySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // your custom ID field
  categoryName: { type: String, required: true },
  description: { type: String },
  questions: { type: [mongoose.Schema.Types.String], ref: "Question" },
  createdOn: Date,
  createdBy: { type: mongoose.Schema.Types.String, required: true },
  categoryStatus: Boolean,
});

export interface IQCategory {
  _id: String;
  categoryName: String;
  description?: String;
  questions?: String[];
  createdOn: Date;
  createdBy: String;
  categoryStatus: Boolean;
}

export const Category = mongoose.model<IQCategory>("Category", CategorySchema);

export const questionSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // your custom ID field
  category: { type: String, ref: 'Category', required: true },
  createdBy: {
    type: String,
    ref: "Users",
    required: true,
  },
  createdOn: Date,
  active: Boolean,
  type: { type: String, required: true, default:"String"},
  question: [
    {
    lang: { type: String, required: true }, //can be eng,fin,swd language
    question:{ type: String, required: true }, // question string eg how old are you
  },
]
});

export interface IQuestion {
  _id: String;
  category: String,
  createdBy: String,
  createdOn: Date;
  active: Boolean,
  type: String,
  question: IQuestionLang[];// hold an array of questions
}


interface IQuestionLang{
  _id:String,
  lang: String,
  question?: String,
  answer?: String
  answeredOn?:Date,
}

export const Question = mongoose.model('Question', questionSchema)






export interface IConvertedTemplate {
  id: string; //maps to database doc id
  templateTitle: string;
  sections: ISection[];
  active: boolean;
}

export interface ISection {
  id: string; //maps to database doc id
  name: string;
  questions: ITemplateQuestion[];
}

export interface ITemplateQuestion {
  id: string; //maps to database doc id
  question: string;
  isFreeForm: boolean;
}
