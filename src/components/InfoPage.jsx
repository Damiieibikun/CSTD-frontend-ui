import { Link } from "react-router-dom";
import Button from "./Button";

const InfoPage = ({ message, redirect, fontstyles = 'text-2xl', buttoncaption }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center space-y-6">
        <h1 className={`${fontstyles} font-bold text-[#152E7E]`}>
          {message}
        </h1>

        <Link to={redirect}>
          <Button
            caption={buttoncaption}
            type="button"
            styles="bg-[#152E7E] text-white px-6 py-2 text-sm rounded-md shadow hover:bg-[#1f3a72] transition duration-300"
          />
        </Link>
      </div>
    </div>
  );
};

export default InfoPage;

