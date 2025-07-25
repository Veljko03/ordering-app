import Item from "@/models/Item";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    await mongoose.connect(process.env.NEXT_MONGO_URL);
    const newItem = await Item.create(body);
    return new Response(JSON.stringify(newItem), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Some error while adding new item" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_URL);

    const url = new URL(req.url);

    const _id = url.searchParams.get("_id");
    await Item.deleteOne({ _id });
    return Response.json(true);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Some error while adding new Item" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_URL);
    const {
      _id,
      name,
      description,
      imageUrl,
      categoryId,
      sizes,
      addons,
      basePrice,
    } = await req.json();

    await Item.updateOne(
      { _id },
      {
        name,
        description,
        imageUrl,
        categoryId,
        basePrice,
        sizes,
        addons,
      }
    );
    return Response.json(true);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Some error while adding new Item" }),
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await mongoose.connect(process.env.NEXT_MONGO_URL);

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  let items;
  if (categoryId) {
    items = await Item.find({ categoryId });
  } else {
    items = await Item.find(); //  svi itemi
  }

  return new Response(JSON.stringify(items), { status: 200 });
}
