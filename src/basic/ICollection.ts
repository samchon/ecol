import { IContainer } from "tstl/base/container/IContainer";
import { IEventDispatcher } from "./IEventDispatcher";

export interface ICollection<T, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT>,
        IteratorT extends IContainer.Iterator<T, SourceT, IteratorT, ReverseT>,
        ReverseT extends IContainer.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
    extends IContainer<T, SourceT, IteratorT, ReverseT>,
        IEventDispatcher<T, SourceT, IteratorT, ReverseT>
{
    refresh(): void;
    refresh(it: IteratorT): void;
    refresh(first: IteratorT, last: IteratorT): void;
}