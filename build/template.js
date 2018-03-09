const fs = require("fs");

function manipulate(path, derives)
{
	let content = fs.readFileSync(path + "/template", "utf8");
	for (let type of derives)
	{
		let my_content = content.split("Type").join(type);
		fs.writeFileSync(`${path}/${type}.ts`, my_content, "utf8");
	}
}

function main()
{
	manipulate(__dirname + "/../src/sets", ["TreeSet", "TreeMultiSet", "HashSet", "HashMultiSet"]);
	manipulate(__dirname + "/../src/maps", ["TreeMap", "TreeMultiMap", "HashMap", "HashMultiMap"]);
}
main();