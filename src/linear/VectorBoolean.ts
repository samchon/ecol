import * as std from "tstl";

import {ICollection} from "../basic/ICollection";
import {CollectionEvent} from "../basic/CollectionEvent";
import {EventDispatcher} from "../basic/EventDispatcher";

export class VectorBoolean
	extends std.VectorBoolean
	implements ICollection<boolean, 
		std.VectorBoolean, 
		std.VectorBoolean.Iterator, 
		std.VectorBoolean.ReverseIterator>
{
	/**
	 * @hidden
	 */
	private dispatcher_: EventDispatcher<boolean, std.VectorBoolean, std.VectorBoolean.Iterator, std.VectorBoolean.ReverseIterator> = new EventDispatcher();

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
	public push_back(val: boolean): void
	{
		super.push(val);

		this._Notify_insert(this.end().prev(), this.end());
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_repeating_val(pos: std.VectorBoolean.Iterator, n: number, val: boolean): std.VectorBoolean.Iterator
	{
		let ret = super._Insert_by_repeating_val(pos, n, val);
		this._Notify_insert(pos, pos.advance(n));

		return ret;
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_range<InputIterator extends Readonly<std.IForwardIterator<boolean, InputIterator>>>
		(pos: std.VectorBoolean.Iterator, first: InputIterator, last: InputIterator): std.VectorBoolean.Iterator
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
	protected _Erase_by_range(first: std.VectorBoolean.Iterator, last: std.VectorBoolean.Iterator): std.VectorBoolean.Iterator
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
	public set(index: number, val: boolean): void
	{
		super.set(index, val);
		this.refresh(this.begin().advance(index));
	}

	/**
	 * @inheritDoc
	 */
	public flip(): void
	{
		super.flip();
		this.refresh();
	}

	/**
	 * @inheritdoc
	 */
	public refresh(): void;

	/**
	 * @inheritdoc
	 */
	public refresh(it: std.VectorBoolean.Iterator): void;

	/**
	 * @inheritdoc
	 */
	public refresh(first: std.VectorBoolean.Iterator, last: std.VectorBoolean.Iterator): void;

	public refresh(first: std.VectorBoolean.Iterator = null, last: std.VectorBoolean.Iterator = null): void
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
	public dispatchEvent(event: VectorBoolean.Event): void
	{
		this.dispatcher_.dispatchEvent(event);
	}

	/**
	 * @hidden
	 */
	private _Notify_insert(first: std.VectorBoolean.Iterator, last: std.VectorBoolean.Iterator): void
	{
		this.dispatchEvent(new CollectionEvent("insert", first, last));
	}

	/**
	 * @hidden
	 */
	private _Notify_erase(first: std.VectorBoolean.Iterator, last: std.VectorBoolean.Iterator): void
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
	public addEventListener(type: CollectionEvent.Type, listener: VectorBoolean.Listener): void
	{
		this.dispatcher_.addEventListener(type, listener);
	}

	/**
	 * @inheritdoc
	 */
	public removeEventListener(type: CollectionEvent.Type, listener: VectorBoolean.Listener): void
	{
		this.dispatcher_.removeEventListener(type, listener);
	}
}

export namespace VectorBoolean
{
	export type Event = CollectionEvent<boolean, std.VectorBoolean, std.VectorBoolean.Iterator, std.VectorBoolean.ReverseIterator>;
	export type Listener = CollectionEvent.Listener<boolean, std.VectorBoolean, std.VectorBoolean.Iterator, std.VectorBoolean.ReverseIterator>;

	export const Event = CollectionEvent;
	export import Iterator = std.VectorBoolean.Iterator;
	export import ReverseIterator = std.VectorBoolean.ReverseIterator;
}