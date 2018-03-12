import fs = require("fs");

const PATH = __dirname + "/tests";

async function main(): Promise<void>
{
	let directory: string[] = fs.readdirSync(PATH);
	for (let file of directory)
	{
		if (file.substr(-3) != ".js")
			continue;
		
		let external = await import(PATH + "/" + file.substr(0, file.length - 3));
		for (let key in external)
			if (key.substr(0, 5) == "test_")
			{
				console.log(key);
				await external[key]();
			}
	}
}
main().then(() =>
{
	console.log("Success");
}).catch(ex =>
{
	console.log(ex);
	process.exit(1);
});