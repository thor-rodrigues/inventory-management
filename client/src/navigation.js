// Sidebar navigation, rendered by AppSidebar. Labels are i18n keys resolved with t().
// Icons are SVG path data for a 24x24 stroke-based icon (drawn inline, no icon package).
export const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  cart: 'M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.6L21 8H6M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  wallet: 'M3 7a2 2 0 0 1 2-2h14v4M3 7v10a2 2 0 0 0 2 2h16V9H5a2 2 0 0 1-2-2zM17 14h.01',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  file: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6',
  chevronsLeft: 'M11 17l-5-5 5-5M18 17l-5-5 5-5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4'
}

export const NAV_GROUPS = [
  {
    label: 'nav.groupOperations',
    items: [
      { to: '/', label: 'nav.overview', icon: 'home', exact: true },
      { to: '/inventory', label: 'nav.inventory', icon: 'box' },
      { to: '/orders', label: 'nav.orders', icon: 'cart' }
    ]
  },
  {
    label: 'nav.groupInsights',
    items: [
      { to: '/spending', label: 'nav.finance', icon: 'wallet' },
      { to: '/demand', label: 'nav.demandForecast', icon: 'trend' },
      { to: '/reports', label: 'nav.reports', icon: 'file' }
    ]
  }
]

// Finds the nav item (and its group) for a route path. Root '/' only matches exactly.
export function findNavItem(path) {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      const match = item.exact
        ? path === item.to
        : path === item.to || path.startsWith(item.to + '/')
      if (match) return { group, item }
    }
  }
  return null
}
