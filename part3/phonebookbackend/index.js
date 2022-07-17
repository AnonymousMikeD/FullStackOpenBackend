const http = require('http');
const { response } = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { appendFile } = require('fs');
app.use(express.json());

morgan.token('data', (request, response) => JSON.stringify(request.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons',(request, response) => {
    response.json(persons);
})

app.get('/info',(request, response) => {
    const date = new Date();
    response.write(`Phonebook has info for ${persons.length} people \n`)
    response.write(Date())
    response.send()
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        response.json(person)
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id);
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const id = Number(request.params.id);
    const personID = persons.find(p => p.id === id);

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (!personID) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    

    persons = persons.concat(person)

    response.json(person)
})

const Logger = (request, response) =>{
    console.log(request.method)


}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
