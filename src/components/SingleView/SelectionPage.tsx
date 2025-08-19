import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelection } from './context/SelectionContext';
import { useAvailableOptions } from './hooks/useWorkflowData';
import WorkflowSelector from './components/WorkflowSelector';
import EntitySelector from './components/EntitySelector';
import CustomizationPanel from './components/CustomizationPanel';
import { Eye, ArrowLeft } from 'lucide-react';

export default function SelectionPage() {
  const navigate = useNavigate();
  const { selection, updateSelection, updateCustomizations } = useSelection();
  const { workflows, entities } = useAvailableOptions();
  const [activeTab, setActiveTab] = useState<'workflows' | 'entities'>('workflows');

  const handleWorkflowSelect = (id: string) => {
    updateSelection('workflow', id);
    setActiveTab('workflows');
  };

  const handleEntitySelect = (id: string) => {
    updateSelection('entity', id);
    setActiveTab('entities');
  };

  const handleVisualize = () => {
    if (selection.selectedType && selection.selectedId) {
      navigate(`/visualization/${selection.selectedType}/${selection.selectedId}`);
    }
  };

  const canVisualize = selection.selectedType && selection.selectedId;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Pipeline Management Framework</h1>
                <p className="text-sm text-muted-foreground">
                  Select a workflow or entity to visualize
                </p>
              </div>
            </div>
            <Button 
              onClick={handleVisualize}
              disabled={!canVisualize}
              className="gap-2"
              size="lg"
            >
              <Eye className="h-4 w-4" />
              Visualize
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selection Panel */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'workflows' | 'entities')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="workflows">
                  Workflows ({workflows.length})
                </TabsTrigger>
                <TabsTrigger value="entities">
                  Entities ({entities.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="workflows" className="mt-6">
                <WorkflowSelector
                  workflows={workflows}
                  selectedId={selection.selectedType === 'workflow' ? selection.selectedId : null}
                  onSelect={handleWorkflowSelect}
                />
              </TabsContent>
              
              <TabsContent value="entities" className="mt-6">
                <EntitySelector
                  entities={entities}
                  selectedId={selection.selectedType === 'entity' ? selection.selectedId : null}
                  onSelect={handleEntitySelect}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CustomizationPanel
                customizations={selection.customizations}
                onUpdate={updateCustomizations}
              />
              
              {/* Selection Summary */}
              {canVisualize && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Selected for Visualization:</h4>
                  <p className="text-sm">
                    <span className="capitalize">{selection.selectedType}:</span>{' '}
                    {selection.selectedType === 'workflow' 
                      ? workflows.find(w => w.id === selection.selectedId)?.title
                      : entities.find(e => e.id === selection.selectedId)?.title
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}