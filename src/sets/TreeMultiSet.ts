import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class TreeMultiSet<T> 
	extends std.TreeMultiSet<T>
	implements ICollection<T, std.TreeMultiSet<T>, std.TreeMultiSet.Iterator<T>, std.TreeMultiSet.ReverseIterator<T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<T, std.TreeMultiSet<T>, std.TreeMultiSet.Iterator<T>, std.TreeMultiSet.ReverseIterator<T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: std.TreeMultiSet.Iterator<T>, last: std.TreeMultiSet.Iterator<T>): void
	{
		super._Handle_insert(first, last);
		
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: std.TreeMultiSet.Iterator<T>, last: std.TreeMultiSet.Iterator<T>): void
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
	public dispatchEvent(event: TreeMultiSet.Event<T>): void
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
	public refresh(it: std.TreeMultiSet.Iterator<T>): void;

	/**
	 * @inheritDoc
	 */
	public refresh(first: std.TreeMultiSet.Iterator<T>, last: std.TreeMultiSet.Iterator<T>): void;

	public refresh(first: std.TreeMultiSet.Iterator<T> = null, last: std.TreeMultiSet.Iterator<T> = null): void
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
	public addEventListener(type: CollectionEvent.Type, listener: TreeMultiSet.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritDoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: TreeMultiSet.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace TreeMultiSet
{
	export type Event<T> = CollectionEvent<T, std.TreeMultiSet<T>, std.TreeMultiSet.Iterator<T>, std.TreeMultiSet.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.TreeMultiSet<T>, std.TreeMultiSet.Iterator<T>, std.TreeMultiSet.ReverseIterator<T>>;

	export const Event = CollectionEvent;
	export import Iterator = std.TreeMultiSet.Iterator;
	export import ReverseIterator = std.TreeMultiSet.ReverseIterator;
}