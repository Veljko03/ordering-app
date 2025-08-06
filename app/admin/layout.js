import Stepper from "@/components/Stepper";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper />
      <main>{children}</main>
    </div>
  );
}
