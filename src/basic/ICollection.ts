import * as std from "tstl";

import {IEventDispatcher} from "./IEventDispatcher";

export interface ICollection<T, 
        SourceT extends std.base.Container<T, SourceT, IteratorT, ReverseT>,
        IteratorT extends std.base.Iterator<T, SourceT, IteratorT, ReverseT>,
        ReverseT extends std.base.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
    extends std.base.Container<T, SourceT, IteratorT, ReverseT>,
        IEventDispatcher<T, SourceT, IteratorT, ReverseT>
{
    refresh(): void;
    refresh(it: IteratorT): void;
    refresh(first: IteratorT, last: IteratorT): void;
}