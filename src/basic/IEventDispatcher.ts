import { CollectionEvent } from "./CollectionEvent";
import { IContainer } from "tstl/base/container/IContainer";

export interface IEventDispatcher<T, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT>,
        IteratorT extends IContainer.Iterator<T, SourceT, IteratorT, ReverseT>,
        ReverseT extends IContainer.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
{
    hasEventListener(type: CollectionEvent.Type): boolean;
    
    addEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void;
    removeEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void;

    dispatchEvent(event: CollectionEvent<T, SourceT, IteratorT, ReverseT>): void;
}