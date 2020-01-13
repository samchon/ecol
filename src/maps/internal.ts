import { EventDispatcher } from "../basic/EventDispatcher";

import { MapElementList } from "tstl/base/container/MapElementList";
import { MapElementVector } from "tstl/base/container/MapElementVector";

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