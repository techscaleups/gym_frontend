import React from 'react';

const VideoPromo = () => {
  return (
    <section className="py-5">
      <div className="container ">
        <h6 className="fw-bold mb-4 ">Video Promo</h6>

        <div className="ratio ratio-16x9 mb-3">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/0zz172zODiY?si=oRYJQFRYFT80MTcT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

        </div>

        <h6 className="text-center ">Watch how to build your home gym</h6>
      </div>
    </section>
  );
};

export default VideoPromo;
