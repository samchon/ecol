import { Deque } from "tstl/container/Deque";
import { IForwardIterator } from "tstl/iterator/IForwardIterator";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

export class DequeCollection<T> 
	extends Deque<T>
	implements ICollection<T, Deque<T>, Deque.Iterator<T>, Deque.ReverseIterator<T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<T, Deque<T>, Deque.Iterator<T>, Deque.ReverseIterator<T>> = new EventDispatcher();

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
	protected _Insert_by_range<U extends T, InputIterator extends IForwardIterator<U, InputIterator>>
		(pos: Deque.Iterator<T>, first: InputIterator, last: InputIterator): Deque.Iterator<T>
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
	protected _Erase_by_range(first: Deque.Iterator<T>, last: Deque.Iterator<T>): Deque.Iterator<T>
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
	public refresh(it: Deque.Iterator<T>): void;

	/**
	 * @inheritdoc
	 */
	public refresh(first: Deque.Iterator<T>, last: Deque.Iterator<T>): void;

	public refresh(first: Deque.Iterator<T> = null, last: Deque.Iterator<T> = null): void
	{
		if (first === null)
		{
			first = this.begin();
			last = this.end();
		}
		else if (last === null)
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
	public dispatchEvent(event: DequeCollection.Event<T>): void
	{
		if (this.dispatcher_)
			this.dispatcher_.dispatchEvent(event);
	}

	/**
	 * @hidden
	 */
	private _Notify_insert(first: Deque.Iterator<T>, last: Deque.Iterator<T>): void
	{
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	private _Notify_erase(first: Deque.Iterator<T>, last: Deque.Iterator<T>): void
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
	public addEventListener(type: CollectionEvent.Type, listener: DequeCollection.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: DequeCollection.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace DequeCollection
{
	export type Event<T> = CollectionEvent<T, Deque<T>, Deque.Iterator<T>, Deque.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, Deque<T>, Deque.Iterator<T>, Deque.ReverseIterator<T>>;

	export const Event = CollectionEvent;
	export import Iterator = Deque.Iterator;
	export import ReverseIterator = Deque.ReverseIterator;
}

const old_swap = Deque.prototype.swap;
Deque.prototype.swap = function <T>(obj: Deque<T>): void
{
	old_swap.call(this, obj);

	if (this instanceof DequeCollection)
		this.refresh();
	if (obj instanceof DequeCollection)
		obj.refresh();
};