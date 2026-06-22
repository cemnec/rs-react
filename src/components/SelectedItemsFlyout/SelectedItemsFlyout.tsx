'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSelectedItems } from '@/store/selectedItemsSlice';

export default function SelectedItemsFlyout() {
  const t = useTranslations('SelectedItemsFlyout');
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.selectedItems.items);
  const [isDownloading, setIsDownloading] = useState(false);

  if (items.length === 0) {
    return null;
  }

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch('/api/selected-items-csv', {
        body: JSON.stringify({ items }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Failed to download CSV: ${response.status} ${errorText}`,
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'selected-characters.csv';
      link.click();

      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <aside className="selected-items-flyout">
      <p className="selected-items-flyout__count">
        {t('count', { count: items.length })}
      </p>

      <div className="selected-items-flyout__actions">
        <button disabled={isDownloading} onClick={handleDownload} type="button">
          {isDownloading ? t('downloading') : t('download')}
        </button>

        <button onClick={() => dispatch(clearSelectedItems())} type="button">
          {t('clear')}
        </button>
      </div>
    </aside>
  );
}
