export default function NavBar() {
  return (
    <div className="hidden lg:block">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="flex justify-center items-center gap-5 text-md font-semibold">
          <a className="navbar-brand" href="#">
            The Experience
          </a>
          <a className="navbar-brand" href="#">
            Our Chefs
          </a>
          <a className="navbar-brand" href="#">
            Gift
          </a>
          <a className="navbar-brand" href="#">
            Chef register
          </a>
          <a className="navbar-brand" href="#">
            Explore More
          </a>
        </div>
      </nav>
    </div>
  );
}
