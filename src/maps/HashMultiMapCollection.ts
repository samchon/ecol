import { HashMultiMap } from "tstl/container/HashMultiMap";
import { Entry } from "tstl/utility/Entry";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

import "./internal";

export class HashMultiMapCollection<Key, T> 
    extends HashMultiMap<Key, T>
    implements ICollection<Entry<Key, T>, 
        HashMultiMap<Key, T>, 
        HashMultiMap.Iterator<Key, T>, 
        HashMultiMap.ReverseIterator<Key, T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<Entry<Key, T>, 
        HashMultiMap<Key, T>, 
        HashMultiMap.Iterator<Key, T>, 
        HashMultiMap.ReverseIterator<Key, T>> = new EventDispatcher();

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
    protected _Handle_insert(first: HashMultiMap.Iterator<Key, T>, last: HashMultiMap.Iterator<Key, T>): void
    {
        super._Handle_insert(first, last);
        
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: HashMultiMap.Iterator<Key, T>, last: HashMultiMap.Iterator<Key, T>): void
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
    public dispatchEvent(event: HashMultiMapCollection.Event<Key, T>): void
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
    public refresh(it: HashMultiMap.Iterator<Key, T>): void;

    /**
     * @inheritDoc
     */
    public refresh(first: HashMultiMap.Iterator<Key, T>, last: HashMultiMap.Iterator<Key, T>): void;

    public refresh(first?: HashMultiMap.Iterator<Key, T>, last?: HashMultiMap.Iterator<Key, T>): void
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
    public addEventListener(type: CollectionEvent.Type, listener: HashMultiMapCollection.Listener<Key, T>): void
    {
        this.dispatcher_.addEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: CollectionEvent.Type, listener: HashMultiMapCollection.Listener<Key, T>): void
    {
        this.dispatcher_.removeEventListener(type, listener);
    }
}

export namespace HashMultiMapCollection
{
    export type Event<Key, T> = CollectionEvent<Entry<Key, T>, 
        HashMultiMap<Key, T>, 
        HashMultiMap.Iterator<Key, T>, 
        HashMultiMap.ReverseIterator<Key, T>>;

    export type Listener<Key, T> = CollectionEvent.Listener<Entry<Key, T>, 
        HashMultiMap<Key, T>, 
        HashMultiMap.Iterator<Key, T>, 
        HashMultiMap.ReverseIterator<Key, T>>;

    export const Event = CollectionEvent;
    export import Iterator = HashMultiMap.Iterator;
    export import ReverseIterator = HashMultiMap.ReverseIterator;
}

const old_swap = HashMultiMap.prototype.swap;
HashMultiMap.prototype.swap = function <Key, T>(obj: HashMultiMap<Key, T>): void
{
    old_swap.call(this, obj);

    if (this instanceof HashMultiMapCollection)
        this.refresh();
    if (obj instanceof HashMultiMapCollection)
        obj.refresh();
};