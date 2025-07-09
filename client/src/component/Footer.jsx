

const Footer = () => {
  return (
    <footer className="bg-white text-black px-6 py-10 rounded-[20px] max-w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Left section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-3 text-blue-600">
            Get in Touch
          </h2>
          <p className="text-sm text-gray-700 max-w-xs mx-auto md:mx-0">
            Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>
        </div>

        {/* Middle section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            get quick link
          </h2>
          <ul className="space-y-2 text-sm text-gray-800">
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Homepage
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Aboutpage
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Gallery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* Right section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Contact us</h2>
          <ul className="space-y-2 text-sm text-gray-800">
            <li>+91 34234234234</li>
            <li>Admin@gmail.com</li>
            <li>
              Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
