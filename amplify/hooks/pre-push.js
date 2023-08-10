/**
 * Hook to set tags for other tooling
 */
const fs = require("node:fs");
const {execSync} = require("node:child_process");
const tagFile = __dirname + "/../backend/tags.json";
const customerKey = "grl:customer";
/**
 * @param data { { amplify: { environment: { envName: string, projectPath: string, defaultEditor: string }, command: string, subCommand: string, argv: string[] } } }
 * @param error { { message: string, stack: string } }
 */
const hookHandler = async (data, error) => {
  // Use the current git branch as a basis for the customer name
  const git = execSync("git branch --show-current");

  const betterEnvName = git
    .toString()
    .replace(/\s/g, "")
    .replace(/^([a-z]*[^a-z])?/i, "") // remove any prefix delimited by any non alpha
    .toLocaleLowerCase()
    .replace(/[^a-z]+/g, ""); // Just remove non-alpha
  const tags = [
    ...JSON.parse(fs.readFileSync(tagFile, {encoding: "utf8"})).filter(
      ({Key}) => Key !== customerKey
    ),
    {
      Key: "grl:customer",
      Value: betterEnvName
    }
  ];
  fs.writeFileSync(tagFile, JSON.stringify(tags, undefined, 2));
  console.log("Tags updated: ", tags);
};

const getParameters = async () => {
  const fs = require("fs");
  return JSON.parse(fs.readFileSync(0, {encoding: "utf8"}));
};

getParameters()
  .then((event) => {
    hookHandler(event.data, event.error);
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
