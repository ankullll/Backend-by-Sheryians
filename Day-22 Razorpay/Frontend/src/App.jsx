import axios from "axios";
import { useEffect, useState } from "react";
import PaymentButton from "./PaymentButton";

const App = () => {
  const [product, setproduct] = useState(null);
  useEffect(() => {
    axios.get("http://localhost:3000/api/products/getItem").then((response) => {
      setproduct(response.data.product);
      console.log(response.data.product);
    });
  }, []);

  const submitHandler = ()=>{
    alert("Buy now")
  }

  return product ? (
    <div className="h-screen w-screen flex bg-gray-900 text-white items-center justify-center">
      <div className=" flex overflow-hidden rounded-2xl bg-gray-700">
        <div className="img w-1/2 overflow-hidden">
          <img className="h-60 w-90 object-top  " src={product.image} alt="" />
        </div>
        <div className="flex flex-col justify-center pl-10">
          <h1 className="text-2xl font-bold">{product?.title}</h1>
          <p className="text-sm">{product?.description}</p>
          <h1 className="text-xl font-bold mt-5">र{product?.price?.amount / 100}</h1>
        </div>
        <div className="flex justify-center items-center ">
         <PaymentButton/>
        </div>
      </div>
    </div>
  ) : (
    <h1>NO</h1>
  );
};

export default App;
