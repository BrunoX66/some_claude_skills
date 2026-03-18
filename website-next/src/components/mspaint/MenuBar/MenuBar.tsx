'use client';

import React, { useState } from 'react';
import styles from './MenuBar.module.css';

interface MenuItem {
  label: string;
  items?: { label: string; shortcut?: string; disabled?: boolean; divider?: boolean }[];
}

const MENUS: MenuItem[] = [
  {
    label: 'File',
    items: [
      { label: 'New', shortcut: 'Ctrl+N' },
      { label: 'Open...', shortcut: 'Ctrl+O', disabled: true },
      { label: 'Save', shortcut: 'Ctrl+S', disabled: true },
      { label: 'Save As...', disabled: true },
      { divider: true, label: '' },
      { label: 'Export PNG...', disabled: true },
      { divider: true, label: '' },
      { label: 'Exit' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z', disabled: true },
      { divider: true, label: '' },
      { label: 'Cut', shortcut: 'Ctrl+X', disabled: true },
      { label: 'Copy', shortcut: 'Ctrl+C', disabled: true },
      { label: 'Paste', shortcut: 'Ctrl+V', disabled: true },
      { label: 'Clear Selection', shortcut: 'Del', disabled: true },
      { divider: true, label: '' },
      { label: 'Select All', shortcut: 'Ctrl+A', disabled: true },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Zoom In', disabled: true },
      { label: 'Zoom Out', disabled: true },
      { label: 'Actual Size' },
      { divider: true, label: '' },
      { label: 'Show Grid', disabled: true },
    ],
  },
  {
    label: 'Image',
    items: [
      { label: 'Flip Horizontal', disabled: true },
      { label: 'Flip Vertical', disabled: true },
      { divider: true, label: '' },
      { label: 'Rotate 90°', disabled: true },
      { label: 'Rotate 180°', disabled: true },
      { label: 'Rotate 270°', disabled: true },
      { divider: true, label: '' },
      { label: 'Clear Image' },
    ],
  },
  {
    label: 'Options',
    items: [
      { label: 'Edit Colors...', disabled: true },
      { divider: true, label: '' },
      { label: 'Draw Opaque', disabled: true },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'About Pixel Paint' },
    ],
  },
];

export function MenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuClick = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleMenuLeave = () => {
    setOpenMenu(null);
  };

  return (
    <div className={styles.menubar} onMouseLeave={handleMenuLeave}>
      {MENUS.map((menu) => (
        <div key={menu.label} className={styles.menuWrapper}>
          <button
            className={`${styles.menuItem} ${openMenu === menu.label ? styles.open : ''}`}
            onClick={() => handleMenuClick(menu.label)}
            onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
          >
            {menu.label}
          </button>
          {openMenu === menu.label && menu.items && (
            <div className={styles.dropdown}>
              {menu.items.map((item, index) =>
                item.divider ? (
                  <div key={index} className={styles.divider} />
                ) : (
                  <button
                    key={item.label}
                    className={`${styles.dropdownItem} ${item.disabled ? styles.disabled : ''}`}
                    disabled={item.disabled}
                    onClick={() => {
                      if (!item.disabled) {
                        setOpenMenu(null);
                        // Handle menu action here
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
