import Category from "@/models/Category";
import Item from "@/models/Item";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    await mongoose.connect(process.env.NEXT_MONGO_URL);
    const newCategory = await Category.create({ name: body.name });
    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Some error while adding new category" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_URL);

    const url = new URL(req.url);
    console.log("oov je url ", url);

    const _id = url.searchParams.get("_id");
    const itemCount = await Item.countDocuments({ categoryId: _id });

    if (itemCount > 0) {
      return new Response(
        JSON.stringify({
          error: `Ne možeš obrisati kategoriju jer je povezana sa ${itemCount} item(a).`,
        }),
        { status: 400 }
      );
    }
    console.log("oov je id ", _id);
    await Category.deleteOne({ _id });
    return Response.json(true);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Some error while adding new category" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await mongoose.connect(process.env.NEXT_MONGO_URL);
    const { _id, name, startTime, endTime } = await req.json();
    await Category.updateOne(
      { _id },
      {
        name,
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
      }
    );
    return Response.json(true);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Some error while adding new category" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  await mongoose.connect(process.env.NEXT_MONGO_URL);
  const category = await Category.find();
  return new Response(JSON.stringify(category), { status: 201 });
}
