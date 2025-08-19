import { createContext, useContext, useState, ReactNode } from 'react';
import { SelectionState, ViewCustomizations } from '../types';

interface SelectionContextType {
  selection: SelectionState;
  updateSelection: (type: 'workflow' | 'entity', id: string) => void;
  updateCustomizations: (customizations: Partial<ViewCustomizations>) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const defaultCustomizations: ViewCustomizations = {
  expandAllEntities: true,
  showLegend: true,
  showMiniMap: true,
};

const defaultSelection: SelectionState = {
  selectedType: null,
  selectedId: null,
  customizations: defaultCustomizations,
};

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>(defaultSelection);

  const updateSelection = (type: 'workflow' | 'entity', id: string) => {
    setSelection(prev => ({
      ...prev,
      selectedType: type,
      selectedId: id,
    }));
  };

  const updateCustomizations = (customizations: Partial<ViewCustomizations>) => {
    setSelection(prev => ({
      ...prev,
      customizations: { ...prev.customizations, ...customizations },
    }));
  };

  const clearSelection = () => {
    setSelection(defaultSelection);
  };

  return (
    <SelectionContext.Provider value={{
      selection,
      updateSelection,
      updateCustomizations,
      clearSelection,
    }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}