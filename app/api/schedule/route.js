import { Schedule } from "@/app/models/WeeklySchedule";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const body = await req.json();

    await mongoose.connect(process.env.NEXT_MONGO_URL);
    console.log(body);

    await Schedule.deleteMany({});

    const newSchedule = await Schedule.create({ schedule: body });

    return new Response(JSON.stringify(newSchedule), { status: 201 });
  } catch (error) {
    console.error("Error saving schedule:", error);
    return new Response(JSON.stringify({ error: "Failed to save schedule" }), {
      status: 500,
    });
  }
}

export async function GET() {
  await mongoose.connect(process.env.NEXT_MONGO_URL);
  const schedules = await Schedule.find();
  return new Response(JSON.stringify(schedules), { status: 201 });
}
