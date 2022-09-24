function Page() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[75vh]">
      <div className="flex gap-1 h-24 w-24">
        <div className="h-full w-1/3 bg-gray-900 animate-pulse-6s" />
        <div className="h-full w-1/3 bg-gray-700 animate-pulse-4s" />
        <div className="h-full w-1/3 bg-gray-500 animate-pulse" />
      </div>
      <hr className="my-2" />
      <h1>
        <strong>XABI</strong> Web Portal
      </h1>
      <p className="text-sm">Version 0.1.smtn</p>
      <p className="text-sm">Use at your own risk</p>
      <p className="text-sm">*Currently hosted on XToken Game Server.</p>
    </div>
  );
}

export default Page;
