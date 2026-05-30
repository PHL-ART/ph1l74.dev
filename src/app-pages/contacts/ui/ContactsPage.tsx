'use client';

import { useEffect, useState } from 'react';

type ContactItem = {
  id: number;
  kind: string;
  label: string;
  value: string;
  order: number;
};

/* Map well-known platform names to a small Unicode glyph */
const ICON_MAP: Record<string, string> = {
  email:        '✉',
  telegram:     '✈',
  github:       '⌥',
  stackoverflow:'◈',
  codepen:      '✎',
  dribbble:     '◎',
  behance:      '⬡',
  figma:        '▣',
  linkedin:     '□',
  instagram:    '⊕',
  twitter:      '✕',
  x:            '✕',
  vkontakte:    '◇',
  vk:           '◇',
  youtube:      '▷',
  'dev.to':     '◑',
  habr:         '◐',
};

const getIcon = (label: string) =>
  ICON_MAP[label.toLowerCase()] ?? '→';

/* Fallback static contacts shown when the DB is empty */
const FALLBACK_GROUPS: { title: string; items: Omit<ContactItem, 'id' | 'order'>[] }[] = [
  {
    title: 'Primary',
    items: [
      { kind: 'Email',     label: 'Email',    value: 'astakhovfilat@gmail.com' },
      { kind: 'Messenger', label: 'Telegram', value: 'https://t.me/ph1l74' },
    ],
  },
  {
    title: 'Code & Development',
    items: [
      { kind: 'Portfolio', label: 'GitHub',          value: 'https://github.com/ph1l74' },
      { kind: 'Q&A',       label: 'Stack Overflow',  value: 'https://stackoverflow.com/users/ph1l74' },
    ],
  },
  {
    title: 'Professional',
    items: [
      { kind: 'Network',   label: 'LinkedIn', value: 'https://linkedin.com/in/ph1l74' },
    ],
  },
];

const toHref = (value: string) => {
  if (value.startsWith('http')) return value;
  if (value.includes('@') && !value.startsWith('@')) return `mailto:${value}`;
  return `https://${value}`;
};

const toHandle = (value: string) => {
  if (value.startsWith('mailto:')) return value.replace('mailto:', '');
  // plain email address — contains @ but not a URL
  if (value.includes('@') && !value.startsWith('http')) return value;
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return url.hostname.replace('www.', '') + url.pathname;
  } catch {
    return value;
  }
};

export const ContactsPage = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/contacts', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load contacts');
      const data: ContactItem[] = await res.json();
      setContacts(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContacts(); }, []);

  /* Group API contacts by `kind`, or use fallback if empty */
  const groups = (() => {
    if (contacts.length === 0) return FALLBACK_GROUPS;
    const map = new Map<string, ContactItem[]>();
    contacts.forEach((c) => {
      const key = c.kind || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
  })();

  return (
    <main className="ds-contacts-page">
      {/* ── Left: heading + email CTA ── */}
      <section className="ds-contacts-left">
        <div className="ds-contacts-eyebrow ds-eyebrow">03 / Contacts</div>

        <h1 className="ds-contacts-hero-title">
          Let&apos;s
          <span className="ghost">
            Connect<span className="dot">.</span>
          </span>
        </h1>

        <p className="ds-contacts-intro">
          Whether you have a project in mind, want to collaborate, or just want to say hi:
          pick any channel that works for you. I&apos;m always happy to talk.
        </p>

        <div className="ds-contacts-email-block">
          <div className="ds-contacts-email-label">Primary email</div>
          <a href="mailto:astakhovfilat@gmail.com" className="ds-contacts-email-link">
            astakhovfilat@gmail.com
          </a>
        </div>

        <div className="ds-contacts-bg-num" aria-hidden="true">03</div>
      </section>

      {/* ── Right: contacts list ── */}
      <aside className="ds-contacts-right">
        {loading && (
          <div className="flex min-h-[200px] items-center justify-center gap-3"
            style={{ color: 'var(--ds-text-2)' }}>
            <span className="h-4 w-4 animate-spin rounded-full border border-t-transparent"
              style={{ borderColor: 'var(--ds-accent)', borderTopColor: 'transparent' }} />
            Loading...
          </div>
        )}

        {!loading && groups.map((group) => (
          <div key={group.title} className="ds-contact-group">
            <div className="ds-contact-group-title">{group.title}</div>

            {group.items.map((c, i) => {
              const href = toHref(c.value);
              const handle = toHandle(c.value);
              const isExternal = href.startsWith('http');
              return (
                <a
                  key={i}
                  href={href}
                  className="ds-contact-row"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                >
                  <div className="ds-contact-row-left">
                    <span className="ds-contact-icon" aria-hidden="true">
                      {getIcon(c.label)}
                    </span>
                    <span className="ds-contact-platform">{c.label}</span>
                    <span className="ds-contact-handle">{handle}</span>
                  </div>
                  <div className="ds-contact-row-right">
                    <span className="ds-contact-kind">{c.kind}</span>
                    <span className="ds-contact-arrow" aria-hidden="true">↗</span>
                  </div>
                </a>
              );
            })}
          </div>
        ))}
      </aside>
    </main>
  );
};
