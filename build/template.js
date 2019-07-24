const fs = require("fs");

function manipulate(path, containers)
{
    let standard = containers[0];
    let content = fs.readFileSync(`${path}/${standard}Collection.ts`, "utf8");

    for (let i = 1; i < containers.length; ++i)
    {
        let target = containers[i];
        let myContent = fs.readFileSync(`${path}/${target}Collection.ts`, "utf8");
        myContent = content.split(standard).join(target);

        fs.writeFileSync(`${path}/${target}Collection.ts`, myContent, "utf8");
    }
}

function main()
{
    manipulate(__dirname + "/../src/sets", ["HashMultiSet", "HashSet", "TreeMultiSet", "TreeSet"]);
    manipulate(__dirname + "/../src/maps", ["HashMap", "HashMultiMap", "TreeMap", "TreeMultiMap"]);
}
main();