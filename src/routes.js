import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { getParameterName } from "./utils/get-parameter-name.js"
import dayjs from "dayjs"

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: getParameterName('/tasks'),
        handler: (req, res) => {
            const { name, description } = req.body

            if ( !name || !description ) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'You need to send the fields "name" and "description"'})
                )
            }

            const task = {
                id: randomUUID(),
                name,
                description,
                created_at: dayjs().format('DD/MM/YYYY HH:mm:ss'),
                completed_at: null,
                updated_at: dayjs().format('DD/MM/YYYY HH:mm:ss')
            }

            database.insert('tasks', task)
            res.writeHead(201).end()
        }
    }, 
    {
        method: 'GET',
        path: getParameterName('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                name: search,
                description: search
            }: null)

            res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: getParameterName('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.parms
            const { name, description } = req.body

            if ( !name || !description ) {
                return res.writeHead(400).end(
                    JSON.stringify({message: 'You submitted fields less than required'})
                )
            }

            const [task] = database.select('tasks', { id })

            if(!task) {
                return res.writeHead(404).end()
            }

            database.update('tasks', id, {
                name,
                description,
                updated_at: dayjs().format('DD/MM/YYYY HH:mm:ss')
            })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: getParameterName('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.parms
        
            database.delete('tasks', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: getParameterName('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.parms
        
            const [task] = database.select('tasks', { id })

            if(!task) {
                return res.writeHead(404).end()
            }

            const completed = !!task.completed_at
            const completed_at = completed ? null : dayjs().format('DD/MM/YYYY HH:mm:ss')

            database.update('tasks', id, {completed_at})
            return res.writeHead(204).end()
        }
    },
]