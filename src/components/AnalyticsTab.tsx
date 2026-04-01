import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Legend } from "recharts";
import { Box, Users } from "lucide-react";

const WEEKLY_DATA = [
  { name: "Mon", empty: 3420, occupied: 6580 },
  { name: "Tue", empty: 3100, occupied: 6900 },
  { name: "Wed", empty: 2800, occupied: 7200 },
  { name: "Thu", empty: 3600, occupied: 6400 },
  { name: "Fri", empty: 3900, occupied: 6100 },
  { name: "Sat", empty: 4200, occupied: 5800 },
  { name: "Sun", empty: 4500, occupied: 5500 },
];

const MONTHLY_DATA = [
  { name: "Jan", empty: 3200, occupied: 6800 },
  { name: "Feb", empty: 3400, occupied: 6600 },
  { name: "Mar", empty: 2900, occupied: 7100 },
  { name: "Apr", empty: 3100, occupied: 6900 },
  { name: "May", empty: 3800, occupied: 6200 },
  { name: "Jun", empty: 4100, occupied: 5900 },
  { name: "Jul", empty: 3600, occupied: 6400 },
  { name: "Aug", empty: 3300, occupied: 6700 },
  { name: "Sep", empty: 3700, occupied: 6300 },
  { name: "Oct", empty: 4000, occupied: 6000 },
  { name: "Nov", empty: 3500, occupied: 6500 },
  { name: "Dec", empty: 3420, occupied: 6580 },
];

const TOTAL_SPACE = 10000;
const EMPTY_SPACE = 3420;
const PIE_DATA = [
  { name: "Empty Space", value: EMPTY_SPACE },
  { name: "Occupied Space", value: TOTAL_SPACE - EMPTY_SPACE },
];

const PIE_COLORS = ["hsl(152, 60%, 40%)", "hsl(205, 65%, 20%)"];

const chartConfig = {
  empty: { label: "Empty Space (m²)", color: "hsl(152, 60%, 40%)" },
  occupied: { label: "Occupied Space (m²)", color: "hsl(205, 65%, 20%)" },
};

const AnalyticsTab = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const data = period === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <div className="space-y-6">
      {/* Top KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Box className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Empty Space</p>
              <p className="text-2xl font-display font-bold text-foreground">
                8,550 <span className="text-sm font-normal text-muted-foreground">m³</span>
              </p>
              <p className="text-xs text-success mt-0.5">Based on 3,420 m² floor area × avg 2.5m height</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">People in Warehouse</p>
              <p className="text-2xl font-display font-bold text-foreground">
                24 <span className="text-sm font-normal text-muted-foreground">persons</span>
              </p>
              <p className="text-xs text-info mt-0.5">Across all aisles and zones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line + Bar Graph */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-display">Empty Space Over Time</CardTitle>
          <Select value={period} onValueChange={(v) => setPeriod(v as "weekly" | "monthly")}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(215, 12%, 50%)" }} />
              <YAxis className="text-xs" tick={{ fill: "hsl(215, 12%, 50%)" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="empty" name="Empty Space (m²)" fill="hsl(152, 60%, 40%)" radius={[4, 4, 0, 0]} opacity={0.7} />
              <Line type="monotone" dataKey="empty" name="Empty Trend" stroke="hsl(152, 60%, 40%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="occupied" name="Occupied Trend" stroke="hsl(205, 65%, 20%)" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-display">Space Distribution (Total: 10,000 m²)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ChartContainer config={chartConfig} className="h-[280px] w-full max-w-[400px]">
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {PIE_DATA.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: PIE_COLORS[0] }} />
              <span className="text-sm text-muted-foreground">Empty: {EMPTY_SPACE} m² ({((EMPTY_SPACE / TOTAL_SPACE) * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: PIE_COLORS[1] }} />
              <span className="text-sm text-muted-foreground">Occupied: {TOTAL_SPACE - EMPTY_SPACE} m²</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
