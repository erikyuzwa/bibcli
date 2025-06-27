# bibcli

A handy dandy CLI for sifting through different translations of God's Holy Word!

## Translations Supported

- `KJV` (King James Version - of course)
- `NKJV`(New King James Version)
- `ESV` (English Standard Version)
- `AMP` (Amplified Version)

## Installation

`npm i bibcli`

## Usage

- Searching for a pattern
`bibcli --text "morning star"` or `bibcli -t "morning star"`
```
--- Search Results for 'morning star' in './data/en' ---

File: data/en/esv.txt
  [JB3807] Context: "Jb3807 when the morning stars sang together and all the sons of God shouted fo..."
  [2P0119] Context: "...ning in a dark place, until the day dawns and the morning star rises in your hearts,  "
  [RV0228] Context: "Rv0228 And I will give him the morning star.  "
  [RV2216] Context: "... the root and the descendant of David, the bright morning star.”  "

File: data/en/kjv.txt
  [JB3807] Context: "Jb3807 When the morning stars sang together, and all the sons of God shouted f..."
  [RV0228] Context: "Rv0228 And I will give him the morning star.  "
  [RV2216] Context: "...ot and the offspring of David, and the bright and morning star.  "

File: data/en/nkjv.txt
  [JB3807] Context: "Jb3807 When the morning stars sang together, And all the sons of God shouted f..."
  [2P0119] Context: "...ines in a dark place, until the day dawns and the morning star rises in your hearts;  "
  [RV0228] Context: "Rv0228 and I will give him the morning star.  "
  [RV2216] Context: "...e Root and the Offspring of David, the Bright and Morning Star.”  "

Search complete! Found 11 total match(es) in 3 file(s).
```

- Available options
`bibcli --help` or `bibcli -h`
```
Usage: bibcli [options]

CLI tool for scavaging patterns in different translations of God's Holy Word.

Options:
  -V, --version        output the version number
  -d, --debug          output extra debugging
  -l, --lang           language (default "en")
  -t, --text <string>  phrase to search for
  -h, --help           display help for command
```



## Development

- `git clone `
- `cd `
- `npm link`

## LICENSE

Copyright 2025 Erik Yuzwa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the “Software”), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
