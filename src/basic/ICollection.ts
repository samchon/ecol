import { Container } from "tstl/base/container/Container";
import { Iterator } from "tstl/base/iterator/Iterator";
import { ReverseIterator } from "tstl/base/iterator/ReverseIterator";

import {IEventDispatcher} from "./IEventDispatcher";

export interface ICollection<T, 
		SourceT extends Container<T, SourceT, IteratorT, ReverseT>,
		IteratorT extends Iterator<T, SourceT, IteratorT, ReverseT>,
		ReverseT extends ReverseIterator<T, SourceT, IteratorT, ReverseT>>
	extends Container<T, SourceT, IteratorT, ReverseT>,
		IEventDispatcher<T, SourceT, IteratorT, ReverseT>
{
	refresh(): void;
	refresh(it: IteratorT): void;
	refresh(first: IteratorT, last: IteratorT): void;
}