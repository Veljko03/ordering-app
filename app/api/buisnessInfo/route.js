import GeneralInfo from "@/models/GeneralInfo";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("this is body ", body);

    await mongoose.connect(process.env.NEXT_MONGO_URL);

    const existing = await GeneralInfo.findOne();

    let result;

    if (existing) {
      // ako postoji azurira se, ako ne postoji pravi se novi
      await GeneralInfo.updateOne({ _id: existing._id }, body);
      result = await GeneralInfo.findById(existing._id);
    } else {
      result = await GeneralInfo.create(body);
    }

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return new Response(JSON.stringify({ error: "Failed to save schedule" }), {
      status: 500,
    });
  }
}

export async function GET() {
  await mongoose.connect(process.env.NEXT_MONGO_URL);
  const schedules = await GeneralInfo.find();
  return new Response(JSON.stringify(schedules), { status: 201 });
}
