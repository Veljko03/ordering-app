const { Schema, model, models } = require("mongoose");

const CategorySchema = new Schema({
  name: String,
});

export default models?.Category || model("Category", CategorySchema);
