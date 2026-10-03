import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSpots } from '../data/SpotsProvider'
import { useAuth } from '../auth/AuthContext'
import SpotForm from '../components/ui/SpotForm'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import type { Spot } from '../data/types'

function SpotFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getSpot, addSpot, updateSpot } = useSpots()
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isEdit = Boolean(slug)
  const existing = slug ? getSpot(slug) : undefined

  if (!user) {
    return (
      <div className="mx-auto px-8 py-12 max-[980px]:px-[18px] max-[640px]:px-[14px]" style={{ width: 'min(1310px, 100% - 80px)' }}>
        <h1 className="text-[28px] font-bold mb-3">Sign in required</h1>
        <p className="text-muted text-[14px]">You need to be signed in to {isEdit ? 'edit' : 'add'} spots.</p>
      </div>
    )
  }

  if (isEdit && !existing) {
    return (
      <div className="mx-auto px-8 py-12 max-[980px]:px-[18px] max-[640px]:px-[14px]" style={{ width: 'min(1310px, 100% - 80px)' }}>
        <h1 className="text-[28px] font-bold mb-3">Spot not found</h1>
        <p className="text-muted text-[14px]">The spot you're trying to edit doesn't exist.</p>
      </div>
    )
  }

  const handleSubmit = async (spot: Spot) => {
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit && slug) {
        await updateSpot(slug, spot)
      } else {
        await addSpot(spot)
      }
      navigate('/spots')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-[min(1310px,100%-80px)] max-[980px]:w-[min(100%-36px,760px)] max-[640px]:w-[calc(100%-28px)]">
      <div className="px-8 pt-12 pb-6 max-[980px]:px-[18px] max-[640px]:px-[14px] max-[640px]:pt-[30px]">
        <Breadcrumbs
          items={[
            { label: 'Saved spots', to: '/spots' },
            { label: isEdit ? `Edit: ${existing!.name}` : 'New spot' },
          ]}
        />

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 text-amber text-[12px] font-bold uppercase mb-3">
            <span className="w-[7px] h-[7px] bg-amber rounded-full inline-block" />
            {isEdit ? 'EDIT SPOT' : 'NEW SPOT'}
          </div>
          <h1 className="text-[36px] font-extrabold tracking-[-1.5px] leading-[1.08] max-[640px]:text-[28px]">
            {isEdit ? `Edit ${existing!.name}` : 'Add a new spot'}
          </h1>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[14px] text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="bg-card border border-border rounded-card p-6 max-[640px]:p-4">
          <SpotForm
            initial={existing}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/spots')}
            submitLabel={submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add spot'}
          />
        </div>
      </div>
    </div>
  )
}

export default SpotFormPage
