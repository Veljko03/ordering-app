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
  basePrice: Number, //dodati ovu cenu na front i preracunati cene na osnovu base cene + prilozi + velicina
  description: String,
  imageUrl: String,
  sizes: [SizesSchema],
  addons: [AddonsSchema],
});

// proveriti kako da uradim da kada se proveri kategorija da se refresuje i u itemu pa da se prikaze
//jer kada obrisem kategoriju ona i dalje ostaje u itemu iako  ne bi trebala

export default models?.Item || model("Item", ItemSchema);
