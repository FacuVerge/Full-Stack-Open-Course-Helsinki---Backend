const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
morgan.token('body', req => {
	return JSON.stringify(req.body)
})
  
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/info', (request, response) => {
	response.send(
		'<p>Phonebook has info for ' + persons.length + ' people</p>' +
		'<p>' + new Date() + '</p>'
	)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(note => note.id === id)
	if (person) {    
		response.json(person)  
	} else {    
		response.status(404).end()  
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(note => note.id !== id)
	response.status(204).end()
})

const generateId = () => {
	return Math.floor(Math.random() * 54684454);
}

app.post('/api/persons', (request, response) => {
	const body = request.body
  
	if (!body.name) {
	  	return response.status(400).json({ 
			error: 'Name is missing' 
	  	})
	}

	if (!body.number) {
		return response.status(400).json({ 
		  	error: 'Number is missing' 
		})
  	}

  	if (persons.map(person => person.name).includes(body.name)) {
		return response.status(400).json({ 
	  		error: 'Name must be unique' 
		})
	}
  
	const person = {
		name: body.name,
		number: body.number,
		id: generateId().toString(),
	}
  
	persons = persons.concat(person)
  
	response.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})