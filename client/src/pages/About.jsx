import PageTransition from '@/components/molecules/PageTransition'
import Section from '@/components/molecules/Section'
import Container from '@/components/molecules/Container'
import SectionHeader from '@/components/molecules/SectionHeader'

export default function About() {
  return (
    <PageTransition>
      <Section>
        <Container narrow>
          <SectionHeader label="About" title="Who we are" />
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-on-surface">
            <h3>Our Story</h3>
            <p className="text-neutral-500">
              {/* Replace with real club history */}
              NGND was founded with the mission of bringing together passionate students and
              professionals to explore cutting-edge technology, conduct research, and build
              impactful projects.
            </p>
            <h3>Mission</h3>
            <p className="text-neutral-500">
              To foster a culture of innovation and collaboration where members can grow
              their technical skills and make meaningful contributions to their field.
            </p>
            <h3>Vision</h3>
            <p className="text-neutral-500">
              A club where every member becomes a builder, researcher, and leader.
            </p>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
