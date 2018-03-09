import * as std from "tstl";

export class CollectionEvent<T, 
		SourceT extends std.base.Container<T, SourceT, IteratorT, ReverseT>,
		IteratorT extends std.base.Iterator<T, SourceT, IteratorT, ReverseT>,
		ReverseT extends std.base.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
{
	private type_: string;
	private first_: IteratorT;
	private last_: IteratorT;

	public constructor(type: string, first: IteratorT, last: IteratorT)
	{
		this.type_ = type;
		this.first_ = first;
		this.last_ = last;
	}

	public get type(): string
	{
		return this.type_;
	}

	public get first(): IteratorT
	{
		return this.first_;
	}

	public get last(): IteratorT
	{
		return this.last_;
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