import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class HashMap<Key, T> 
	extends std.HashMap<Key, T>
	implements ICollection<std.Entry<Key, T>, 
		std.HashMap<Key, T>, 
		std.HashMap.Iterator<Key, T>, 
		std.HashMap.ReverseIterator<Key, T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<std.Entry<Key, T>, 
		std.HashMap<Key, T>, 
		std.HashMap.Iterator<Key, T>, 
		std.HashMap.ReverseIterator<Key, T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: std.HashMap.Iterator<Key, T>, last: std.HashMap.Iterator<Key, T>): void
	{
		super._Handle_insert(first, last);
		
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: std.HashMap.Iterator<Key, T>, last: std.HashMap.Iterator<Key, T>): void
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
	public dispatchEvent(event: HashMap.Event<Key, T>): void
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
	public refresh(it: std.HashMap.Iterator<Key, T>): void;

	/**
	 * @inheritDoc
	 */
	public refresh(first: std.HashMap.Iterator<Key, T>, last: std.HashMap.Iterator<Key, T>): void;

	public refresh(first: std.HashMap.Iterator<Key, T> = null, last: std.HashMap.Iterator<Key, T> = null): void
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
	public addEventListener(type: CollectionEvent.Type, listener: HashMap.Listener<Key, T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritDoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: HashMap.Listener<Key, T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace HashMap
{
	export type Event<Key, T> = CollectionEvent<std.Entry<Key, T>, 
		std.HashMap<Key, T>, 
		std.HashMap.Iterator<Key, T>, 
		std.HashMap.ReverseIterator<Key, T>>;

	export type Listener<Key, T> = CollectionEvent.Listener<std.Entry<Key, T>, 
		std.HashMap<Key, T>, 
		std.HashMap.Iterator<Key, T>, 
		std.HashMap.ReverseIterator<Key, T>>;

	export const Event = CollectionEvent;
	export import Iterator = std.HashMap.Iterator;
	export import ReverseIterator = std.HashMap.ReverseIterator;
}