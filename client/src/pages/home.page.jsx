import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/InPageNavigation";

const Home = () => {
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs  */}

        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <h1>Latest Blogs here</h1>
            <h1>Trending Blogs here</h1>
          </InPageNavigation>
        </div>

        {/* Editors and trending blogs  */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
