const { Schema, model, models } = require("mongoose");

const SizesSchema = new Schema({
  size: String,
  price: Number,
});

const AddonsSchema = new Schema({
  name: String,
  price: Number,
  active: Boolean,
});

const ItemSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  name: String,
  description: String,
  imageUrl: String,
  sizes: [SizesSchema],
  addons: [AddonsSchema],
});

export default models?.Item || model("Item", ItemSchema);
