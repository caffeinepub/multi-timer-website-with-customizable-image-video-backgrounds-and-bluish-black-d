export type NavigationTabId = 'home' | 'explore' | 'create' | 'library' | 'profile';

export interface NavigationTabDefinition {
  id: NavigationTabId;
  label: string;
}

export const NAVIGATION_TABS: NavigationTabDefinition[] = [
  { id: 'home', label: 'Home' },
  { id: 'explore', label: 'Explore' },
  { id: 'create', label: 'Create' },
  { id: 'library', label: 'Library' },
  { id: 'profile', label: 'Profile' },
];

export const DEFAULT_NAVIGATION_ORDER: NavigationTabId[] = NAVIGATION_TABS.map(t => t.id);

export function getNavigationTabLabel(id: NavigationTabId): string {
  return NAVIGATION_TABS.find(t => t.id === id)?.label || id;
}
