import { MapIterator } from "tstl/base/iterator/MapIterator";
import { EventDispatcher } from "../basic/EventDispatcher";

Object.defineProperty(MapIterator.prototype, "second",
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