import { Vector } from "tstl/container/Vector";
import { IForwardIterator } from "tstl/iterator/IForwardIterator";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

export class ArrayCollection<T> 
	extends Vector<T>
	implements ICollection<T, Vector<T>, Vector.Iterator<T>, Vector.ReverseIterator<T>>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<T, Vector<T>, Vector.Iterator<T>, Vector.ReverseIterator<T>> = new EventDispatcher();

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
	public push(...items: T[]): number
	{
		let n: number = this.size();
		let ret: number = super.push(...items);

		this._Notify_insert(this.begin().advance(n), this.end());
		return ret;
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
		(pos: Vector.Iterator<T>, first: InputIterator, last: InputIterator): Vector.Iterator<T>
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
	public pop_back(): void
	{
		this._Notify_erase(this.end().prev(), this.end());

		super.pop_back();
	}

	/**
	 * @hidden
	 */
	protected _Erase_by_range(first: Vector.Iterator<T>, last: Vector.Iterator<T>): Vector.Iterator<T>
	{
		this._Notify_erase(first, last);

		return super._Erase_by_range(first, last);
	}

	/* ---------------------------------------------------------
		REFRESH
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
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
	public refresh(it: Vector.Iterator<T>): void;

	/**
	 * @inheritdoc
	 */
	public refresh(first: Vector.Iterator<T>, last: Vector.Iterator<T>): void;

	public refresh(first: Vector.Iterator<T> = null, last: Vector.Iterator<T> = null): void
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
	public dispatchEvent(event: ArrayCollection.Event<T>): void
	{
		if (this.dispatcher_)
			this.dispatcher_.dispatchEvent(event);
	}

	/**
	 * @hidden
	 */
	private _Notify_insert(first: Vector.Iterator<T>, last: Vector.Iterator<T>): void
	{
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	private _Notify_erase(first: Vector.Iterator<T>, last: Vector.Iterator<T>): void
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
	public addEventListener(type: CollectionEvent.Type, listener: ArrayCollection.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: ArrayCollection.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace ArrayCollection
{
	export type Event<T> = CollectionEvent<T, Vector<T>, Vector.Iterator<T>, Vector.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, Vector<T>, Vector.Iterator<T>, Vector.ReverseIterator<T>>;

	export const Event = CollectionEvent;
	export import Iterator = Vector.Iterator;
	export import ReverseIterator = Vector.ReverseIterator;
}

const old_swap = Vector.prototype.swap;
Vector.prototype.swap = function <T>(obj: Vector<T>): void
{
	old_swap.call(this, obj);

	if (this instanceof ArrayCollection)
		this.refresh();
	if (obj instanceof ArrayCollection)
		obj.refresh();
};