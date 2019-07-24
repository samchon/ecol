import { TreeMultiMap } from "tstl/container/TreeMultiMap";
import { Entry } from "tstl/utility/Entry";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

import "./internal";

export class TreeMultiMapCollection<Key, T> 
    extends TreeMultiMap<Key, T>
    implements ICollection<Entry<Key, T>, 
        TreeMultiMap<Key, T>, 
        TreeMultiMap.Iterator<Key, T>, 
        TreeMultiMap.ReverseIterator<Key, T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<Entry<Key, T>, 
        TreeMultiMap<Key, T>, 
        TreeMultiMap.Iterator<Key, T>, 
        TreeMultiMap.ReverseIterator<Key, T>> = new EventDispatcher();

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    // using super.constructor;

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
    protected _Handle_insert(first: TreeMultiMap.Iterator<Key, T>, last: TreeMultiMap.Iterator<Key, T>): void
    {
        super._Handle_insert(first, last);
        
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: TreeMultiMap.Iterator<Key, T>, last: TreeMultiMap.Iterator<Key, T>): void
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
    public dispatchEvent(event: TreeMultiMapCollection.Event<Key, T>): void
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
    public refresh(it: TreeMultiMap.Iterator<Key, T>): void;

    /**
     * @inheritDoc
     */
    public refresh(first: TreeMultiMap.Iterator<Key, T>, last: TreeMultiMap.Iterator<Key, T>): void;

    public refresh(first?: TreeMultiMap.Iterator<Key, T>, last?: TreeMultiMap.Iterator<Key, T>): void
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
    -------------------------------------------------------- */
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
    public addEventListener(type: CollectionEvent.Type, listener: TreeMultiMapCollection.Listener<Key, T>): void
    {
        this.dispatcher_.addEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: CollectionEvent.Type, listener: TreeMultiMapCollection.Listener<Key, T>): void
    {
        this.dispatcher_.removeEventListener(type, listener);
    }
}

export namespace TreeMultiMapCollection
{
    export type Event<Key, T> = CollectionEvent<Entry<Key, T>, 
        TreeMultiMap<Key, T>, 
        TreeMultiMap.Iterator<Key, T>, 
        TreeMultiMap.ReverseIterator<Key, T>>;

    export type Listener<Key, T> = CollectionEvent.Listener<Entry<Key, T>, 
        TreeMultiMap<Key, T>, 
        TreeMultiMap.Iterator<Key, T>, 
        TreeMultiMap.ReverseIterator<Key, T>>;

    export const Event = CollectionEvent;
    export import Iterator = TreeMultiMap.Iterator;
    export import ReverseIterator = TreeMultiMap.ReverseIterator;
}

const old_swap = TreeMultiMap.prototype.swap;
TreeMultiMap.prototype.swap = function <Key, T>(obj: TreeMultiMap<Key, T>): void
{
    old_swap.call(this, obj);

    if (this instanceof TreeMultiMapCollection)
        this.refresh();
    if (obj instanceof TreeMultiMapCollection)
        obj.refresh();
};