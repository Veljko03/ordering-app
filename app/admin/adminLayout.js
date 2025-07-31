import Stepper from "@/components/Stepper";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Stepper />
        {children}
      </body>
    </html>
  );
}
