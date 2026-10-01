import { ReactNode } from 'react'

interface InfoCardProps {
  icon?: ReactNode
  title: string
  children: ReactNode
  dark?: boolean
}

function InfoCard({ icon, title, children, dark }: InfoCardProps) {
  return (
    <div className={`p-6 rounded-card max-[640px]:p-[18px] ${dark ? 'bg-dark-card text-white' : 'bg-card border border-border'}`}>
      <div className="flex items-center gap-2.5 mb-4">
        {icon && <div className="w-[18px] h-[18px]">{icon}</div>}
        <h2 className="text-[20px] font-bold m-0">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default InfoCard
