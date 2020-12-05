import unified from 'unified';
import parser from 'remark-parse';
import stringify from 'remark-stringify';
import marktable from 'marktable';
import Table from 'cli-table';

export const toAst = (markdown: string) => {
    return unified().use(parser).parse(markdown);
};

export const toMarkdown = (node: any) => {
    return unified().use(stringify).stringify(node);
};

export const isMarkdownTable = (text: string) => {
    // https://github.com/erikvullings/slimdown-js/blob/master/src/slimdown.ts 125
    return /(\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?/g.test(text);
};

export const prettifyTable = (mdt: string): string => {
    let parsedTable: string = marktable(mdt);

    let tableArray = parsedTable
        .trim()
        .split('\n')
        .map((s) =>
            s
                .split('|')
                .filter((c) => !c.includes('-'))
                .filter((d) => /\s+/.test(d))
        )
        .filter((e) => e.length > 1);

    const table = new Table({
        head: tableArray.shift(),
        chars: {
            top: '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            'left-mid': '╟',
            mid: '─',
            'mid-mid': '┼',
            right: '║',
            'right-mid': '╢',
            middle: '│',
        },
    });

    tableArray.forEach((e) => {
        table.push(e);
    });

    return table.toString();
};
