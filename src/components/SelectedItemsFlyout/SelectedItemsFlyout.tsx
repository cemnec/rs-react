'use client';

import { useTranslations } from 'next-intl';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSelectedItems } from '@/store/selectedItemsSlice';

export default function SelectedItemsFlyout() {
  const t = useTranslations('SelectedItemsFlyout');
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.selectedItems.items);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="selected-items-flyout">
      <p className="selected-items-flyout__count">
        {t('count', { count: items.length })}
      </p>

      <form
        action="/api/selected-items-csv"
        className="selected-items-flyout__actions"
        method="post"
      >
        <input name="items" type="hidden" value={JSON.stringify(items)} />

        <button type="submit">{t('download')}</button>

        <button onClick={() => dispatch(clearSelectedItems())} type="button">
          {t('clear')}
        </button>
      </form>
    </aside>
  );
}
