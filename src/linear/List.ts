import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class List<T> 
	extends std.List<T>
	implements ICollection<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	// using super.constructor;

	/**
	 * @hidden
	 */
	protected _Create_iterator(prev: std.List.Iterator<T>, next: std.List.Iterator<T>, val: T): std.List.Iterator<T>
	{
		return new Iterator(this["ptr_"], prev, next, val);
	}

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Insert_by_range<U extends T, InputIterator extends std.IForwardIterator<U, InputIterator>>
		(pos: std.List.Iterator<T>, first: InputIterator, last: InputIterator): std.List.Iterator<T>
	{
		let n: number = this.size();
		let ret = super._Insert_by_range(pos, first, last);

		n = this.size() - n;
		this._Notify_insert(ret, std.advance(ret, n));

		return ret;
	}

	/**
	 * @hidden
	 */
	protected _Erase_by_range(first: std.List.Iterator<T>, last: std.List.Iterator<T>): std.List.Iterator<T>
	{
		let ret = super._Erase_by_range(first, last);
		this._Notify_erase(first, last);

		return ret;
	}

	/* =========================================================
		EVENT DISPATCHER
			- NOTIFIERS
			- ACCESSORS
	============================================================
		NOTIFIERS
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public refresh(): void;

	/**
	 * @inheritdoc
	 */
	public refresh(it: std.List.Iterator<T>): void;

	/**
	 * @inheritdoc
	 */
	public refresh(first: std.List.Iterator<T>, last: std.List.Iterator<T>): void;

	public refresh(first: std.List.Iterator<T> = null, last: std.List.Iterator<T> = null): void
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

	/**
	 * @inheritdoc
	 */
	public dispatchEvent(event: List.Event<T>): void
	{
		this.dispatcher_.dispatchEvent(event);
	}

	/**
	 * @hidden
	 */
	private _Notify_insert(first: std.List.Iterator<T>, last: std.List.Iterator<T>): void
	{
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	private _Notify_erase(first: std.List.Iterator<T>, last: std.List.Iterator<T>): void
	{
		this.dispatchEvent(new CollectionEvent("erase", first, last));
	}

	/* ---------------------------------------------------------
		ACCESSORS
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public hasEventListener(type: CollectionEvent.Type): boolean
	{
		return this.dispatcher_.hasEventListener(type);
	}

	/**
	 * @inheritdoc
	 */
	public addEventListener(type: CollectionEvent.Type, listener: List.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: List.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace List
{
	export type Event<T> = CollectionEvent<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>>;

	export const Event = CollectionEvent;

	export import Iterator = std.List.Iterator;
	export import ReverseIterator = std.List.ReverseIterator;
}

/**
 * @hidden
 */
class Iterator<T> extends std.List.Iterator<T>
{
	public get value(): T
	{
		return this["value_"];
	}

	public set value(val: T)
	{
		this["value_"] = val;
		(this.source() as List<T>).refresh(this);
	}
}