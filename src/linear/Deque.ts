import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class Deque<T> 
	extends std.Deque<T>
	implements ICollection<T, std.Deque<T>, std.Deque.Iterator<T>, std.Deque.ReverseIterator<T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<T, std.Deque<T>, std.Deque.Iterator<T>, std.Deque.ReverseIterator<T>> = new EventDispatcher();

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	// using super.constructor;

	public clear(): void
	{
		let first = this.begin();
		let last = this.end();

		this._Notify_erase(first, last);
		super.clear();
	}

	/* =========================================================
		ELEMENTS I/O
			- INSERT
			- ERASE
			- REFRESH
	============================================================
		INSERT
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public push_front(val: T): void
	{
		super.push_front(val);

		this._Notify_insert(this.begin(), this.begin().next());
	}

	/**
	 * @inheritdoc
	 */
	public push_back(val: T): void
	{
		super.push(val);

		this._Notify_insert(this.end().prev(), this.end());
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_range<U extends T, InputIterator extends std.IForwardIterator<U, InputIterator>>
		(pos: std.Deque.Iterator<T>, first: InputIterator, last: InputIterator): std.Deque.Iterator<T>
	{
		let n: number = this.size();
		let ret = super._Insert_by_range(pos, first, last);
		
		n = this.size() - n;
		this._Notify_insert(ret, ret.advance(n));

		return ret;
	}

	/* ---------------------------------------------------------
		ERASE
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public pop_front(): void
	{
		this._Notify_erase(this.begin(), this.begin().next());

		super.pop_front();
	}

	/**
	 * @inheritdoc
	 */
	public pop_back(): void
	{
		this._Notify_erase(this.end().prev(), this.end());

		super.pop_back();
	}

	/**
	 * @hidden
	 */
	protected _Erase_by_range(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): std.Deque.Iterator<T>
	{
		this._Notify_erase(first, last);

		return super._Erase_by_range(first, last);
	}

	/* ---------------------------------------------------------
		REFRESH
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public set(index: number, val: T): void
	{
		super.set(index, val);
		this.refresh(this.begin().advance(index));
	}

	/**
	 * @inheritdoc
	 */
	public refresh(): void;

	/**
	 * @inheritdoc
	 */
	public refresh(it: std.Deque.Iterator<T>): void;

	/**
	 * @inheritdoc
	 */
	public refresh(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): void;

	public refresh(first: std.Deque.Iterator<T> = null, last: std.Deque.Iterator<T> = null): void
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
	public dispatchEvent(event: Deque.Event<T>): void
	{
		this.dispatcher_.dispatchEvent(event);
	}

	/**
	 * @hidden
	 */
	private _Notify_insert(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): void
	{
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	private _Notify_erase(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): void
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
	public addEventListener(type: CollectionEvent.Type, listener: Deque.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: Deque.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace Deque
{
	export type Event<T> = CollectionEvent<T, std.Deque<T>, std.Deque.Iterator<T>, std.Deque.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.Deque<T>, std.Deque.Iterator<T>, std.Deque.ReverseIterator<T>>;

	export const Event = CollectionEvent;
	export import Iterator = std.Deque.Iterator;
	export import ReverseIterator = std.Deque.ReverseIterator;
}