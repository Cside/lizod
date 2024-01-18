type AccessPath = Array<(string | symbol | number)>;
type ValidatorContext = {
    errors: Array<AccessPath>;
};
export type Validator<Expect> = (input: any, ctx?: ValidatorContext, path?: (string | symbol | number)[]) => input is Expect;
export type Infer<T> = T extends Validator<infer E> ? E : unknown;
type TupleToIntersection<T extends any[]> = {
    [I in keyof T]: (x: T[I]) => void;
}[number] extends (x: infer R) => void ? R : never;
type MapInfer<T> = T extends [infer x, ...infer xs] ? [Infer<x>, ...MapInfer<xs>] : [];
export declare const $const: <T extends string | number | boolean | symbol | void | undefined>(def: T) => Validator<T>;
export declare const $undefined: Validator<undefined>;
export declare const $null: Validator<null>;
export declare const $void: Validator<void>;
export declare const $any: Validator<any>;
export declare const $opt: <T>(validator: Validator<T>) => Validator<T | null | undefined>;
export declare const $nullable: <T>(validator: Validator<T>) => Validator<NonNullable<T> | null>;
export declare const $string: Validator<string>;
/** Number parseable string for record key */
export declare const $numberString: Validator<string>;
export declare const $regexp: (regexp: RegExp) => Validator<string>;
export declare const $symbol: Validator<symbol>;
export declare const $number: Validator<number>;
export declare const $bigint: Validator<bigint>;
export declare const $numberRange: (min: number | undefined, max: number | undefined) => Validator<number>;
export declare const $i8: Validator<number>;
export declare const $u8: Validator<number>;
export declare const $i16: Validator<number>;
export declare const $u16: Validator<number>;
export declare const $i32: Validator<number>;
export declare const $u32: Validator<number>;
export declare const $boolean: Validator<boolean>;
export declare const $enum: <const E extends readonly string[]>(enums: E) => Validator<E[number]>;
export declare const $intersection: <Vs extends Validator<any>[]>(validators: readonly [...Vs]) => Validator<TupleToIntersection<MapInfer<Vs>>>;
export declare const $union: <Vs extends Validator<any>[]>(validators: readonly [...Vs]) => (input: any, ctx?: ValidatorContext, path?: (string | symbol | number)[]) => input is Infer<Vs[number]>;
export declare const $object: <Map_1 extends Record<string, Validator<any>>>(vmap: Map_1, exact?: boolean) => (input: any, ctx?: ValidatorContext, path?: AccessPath) => input is { [K in keyof Map_1]: Infer<Map_1[K]>; };
export declare const $array: <T extends Validator<any>>(child: T) => (input: any, ctx?: ValidatorContext, path?: AccessPath) => input is Infer<T>[];
export declare const $record: <K extends Validator<string>, V extends Validator<any>>(keyValidator: K, valueValidator: V) => (input: any, ctx?: ValidatorContext, path?: AccessPath) => input is {
    [K: string]: Infer<V>;
};
export declare const $tuple: <T extends any[]>(children: readonly [...{ [I in keyof T]: Validator<T[I]>; }]) => (input: unknown, ctx?: ValidatorContext, path?: AccessPath) => input is T;
export declare const access: (obj: any, path: Array<string | number>) => any;
export {};
