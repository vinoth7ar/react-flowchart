import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkflowOption } from '../types';

interface WorkflowSelectorProps {
  workflows: WorkflowOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function WorkflowSelector({ workflows, selectedId, onSelect }: WorkflowSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Workflows</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose up to one workflow to visualize (MVP)
        </p>
      </div>
      
      <div className="grid gap-3">
        {workflows.map((workflow) => (
          <Card 
            key={workflow.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedId === workflow.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'border-border hover:border-muted-foreground'
            }`}
            onClick={() => onSelect(workflow.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{workflow.title}</CardTitle>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedId === workflow.id 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`} />
              </div>
              <CardDescription className="text-sm">
                {workflow.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}