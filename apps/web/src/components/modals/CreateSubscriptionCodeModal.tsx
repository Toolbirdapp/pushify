import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal } from '../ui/Modal'
import { toast } from 'sonner'
import { useState } from 'react'
import Button from '../ui/Button'
import Copyable from '../molecules/Copyable'
import http, { getError } from '@/queries/http'
import useWorkspace from '@/hooks/use-workspace'

export default NiceModal.create(({ channelId }: { channelId: string }) => {
	const modal = useModal()
	const { workspace } = useWorkspace()
	const [submitting, setSubmitting] = useState(false)
	const [code, setCode] = useState<string | null>(null)

	async function handleCreate() {
		if (submitting) return
		setSubmitting(true)
		await http
			.post(`/workspace/${workspace?.id}/channels/${channelId}/code/new`)
			.then((res) => {
				if (res.data.code) {
					setCode(res.data.code)
				}
			})
			.catch((error) => {
				toast.error(getError(error))
				setSubmitting(false)
			})
	}

	return (
		<Modal modal={modal} className="p-0" headerClassName="px-6 pt-6">
			{code ? (
				<>
					<div className="text-center p-8 flex flex-col gap-2 items-center justify-center">
						<h2 className="text-2xl font-semibold text-slate-900">
							Code Created
						</h2>
						<p className="text-gray-500 text-sm max-w-xs mx-auto">
							Use this in the{' '}
							<span className="text-main">Pushify App</span> to
							connect to this channel.
						</p>
					</div>
					<div className="bg-slate-50 border-t border-gray-300 p-4 gap-2">
						<div className="mx-auto max-w-xs flex flex-col items-center justify-center gap-4">
							<div className="p-3.5 border border-gray-300 bg-white rounded-lg w-full flex items-center justify-between">
								<p className="text-gray-500 text-sm">{code}</p>
								<Copyable text={code} />
							</div>
							<Button
								onClick={() => modal.remove()}
								variant="secondary"
								className="w-full"
							>
								Done
							</Button>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="text-center p-8 flex flex-col gap-2 items-center justify-center">
						<h2 className="text-2xl font-semibold text-slate-900">
							Create Code
						</h2>
						<p className="text-gray-500 text-sm max-w-xs mx-auto">
							Generate a new subscription code for this channel,
							so that you can connect to it with your device.
						</p>
					</div>
					<div className="bg-slate-50 border-t border-gray-300 p-4 gap-2">
						<Button
							type="submit"
							variant="secondary"
							className="w-full"
							loading={submitting}
							disabled={submitting}
							onClick={handleCreate}
						>
							Create
						</Button>
					</div>
				</>
			)}
		</Modal>
	)
})