import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class TreeSet<T> 
	extends std.TreeSet<T>
	implements ICollection<T, std.TreeSet<T>, std.TreeSet.Iterator<T>, std.TreeSet.ReverseIterator<T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<T, std.TreeSet<T>, std.TreeSet.Iterator<T>, std.TreeSet.ReverseIterator<T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: std.TreeSet.Iterator<T>, last: std.TreeSet.Iterator<T>): void
	{
		super._Handle_insert(first, last);
		
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: std.TreeSet.Iterator<T>, last: std.TreeSet.Iterator<T>): void
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
	public refresh(it: std.TreeSet.Iterator<T>): void;
	public refresh(first: std.TreeSet.Iterator<T>, last: std.TreeSet.Iterator<T>): void;

	public refresh(first: std.TreeSet.Iterator<T>, last: std.TreeSet.Iterator<T> = first.next()): void
	{
		this.dispatchEvent(new CollectionEvent("refresh", first, last));
	}

	public dispatchEvent(event: TreeSet.Event<T>): void
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

	public addEventListener(type: CollectionEvent.Type, listener: TreeSet.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	public removeEventListener(type: CollectionEvent.Type, listener: TreeSet.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace TreeSet
{
	export type Event<T> = CollectionEvent<T, std.TreeSet<T>, std.TreeSet.Iterator<T>, std.TreeSet.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.TreeSet<T>, std.TreeSet.Iterator<T>, std.TreeSet.ReverseIterator<T>>;
}