import { LayoutGrid, Users, Clock, Warehouse, Video, Upload } from "lucide-react";
import KPIWidget from "@/components/KPIWidget";
import ImagePreview from "@/components/ImagePreview";
import AnalyticsTab from "@/components/AnalyticsTab";
import FloorPlanTab from "@/components/FloorPlanTab";
import AIChatbot from "@/components/AIChatbot";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef } from "react";

const KPI_DATA = [
  {
    title: "Available Space",
    value: "34.2",
    unit: "%",
    icon: LayoutGrid,
    color: "success" as const,
    trend: { value: "5.1%", positive: true },
  },
  {
    title: "Occupied Space",
    value: "65.8",
    unit: "%",
    icon: Warehouse,
    color: "warning" as const,
    trend: { value: "2.3%", positive: false },
  },
  {
    title: "People in Aisle",
    value: "12",
    unit: "persons",
    icon: Users,
    color: "info" as const,
    trend: { value: "3", positive: false },
  },
  {
    title: "Avg. Refill Time",
    value: "47",
    unit: "min",
    icon: Clock,
    color: "primary" as const,
    trend: { value: "8 min", positive: true },
  },
];

const Index = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Warehouse className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-display font-bold text-foreground leading-tight">
                Warehouse Monitoring
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                AI-Powered Warehouse Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1.5" /> Upload Image
            </Button>
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Video className="h-4 w-4 mr-1.5" /> Start Feed Preview
            </Button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Row */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KPI_DATA.map((kpi) => (
                <KPIWidget key={kpi.title} {...kpi} />
              ))}
            </section>
            {/* Image Preview */}
            <section className="kpi-card">
              <ImagePreview />
            </section>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="floorplan">
            <FloorPlanTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 SpaceIQ — AI Warehouse Solutions. All rights reserved.</span>
          <span>Compliant with KSA Data Protection Standards</span>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Index;
