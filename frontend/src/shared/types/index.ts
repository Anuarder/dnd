import { RouteObject } from 'react-router';

export type Route = RouteObject & { path: string; Component: React.ComponentType };
