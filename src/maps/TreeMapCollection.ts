import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

import "./internal";

export class TreeMapCollection<Key, T> 
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
		CONSTRUCTORS
	--------------------------------------------------------- */
	// using super.constructor;

	public clear(): void
	{
		let first = this.begin();
		let last = this.end();

		super.clear();
		this.dispatchEvent(new CollectionEvent("erase", first, last));
	}

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
	public dispatchEvent(event: TreeMapCollection.Event<Key, T>): void
	{
		if (this.dispatcher_)
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
	public addEventListener(type: CollectionEvent.Type, listener: TreeMapCollection.Listener<Key, T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritDoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: TreeMapCollection.Listener<Key, T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace TreeMapCollection
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

const old_swap = std.TreeMap.prototype.swap;
std.TreeMap.prototype.swap = function <Key, T>(obj: std.TreeMap<Key, T>): void
{
	old_swap.call(this, obj);

	if (this instanceof TreeMapCollection)
		this.refresh();
	if (obj instanceof TreeMapCollection)
		obj.refresh();
};