
const Footer = () => {
  return (
    <footer className="bg-gray-100 p-4 mt-4">
      <div className="flex justify-around">
        <div>
          <h3 className="font-bold">Use cases</h3>
          <ul>
            <li>UI design</li>
            <li>UX design</li>
            <li>Wireframing</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Explore</h3>
          <ul>
            <li>Design</li>
            <li>Prototyping</li>
            <li>Development features</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Resources</h3>
          <ul>
            <li>Blog</li>
            <li>Best practices</li>
            <li>Colors</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
