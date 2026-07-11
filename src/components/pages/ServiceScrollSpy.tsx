'use client'

import ScrollSpyNav from '@/components/ScrollSpyNav'

interface Props {
  sections: { id: string; label: string }[]
}

export default function ServiceScrollSpy({ sections }: Props) {
  return <ScrollSpyNav sections={sections} />
}
