import Navbar from "../../components/Navbar/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div className="pt-24 text-center">
        <h1 className="text-4xl font-bold">
          Welcome to HIMED
        </h1>

        <p className="mt-4">
          Medicine Marketplace Platform
        </p>
      </div>
    </>
  );
}

export default Home;