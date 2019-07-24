import { TreeSet } from "tstl/container/TreeSet";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

export class TreeSetCollection<T> 
    extends TreeSet<T>
    implements ICollection<T, TreeSet<T>, TreeSet.Iterator<T>, TreeSet.ReverseIterator<T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<T, TreeSet<T>, TreeSet.Iterator<T>, TreeSet.ReverseIterator<T>> = new EventDispatcher();

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
    protected _Handle_insert(first: TreeSet.Iterator<T>, last: TreeSet.Iterator<T>): void
    {
        super._Handle_insert(first, last);
        
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: TreeSet.Iterator<T>, last: TreeSet.Iterator<T>): void
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
    public dispatchEvent(event: TreeSetCollection.Event<T>): void
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
    public refresh(it: TreeSet.Iterator<T>): void;

    /**
     * @inheritDoc
     */
    public refresh(first: TreeSet.Iterator<T>, last: TreeSet.Iterator<T>): void;

    public refresh(first?: TreeSet.Iterator<T>, last?: TreeSet.Iterator<T>): void
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
    public addEventListener(type: CollectionEvent.Type, listener: TreeSetCollection.Listener<T>): void
    {
        this.dispatcher_.addEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: CollectionEvent.Type, listener: TreeSetCollection.Listener<T>): void
    {
        this.dispatcher_.removeEventListener(type, listener);
    }
}

export namespace TreeSetCollection
{
    export type Event<T> = CollectionEvent<T, TreeSet<T>, TreeSet.Iterator<T>, TreeSet.ReverseIterator<T>>;
    export type Listener<T> = CollectionEvent.Listener<T, TreeSet<T>, TreeSet.Iterator<T>, TreeSet.ReverseIterator<T>>;

    export const Event = CollectionEvent;
    export import Iterator = TreeSet.Iterator;
    export import ReverseIterator = TreeSet.ReverseIterator;
}

const old_swap = TreeSet.prototype.swap;
TreeSet.prototype.swap = function <T>(obj: TreeSet<T>): void
{
    old_swap.call(this, obj);

    if (this instanceof TreeSetCollection)
        this.refresh();
    if (obj instanceof TreeSetCollection)
        obj.refresh();
};