import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowOption } from '../types';

interface EntitySelectorProps {
  entities: WorkflowOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function EntitySelector({ entities, selectedId, onSelect }: EntitySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Entities</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose up to one entity to visualize (MVP)
        </p>
      </div>
      
      {entities.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
              <p className="text-sm text-muted-foreground">
                Entity visualization will be available in a future release
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {entities.map((entity) => (
            <Card 
              key={entity.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedId === entity.id 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => onSelect(entity.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{entity.title}</CardTitle>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedId === entity.id 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground'
                  }`} />
                </div>
                <CardDescription className="text-sm">
                  {entity.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}