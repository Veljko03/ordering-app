export async function GET() {
  const now = new Date();
  const hours = now.getHours(); // Dobijamo sate (0-23)
  const minutes = now.getMinutes(); // Dobijamo minute (0-59)
  const full = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`; // Dodajemo nulu za minute ako su ispod 10
  console.log("time, ", full);

  return new Response(full, { status: 201 });
}
