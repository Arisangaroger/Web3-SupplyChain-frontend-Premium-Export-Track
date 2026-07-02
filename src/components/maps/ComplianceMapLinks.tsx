import { ExternalLink, MapPin, Trees } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DataBlock } from "@/components/ui/typography";

export function buildGoogleMapsSatelliteUrl(coordinates: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}&layer=satellite`;
}

export function buildGlobalForestWatchUrl(coordinates: string) {
  const point = coordinates.includes(",")
    ? coordinates.split(",")
    : [coordinates, coordinates];
  const lat = point[0]?.trim() ?? coordinates;
  const lng = point[1]?.trim() ?? coordinates;
  return `https://www.globalforestwatch.org/map/?lat=${lat}&lng=${lng}&zoom=14`;
}

export function ComplianceMapLinks({ coordinates }: { coordinates: string }) {
  return (
    <div className="space-y-3">
      <DataBlock size="sm" className="surface-inset px-3 py-2 text-slate-700">
        {coordinates}
      </DataBlock>
      <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={buildGoogleMapsSatelliteUrl(coordinates)}
        target="_blank"
        rel="noopener noreferrer"
        className="surface-inset flex items-center gap-3 p-4 transition hover:border-forest/20 hover:ring-1 hover:ring-forest/10"
      >
        <MapPin className="h-5 w-5 text-forest" />
        <div>
          <p className="font-medium text-forest">Google Maps Satellite</p>
          <p className="text-xs text-slate-500">Inspect farm boundary imagery</p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 text-slate-400" />
      </a>

      <a
        href={buildGlobalForestWatchUrl(coordinates)}
        target="_blank"
        rel="noopener noreferrer"
        className="surface-inset flex items-center gap-3 p-4 transition hover:border-forest/20 hover:ring-1 hover:ring-forest/10"
      >
        <Trees className="h-5 w-5 text-forest" />
        <div>
          <p className="font-medium text-forest">Global Forest Watch</p>
          <p className="text-xs text-slate-500">Trace canopy history to 2020</p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 text-slate-400" />
      </a>
      </div>
    </div>
  );
}

export function OpenMapsButton({ coordinates }: { coordinates: string }) {
  return (
    <Button
      variant="secondary"
      onClick={() => window.open(buildGoogleMapsSatelliteUrl(coordinates), "_blank")}
    >
      Open Compliance Maps
    </Button>
  );
}
