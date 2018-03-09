import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class HashMultiMap<Key, T> 
	extends std.HashMultiMap<Key, T>
	implements ICollection<std.Entry<Key, T>, 
		std.HashMultiMap<Key, T>, 
		std.HashMultiMap.Iterator<Key, T>, 
		std.HashMultiMap.ReverseIterator<Key, T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<std.Entry<Key, T>, 
		std.HashMultiMap<Key, T>, 
		std.HashMultiMap.Iterator<Key, T>, 
		std.HashMultiMap.ReverseIterator<Key, T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: std.HashMultiMap.Iterator<Key, T>, last: std.HashMultiMap.Iterator<Key, T>): void
	{
		super._Handle_insert(first, last);
		
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: std.HashMultiMap.Iterator<Key, T>, last: std.HashMultiMap.Iterator<Key, T>): void
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
	public dispatchEvent(event: HashMultiMap.Event<Key, T>): void
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
	public refresh(it: std.HashMultiMap.Iterator<Key, T>): void;

	/**
	 * @inheritDoc
	 */
	public refresh(first: std.HashMultiMap.Iterator<Key, T>, last: std.HashMultiMap.Iterator<Key, T>): void;

	public refresh(first: std.HashMultiMap.Iterator<Key, T> = null, last: std.HashMultiMap.Iterator<Key, T> = null): void
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
	-------------------------------------------------------- */
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
	public addEventListener(type: CollectionEvent.Type, listener: HashMultiMap.Listener<Key, T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritDoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: HashMultiMap.Listener<Key, T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace HashMultiMap
{
	export type Event<Key, T> = CollectionEvent<std.Entry<Key, T>, 
		std.HashMultiMap<Key, T>, 
		std.HashMultiMap.Iterator<Key, T>, 
		std.HashMultiMap.ReverseIterator<Key, T>>;

	export type Listener<Key, T> = CollectionEvent.Listener<std.Entry<Key, T>, 
		std.HashMultiMap<Key, T>, 
		std.HashMultiMap.Iterator<Key, T>, 
		std.HashMultiMap.ReverseIterator<Key, T>>;

	export const Event = CollectionEvent;
	export import Iterator = std.HashMultiMap.Iterator;
	export import ReverseIterator = std.HashMultiMap.ReverseIterator;
}