import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Camera, Square, Type, Trash2, Eye, PenTool } from "lucide-react";

// --- Types ---
interface Zone {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  color: string;
  camera?: string;
}

interface EmptySpace {
  zoneId: string;
  area: number; // sq m
  count: number;
}

// --- Dummy default floor plan ---
const DEFAULT_ZONES: Zone[] = [
  { id: "z1", x: 5, y: 5, w: 28, h: 40, name: "Zone A - Receiving", color: "hsl(205, 65%, 20%)", camera: "Camera 1" },
  { id: "z2", x: 36, y: 5, w: 28, h: 40, name: "Zone B - Storage", color: "hsl(152, 60%, 40%)", camera: "Camera 2" },
  { id: "z3", x: 67, y: 5, w: 28, h: 40, name: "Zone C - Packing", color: "hsl(42, 70%, 55%)", camera: "Camera 3" },
  { id: "z4", x: 5, y: 52, w: 42, h: 42, name: "Zone D - Shipping", color: "hsl(0, 72%, 51%)", camera: "Camera 4" },
  { id: "z5", x: 52, y: 52, w: 43, h: 42, name: "Zone E - Returns", color: "hsl(270, 50%, 50%)", camera: "Camera 5" },
];

const DEFAULT_EMPTY_SPACES: EmptySpace[] = [
  { zoneId: "z1", area: 520, count: 3 },
  { zoneId: "z2", area: 890, count: 5 },
  { zoneId: "z3", area: 340, count: 2 },
  { zoneId: "z4", area: 1100, count: 4 },
  { zoneId: "z5", area: 570, count: 3 },
];

const CAMERAS = ["Camera 1", "Camera 2", "Camera 3", "Camera 4", "Camera 5", "Camera 6", "Camera 7", "Camera 8"];

const ZONE_COLORS = [
  "hsl(205, 65%, 20%)",
  "hsl(152, 60%, 40%)",
  "hsl(42, 70%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(270, 50%, 50%)",
  "hsl(180, 50%, 40%)",
  "hsl(330, 60%, 50%)",
  "hsl(15, 70%, 50%)",
];

const FloorPlanTab = () => {
  const [mode, setMode] = useState<"view" | "create">("view");
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [emptySpaces] = useState<EmptySpace[]>(DEFAULT_EMPTY_SPACES);
  const [searchArea, setSearchArea] = useState("");
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);

  // Create mode state
  const [newZoneName, setNewZoneName] = useState("");
  const [editZones, setEditZones] = useState<Zone[]>([...DEFAULT_ZONES]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedEditZone, setSelectedEditZone] = useState<string | null>(null);

  const handleSearch = () => {
    const target = parseFloat(searchArea);
    if (isNaN(target)) { setHighlightedZone(null); return; }
    // find zone with empty space >= target
    const match = emptySpaces.find((es) => es.area >= target);
    setHighlightedZone(match?.zoneId || null);
  };

  const addZone = () => {
    if (!newZoneName.trim()) return;
    const id = `z${Date.now()}`;
    const colorIdx = editZones.length % ZONE_COLORS.length;
    const row = Math.floor(editZones.length / 3);
    const col = editZones.length % 3;
    const newZone: Zone = {
      id,
      x: 5 + col * 32,
      y: 5 + row * 48,
      w: 28,
      h: 40,
      name: newZoneName.trim(),
      color: ZONE_COLORS[colorIdx],
    };
    setEditZones((prev) => [...prev, newZone]);
    setNewZoneName("");
    setSelectedEditZone(id);
  };

  const tagCamera = () => {
    if (!selectedEditZone || !selectedCamera) return;
    setEditZones((prev) =>
      prev.map((z) => (z.id === selectedEditZone ? { ...z, camera: selectedCamera } : z))
    );
    setSelectedCamera("");
  };

  const removeZone = (id: string) => {
    setEditZones((prev) => prev.filter((z) => z.id !== id));
    if (selectedEditZone === id) setSelectedEditZone(null);
  };

  const applyFloorPlan = () => {
    setZones(editZones);
    setMode("view");
  };

  const totalEmpty = emptySpaces.reduce((s, e) => s + e.area, 0);
  const totalCount = emptySpaces.reduce((s, e) => s + e.count, 0);

  return (
    <div className="space-y-4">
      {/* Search Bar + Mode Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search space (m²)..."
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 h-9 text-sm"
              type="number"
            />
          </div>
          <Button size="sm" onClick={handleSearch} className="h-9">
            Find Space
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === "view" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("view")}
          >
            <Eye className="h-4 w-4 mr-1.5" /> View Plan
          </Button>
          <Button
            variant={mode === "create" ? "default" : "outline"}
            size="sm"
            onClick={() => { setMode("create"); setEditZones([...zones]); }}
          >
            <PenTool className="h-4 w-4 mr-1.5" /> Create Plan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {mode === "view" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Empty</p>
              <p className="text-xl font-display font-bold text-success">{totalEmpty.toLocaleString()} m²</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Empty Spots</p>
              <p className="text-xl font-display font-bold text-info">{totalCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Zones</p>
              <p className="text-xl font-display font-bold text-foreground">{zones.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">Cameras Active</p>
              <p className="text-xl font-display font-bold text-secondary">{zones.filter((z) => z.camera).length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floor Plan Visual */}
      {mode === "view" ? (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display">Warehouse Floor Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-[16/10] bg-muted/30 rounded-xl border border-border overflow-hidden">
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="currentColor" />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="currentColor" />
                ))}
              </svg>

              {zones.map((zone) => {
                const es = emptySpaces.find((e) => e.zoneId === zone.id);
                const isHighlighted = highlightedZone === zone.id;
                return (
                  <div
                    key={zone.id}
                    className={`absolute border-2 rounded-lg transition-all duration-300 flex flex-col items-center justify-center text-center p-2 ${
                      isHighlighted ? "ring-4 ring-secondary ring-offset-2 z-10 scale-[1.02]" : ""
                    }`}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.w}%`,
                      height: `${zone.h}%`,
                      borderColor: zone.color,
                      backgroundColor: isHighlighted
                        ? "hsl(42, 70%, 55%, 0.25)"
                        : `${zone.color}11`,
                    }}
                  >
                    <p className="text-[11px] font-semibold text-foreground leading-tight">{zone.name}</p>
                    {zone.camera && (
                      <Badge variant="outline" className="mt-1 text-[9px] h-5 gap-1">
                        <Camera className="h-3 w-3" /> {zone.camera}
                      </Badge>
                    )}
                    {es && (
                      <div className="mt-1.5 bg-success/10 border border-success/30 rounded px-2 py-0.5">
                        <p className="text-[10px] font-medium text-success">{es.count} empty spots</p>
                        <p className="text-[9px] text-success/80">{es.area} m² available</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Create Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Add Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Zone name..."
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    className="text-sm h-9"
                  />
                  <Button size="sm" className="h-9" onClick={addZone}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Tag Camera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedEditZone || ""} onValueChange={setSelectedEditZone}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select zone..." />
                  </SelectTrigger>
                  <SelectContent>
                    {editZones.map((z) => (
                      <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select camera..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMERAS.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedEditZone && selectedCamera && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="w-full h-9 text-sm">
                        Preview Feed
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedCamera} — Live Preview</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                        <div className="text-center text-muted-foreground">
                          <Camera className="h-10 w-10 mx-auto mb-2 opacity-40" />
                          <p className="text-sm font-medium">CCTV Feed Placeholder</p>
                          <p className="text-xs">{selectedCamera} — Live</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button size="sm" className="w-full h-9" onClick={tagCamera} disabled={!selectedEditZone || !selectedCamera}>
                  <Camera className="h-4 w-4 mr-1.5" /> Tag Camera
                </Button>
              </CardContent>
            </Card>

            {/* Zone List */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Zones ({editZones.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[200px] overflow-y-auto">
                {editZones.map((z) => (
                  <div
                    key={z.id}
                    className={`flex items-center justify-between p-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                      selectedEditZone === z.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedEditZone(z.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: z.color }} />
                      <span className="text-xs font-medium">{z.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {z.camera && <Badge variant="secondary" className="text-[9px] h-4">{z.camera}</Badge>}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); removeZone(z.id); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button className="w-full" onClick={applyFloorPlan}>
              Apply Floor Plan
            </Button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <Card className="border-border h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Floor Plan Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full aspect-[16/10] bg-muted/30 rounded-xl border border-border overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="currentColor" />
                    ))}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="currentColor" />
                    ))}
                  </svg>
                  {editZones.map((zone) => (
                    <div
                      key={zone.id}
                      className={`absolute border-2 rounded-lg flex flex-col items-center justify-center text-center p-1 cursor-pointer transition-all ${
                        selectedEditZone === zone.id ? "ring-2 ring-primary" : ""
                      }`}
                      style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.w}%`,
                        height: `${zone.h}%`,
                        borderColor: zone.color,
                        backgroundColor: `${zone.color}15`,
                      }}
                      onClick={() => setSelectedEditZone(zone.id)}
                    >
                      <p className="text-[10px] font-semibold text-foreground">{zone.name}</p>
                      {zone.camera && (
                        <Badge variant="outline" className="mt-0.5 text-[8px] h-4 gap-0.5">
                          <Camera className="h-2.5 w-2.5" /> {zone.camera}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanTab;
