import * as std from "tstl";

import {IEventDispatcher} from "./IEventDispatcher";
import {CollectionEvent} from "./CollectionEvent";

export class EventDispatcher<T, 
		SourceT extends std.base.Container<T, SourceT, IteratorT, ReverseT>,
		IteratorT extends std.base.Iterator<T, SourceT, IteratorT, ReverseT>,
		ReverseT extends std.base.ReverseIterator<T, SourceT, IteratorT, ReverseT>>
	implements IEventDispatcher<T, SourceT, IteratorT, ReverseT>
{
	/**
	 * @hidden
	 */
	private listeners_: std.HashMap<string, std.HashSet<CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>>>;

	public constructor()
	{
		this.listeners_ = new std.HashMap();
	}

	public dispatchEvent(event: CollectionEvent<T, SourceT, IteratorT, ReverseT>): boolean
	{
		let it = this.listeners_.find(event.type);
		if (it.equals(this.listeners_.end()))
			return false;

		let listeners = it.second;
		for (let elem of listeners)
			elem(event);

		return true;
	}

	public hasEventListener(type: CollectionEvent.Type): boolean
	{
		return this.listeners_.has(type);
	}

	public addEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void
	{
		let it = this.listeners_.find(type);
		if (it.equals(this.listeners_.end()))
			it = this.listeners_.emplace(type, new std.HashSet()).first;

		it.second.insert(listener);
	}

	public removeEventListener(type: CollectionEvent.Type, listener: CollectionEvent.Listener<T, SourceT, IteratorT, ReverseT>): void
	{
		this.listeners_.get(type).erase(listener);
	}
}
