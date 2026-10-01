import { ReactNode } from 'react'

interface InfoCardProps {
  icon?: ReactNode
  title: string
  children: ReactNode
  dark?: boolean
}

function InfoCard({ icon, title, children, dark }: InfoCardProps) {
  return (
    <div className={`p-6 rounded-card ${dark ? 'bg-dark-card text-white' : 'bg-card border border-border'}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="w-5 h-5">{icon}</div>}
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default InfoCard
