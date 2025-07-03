const { Schema, model, models } = require("mongoose");

const CategorySchema = new Schema({
  name: String,
  startTime: {
    type: String,
    required: false,
  },
  endTime: {
    type: String,
    required: false,
  },
});

export default models?.Category || model("Category", CategorySchema);
