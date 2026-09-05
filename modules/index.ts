import type React from 'react';
import { Boxes, Cpu, Layers, TerminalSquare, User } from 'lucide-react';
import type { ModuleId, ModuleMeta } from '../types';
import { Identity } from './Identity';
import { Operations } from './Operations';
import { Work } from './Work';
import { Stack } from './Stack';
import { Query } from './Query';

export interface ModuleDef extends ModuleMeta {
  Component: React.FC;
}

// Single source of truth for the rail, the dock, the hash router and the
// command palette. Adding a module here wires all four.
export const MODULES: ModuleDef[] = [
  { id: 'identity', label: 'IDENTITY', title: 'Identity', hint: 'operator record', icon: User, Component: Identity },
  { id: 'ops', label: 'OPERATIONS', title: 'Operations', hint: 'employment history', icon: Layers, Component: Operations },
  { id: 'work', label: 'WORK', title: 'Work', hint: 'public repositories', icon: Boxes, Component: Work },
  { id: 'stack', label: 'STACK', title: 'Stack', hint: 'tools and domains', icon: Cpu, Component: Stack },
  { id: 'query', label: 'QUERY', title: 'Query', hint: 'ask the console', icon: TerminalSquare, Component: Query },
];

export const moduleById = (id: ModuleId): ModuleDef =>
  MODULES.find((m) => m.id === id) ?? MODULES[0];
