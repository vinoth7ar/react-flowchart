export interface SelectionState {
  selectedType: 'workflow' | 'entity' | null;
  selectedId: string | null;
  customizations: ViewCustomizations;
}

export interface ViewCustomizations {
  expandAllEntities: boolean;
  showLegend: boolean;
  showMiniMap: boolean;
}

export interface WorkflowOption {
  id: string;
  title: string;
  description: string;
  category: 'workflow' | 'entity';
}