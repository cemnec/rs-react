'use client';

import { useTranslations } from 'next-intl';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSelectedItem } from '@/store/selectedItemsSlice';
import type { SelectedItem } from '@/types/selectedItem';

type Props = {
  item: SelectedItem;
};

export default function SelectCharacterCheckbox({ item }: Props) {
  const t = useTranslations('SelectCharacterCheckbox');
  const dispatch = useAppDispatch();

  const isSelected = useAppSelector((state) =>
    state.selectedItems.items.some(
      (selectedItem) => selectedItem.id === item.id,
    ),
  );

  return (
    <label className="card-checkbox">
      <input
        checked={isSelected}
        onChange={() => dispatch(toggleSelectedItem(item))}
        type="checkbox"
      />

      <span className="visually-hidden">
        {t('label')} {item.name}
      </span>
    </label>
  );
}
