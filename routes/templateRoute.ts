import express from "express";
import {
  addTemplate,
  getActiveTemplate,
  getTemplates,
} from "../controllers/template";
export const templateRoute = express.Router();

templateRoute.get("/", getTemplates);
//Get all templates
templateRoute.get("/active", getActiveTemplate); // get current active template
templateRoute.post("/", addTemplate);
//templateRoute.patch('/:id', setDefaultTemplate); // set template as default setting all other not default
