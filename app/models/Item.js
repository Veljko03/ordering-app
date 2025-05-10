const { Schema, model, models } = require("mongoose");

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

const SizesSchema = new Schema({
  size: String,
  price: Number,
});

const AddonsSchema = new Schema({
  name: String,
  price: Number,
  active: Boolean,
});

export default models?.Item || model("Item", ItemSchema);
