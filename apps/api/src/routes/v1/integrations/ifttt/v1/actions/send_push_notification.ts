import { validAPIKey } from '../../../../../../middlewares/APIMiddleware'
import { uuid } from '../../../../../../helpers/crypto'
import type Server from '../../../../../../interfaces/Server'
import type { Request, Response, Router } from 'express'
import * as z from 'zod'

const router = require('express').Router({ mergeParams: true }) as Router

module.exports = (server: Server) => {
	return {
		router: () => {
			router.post('/', async (req: Request, res: Response) => {
				const channelKey = req.headers['ifttt-channel-key']
				const serviceKey = req.headers['ifttt-service-key']
				if (
					!channelKey ||
					!serviceKey ||
					serviceKey !== process.env.IFTTT_SERVICE_KEY
				) {
					return res.status(401).json({
						errors: [
							{
								message: 'Unauthorized',
							},
						],
					})
				}

				const schema = z.object({
					api_key: z.string(),
					channel_id: z.string(),
					title: z.string().min(1),
					message: z
						.string()
						.optional()
						.or(z.undefined())
						.or(z.null())
						.or(z.literal('')),
					url: z
						.string()
						.url()
						.optional()
						.or(z.undefined())
						.or(z.null())
						.or(z.literal('')),
				})

				const { actionFields } = req.body

				try {
					var data = schema.parse(actionFields)
				} catch (error) {
					return res.status(400).json({
						errors: [
							{
								status: 'SKIP',
								message: 'Invalid input',
							},
						],
					})
				}

				const token = await validAPIKey(server, data.api_key)
				if (!token) {
					return res.status(401).json({
						errors: [
							{
								message: 'Unauthorized',
							},
						],
					})
				}

				await server.pushController.addMessage(
					token.workspaceId as string,
					[data.channel_id as string],
					{
						title:
							data.title != null && data.title !== ''
								? data.title
								: 'Empty title',
						body: data.message || undefined,
						data: {
							url: data.url || undefined,
						},
					}
				)

				return res.json({
					data: [
						{
							id: uuid(),
						},
					],
				})
			})

			return router
		},
	}
}
