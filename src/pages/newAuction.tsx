import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import DatePickerFunction from "@/components/OnCreateProduct/DatePicker";
import MySelect from "@/components/OnCreateProduct/SelectCategory";
import Layout from "@/components/onPageComponents/layout";
import { useRouter } from "next/router";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const NewAuction = () => {
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date>(tomorrow);
  const [values, setValues] = useState({
    product: "",
    image: "",
    description: "",
    price: 1,
    finishTime: tomorrow.toISOString(),
    category: "Gaming",
  });
  const [img, setImg] = useState<File>();
  const [imageUrl, setImageUrl] = useState();

  const [isError, setIsError] = useState(false);

  const handleChange = (
    evt:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = evt.target.value;
    const name = evt.target.name;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!img) {
      return toast.error("Please add a image");
    }

    if (!values.product) {
      return toast.error("Please add a name to the auction");
    }

    if (!Number.isInteger(+values.price)) {
      return toast.error("The initial price must be a whole number");
    }

    try {
      const formData = new FormData();
      formData.append("file", img);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.secure_url);

      const response = await fetch("api/auction/newauction", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          image: data.secure_url,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      toast.success("Auction added!");
      return router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleTime = (date: Date | null) => {
    if (date) {
      const realDate = date;

      const experimentalTomorrow = new Date(tomorrow);
      experimentalTomorrow.setHours(0, 0, 0, 0);

      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (experimentalTomorrow <= selectedDate) {
        setStartDate(realDate);
        setValues({ ...values, finishTime: realDate.toISOString() });
        setIsError(false);
      } else {
        setIsError(true);
        toast.error("That date isn't valid");
      }
    }
  };

  const handleIsErrorFalse = () => {
    setIsError(false);
  };

  const handleChangeCategory = (option: string) => {
    setValues({ ...values, category: option });
  };

  return (
    <Layout>
      <Toaster />
      <div className="grid grid-cols-2">
        <div className="flex justify-center items-center h-screen">
          <p className="absolute top-24 text-4xl font-bold">Start Offering!</p>
          <p className="absolute top-40 text-lg font-medium">
            Set up your auction as you want!
          </p>
          <Image
            src="/images/bids-online.jpg"
            alt="bid-image"
            height="600"
            width="600"
            className="mx-auto -mt-16"
          />
        </div>
        <div className="flex">
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex m-8 ml-14 items-center ">
              <p className="font-semibold mr-1">Product name: </p>
              <input
                type="text"
                name="product"
                value={values.product}
                onChange={handleChange}
                placeholder="Product name"
                className="border-2 rounded-md p-2 w-3/4  border-blue-200"
              />
              <p className="text-2xl ml-3 text-red-500">*</p>
            </div>
            <div className="flex m-8 ml-14 items-center ">
              <p className="font-semibold mr-5">Description: </p>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder="Product description"
                className="border-2 rounded-md p-2 w-3/4 h-32 border-blue-200"
              />
              <p className="text-2xl ml-3 text-red-500">*</p>
            </div>
            <div className="flex items-center mx-14">
              <MySelect
                selectedOption={values.category}
                handleChangeCategory={handleChangeCategory}
              />
              <p className="text-2xl ml-3 text-red-500">*</p>
            </div>
            <div className="flex items-center my-8 mx-14">
              <p className="items-center font-semibold mx-1">Finish date:</p>
              <DatePickerFunction
                startDate={startDate as Date}
                handleTime={handleTime}
                isError={isError}
                handleIsErrorFalse={handleIsErrorFalse}
              />
              <p className="text-2xl ml-3 text-red-500">*</p>
            </div>
            <div className="flex items-center ">
              <p className="flex-shrink-0 mr-1 ml-14 font-semibold">
                Set an inicial price:{" "}
              </p>
              <p>$</p>
              <input
                type="number"
                name="price"
                value={values.price}
                onChange={(e) => handleChange(e)}
                placeholder="initial"
                className="my-4 py-2 px-1 border border-gray-300 rounded-lg ml-1 w-1/4"
              />
              <p className="text-2xl ml-3 text-red-500">*</p>
            </div>
            <p className="text-sm font-light ml-36 -mt-3 text-green-500">
              the price must be a whole number
            </p>
            <div className="flex m-5 ml-14 font-semibold mt-8">
              <label htmlFor="image-upload">Choose an image:</label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-2xl ml-3 text-red-500">*</p>
            </div>
            <div>
              {img && (
                <div className="my-4">
                  <Image
                    src={URL.createObjectURL(img)}
                    alt="uploaded image"
                    width="400"
                    height="400"
                    className="max-h-80 ml-14"
                  />
                </div>
              )}
            </div>
            <button
              className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-3 ml-48 mb-12
             rounded-lg mt-4 w-[150px] transition-all hover:scale-105"
            >
              Start auction
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewAuction;
