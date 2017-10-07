export interface FutureString {
    startsWith(searchString: string, position?: number): boolean;
    endsWith(searchString: string, endPosition?: number): boolean;
}
export interface FutureArrayConstructor {
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
