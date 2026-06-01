'use client';

import { useEffect, useRef, useState } from 'react';

export interface ComboboxOption {
  id: number;
  name: string;
}

interface MultiComboboxProps {
  value: number[];
  onChange: (ids: number[]) => void;
  options: ComboboxOption[];
  onCreateNew: (name: string) => Promise<ComboboxOption>;
  placeholder?: string;
}

export function MultiCombobox({
  value,
  onChange,
  options,
  onCreateNew,
  placeholder = 'Поиск или создать...',
}: MultiComboboxProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [creating, setCreating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = options.filter((o) => value.includes(o.id));

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  const unselected = filtered.filter((o) => !value.includes(o.id));
  const selected = filtered.filter((o) => value.includes(o.id));
  const dropdownItems = [...unselected, ...selected];

  const hasExactMatch = options.some(
    (o) => o.name.toLowerCase() === inputValue.trim().toLowerCase()
  );
  const showCreate = inputValue.trim().length > 0 && !hasExactMatch;
  const createIndex = dropdownItems.length;
  const totalItems = createIndex + (showCreate ? 1 : 0);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [inputValue]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setInputValue('');
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  function select(option: ComboboxOption) {
    if (value.includes(option.id)) return;
    onChange([...value, option.id]);
    setInputValue('');
    inputRef.current?.focus();
  }

  function remove(id: number) {
    onChange(value.filter((v) => v !== id));
  }

  async function handleCreate() {
    const name = inputValue.trim();
    if (!name || creating) return;
    setCreating(true);
    try {
      const created = await onCreateNew(name);
      onChange([...value, created.id]);
      setInputValue('');
    } finally {
      setCreating(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex === createIndex && showCreate) {
          handleCreate();
        } else if (focusedIndex >= 0 && focusedIndex < dropdownItems.length) {
          const item = dropdownItems[focusedIndex];
          if (!value.includes(item.id)) select(item);
        } else if (showCreate) {
          handleCreate();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setInputValue('');
        break;
      case 'Backspace':
        if (inputValue === '') onChange(value.slice(0, -1));
        break;
    }
  }

  const dropdownVisible = isOpen && totalItems > 0;

  return (
    <div className="cmb-wrap" ref={containerRef}>
      <div
        className="cmb-box"
        onClick={() => {
          inputRef.current?.focus();
          setIsOpen(true);
        }}
      >
        {selectedOptions.map((opt) => (
          <span key={opt.id} className="cmb-chip">
            {opt.name}
            <span
              className="cmb-chip-x"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                remove(opt.id);
              }}
            >
              ×
            </span>
          </span>
        ))}
        <input
          ref={inputRef}
          className="cmb-input"
          value={inputValue}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {dropdownVisible && (
        <div className="cmb-dropdown">
          {dropdownItems.map((opt, i) => (
            <div
              key={opt.id}
              className={[
                'cmb-option',
                value.includes(opt.id) ? 'cmb-option--selected' : '',
                focusedIndex === i ? 'cmb-option--focused' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseDown={(e) => {
                e.preventDefault();
                if (!value.includes(opt.id)) select(opt);
              }}
              onMouseEnter={() => setFocusedIndex(i)}
            >
              {opt.name}
            </div>
          ))}

          {showCreate && (
            <div
              className={[
                'cmb-option cmb-option--create',
                focusedIndex === createIndex ? 'cmb-option--focused' : '',
                creating ? 'cmb-option--loading' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseDown={(e) => {
                e.preventDefault();
                handleCreate();
              }}
              onMouseEnter={() => setFocusedIndex(createIndex)}
            >
              {creating
                ? `Создание «${inputValue.trim()}»...`
                : `+ Создать «${inputValue.trim()}»`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
