#! /usr/bin/env node

import { Command } from 'commander'
import {promises as fs_promises} from 'fs'
import chalk from 'chalk'
import ora from 'ora'
//import pkg from './package.json'
import path from 'path'


const program = new Command()

program
    .name('bibcli')
    .description("CLI tool for scavaging patterns in different translations of God's Holy Word.")
    .version('0.0.1')
    .option('-d, --debug', 'output extra debugging')
    .option('-l, --lang <string>', 'language', 'en')
    .option('-p, --phrase <string>', 'phrase to search for')


program.parse(process.argv)

const options = program.opts()
const caseSensitive = false
const phrase_value = options.phrase
const lang_value = 'en' // TODO: add support for options.lang
const directory = './data/' + lang_value

const spinner = ora(chalk.cyan(`searching '${directory}' for '${phrase_value}'...`)).start()

try {
    // Check if the directory exists
    const stats = await fs_promises.stat(directory);
    if (!stats.isDirectory()) {
        spinner.fail(chalk.red(`Error: '${directory}' is not a directory.`));
        process.exit(1);
    }

    let totalMatchesFound = 0;
    const filesWithMatches = new Set(); // To store unique file paths that contain matches
    // Use a Map to group matches by file path
    const groupedMatches = new Map(); // Map<filePath, Array<MatchDetails>>

    const files = await fs_promises.readdir(directory);

    spinner.text = chalk.cyan(`Scanning ${files.length} items in '${directory}'...`);

    for (const file of files) {
        const filePath = path.join(directory, file);
        let fileStats;
        try {
            fileStats = await fs_promises.stat(filePath);
        } catch (err) {
            // Skip if we can't stat the file (e.g., permission error, broken symlink)
            spinner.warn(chalk.yellow(`Skipping '${filePath}': Could not access. (${err.message})`));
            spinner.start(chalk.cyan(`Scanning items in '${directory}'...`)); // Restart spinner
            continue;
        }

        if (fileStats.isFile()) {
            let content;
            try {
                content = await fs_promises.readFile(filePath, 'utf8');
            } catch (err) {
                spinner.warn(chalk.yellow(`Skipping '${filePath}': Could not read file content. (${err.message})`));
                spinner.start(chalk.cyan(`Scanning items in '${directory}'...`)); // Restart spinner
                continue;
            }

            const searchTarget = caseSensitive ? phrase_value : phrase_value.toLowerCase();
            const contentLines = content.split(/\r?\n/);

            contentLines.forEach((line, index) => {
                const lineToSearch = caseSensitive ? line : line.toLowerCase();
                let currentMatchIndexInLowerCase = -1;
                let offset = 0;

                // Find all occurrences of the search target within the current line
                while ((currentMatchIndexInLowerCase = lineToSearch.indexOf(searchTarget, offset)) !== -1) {
                    const matchDetail = {
                        lineNumber: index + 1,
                        lineContent: line, // Store original line content
                        matchStartIndex: currentMatchIndexInLowerCase, // Start index of match in the original line (assuming only case changes)
                        searchText: phrase_value // The actual text searched for (original case)
                    };

                    // Add to groupedMatches
                    if (!groupedMatches.has(filePath)) {
                        groupedMatches.set(filePath, []);
                    }
                    groupedMatches.get(filePath).push(matchDetail);

                    totalMatchesFound++; // Increment total matches found globally
                    filesWithMatches.add(filePath); // Add file path to the set of files with matches
                    offset = currentMatchIndexInLowerCase + searchTarget.length;
                }
            });
        } else if (fileStats.isDirectory()) {
            spinner.info(chalk.blue(`Skipping directory: '${filePath}' (non-recursive search).`));
            spinner.start(chalk.cyan(`Scanning items in '${directory}'...`)); // Restart spinner
        }
    }

    spinner.stop(); // Stop the scanning spinner

    if (totalMatchesFound > 0) {
        console.log(chalk.green.bold(`\n--- Search Results for '${phrase_value}' in '${directory}' ---`));

        // Get sorted file paths
        const sortedFilePaths = Array.from(groupedMatches.keys()).sort();

        sortedFilePaths.forEach(filePath => {
            console.log(chalk.cyan.bold(`\nFile: ${filePath}`));
            const matchesInFile = groupedMatches.get(filePath);

            // Sort matches within the file by line number
            matchesInFile.sort((a, b) => a.lineNumber - b.lineNumber);

            matchesInFile.forEach(match => {
                const originalLine = match.lineContent;
                const matchStartCharIndex = match.matchStartIndex;
                const searchText = match.searchText;

                // Part 1: First 6 characters of the line
                const first6Chars = originalLine.length > 6 ? originalLine.substring(0, 6)?.toUpperCase() : originalLine;

                // Part 2: Context snippet with highlighting (approx. 3 words around the match)
                const contextWindowChars = 50; // Characters before and after the match for context
                let contextStart = Math.max(0, matchStartCharIndex - contextWindowChars);
                let contextEnd = Math.min(originalLine.length, matchStartCharIndex + searchText.length + contextWindowChars);

                // Attempt to adjust contextStart to the beginning of a word
                let tempStart = contextStart;
                while (tempStart > 0 && !/\s/.test(originalLine[tempStart - 1]) && (matchStartCharIndex - tempStart) < contextWindowChars) {
                    tempStart--;
                }
                contextStart = tempStart;

                // Attempt to adjust contextEnd to the end of a word
                let tempEnd = contextEnd;
                while (tempEnd < originalLine.length && !/\s/.test(originalLine[tempEnd]) && (tempEnd - (matchStartCharIndex + searchText.length)) < contextWindowChars) {
                    tempEnd++;
                }
                contextEnd = tempEnd;

                let contextString = originalLine.substring(contextStart, contextEnd);

                // Highlight the search text within the context string
                // Find the index of the search text within the *contextString* (case-insensitive search for index)
                const highlightStartIndex = contextString.toLowerCase().indexOf(searchText.toLowerCase());

                if (highlightStartIndex !== -1) {
                    const beforeMatch = contextString.substring(0, highlightStartIndex);
                    const matchedText = contextString.substring(highlightStartIndex, highlightStartIndex + searchText.length);
                    const afterMatch = contextString.substring(highlightStartIndex + searchText.length);
                    contextString = `${beforeMatch}${chalk.red.bold(matchedText)}${afterMatch}`;
                }

                // Add ellipses if the context string doesn't start/end at the original line's boundaries
                if (contextStart > 0) {
                    contextString = "..." + contextString;
                }
                if (contextEnd < originalLine.length) {
                    contextString = contextString + "...";
                }

                const snippet = `[${first6Chars}] Context: "${contextString}"`;

                console.log(chalk.green(`  ${snippet}`));
            });
        });
        console.log(chalk.green.bold(`\nSearch complete! Found ${totalMatchesFound} total match(es) in ${filesWithMatches.size} file(s).`));
    } else {
        console.log(chalk.yellow.bold(`\nSearch complete. No matches found for '${phrase_value}' in ${filesWithMatches.size} file(s) within '${directory}'.`));
    }

} catch (error) {
    if (error.code === 'ENOENT') {
        spinner.fail(chalk.red(`Error: Directory not found at '${directory}'.`));
    } else {
        spinner.fail(chalk.red(`An unexpected error occurred: ${error.message}`));
    }
    process.exit(1);
}


