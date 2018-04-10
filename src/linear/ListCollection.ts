import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class ListCollection<T> 
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

	public clear(): void
	{
		let first = this.begin();
		let last = this.end();

		super.clear();
		this._Notify_erase(first, last);
	}

	/* =========================================================
		ELEMENTS I/O
			- INSERT & ERASE
			- ALGORITHMS
	============================================================
		INSERT & ERASE
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

	/* ---------------------------------------------------------
		ALGORITHMS
	--------------------------------------------------------- */
	/** 
	 * @inheritDoc
	 */
	public sort(): void;

	/** 
	 * @inheritDoc
	 */
	public sort(comp: (x: T, y: T) => boolean): void;

	public sort(comp: (x: T, y: T) => boolean = std.less): void
	{
		super.sort(comp);
		this.refresh();
	}

	/** 
	 * @inheritDoc
	 */
	public reverse(): void
	{
		super.reverse();
		this.refresh();
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
		if (first === null)
		{
			first = this.begin();
			last = this.end();
		}
		else if (last === null)
			last = first.next();

		this.dispatchEvent(new CollectionEvent("refresh", first, last));
	}

	/**
	 * @inheritdoc
	 */
	public dispatchEvent(event: ListCollection.Event<T>): void
	{
		if (this.dispatcher_)
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
	public addEventListener(type: CollectionEvent.Type, listener: ListCollection.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: ListCollection.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace ListCollection
{
	export type Event<T> = CollectionEvent<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>>;

	export const Event = CollectionEvent;

	export import Iterator = std.List.Iterator;
	export import ReverseIterator = std.List.ReverseIterator;
}

Object.defineProperty(std.List.Iterator.prototype, "value",
{
	get: function () 
	{
		return this.value_;
	},
	set: function (val) 
	{
		this.value_ = val;

		if (this.source() instanceof ListCollection)
			this.source().refresh(this);
	},
	enumerable: true,
	configurable: true
});

const old_swap = std.List.prototype.swap;
std.List.prototype.swap = function <T>(obj: std.List<T>): void
{
	old_swap.call(this, obj);

	if (this instanceof ListCollection)
		this.refresh();
	if (obj instanceof ListCollection)
		obj.refresh();
};