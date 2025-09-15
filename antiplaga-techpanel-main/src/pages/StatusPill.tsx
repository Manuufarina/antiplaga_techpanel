import React, { useState } from "react"
import classNames from "classnames"

interface StatusPillProps {
  text: string
}

const StatusPill: React.FC<StatusPillProps> = ({ text }) => {

  const [active, setActive] = useState<boolean>(false)

  const classList = classNames({
    "item": true,
    "active": active,
  })

  return (
    <span className={classList} onClick={() => setActive(active => !active)}>{text}</span>

  )
}

export default StatusPill