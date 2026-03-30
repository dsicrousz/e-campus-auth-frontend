import { Tooltip, Tag } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { getRoleResources, type RoleName } from '@/lib/access-control'

interface RolePermissionsTooltipProps {
  role: RoleName
}

export function RolePermissionsTooltip({ role }: RolePermissionsTooltipProps) {
  const resources = getRoleResources(role)

  const content = (
    <div className="max-w-xs p-1">
      <div className="mb-2 font-bold text-sm capitalize text-white/90">{role}</div>
      <div className="text-[11px] text-white/50 uppercase tracking-wide mb-2">Ressources accessibles</div>
      <div className="flex flex-wrap gap-1">
        {resources.map((resource) => (
          <Tag key={resource} className="!text-[11px] !rounded-md !bg-white/10 !text-white/80 !border-white/10 !m-0">
            {resource}
          </Tag>
        ))}
      </div>
    </div>
  )

  return (
    <Tooltip title={content} placement="top" color="#1e1b4b">
      <InfoCircleOutlined className="ml-1 text-slate-300 hover:text-indigo-500 cursor-help transition-colors" />
    </Tooltip>
  )
}
