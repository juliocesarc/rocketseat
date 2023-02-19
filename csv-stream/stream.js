import { parse } from "csv-parse";
import fs from "node:fs"

const fileCsv = new URL('./arquivo.csv', import.meta.url)

const stream = fs.createReadStream(fileCsv)

const csvParse = parse({
    delimiter: ',',
    from_line: 2,
    skip_empty_lines: true
})

async function runStream() {
    const linesCsv = stream.pipe(csvParse)

    for await (const line of linesCsv) {
        const [name, description] = line

        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description
            })
        })

        await wait(1000)
    }
}

runStream()

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
