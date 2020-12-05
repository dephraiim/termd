#!/usr/bin/env ts-node
import meow from 'meow';
import renderMarkdown, { renderString } from './src/termd';
import { getMarkdownFromUrl } from './src/utils';

const cli = meow(`
  Usage
    $ termd <filename>

  Options
    --string, -s  Use a string with markdown syntax
    --url, -u     Render markdown from url in the terminal

  Examples
    $ termd readme.md // # Heading 1
    ${renderString('# Heading 1')}
    $ termd -s "# Heading 1"
    ${renderString('# Heading 1')}
    $ termd --url="https://gist.githubusercontent.com/dephraiim/..."
    ${renderString('# Heading 1')}
`);

try {
    if (cli.input[0]) {
        console.log(renderMarkdown(cli.input[0]));
    }

    if (cli.flags.s || cli.flags.string) {
        let optionString = (cli.flags.s as string) || (cli.flags.string as string);
        console.log(renderString(optionString));
    }

    if (cli.flags.u || cli.flags.url) {
        let url = (cli.flags.u as string) || (cli.flags.url as string);
        getMarkdownFromUrl(url)
            .then((string) => console.log(renderString(string)))
            .catch((e) => {
                throw new Error(e);
            });
    }
} catch (error) {
    console.log(error.message);
}
