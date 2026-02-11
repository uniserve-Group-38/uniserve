const testimonials = [
  {
    name: "Ama K.",
    role: "Level 300 Computer Science Student",
    text: "Uniserve saved me so much time. I no longer walk around campus looking for laundry or food services — everything is just a click away.",
  },
  {
    name: "Kwame D.",
    role: "Level 200 Business Administration Student",
    text: "The announcements feature helped me find internship opportunities I would’ve missed. It keeps me organized and stress-free.",
  },
  {
    name: "Esi A.",
    role: "Level 100 Nursing Student",
    text: "As a fresher, Uniserve made campus life easier. From food delivery to cleaning services, everything feels simple now.",
  },
  {
    name: "Yaw M.",
    role: "Level 400 Engineering Student",
    text: "I used to waste time in long queues. Now I just book services online and focus on my studies.",
  },
  {
    name: "Abena S.",
    role: "Level 300 Economics Student",
    text: "It feels like having a personal campus assistant. Super convenient and easy to use.",
  },
  {
    name: "Kojo T.",
    role: "Level 200 Information Technology Student",
    text: "Uniserve makes campus life smoother. I can order services and stay updated in one place.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            What Students Are Saying
          </h2>
          <p className="mt-5 text-gray-600 text-lg">
            Trusted by students across campus to simplify daily life.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}

        </div>

      </div>
    </section>
  )
}

function TestimonialCard({
  name,
  role,
  text,
}: {
  name: string
  role: string
  text: string
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 border border-gray-200">

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
          {name[0]}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>

      {/* Testimonial text */}
      <p className="text-gray-700 leading-relaxed text-sm">
        “{text}”
      </p>

    </div>
  )
}
