import { HashSet } from "tstl/container/HashSet";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

export class HashSetCollection<T> 
    extends HashSet<T>
    implements ICollection<T, HashSet<T>, HashSet.Iterator<T>, HashSet.ReverseIterator<T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<T, HashSet<T>, HashSet.Iterator<T>, HashSet.ReverseIterator<T>> = new EventDispatcher();

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
    protected _Handle_insert(first: HashSet.Iterator<T>, last: HashSet.Iterator<T>): void
    {
        super._Handle_insert(first, last);
        
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: HashSet.Iterator<T>, last: HashSet.Iterator<T>): void
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
    public dispatchEvent(event: HashSetCollection.Event<T>): void
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
    public refresh(it: HashSet.Iterator<T>): void;

    /**
     * @inheritDoc
     */
    public refresh(first: HashSet.Iterator<T>, last: HashSet.Iterator<T>): void;

    public refresh(first?: HashSet.Iterator<T>, last?: HashSet.Iterator<T>): void
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
    public addEventListener(type: CollectionEvent.Type, listener: HashSetCollection.Listener<T>): void
    {
        this.dispatcher_.addEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: CollectionEvent.Type, listener: HashSetCollection.Listener<T>): void
    {
        this.dispatcher_.removeEventListener(type, listener);
    }
}

export namespace HashSetCollection
{
    export type Event<T> = CollectionEvent<T, HashSet<T>, HashSet.Iterator<T>, HashSet.ReverseIterator<T>>;
    export type Listener<T> = CollectionEvent.Listener<T, HashSet<T>, HashSet.Iterator<T>, HashSet.ReverseIterator<T>>;

    export const Event = CollectionEvent;
    export import Iterator = HashSet.Iterator;
    export import ReverseIterator = HashSet.ReverseIterator;
}

const old_swap = HashSet.prototype.swap;
HashSet.prototype.swap = function <T>(obj: HashSet<T>): void
{
    old_swap.call(this, obj);

    if (this instanceof HashSetCollection)
        this.refresh();
    if (obj instanceof HashSetCollection)
        obj.refresh();
};