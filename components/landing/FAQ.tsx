"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "What is Uniserve?",
    a: "Uniserve is a student-focused platform that connects you to essential campus services like food delivery, laundry, cleaning, and important announcements — all in one place.",
  },
  {
    q: "Who can use the platform?",
    a: "Uniserve is built primarily for university students but also supports campus service providers who want to reach students easily.",
  },
  {
    q: "How do I book a service?",
    a: "Simply choose a service, select a provider, confirm your request, and track everything directly from your dashboard.",
  },
  {
    q: "Is Uniserve free for students?",
    a: "Yes, students can browse services and announcements for free. Some services may have their own service charges.",
  },
  {
    q: "How do I receive campus announcements?",
    a: "Announcements appear directly in the platform so you never miss internship opportunities, deadlines, or campus events.",
  },
]

export default function FAQ() {
  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Everything you need to know about using Uniserve.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border rounded-xl px-4"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  )
}
