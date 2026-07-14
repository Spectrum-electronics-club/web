import { useState } from 'react'
import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Select from '@/components/atoms/Select'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import Tooltip from '@/components/atoms/Tooltip'
import { Tabs, TabPanel } from '@/components/atoms/Tabs'
import Skeleton, { SkeletonCard } from '@/components/atoms/Skeleton'

const GUIDE_TABS = [
  { value: 'buttons',    label: 'Buttons' },
  { value: 'forms',      label: 'Forms' },
  { value: 'cards',      label: 'Cards' },
  { value: 'badges',     label: 'Badges' },
  { value: 'overlays',   label: 'Overlays' },
  { value: 'skeletons',  label: 'Skeletons' },
  { value: 'colors',     label: 'Colors' },
]

export default function StyleGuide() {
  const [tab, setTab] = useState('buttons')
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageTransition>
      <Section>
        <Container>
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">Internal</span>
            <h1 className="mt-1">Style Guide</h1>
            <p className="text-neutral-500 mt-2">Design system component reference.</p>
          </div>

          <Tabs tabs={GUIDE_TABS} active={tab} onChange={setTab} className="mb-8 overflow-x-auto" />

          <TabPanel value="buttons" active={tab}>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 mb-3">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  {['primary','secondary','ghost','danger','accent'].map((v) => (
                    <Button key={v} variant={v}>{v}</Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {['sm','md','lg','xl'].map((s) => (
                    <Button key={s} size={s}>Size {s}</Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 mb-3">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading</Button>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel value="forms" active={tab}>
            <div className="max-w-md space-y-5">
              <Input label="Default input" placeholder="Placeholder text" />
              <Input label="Required input" required placeholder="Enter value" />
              <Input label="Input with error" error="This field has an error." value="bad value" onChange={() => {}} />
              <Textarea label="Textarea" placeholder="Enter your message…" />
              <Select label="Select field" placeholder="Choose option"
                options={[{ value: '1', label: 'Option A' }, { value: '2', label: 'Option B' }]} />
            </div>
          </TabPanel>

          <TabPanel value="cards" active={tab}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-5"><p className="text-on-surface">Default card</p></Card>
              <Card hover className="p-5"><p className="text-on-surface">Hoverable card</p></Card>
            </div>
          </TabPanel>

          <TabPanel value="badges" active={tab}>
            <div className="flex flex-wrap gap-3">
              {['default','primary','accent','success','warning','error','ongoing','completed','archived'].map((v) => (
                <Badge key={v} variant={v}>{v}</Badge>
              ))}
            </div>
          </TabPanel>

          <TabPanel value="overlays" active={tab}>
            <div className="flex gap-4 flex-wrap items-start">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
                <p className="text-neutral-500">This is the modal body content. Press Escape or click outside to close.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setModalOpen(false)}>Confirm</Button>
                </div>
              </Modal>
              <Tooltip content="This is a tooltip">
                <Button variant="ghost">Hover for tooltip</Button>
              </Tooltip>
            </div>
          </TabPanel>

          <TabPanel value="skeletons" active={tab}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </TabPanel>

          <TabPanel value="colors" active={tab}>
            <div className="space-y-6">
              {[
                ['Primary', ['bg-primary-50','bg-primary-100','bg-primary-200','bg-primary-300','bg-primary-400','bg-primary-500','bg-primary-600','bg-primary-700','bg-primary-800','bg-primary-900','bg-primary-950']],
                ['Neutral', ['bg-neutral-50','bg-neutral-100','bg-neutral-200','bg-neutral-300','bg-neutral-400','bg-neutral-500','bg-neutral-600','bg-neutral-700','bg-neutral-800','bg-neutral-900','bg-neutral-950']],
                ['Accent',  ['bg-accent-50','bg-accent-100','bg-accent-500','bg-accent-600','bg-accent-700']],
              ].map(([name, swatches]) => (
                <div key={name}>
                  <h3 className="text-sm font-semibold text-neutral-500 mb-2">{name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {swatches.map((s) => (
                      <div key={s} className={`${s} w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700`} title={s} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        </Container>
      </Section>
    </PageTransition>
  )
}
