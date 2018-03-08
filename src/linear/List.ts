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
	public refresh(it: std.List.Iterator<T>): void;
	public refresh(first: std.List.Iterator<T>, last: std.List.Iterator<T>): void;

	public refresh(first: std.List.Iterator<T>, last: std.List.Iterator<T> = first.next()): void
	{
		this.dispatchEvent(new CollectionEvent("refresh", first, last));
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

	public dispatchEvent(event: List.Event<T>): void
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

	public addEventListener(type: CollectionEvent.Type, listener: List.Listener<T>): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	public removeEventListener(type: CollectionEvent.Type, listener: List.Listener<T>): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace List
{
	export type Event<T> = CollectionEvent<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>>;
	export type Listener<T> = CollectionEvent.Listener<T, std.List<T>, std.List.Iterator<T>, std.List.ReverseIterator<T>>;
}