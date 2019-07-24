import * as std from "tstl";

import {CollectionEvent} from "./CollectionEvent";

export interface IEventDispatcher<T, 
        SourceT extends std.base.Container<T, SourceT, IteratorT, ReverseT>,
        IteratorT extends std.base.Iterator<T, SourceT, IteratorT, ReverseT>,
        ReverseT extends std.base.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
{
    hasEventListener(type: CollectionEvent.Type): boolean;
    
    addEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void;

    removeEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void;

    dispatchEvent(event: CollectionEvent<T, SourceT, IteratorT, ReverseT>): void;
}