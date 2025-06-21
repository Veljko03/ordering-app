const { Schema, model, models } = require("mongoose");

const DaySchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
});
const ScheduleSchema = new Schema({
  schedule: [DaySchema], // Array of days
});

export const Schedule = models?.Schedule || model("Schedule", ScheduleSchema);

//mozda napraviti semu i onda dodati za svaki dan u onoj formi u weekSchedule.
//ovde se dodaje "uopstena" forma kako radi restoran, a onda posebna forma za izuzetke
//prilikom promene "uopstene" forme rada restorana, baza se brise i zamenjuje novom

//provo se proverava da li postoji izuzetak ako ga ima uzima se on ako ga nema..
//proverava se samo dan u nedelji i onda se na osnovu toga gleda kada radi
