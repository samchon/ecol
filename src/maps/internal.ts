import * as std from "tstl";

export class _MapElementList<Key, T, Source extends std.base.MapContainer<Key, T, Source>>
	extends std.base._MapElementList<Key, T, Source>
{
	protected _Create_iterator(prev: std.base.MapIterator<Key, T, Source>, next: std.base.MapIterator<Key, T, Source>, val: std.Entry<Key, T>): std.base.MapIterator<Key, T, Source>
	{
		return new MapIterator(<any>this.associative(), prev, next,val);
	}
}

export class MapIterator<Key, T, Source extends std.base.MapContainer<Key, T, Source>>
	extends std.base.MapIterator<Key, T, Source>
{
	public get second(): T
	{
		return this.value.second;
	}

	public set second(val: T)
	{
		this.value.second = val;
		(this.source() as any).refresh(this);
	}
}