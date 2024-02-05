/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const LoadMoreDataBtn = ({ state, fetchData, additionalParam }) => {
  if (state !== null && state?.totalDocs > state?.results.length) {
    return (
      <button
        onClick={() => fetchData({ ...additionalParam, page: state.page + 1 })}
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
      >
        Load More
      </button>
    );
  }
};

export default LoadMoreDataBtn;
