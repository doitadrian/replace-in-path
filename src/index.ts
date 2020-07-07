const globby = require("globby");
const fs = require("fs");

type PathParam = string;

type Replacement = {
    find: string;
    replaceWith: string;
};

type ReplaceInPathParam = Replacement | Replacement[];

export default (path: PathParam, replacement: ReplaceInPathParam) => {
    const paths = globby.sync(path);
    const replacements = Array.isArray(replacement) ? replacement : [replacement];

    for (let i = 0; i < paths.length; i++) {
        const currentPath = paths[i];
        let file = fs.readFileSync(currentPath, "utf8");

        for (let j = 0; j < replacements.length; j++) {
            const currentReplacement = replacements[j];
            const findRegex = new RegExp(currentReplacement.find, "g");
            file = file.replace(findRegex, currentReplacement.replaceWith);
        }

        fs.writeFileSync(currentPath, file);
    }
};
