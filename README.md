# **E**vent **Con**tainers
[![Build Status](https://travis-ci.org/samchon/econ.svg?branch=master)](https://travis-ci.org/samchon/econ)
[![npm version](https://badge.fury.io/js/econ.svg)](https://www.npmjs.com/package/econ)
[![Downloads](https://img.shields.io/npm/dm/econ.svg)](https://www.npmjs.com/package/econ)
[![DeepScan grade](https://deepscan.io/api/projects/2075/branches/10002/badge/grade.svg)](https://deepscan.io/dashboard#view=project&pid=2075&bid=10002)
[![Chat on Gitter](https://badges.gitter.im/samchon/econ.svg)](https://gitter.im/samchon/econ?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Extension of [TypeScript-STL](https://github.com/samchon/tstl) **Con**tainers dispatching **E**vents.

**TSTL** is an open-source project providing features of STL, migrated from *C++* to *TypeScript*. You can enjoy the STL's own specific *containers*, *algorithms* and *functors* in the JavaScript. If TypeScript, you also can take advantage of type restrictions and generic programming with the TypeScript. 

**ECON** is an extension module of such **TSTL**, providing special containers dispatching events. The special containers are almost similar with the original STL Containers, but you also can observe elements' I/O events with the special containers. Types of the event dispatched by the special containers are `"insert"`, `"erase"` and `"refresh"`.



## Features
### Linear Containers
  - Vector
  - Deque
  - List
  - VectorBoolean

### Set Containers
  - *Tree-based Containers*
    - TreeSet
    - TreeMultiSet
  - *Hash-buckets based Containers*
    - HashSet
    - HashMultiSet

### Map Containers
  - *Tree-based Containers*
    - TreeMap
    - TreeMultiMap
  - *Hash-buckets based Containers*
    - HashMap
    - HashMultiMap



## Installation
### NPM Module
Installing **ECON** in *NodeJS* is very easy. Just install with the `npm`.

```bash
# Install TSTL from the NPM module
npm install --save econ
```

### Usage
``` typescript
import econ = require("econ");

function listener(event: econ.TreeMap.Event<number, string>): void
{
    console.log("Event type is: " + event.type);

    for (let it = event.first; !it.equals(event.last); it = it.next())
        console.log("\t", "An element by that event:", it.value);
}

function main(): void
{
    // CONSTRUCT EVENT TREE-MAP
    let map: econ.TreeMap<number, string> = new econ.TreeMap();
    map.addEventListener("insert", listener);
    map.addEventListener("erase", listener);

    // DISPATCHES INSERT EVENT
    map.set(1, "One");
    map.set(2, "Two");
    map.set(3, "Three");

    // DISPATCHES ERASE EVENT
    map.erase(2);
    map.erase(3);
}
main();
```



## References
  - **Repositories**
    - [GitHub Repository](https://github.com/samchon/econ)
    - [NPM Repository](https://www.npmjs.com/package/econ)
  - **Documents**
    - [**Guide Documents**](https://github.com/samchon/econ/wiki)
    - [API Documents](http://samchon.github.io/econ/api)
  - **Dependency**
    - [TypeScript-STL](https://github.com/samchon/tstl)