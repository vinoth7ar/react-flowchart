import WorkflowHeader from '@/components/workflow/WorkflowHeader';
import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-workflow-bg">
      <WorkflowHeader />
      <WorkflowBuilder />
    </div>
  );
};

export default Index;
