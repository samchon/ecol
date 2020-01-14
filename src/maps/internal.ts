import { EventDispatcher } from "../basic/EventDispatcher";

import { MapElementList } from "tstl/internal/container/associative/MapElementList";
import { MapElementVector } from "tstl/internal/container/associative/MapElementVector";

for (let proto of [MapElementList.prototype, MapElementVector.prototype])
    Object.defineProperty(proto, "second",
    {
        get: function () 
        {
            return this.value.second;
        },
        set: function (val) 
        {
            this.value.second = val;

            if (this.source().dispatcher_ instanceof EventDispatcher)
                this.source().refresh(this);
        },
        enumerable: true,
        configurable: true
    });