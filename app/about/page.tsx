import { Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">About IEEE MTT-S CUSAT SB</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn about our mission, vision, and the team behind IEEE Microwave Theory and Techniques Society CUSAT
          Student Branch.
        </p>
      </div>

      {/* About Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Who We Are</h2>
            <p className="text-gray-700 mb-4">
              The IEEE Microwave Theory and Techniques Society (MTT-S) CUSAT Student Branch is a vibrant community of
              students, researchers, and faculty members passionate about microwave engineering, RF technologies, and
              wireless communications.
            </p>
            <p className="text-gray-700 mb-4">
              Established in 2018, our student branch is affiliated with the IEEE MTT-S, which is the world's leading
              professional organization for microwave theory and techniques. We operate under the Department of
              Electronics at Cochin University of Science and Technology (CUSAT).
            </p>
            <p className="text-gray-700">
              Our branch provides a platform for students to explore the fascinating world of microwave engineering
              through workshops, seminars, technical competitions, and industry interactions.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=400&width=600&text=IEEE+MTT-S+CUSAT+SB"
              alt="IEEE MTT-S CUSAT SB Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mb-16 bg-blue-50 p-8 rounded-lg">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              To foster interest and knowledge in microwave theory, techniques, and applications among students through
              educational activities, technical events, and industry collaborations.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                  <Award className="h-4 w-4 text-blue-900" />
                </div>
                <span className="text-gray-700">Promote excellence in microwave engineering education</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                  <Award className="h-4 w-4 text-blue-900" />
                </div>
                <span className="text-gray-700">Facilitate knowledge sharing and technical skill development</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                  <Award className="h-4 w-4 text-blue-900" />
                </div>
                <span className="text-gray-700">Bridge the gap between academia and industry</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Our Vision</h2>
            <p className="text-gray-700 mb-6">
              To be a leading student community that empowers the next generation of microwave engineers and researchers
              to innovate and excel in their careers.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                  <Award className="h-4 w-4 text-blue-900" />
                </div>
                <span className="text-gray-700">Create a collaborative learning environment</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                  <Award className="h-4 w-4 text-blue-900" />
                </div>
                <span className="text-gray-700">Inspire innovation in microwave and RF technologies</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                  <Award className="h-4 w-4 text-blue-900" />
                </div>
                <span className="text-gray-700">Develop future leaders in the field of microwave engineering</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">Our History</h2>
        <div className="relative border-l-2 border-blue-200 pl-8 ml-4 space-y-10">
          <div className="relative">
            <div className="absolute -left-10 top-0 bg-blue-900 rounded-full w-6 h-6"></div>
            <h3 className="text-xl font-bold mb-2">2018 - Establishment</h3>
            <p className="text-gray-700">
              IEEE MTT-S CUSAT Student Branch was established with a small group of enthusiastic students and faculty
              members.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-10 top-0 bg-blue-900 rounded-full w-6 h-6"></div>
            <h3 className="text-xl font-bold mb-2">2019 - First Technical Workshop</h3>
            <p className="text-gray-700">
              Organized our first technical workshop on "RF Circuit Design" with over 100 participants from various
              institutions.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-10 top-0 bg-blue-900 rounded-full w-6 h-6"></div>
            <h3 className="text-xl font-bold mb-2">2020 - Virtual Transition</h3>
            <p className="text-gray-700">
              Successfully transitioned to virtual events and webinars during the pandemic, reaching a wider audience.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-10 top-0 bg-blue-900 rounded-full w-6 h-6"></div>
            <h3 className="text-xl font-bold mb-2">2021 - Industry Collaborations</h3>
            <p className="text-gray-700">
              Established collaborations with leading companies in the RF and microwave industry for student internships
              and projects.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-10 top-0 bg-blue-900 rounded-full w-6 h-6"></div>
            <h3 className="text-xl font-bold mb-2">2022 - Regional Recognition</h3>
            <p className="text-gray-700">
              Received recognition as one of the most active student branches in the region with multiple successful
              events.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-10 top-0 bg-blue-900 rounded-full w-6 h-6"></div>
            <h3 className="text-xl font-bold mb-2">2023 - Present</h3>
            <p className="text-gray-700">
              Continuing to grow with new initiatives, technical competitions, and collaborative projects with other
              IEEE societies.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-16 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Our Achievements</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-2">10+</div>
            <h3 className="text-xl font-semibold mb-2">Technical Workshops</h3>
            <p className="text-gray-700">
              Conducted over 10 technical workshops on various aspects of microwave engineering and RF technologies.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-2">500+</div>
            <h3 className="text-xl font-semibold mb-2">Student Members</h3>
            <p className="text-gray-700">
              Built a community of over 500 student members interested in microwave theory and techniques.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-2">5</div>
            <h3 className="text-xl font-semibold mb-2">Industry Partnerships</h3>
            <p className="text-gray-700">
              Established partnerships with 5 leading companies in the RF and microwave industry.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-2">3</div>
            <h3 className="text-xl font-semibold mb-2">Research Publications</h3>
            <p className="text-gray-700">
              Facilitated 3 research publications by student members in international conferences and journals.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-2">2</div>
            <h3 className="text-xl font-semibold mb-2">Regional Awards</h3>
            <p className="text-gray-700">
              Received 2 regional awards for outstanding student branch activities and initiatives.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-900 mb-2">15+</div>
            <h3 className="text-xl font-semibold mb-2">Guest Lectures</h3>
            <p className="text-gray-700">
              Organized over 15 guest lectures by industry experts and academic researchers.
            </p>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Our Affiliations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg border flex items-center justify-center h-32">
            <img src="/placeholder.svg?height=100&width=200&text=IEEE" alt="IEEE Logo" className="max-h-16" />
          </div>
          <div className="bg-white p-4 rounded-lg border flex items-center justify-center h-32">
            <img
              src="/placeholder.svg?height=100&width=200&text=IEEE+MTT-S"
              alt="IEEE MTT-S Logo"
              className="max-h-16"
            />
          </div>
          <div className="bg-white p-4 rounded-lg border flex items-center justify-center h-32">
            <img src="/placeholder.svg?height=100&width=200&text=CUSAT" alt="CUSAT Logo" className="max-h-16" />
          </div>
          <div className="bg-white p-4 rounded-lg border flex items-center justify-center h-32">
            <img
              src="/placeholder.svg?height=100&width=200&text=Dept+of+Electronics"
              alt="Department of Electronics Logo"
              className="max-h-16"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
