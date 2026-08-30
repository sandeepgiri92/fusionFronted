const ApiLoader = () => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />

          <div
            className="
              absolute inset-0
              rounded-full
              border-4
              border-transparent
              border-t-blue-500
              border-r-cyan-400
              animate-spin
            "
          />
        </div>

        <p className="mt-4 text-sm text-slate-500">Fetching data...</p>
      </div>
    </div>
  );
};

export default ApiLoader;
