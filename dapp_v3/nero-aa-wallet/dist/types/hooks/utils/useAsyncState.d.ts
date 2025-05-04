import { UseAsyncStateReturn } from '@/types';
/**
 * 非同期処理を管理するフック
 * @param asyncFunction 実行する非同期関数
 * @param initialData 初期データ（オプション）
 * @returns 非同期ステートとそれを操作する関数
 */
export declare function useAsyncState<T, P extends any[]>(asyncFunction: (...params: P) => Promise<T>, initialData?: T | null): UseAsyncStateReturn<T, P>;
