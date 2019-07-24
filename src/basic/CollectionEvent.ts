import * as std from "tstl";

export class CollectionEvent<T, 
        SourceT extends std.base.Container<T, SourceT, IteratorT, ReverseT>,
        IteratorT extends std.base.Iterator<T, SourceT, IteratorT, ReverseT>,
        ReverseT extends std.base.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
    implements Iterable<T>
{
    public readonly type: string;
    public readonly first: IteratorT;
    public readonly last: IteratorT;

    public constructor(type: string, first: IteratorT, last: IteratorT)
    {
        this.type = type;
        this.first = first;
        this.last = last;
    }

    public [Symbol.iterator](): IterableIterator<T>
    {
        return new std.base.ForOfAdaptor(this.first, this.last);
    }
}

export namespace CollectionEvent
{
    export type Type = "insert" | "erase" | "refresh";

    export type Listener<T, 
            SourceT extends std.base.Container<T, SourceT, IteratorT, ReverseT>,
            IteratorT extends std.base.Iterator<T, SourceT, IteratorT, ReverseT>,
            ReverseT extends std.base.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
        = (event: CollectionEvent<T, SourceT, IteratorT, ReverseT>) => void;
}