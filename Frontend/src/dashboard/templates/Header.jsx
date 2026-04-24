import F2 from "/F2.jpg";

const Header = () => {
  return (
    <div style={{backgroundColor: '#546b57'}} className="flex justify-center items-center p-4 shadow-md border-b border-[#81b68e]">
      <div className="flex items-center space-x-4">
        <div className="flex justify-center items-center">
          <img src={F2} alt="Logo" className="w-20 hidden md:flex rounded-md" />
          <img src={F2} alt="Logo" className="w-10 flex md:hidden rounded-md" />
        </div>
        <h1 className="text-4xl md:text-7xl flex">
          <span style={{color: '#eeded5'}} className="font-bold">Proyecto</span>
          <span style={{color: '#eeded5'}} className="font-bold ml-1">3</span>
        </h1>
      </div>
    </div>
  );
}
export default Header;