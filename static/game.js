const div = document.querySelector('#gameId')
const gameId = div.dataset.gameId
const orientation = div.dataset.orientation

const onDrop = (source, target, piece) => {
	console.info('source: ', source)
	console.info('target: ', target)
	console.info('piece: ', piece)

	const req = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ source, target })
	}
	fetch(`/chess/${gameId}`, req)
		.then(result => {
			console.info('>>> result: ', result)
		})
		.catch(err => {
			console.info('>>> error: ', err)
		})
}

const config = {
	draggable: true,
	position: 'start',
	orientation,
	onDrop
}
const game = Chessboard('chess', config)

const sse = new EventSource('/chess/stream')
sse.addEventListener(gameId, msg => {
	const data = JSON.parse(msg.data)
	console.info('>>> received from sse: ', data)
	game.move(`${data.source}-${data.target}`)
})
