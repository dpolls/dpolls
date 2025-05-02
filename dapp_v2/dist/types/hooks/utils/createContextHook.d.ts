import { Context } from 'react';
export declare function createContextHook<T>(context: Context<T | undefined>, hookName: string): () => T & ({} | null);
