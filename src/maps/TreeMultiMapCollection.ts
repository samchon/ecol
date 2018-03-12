import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

import "./internal";

export class TreeMultiMapCollection<Key, T> 
	extends std.TreeMultiMap<Key, T>
	implements ICollection<std.Entry<Key, T>, 
		std.TreeMultiMap<Key, T>, 
		std.TreeMultiMap.Iterator<Key, T>, 
		std.TreeMultiMap.ReverseIterator<Key, T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<std.Entry<Key, T>, 
		std.TreeMultiMap<Key, T>, 
		std.TreeMultiMap.Iterator<Key, T>, 
		std.TreeMultiMap.ReverseIterator<Key, T>> = new EventDispatcher();

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
	protected _Handle_insert(first: std.TreeMultiMap.Iterator<Key, T>, last: std.TreeMultiMap.Iterator<Key, T>): void
	{
		super._Handle_insert(first, last);
		
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: std.TreeMultiMap.Iterator<Key, T>, last: std.TreeMultiMap.Iterator<Key, T>): void
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
	public dispatchEvent(event: TreeMultiMapCollection.Event<Key, T>): void
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
	public refresh(it: std.TreeMultiMap.Iterator<Key, T>): void;

	/**
	 * @inheritDoc
	 */
	public refresh(first: std.TreeMultiMap.Iterator<Key, T>, last: std.TreeMultiMap.Iterator<Key, T>): void;

	public refresh(first: std.TreeMultiMap.Iterator<Key, T> = null, last: std.TreeMultiMap.Iterator<Key, T> = null): void
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
	public addEventListener(type: CollectionEvent.Type, listener: TreeMultiMapCollection.Listener<Key, T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritDoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: TreeMultiMapCollection.Listener<Key, T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace TreeMultiMapCollection
{
	export type Event<Key, T> = CollectionEvent<std.Entry<Key, T>, 
		std.TreeMultiMap<Key, T>, 
		std.TreeMultiMap.Iterator<Key, T>, 
		std.TreeMultiMap.ReverseIterator<Key, T>>;

	export type Listener<Key, T> = CollectionEvent.Listener<std.Entry<Key, T>, 
		std.TreeMultiMap<Key, T>, 
		std.TreeMultiMap.Iterator<Key, T>, 
		std.TreeMultiMap.ReverseIterator<Key, T>>;

	export const Event = CollectionEvent;
	export import Iterator = std.TreeMultiMap.Iterator;
	export import ReverseIterator = std.TreeMultiMap.ReverseIterator;
}

const old_swap = std.TreeMultiMap.prototype.swap;
std.TreeMultiMap.prototype.swap = function <Key, T>(obj: std.TreeMultiMap<Key, T>): void
{
	old_swap.call(this, obj);

	if (this instanceof TreeMultiMapCollection)
		this.refresh();
	if (obj instanceof TreeMultiMapCollection)
		obj.refresh();
};