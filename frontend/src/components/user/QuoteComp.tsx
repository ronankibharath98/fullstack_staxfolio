
export const QuoteComp = () => {
  return (
    <div className="bg-blue-500 h-screen flex flex-col justify-center">
      <div className="flex justify-center text-center">
        <div className="max-w-xl">
          <div className="text-3xl text-slate-300 font-semibold">
            Welcome to Staxfolio
          </div>
          <div className="text-md text-slate-300 font-light">
            Your one stop marketplace...
          </div>
          <Card />
        </div>
      </div>
    </div>
  )
}

const Card = () => {
  return (
    <div>
      <div className="bg-slate-400">
        Card
      </div>
    </div>
  )
}

