import Navbar from "@/components/Navbar";
import DotGridBackground from "@/components/ui/DotGridBackground";

export default function WebsiteMaintenance() {
  return (
    <div className=" min-h-screen bg-background">
      <DotGridBackground />
      <div className="relative z-10">
        <Navbar />
      </div>
    </div>
  );
}
