import type { ReactElement } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelectedItems } from '../../store/selectedItemsSlice';
import { downloadSelectedItemsCsv } from '../../utils/csv';

function SelectedItemsFlyout(): ReactElement | null {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const selectedItemsCount = selectedItems.length;

  if (selectedItemsCount === 0) {
    return null;
  }

  const handleUnselectAll = (): void => {
    dispatch(clearSelectedItems());
  };

  const handleDownload = (): void => {
    downloadSelectedItemsCsv(selectedItems);
  };

  return (
    <aside className="selected-items-flyout" aria-label="Selected items panel">
      <p className="selected-items-flyout__count">
        Selected items: <strong>{selectedItemsCount}</strong>
      </p>

      <div className="selected-items-flyout__actions">
        <button type="button" onClick={handleUnselectAll}>
          Unselect all
        </button>

        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </div>
    </aside>
  );
}

export default SelectedItemsFlyout;
