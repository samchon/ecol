# **E**vent **Col**lections
[![Build Status](https://travis-ci.org/samchon/ecol.svg?branch=master)](https://travis-ci.org/samchon/ecol)
[![npm version](https://badge.fury.io/js/ecol.svg)](https://www.npmjs.com/package/ecol)
[![Downloads](https://img.shields.io/npm/dm/ecol.svg)](https://www.npmjs.com/package/ecol)
[![DeepScan grade](https://deepscan.io/api/projects/2082/branches/10113/badge/grade.svg)](https://deepscan.io/dashboard#view=project&pid=2082&bid=10113)
[![Chat on Gitter](https://badges.gitter.im/samchon/ecol.svg)](https://gitter.im/samchon/ecol?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Extension of [TypeScript-STL](https://github.com/samchon/tstl) **Con**tainers dispatching **E**vents.

**TSTL** is an open-source project providing features of STL, migrated from *C++* to *TypeScript*. You can enjoy the STL's own specific *containers*, *algorithms* and *functors* in the JavaScript. If TypeScript, you also can take advantage of type restrictions and generic programming with the TypeScript. 

**ECOL** is an extension module of such **TSTL**, providing special collections dispatching events. The special collections are almost similar with the original STL Containers, but you also can observe elements' I/O events with the special collections. Types of the event dispatched by the special collections are `"insert"`, `"erase"` and `"refresh"`.



## Features
### Linear Collections
  - ArrayCollection
  - DequeCollection
  - ListCollection

### Set Containers
  - *Tree-based Collections*
    - TreeSetCollection
    - TreeMultiSetCollection
  - *Hash-buckets based Collections*
    - HashSetCollection
    - HashMultiSetCollection

### Map Collections
  - *Tree-based Collections*
    - TreeMapCollection
    - TreeMultiMapCollection
  - *Hash-buckets based Collections*
    - HashMapCollection
    - HashMultiMapCollection



## Installation
### NPM Module
Installing **ECOL** in *NodeJS* is very easy. Just install with the `npm`.

```bash
# Install TSTL from the NPM module
npm install --save ecol
```

### Usage
``` typescript
import {TreeMapCollection} from "ecol";

function listener(event: TreeMapCollection.Event<number, string>): void
{
    console.log("Event type is: " + event.type);

    for (let it = event.first; !it.equals(event.last); it = it.next())
        console.log("\t", "An element by that event:", it.value);
}

function main(): void
{
    // CONSTRUCT EVENT TREE-MAP
    let map: TreeMapCollection<number, string> = new TreeMapCollection();
    map.addEventListener("insert", listener);
    map.addEventListener("erase", listener);

    // DISPATCHES INSERT EVENT
    map.set(1, "One");
    map.set(2, "Two");
    map.set(3, "Three");

    // DISPATCHES ERASE EVENT
    map.erase(2);
    map.erase(3);

    // DISPATCHES REFRESH EVENT
    map.set(2, "Second"); // AUTOMATIC
    map.refresh(); // BY USER
}
main();
```



## References
  - **Repositories**
    - [GitHub Repository](https://github.com/samchon/ecol)
    - [NPM Repository](https://www.npmjs.com/package/ecol)
  - **Documents**
    - [**Guide Documents**](https://github.com/samchon/ecol/wiki)
    - [API Documents](http://samchon.github.io/ecol/api)
  - **Dependency**
    - [TypeScript-STL](https://github.com/samchon/tstl)