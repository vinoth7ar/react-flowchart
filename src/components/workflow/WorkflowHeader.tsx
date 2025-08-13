import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WorkflowHeader = () => {
  return (
    <header className="bg-workflow-node-bg border-b border-workflow-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">E</span>
          </div>
          <span className="font-semibold text-foreground">EBM Studio</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" className="text-primary">
            PMF
          </Button>
          <span className="text-muted-foreground">Search</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="text-primary font-medium">Data Journeys</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">Lineage</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">FDE</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">Editor</a>
        </nav>
        
        <Button variant="outline" size="sm">
          Settings
        </Button>
      </div>
    </header>
  );
};

export default WorkflowHeader;