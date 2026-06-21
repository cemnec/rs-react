import { getTranslations } from 'next-intl/server';

import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { Link } from '@/i18n/navigation';

export default async function Header() {
  const t = await getTranslations('Navigation');

  return (
    <header className="app-header">
      <nav aria-label="Primary navigation" className="app-nav">
        <Link className="app-nav-link" href="/">
          {t('home')}
        </Link>
        <Link className="app-nav-link" href="/about">
          {t('about')}
        </Link>
      </nav>

      <LanguageSwitcher />
    </header>
  );
}
