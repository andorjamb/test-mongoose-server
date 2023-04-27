const mongoose = require('mongoose');

//schema of json object use by exove
export const employeeSchema = new mongoose.Schema(
    {
        id: String,
        firstName: String,
        surname: String,
        email: String,
        displayName: String,
        about: {
            avatar: String,
            hobbies: [String],
        },
        work: {
            reportsTo: {
                id: String,
                firstName: String,
                surname: String,
                email: String
            },
            title: String,
            department: String,
            site: String,
            startDate: String
        }

    }
)


//Jesse's user schemas

export const usersSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email!`,
      },
    },
    displayName: String,
    imageUrl:String,
  //   personal:  { type: String, required: true },
  //   about: [{ type: mongoose.Schema.Types.ObjectId, ref: "About" }],
    rolesId:Number,
    workId: [
      {
        reportsTo: { type: mongoose.Schema.Types.String },
        workReportStatus: Boolean,
        createdOn: Date,
        deactivatedOn: Date,
      },
    ],
    title: String,
    department: String,
    site: String,
    startDate: Date,
    phone: String,
    userStatus: Boolean,
  
  });

  export const worksReportSchema = new mongoose.Schema({
    _id: { type: Number, required: true},
    userId: { type: mongoose.Schema.Types.String },
    reportsTo: { type: mongoose.Schema.Types.String },
    workReportStatus: Boolean,
    createdOn: Date,
    deactivatedOn: Date,
  });
  