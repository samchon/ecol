import { List } from "tstl/container/List";
import { ICollection } from "../basic/ICollection";

import { IForwardIterator } from "tstl/iterator/IForwardIterator";
import { advance } from "tstl/iterator/global";
import { less } from "tstl/functional/comparators";

import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

export class ListCollection<T> 
    extends List<T>
    implements ICollection<T, List<T>, List.Iterator<T>, List.ReverseIterator<T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<T, List<T>, List.Iterator<T>, List.ReverseIterator<T>> = new EventDispatcher();

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
    protected _Insert_by_range<U extends T, InputIterator extends Readonly<IForwardIterator<U, InputIterator>>>
        (pos: List.Iterator<T>, first: InputIterator, last: InputIterator): List.Iterator<T>
    {
        let n: number = this.size();
        let ret = super._Insert_by_range(pos, first, last);

        n = this.size() - n;
        this._Notify_insert(ret, advance(ret, n));

        return ret;
    }

    /**
     * @hidden
     */
    protected _Erase_by_range(first: List.Iterator<T>, last: List.Iterator<T>): List.Iterator<T>
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

    public sort(comp: (x: T, y: T) => boolean = less): void
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
    public refresh(it: List.Iterator<T>): void;

    /**
     * @inheritdoc
     */
    public refresh(first: List.Iterator<T>, last: List.Iterator<T>): void;

    public refresh(first?: List.Iterator<T>, last?: List.Iterator<T>): void
    {
        if (first === undefined)
        {
            first = this.begin();
            last = this.end();
        }
        else if (last === undefined)
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
    private _Notify_insert(first: List.Iterator<T>, last: List.Iterator<T>): void
    {
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    private _Notify_erase(first: List.Iterator<T>, last: List.Iterator<T>): void
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
    export type Event<T> = CollectionEvent<T, List<T>, List.Iterator<T>, List.ReverseIterator<T>>;
    export type Listener<T> = CollectionEvent.Listener<T, List<T>, List.Iterator<T>, List.ReverseIterator<T>>;

    export const Event = CollectionEvent;

    export import Iterator = List.Iterator;
    export import ReverseIterator = List.ReverseIterator;
}

Object.defineProperty(List.Iterator.prototype, "value",
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

const old_swap = List.prototype.swap;
List.prototype.swap = function <T>(obj: List<T>): void
{
    old_swap.call(this, obj);

    if (this instanceof ListCollection)
        this.refresh();
    if (obj instanceof ListCollection)
        obj.refresh();
};