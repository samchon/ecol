import { TreeMultiSet } from "tstl/container/TreeMultiSet";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

export class TreeMultiSetCollection<T> 
    extends TreeMultiSet<T>
    implements ICollection<T, TreeMultiSet<T>, TreeMultiSet.Iterator<T>, TreeMultiSet.ReverseIterator<T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<T, TreeMultiSet<T>, TreeMultiSet.Iterator<T>, TreeMultiSet.ReverseIterator<T>> = new EventDispatcher();

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
    protected _Handle_insert(first: TreeMultiSet.Iterator<T>, last: TreeMultiSet.Iterator<T>): void
    {
        super._Handle_insert(first, last);
        
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: TreeMultiSet.Iterator<T>, last: TreeMultiSet.Iterator<T>): void
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
    public dispatchEvent(event: TreeMultiSetCollection.Event<T>): void
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
    public refresh(it: TreeMultiSet.Iterator<T>): void;

    /**
     * @inheritDoc
     */
    public refresh(first: TreeMultiSet.Iterator<T>, last: TreeMultiSet.Iterator<T>): void;

    public refresh(first?: TreeMultiSet.Iterator<T>, last?: TreeMultiSet.Iterator<T>): void
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
    public addEventListener(type: CollectionEvent.Type, listener: TreeMultiSetCollection.Listener<T>): void
    {
        this.dispatcher_.addEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: CollectionEvent.Type, listener: TreeMultiSetCollection.Listener<T>): void
    {
        this.dispatcher_.removeEventListener(type, listener);
    }
}

export namespace TreeMultiSetCollection
{
    export type Event<T> = CollectionEvent<T, TreeMultiSet<T>, TreeMultiSet.Iterator<T>, TreeMultiSet.ReverseIterator<T>>;
    export type Listener<T> = CollectionEvent.Listener<T, TreeMultiSet<T>, TreeMultiSet.Iterator<T>, TreeMultiSet.ReverseIterator<T>>;

    export const Event = CollectionEvent;
    export import Iterator = TreeMultiSet.Iterator;
    export import ReverseIterator = TreeMultiSet.ReverseIterator;
}

const old_swap = TreeMultiSet.prototype.swap;
TreeMultiSet.prototype.swap = function <T>(obj: TreeMultiSet<T>): void
{
    old_swap.call(this, obj);

    if (this instanceof TreeMultiSetCollection)
        this.refresh();
    if (obj instanceof TreeMultiSetCollection)
        obj.refresh();
};