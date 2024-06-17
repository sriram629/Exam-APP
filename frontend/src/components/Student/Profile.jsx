import Navbar from "./Navbar"

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  return (
    <section className="bg-slate-100 dark:bg-gray-900 py-4 md:py-10 min-h-screen">
      <div className="container mx-auto px-4">
        <Navbar />

        <div className="bg-gray-100 dark:bg-slate-900 container flex flex-col items-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-4 max-w-lg w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">
              Profile
            </h1>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full h-24 w-24 flex items-center justify-center bg-gray-200 dark:bg-slate-700 mb-4">
                <p className="text-4xl text-gray-800 dark:text-gray-100">
                  {user && user.username[0].toUpperCase()}
                </p>
              </div>
              <div className="">
                <div className="flex gap-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Username:
                  </h2>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
                    {user && user.username}
                  </h3>
                </div>
                <div className="flex gap-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Email:
                  </h2>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
                    {user && user.email}
                  </h3>
                </div>
                <div className="flex gap-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Institute:
                  </h2>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
                    {user && user.institute}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  )
}

export default Profile
