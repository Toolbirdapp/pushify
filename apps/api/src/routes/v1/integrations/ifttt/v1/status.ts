import type Server from '../../../../../interfaces/Server'
import type { Request, Response, Router } from 'express'

const router = require('express').Router({ mergeParams: true }) as Router

module.exports = (server: Server) => {
	return {
		router: () => {
			router.get('/', async (req: Request, res: Response) => {
				const channelKey = req.headers['ifttt-channel-key']
				const serviceKey = req.headers['ifttt-service-key']
				if (
					!channelKey ||
					!serviceKey ||
					serviceKey !== process.env.IFTTT_SERVICE_KEY
				) {
					return res.status(401).json({
						error: 'Unauthorized',
					})
				}

				res.json({ message: 'System is active.' })
			})

			return router
		},
	}
}
