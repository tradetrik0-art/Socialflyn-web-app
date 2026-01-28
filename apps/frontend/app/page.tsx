import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">Socialflyn</h1>
            <div className="flex gap-4">
              <Link href="/auth/login" className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                Sign In
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-6">
            Grow Your Clients <span className="text-indigo-600">Faster with AI</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Socialflyn automates social media marketing with AI-powered content generation, 
            performance tracking, and intelligent recommendations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
              Start Free Trial
            </Link>
            <Link href="#features" className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold">
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🤖",
              title: "AI Content Generator",
              desc: "Generate 22 optimized posts monthly with AI"
            },
            {
              icon: "📈",
              title: "Growth Planning",
              desc: "30/60/90 day roadmaps powered by AI insights"
            },
            {
              icon: "📊",
              title: "Performance Analytics",
              desc: "Real-time metrics and actionable recommendations"
            },
            {
              icon: "💌",
              title: "Cold Outreach Automation",
              desc: "Email + WhatsApp sequences that convert"
            },
            {
              icon: "💰",
              title: "Ad Optimization",
              desc: "Connect your Meta & Google ad accounts"
            },
            {
              icon: "📱",
              title: "Multi-Tenant",
              desc: "Manage 100+ clients from one dashboard"
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
