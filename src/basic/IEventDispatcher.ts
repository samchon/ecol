import { Container } from "tstl/base/container/Container";
import { Iterator } from "tstl/base/iterator/Iterator";
import { ReverseIterator } from "tstl/base/iterator/ReverseIterator";

import { CollectionEvent } from "./CollectionEvent";

export interface IEventDispatcher<T, 
		SourceT extends Container<T, SourceT, IteratorT, ReverseT>,
		IteratorT extends Iterator<T, SourceT, IteratorT, ReverseT>,
		ReverseT extends ReverseIterator<T, SourceT, IteratorT, ReverseT>>
{
	hasEventListener(type: CollectionEvent.Type): boolean;
	
	addEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void;

	removeEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void;

	dispatchEvent(event: CollectionEvent<T, SourceT, IteratorT, ReverseT>): void;
}