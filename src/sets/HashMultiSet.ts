import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class HashMultiSet<T> 
	extends std.HashMultiSet<T>
	implements ICollection<T, std.HashMultiSet<T>, std.HashMultiSet.Iterator<T>, std.HashMultiSet.ReverseIterator<T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<T, std.HashMultiSet<T>, std.HashMultiSet.Iterator<T>, std.HashMultiSet.ReverseIterator<T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T>): void
	{
		super._Handle_insert(first, last);
		
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T>): void
	{
		this._Handle_erase(first, last);
		
		this.dispatchEvent(new CollectionEvent("erase", first, last));
	}

	/* =========================================================
		EVENT DISPATCHER
			- NOTIFIERS
			- ACCESSORS
	============================================================
		NOTIFIERS
	--------------------------------------------------------- */
	public refresh(it: std.HashMultiSet.Iterator<T>): void;
	public refresh(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T>): void;

	public refresh(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T> = first.next()): void
	{
		this.dispatchEvent(new CollectionEvent("refresh", first, last));
	}

	public dispatchEvent(event: HashMultiSet.Event<T>): void
	{
		this.dispatcher_.dispatchEvent(event);
	}

	/* ---------------------------------------------------------
		ACCESSORS
	--------------------------------------------------------- */
	public hasEventListener(type: CollectionEvent.Type): boolean
	{
		return this.dispatcher_.hasEventListener(type);
	}

	public addEventListener(type: CollectionEvent.Type, listener: HashMultiSet.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	public removeEventListener(type: CollectionEvent.Type, listener: HashMultiSet.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace HashMultiSet
{
	export type Event<T> = CollectionEvent<T, std.HashMultiSet<T>, std.HashMultiSet.Iterator<T>, std.HashMultiSet.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.HashMultiSet<T>, std.HashMultiSet.Iterator<T>, std.HashMultiSet.ReverseIterator<T>>;
}