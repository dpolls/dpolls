type Listener = () => void;
declare class TokenEventEmitter {
    private listeners;
    subscribe(listener: Listener): () => void;
    emit(): void;
}
export declare const tokenEventEmitter: TokenEventEmitter;
export {};
