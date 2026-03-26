import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ZoomIn, ZoomOut, Download, RotateCcw } from "lucide-react";

const DUMMY_BOXES = [
  { x: 12, y: 18, w: 22, h: 30, label: "Empty Zone A" },
  { x: 55, y: 10, w: 18, h: 25, label: "Empty Zone B" },
  { x: 30, y: 55, w: 28, h: 35, label: "Empty Zone C" },
  { x: 72, y: 50, w: 20, h: 28, label: "Empty Zone D" },
];

const ImagePreview = () => {
  const [image, setImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showBoxes, setShowBoxes] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setZoom(1);
        setShowBoxes(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = useCallback(() => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      if (ctx && showBoxes) {
        DUMMY_BOXES.forEach((box) => {
          const x = (box.x / 100) * img.width;
          const y = (box.y / 100) * img.height;
          const w = (box.w / 100) * img.width;
          const h = (box.h / 100) * img.height;
          ctx.strokeStyle = "#22c55e";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, w, h);
          ctx.fillStyle = "rgba(34,197,94,0.15)";
          ctx.fillRect(x, y, w, h);
          ctx.fillStyle = "#22c55e";
          ctx.font = `bold ${Math.max(14, img.width * 0.015)}px Inter, sans-serif`;
          ctx.fillText(box.label, x + 4, y - 6);
        });
      }
      const link = document.createElement("a");
      link.download = "processed-warehouse.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  }, [image, showBoxes]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-display font-semibold text-card-foreground">
          Space Detection Preview
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            disabled={!image}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            disabled={!image}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(1)} disabled={!image}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!image}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative rounded-xl border border-border bg-muted/30 overflow-hidden min-h-[360px] flex items-center justify-center">
        {image ? (
          <div
            className="relative transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={image}
              alt="Warehouse view"
              className="max-w-full max-h-[500px] object-contain"
            />
            {showBoxes &&
              DUMMY_BOXES.map((box, i) => (
                <div
                  key={i}
                  className="absolute border-2 border-success rounded-sm"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                    backgroundColor: "hsl(var(--success) / 0.12)",
                  }}
                >
                  <span
                    className="absolute -top-5 left-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-success text-success-foreground whitespace-nowrap"
                  >
                    {box.label}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
            <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center">
              <Upload className="h-7 w-7 text-accent-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-card-foreground">Upload a warehouse image</p>
              <p className="text-sm mt-1">PNG, JPG up to 20MB</p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()}>
              Select Image
            </Button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {image && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1.5" /> Replace Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBoxes(!showBoxes)}
          >
            {showBoxes ? "Hide" : "Show"} Bounding Boxes
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
