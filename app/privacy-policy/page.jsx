export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-3xl bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-10 border border-white/20 space-y-6">
        {/* Product Name */}
        <div className="text-center">
          <span className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            ChatterlyAI
          </span>
        </div>

        <h1 className="text-4xl font-bold text-purple-700 text-center">
          Privacy Policy
        </h1>

        {/* Separator */}
        <hr className="border-gray-300 my-4" />

        <section className="hover:bg-white/30 transition-colors rounded-lg p-2">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">
            Data Collection
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            <strong>ChatterlyAI</strong> is a student-built demo project.
            Email or login information is used only for demonstration
            purposes and should not be real or sensitive data.
          </p>
        </section>

        <section className="hover:bg-white/30 transition-colors rounded-lg p-2">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">
            Usage Purpose
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            This project is a student initiative built solely for educational
            purposes. No login credentials or sensitive information are stored
            or transmitted outside the demo environment.
          </p>
        </section>

        <section className="hover:bg-white/30 transition-colors rounded-lg p-2">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">
            Security
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            While this is a demo project, standard precautions are taken to
            ensure that any temporary data handled during usage is not
            inadvertently exposed or shared.
          </p>
        </section>

        <section className="hover:bg-white/30 transition-colors rounded-lg p-2">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">
            Contact
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            For questions regarding this privacy policy, please contact the
            project creator directly via the platform's contact options.
          </p>
        </section>
      </div>
    </div>
  );
}
