import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class TreeMultiMap<Key, T> 
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
	public refresh(it: std.TreeMultiMap.Iterator<Key, T>): void;
	public refresh(first: std.TreeMultiMap.Iterator<Key, T>, last: std.TreeMultiMap.Iterator<Key, T>): void;

	public refresh(first: std.TreeMultiMap.Iterator<Key, T>, last: std.TreeMultiMap.Iterator<Key, T> = first.next()): void
	{
		this.dispatchEvent(new CollectionEvent("refresh", first, last));
	}

	public dispatchEvent(event: TreeMultiMap.Event<Key, T>): void
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

	public addEventListener(type: CollectionEvent.Type, listener: TreeMultiMap.Listener<Key, T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	public removeEventListener(type: CollectionEvent.Type, listener: TreeMultiMap.Listener<Key, T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace TreeMultiMap
{
	export type Event<Key, T> = CollectionEvent<std.Entry<Key, T>, 
		std.TreeMultiMap<Key, T>, 
		std.TreeMultiMap.Iterator<Key, T>, 
		std.TreeMultiMap.ReverseIterator<Key, T>>;

	export type Listener<Key, T> = CollectionEvent.Listener<std.Entry<Key, T>, 
		std.TreeMultiMap<Key, T>, 
		std.TreeMultiMap.Iterator<Key, T>, 
		std.TreeMultiMap.ReverseIterator<Key, T>>;
}