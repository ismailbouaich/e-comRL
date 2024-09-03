const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 relative">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div>
          <h3 className="font-bold mb-4">Social</h3>
          <ul className="space-y-2">
            <li><a href="#" className="flex items-center"><i className="fab fa-instagram mr-2"></i>Instagram</a></li>
            <li><a href="#" className="flex items-center"><i className="fab fa-twitter mr-2"></i>Twitter</a></li>
            <li><a href="#" className="flex items-center"><i className="fab fa-facebook mr-2"></i>Facebook</a></li>
            <li><a href="#" className="flex items-center"><i className="fab fa-youtube mr-2"></i>Youtube</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul className="space-y-2">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">yourexample@email.com</a></li>
            <li><a href="#">example@email.com</a></li>
            <li><a href="#">Call us: +1 254 568-5479</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">About</h3>
          <ul className="space-y-2">
            <li><a href="#">Support Center</a></li>
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Copyright</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Customer Care</h3>
          <ul className="space-y-2">
            <li><a href="#">FAQ & Helps</a></li>
            <li><a href="#">Shipping & Delivery</a></li>
            <li><a href="#">Return & Exchanges</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Our Information</h3>
          <ul className="space-y-2">
            <li><a href="#">Privacy policy update</a></li>
            <li><a href="#">Terms & conditions</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Site Map</a></li>
          </ul>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 py-4 border-t">
        <div className="container mx-auto flex justify-center">
          <div className="flex space-x-4">
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;