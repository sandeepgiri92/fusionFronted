import logo from "../assets/fusion logo.png"
import { Button } from "@/components/ui/button"

const MobileApkDownloadPage = () => {
  return (
    <div>
      <div className='px-4 py-6 bg-[#2060D0] text-white'>
        <h1 className='text-center text-3xl font-bold'>
          Experience Fusion on the Go!
        </h1>
        <p className='text-center pt-2 text-gray-300 font-semibold'>
          For a faster, smoother, and more secure experience, download the offical Fusion app for your Android device.
        </p>
      </div>
      <div className="flex flex-col items-center py-20 px-4 w-screen">
        <div className=" bg-white w-fit p-2 rounded-xl shadow-[0_0_20px_rgba(32,96,208,0.25)] ">
          <img src={logo} alt="Logo" className="h-[110px] w-[110px]" />
        </div>
        <div className="w-full py-10">
          <Button className={"w-full text-xl bg-[#2060D0] text-white h-[50px] font-bold"} variant="outline">Download APK Now</Button>
        </div>
      </div>
    </div>
  )
}

export default MobileApkDownloadPage