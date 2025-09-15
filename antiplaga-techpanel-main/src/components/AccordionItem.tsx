import React, { useState } from "react"
import classNames from "classnames"
import './AccordionItem.css'
import { IonIcon, IonItemDivider } from "@ionic/react"

import ChevronIcon from '../images/chevron-forward-outline.svg'

interface AccordionItemProps {
  title: string,
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({title, children}) => {

  const [isActive, setIsActive] = useState(false)

  const styles = classNames({
    "item-accordion-content": true,
    "active": isActive,
  })

  const chevronStyles = classNames({
    'rotated': isActive,
    "chevron": true
  })

  return (
    <>
      <div className="item-accordion">
        <div className="item-accordion-title" onClick={() => setIsActive(isActive => !isActive)}>
          <img className={chevronStyles} src={ChevronIcon} alt="" />
          {title}
        </div>
        <div className={styles}>
          {children}
        </div>
      </div>
    </>
  )
}

export default AccordionItem