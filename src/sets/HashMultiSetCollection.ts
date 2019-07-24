import { HashMultiSet } from "tstl/container/HashMultiSet";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

export class HashMultiSetCollection<T> 
    extends HashMultiSet<T>
    implements ICollection<T, HashMultiSet<T>, HashMultiSet.Iterator<T>, HashMultiSet.ReverseIterator<T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<T, HashMultiSet<T>, HashMultiSet.Iterator<T>, HashMultiSet.ReverseIterator<T>> = new EventDispatcher();

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    // using super.constructor

    public clear(): void
    {
        let first = this.begin();
        let last = this.end();

        super.clear();
        this.dispatchEvent(new CollectionEvent("erase", first, last));
    }

    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    /**
     * @hidden
     */
    protected _Handle_insert(first: HashMultiSet.Iterator<T>, last: HashMultiSet.Iterator<T>): void
    {
        super._Handle_insert(first, last);
        
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: HashMultiSet.Iterator<T>, last: HashMultiSet.Iterator<T>): void
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
    public dispatchEvent(event: HashMultiSetCollection.Event<T>): void
    {
        if (this.dispatcher_)
            this.dispatcher_.dispatchEvent(event);
    }

    /**
     * @inheritDoc
     */
    public refresh(): void;

    /**
     * @inheritDoc
     */
    public refresh(it: HashMultiSet.Iterator<T>): void;

    /**
     * @inheritDoc
     */
    public refresh(first: HashMultiSet.Iterator<T>, last: HashMultiSet.Iterator<T>): void;

    public refresh(first?: HashMultiSet.Iterator<T>, last?: HashMultiSet.Iterator<T>): void
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
    public addEventListener(type: CollectionEvent.Type, listener: HashMultiSetCollection.Listener<T>): void
    {
        this.dispatcher_.addEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: CollectionEvent.Type, listener: HashMultiSetCollection.Listener<T>): void
    {
        this.dispatcher_.removeEventListener(type, listener);
    }
}

export namespace HashMultiSetCollection
{
    export type Event<T> = CollectionEvent<T, HashMultiSet<T>, HashMultiSet.Iterator<T>, HashMultiSet.ReverseIterator<T>>;
    export type Listener<T> = CollectionEvent.Listener<T, HashMultiSet<T>, HashMultiSet.Iterator<T>, HashMultiSet.ReverseIterator<T>>;

    export const Event = CollectionEvent;
    export import Iterator = HashMultiSet.Iterator;
    export import ReverseIterator = HashMultiSet.ReverseIterator;
}

const old_swap = HashMultiSet.prototype.swap;
HashMultiSet.prototype.swap = function <T>(obj: HashMultiSet<T>): void
{
    old_swap.call(this, obj);

    if (this instanceof HashMultiSetCollection)
        this.refresh();
    if (obj instanceof HashMultiSetCollection)
        obj.refresh();
};