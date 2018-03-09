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
	/**
	 * @inheritDoc
	 */
	public dispatchEvent(event: HashMultiSet.Event<T>): void
	{
		this.dispatcher_.dispatchEvent(event);
	}

	/**
	 * @inheritDoc
	 */
	public refresh(): void;

	/**
	 * @inheritDoc
	 */
	public refresh(it: std.HashMultiSet.Iterator<T>): void;

	/**
	 * @inheritDoc
	 */
	public refresh(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T>): void;

	public refresh(first: std.HashMultiSet.Iterator<T> = null, last: std.HashMultiSet.Iterator<T> = null): void
	{
		if (first == null)
		{
			first = this.begin();
			last = this.end();
		}
		else if (last == null)
			last = first.next();

		this.dispatchEvent(new CollectionEvent("refresh", first, last));
	}

	/* ---------------------------------------------------------
		ACCESSORS
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
	 */
	public hasEventListener(type: CollectionEvent.Type): boolean
	{
		return this.dispatcher_.hasEventListener(type);
	}

	/**
	 * @inheritDoc
	 */
	public addEventListener(type: CollectionEvent.Type, listener: HashMultiSet.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritDoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: HashMultiSet.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace HashMultiSet
{
	export type Event<T> = CollectionEvent<T, std.HashMultiSet<T>, std.HashMultiSet.Iterator<T>, std.HashMultiSet.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.HashMultiSet<T>, std.HashMultiSet.Iterator<T>, std.HashMultiSet.ReverseIterator<T>>;

	export const Event = CollectionEvent;
	export import Iterator = std.HashMultiSet.Iterator;
	export import ReverseIterator = std.HashMultiSet.ReverseIterator;
}