import { replaceInPath } from "..";
import { ncp } from "ncp";
import path from "path";
import fs from "fs";
import rimraf from "rimraf";

test("must correctly replace in path", async () => {
    const dirs = {
        mock: path.join(__dirname, "matchCaseMock"),
        test: path.join(__dirname, "matchCase")
    };

    await new Promise(resolve => {
        ncp(dirs.mock, dirs.test, resolve);
    });

    replaceInPath(`${dirs.test}/**/*.txt`, [
        { find: "CHANGED", replaceWith: "changed" },
        { find: "LOWERCASE", replaceWith: "lowercase" }
    ]);

    // Assert that the match-case replacements have been made successfully.
    const someFileContent = fs.readFileSync(path.join(dirs.test, "someFile.txt"), "utf8");
    expect(someFileContent).toBe(`This should be changed to lowercase.

But this should not be changed, as it's already lowercase.
`);

    rimraf.sync(dirs.test);
});
