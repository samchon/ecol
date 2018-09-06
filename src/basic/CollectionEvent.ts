import { Container } from "tstl/base/container/Container";
import { Iterator } from "tstl/base/iterator/Iterator";
import { ReverseIterator } from "tstl/base/iterator/ReverseIterator";
import { ForOfAdaptor } from "tstl/base/iterator/ForOfAdaptor";

export class CollectionEvent<T, 
		SourceT extends Container<T, SourceT, IteratorT, ReverseT>,
		IteratorT extends Iterator<T, SourceT, IteratorT, ReverseT>,
		ReverseT extends ReverseIterator<T, SourceT, IteratorT, ReverseT>>
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
		return new ForOfAdaptor(this.first, this.last);
	}
}

export namespace CollectionEvent
{
	export type Type = "insert" | "erase" | "refresh";

	export type Listener<T, 
			SourceT extends Container<T, SourceT, IteratorT, ReverseT>,
			IteratorT extends Iterator<T, SourceT, IteratorT, ReverseT>,
			ReverseT extends ReverseIterator<T, SourceT, IteratorT, ReverseT>>
		= (event: CollectionEvent<T, SourceT, IteratorT, ReverseT>) => void;
}