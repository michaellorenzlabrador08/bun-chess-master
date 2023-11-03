import morgan from 'morgan'
import express from 'express'
import { engine } from 'express-handlebars'
import { v4 as uuidv4 } from 'uuid'
import { EventSource } from 'express-ts-sse'

const PORT = process.env.ENV || 3000

const app = express()

const sse = new EventSource()

app.engine('html', engine({ defaultLayout: false }))
app.set('view engine', 'html')

app.use(morgan('combined'))

app.post('/chess', express.urlencoded({ extended: true }),
	(req, resp) => {
		const gameId = uuidv4().substring(0, 8)
		resp.render(`game`, { gameId, orientation: 'white' })
	}
)

app.post('/chess/:gameId', express.json(), (req, resp) => {
	console.info('>>> body: ', req.body);
	const gameId = req.params.gameId
	console.info('>>> gameId: ', gameId)
	sse.send({ event: gameId, data: req.body })
	resp.status(200).send({ })
})

app.get('/chess', 
	(req, resp) => {
		const gameId = req.query.gameId
		resp.render(`game`, { gameId, orientation: 'black' })
	}
)

app.get('/chess/stream', sse.init)

app.use(express.static(__dirname + '/static'))

app.listen(PORT, () => {
	console.info(`Application started on port ${PORT} at ${new Date()}`)
})
