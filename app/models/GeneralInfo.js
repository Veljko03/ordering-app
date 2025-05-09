const { Schema, model, models } = require("mongoose");

const GeneralInfoSchema = new Schema({
  name: String,
  description: String,
  logoUrl: String,
  contactPhone: String,
  adress: String,
  social: {
    instagram: String,
    facebook: String,
    tiktok: String,
  },
  theme: {
    navbarColor: String,
    textColor: String,
    font: String,
  },
});

export default models?.GeneralInfo || model("GeneralInfo", GeneralInfoSchema);
