import { HashMap } from "tstl/container/HashMap";
import { Entry } from "tstl/utility/Entry";

import { ICollection } from "../basic/ICollection";
import { CollectionEvent } from "../basic/CollectionEvent";
import { EventDispatcher } from "../basic/EventDispatcher";

import "./internal";

export class HashMapCollection<Key, T> 
    extends HashMap<Key, T>
    implements ICollection<Entry<Key, T>, 
        HashMap<Key, T>, 
        HashMap.Iterator<Key, T>, 
        HashMap.ReverseIterator<Key, T>>
{
    /**
     * @hidden
     */
    private dispatcher_: EventDispatcher<Entry<Key, T>, 
        HashMap<Key, T>, 
        HashMap.Iterator<Key, T>, 
        HashMap.ReverseIterator<Key, T>> = new EventDispatcher();

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
    protected _Handle_insert(first: HashMap.Iterator<Key, T>, last: HashMap.Iterator<Key, T>): void
    {
        super._Handle_insert(first, last);
        
        this.dispatchEvent(new CollectionEvent("insert", first, last));
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: HashMap.Iterator<Key, T>, last: HashMap.Iterator<Key, T>): void
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
    public dispatchEvent(event: HashMapCollection.Event<Key, T>): void
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
    public refresh(it: HashMap.Iterator<Key, T>): void;

    /**
     * @inheritDoc
     */
    public refresh(first: HashMap.Iterator<Key, T>, last: HashMap.Iterator<Key, T>): void;

    public refresh(first?: HashMap.Iterator<Key, T>, last?: HashMap.Iterator<Key, T>): void
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
    public addEventListener(type: CollectionEvent.Type, listener: HashMapCollection.Listener<Key, T>): void
    {
        this.dispatcher_.addEventListener(type, listener);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: CollectionEvent.Type, listener: HashMapCollection.Listener<Key, T>): void
    {
        this.dispatcher_.removeEventListener(type, listener);
    }
}

export namespace HashMapCollection
{
    export type Event<Key, T> = CollectionEvent<Entry<Key, T>, 
        HashMap<Key, T>, 
        HashMap.Iterator<Key, T>, 
        HashMap.ReverseIterator<Key, T>>;

    export type Listener<Key, T> = CollectionEvent.Listener<Entry<Key, T>, 
        HashMap<Key, T>, 
        HashMap.Iterator<Key, T>, 
        HashMap.ReverseIterator<Key, T>>;

    export const Event = CollectionEvent;
    export import Iterator = HashMap.Iterator;
    export import ReverseIterator = HashMap.ReverseIterator;
}

const old_swap = HashMap.prototype.swap;
HashMap.prototype.swap = function <Key, T>(obj: HashMap<Key, T>): void
{
    old_swap.call(this, obj);

    if (this instanceof HashMapCollection)
        this.refresh();
    if (obj instanceof HashMapCollection)
        obj.refresh();
};