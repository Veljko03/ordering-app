import { Schedule } from "@/models/WeeklySchedule";
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

  let schedules = await Schedule.find();

  if (schedules.length === 0) {
    const defaultSchedule = {
      schedule: [
        { day: "mon", startTime: "", endTime: "", isOpend: true },
        { day: "tue", startTime: "", endTime: "", isOpend: true },
        { day: "wen", startTime: "", endTime: "", isOpend: true },
        { day: "thu", startTime: "", endTime: "", isOpend: true },
        { day: "fri", startTime: "", endTime: "", isOpend: true },
        { day: "sat", startTime: "", endTime: "", isOpend: true },
        { day: "sun", startTime: "", endTime: "", isOpend: true },
      ],
    };

    const createdSchedule = await Schedule.create(defaultSchedule);
    schedules = [createdSchedule];
  }

  return new Response(JSON.stringify(schedules), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
