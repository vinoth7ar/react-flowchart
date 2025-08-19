import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ViewCustomizations } from '../types';

interface CustomizationPanelProps {
  customizations: ViewCustomizations;
  onUpdate: (customizations: Partial<ViewCustomizations>) => void;
}

export default function CustomizationPanel({ customizations, onUpdate }: CustomizationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customize View</CardTitle>
        <CardDescription>
          Configure how the workflow visualization will appear
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="expand-entities" className="text-sm font-medium">
              Expand All Entities
            </Label>
            <p className="text-xs text-muted-foreground">
              Show all entity details by default
            </p>
          </div>
          <Switch
            id="expand-entities"
            checked={customizations.expandAllEntities}
            onCheckedChange={(checked) => onUpdate({ expandAllEntities: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-legend" className="text-sm font-medium">
              Show Legend
            </Label>
            <p className="text-xs text-muted-foreground">
              Display legend panel in the visualization
            </p>
          </div>
          <Switch
            id="show-legend"
            checked={customizations.showLegend}
            onCheckedChange={(checked) => onUpdate({ showLegend: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-minimap" className="text-sm font-medium">
              Show Mini Map
            </Label>
            <p className="text-xs text-muted-foreground">
              Display navigation mini map
            </p>
          </div>
          <Switch
            id="show-minimap"
            checked={customizations.showMiniMap}
            onCheckedChange={(checked) => onUpdate({ showMiniMap: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}