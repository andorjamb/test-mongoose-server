import { Test } from "../models/test";

export const getTests = async () => {
  try {
    const tests = await Test.find({})
      .exec()
      .then((res) => {return res});
  } catch (error) {
    console.log(error);
  }
};
