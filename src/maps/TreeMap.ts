import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class TreeMap<Key, T> 
	extends std.TreeMap<Key, T>
	implements ICollection<std.Entry<Key, T>, 
		std.TreeMap<Key, T>, 
		std.TreeMap.Iterator<Key, T>, 
		std.TreeMap.ReverseIterator<Key, T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<std.Entry<Key, T>, 
		std.TreeMap<Key, T>, 
		std.TreeMap.Iterator<Key, T>, 
		std.TreeMap.ReverseIterator<Key, T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: std.TreeMap.Iterator<Key, T>, last: std.TreeMap.Iterator<Key, T>): void
	{
		super._Handle_insert(first, last);
		
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: std.TreeMap.Iterator<Key, T>, last: std.TreeMap.Iterator<Key, T>): void
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
	public dispatchEvent(event: TreeMap.Event<Key, T>): void
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
	public refresh(it: std.TreeMap.Iterator<Key, T>): void;

	/**
	 * @inheritDoc
	 */
	public refresh(first: std.TreeMap.Iterator<Key, T>, last: std.TreeMap.Iterator<Key, T>): void;

	public refresh(first: std.TreeMap.Iterator<Key, T> = null, last: std.TreeMap.Iterator<Key, T> = null): void
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
	public addEventListener(type: CollectionEvent.Type, listener: TreeMap.Listener<Key, T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritDoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: TreeMap.Listener<Key, T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace TreeMap
{
	export type Event<Key, T> = CollectionEvent<std.Entry<Key, T>, 
		std.TreeMap<Key, T>, 
		std.TreeMap.Iterator<Key, T>, 
		std.TreeMap.ReverseIterator<Key, T>>;

	export type Listener<Key, T> = CollectionEvent.Listener<std.Entry<Key, T>, 
		std.TreeMap<Key, T>, 
		std.TreeMap.Iterator<Key, T>, 
		std.TreeMap.ReverseIterator<Key, T>>;

	export const Event = CollectionEvent;
	export import Iterator = std.TreeMap.Iterator;
	export import ReverseIterator = std.TreeMap.ReverseIterator;
}