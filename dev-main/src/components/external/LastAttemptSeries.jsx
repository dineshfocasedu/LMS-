import { memo, useState, useRef } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const videos = [
  { id: 'WnlnJ8RuBYw', title: 'CA Inter -Cost of Capital',     subject: 'FM',      duration: '35:10:30' },
  { id: 'tVmLTxH38jM', title: 'CA Inter - Audit',           subject: 'Audit',       duration: '13:43:15' },
  { id: 'zfF8bGY6gkU', title: 'CA Inter - Accounts', subject: 'Accounts', duration: '11:37:00' },
  { id: '0Y5enJ06BfA', title: 'CA Inter - Costing',       subject: 'Costing',      duration: '32:46:00'   },
  { id: 'CpLA_ZL7unA', title: 'CA Inter - Law',          subject: 'Law',      duration: '16:27:00' },
  { id: 'CUVWjpd3vNE', title: 'CA Inter - Cost and Management Accounting',        subject: 'CMA',    duration: '1:10:18' },
];

const subjectColors = {
  SFM:      'bg-blue-100 text-blue-700',
  FR:       'bg-indigo-100 text-indigo-700',
  Accounts: 'bg-sky-100 text-sky-700',
  Law:      'bg-slate-100 text-slate-700',
  Tax:      'bg-cyan-100 text-cyan-700',
  Audit:    'bg-violet-100 text-violet-700',
};

const VideoCard = ({ video }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-out hover:scale-[1.02] border border-gray-100 w-full">
      <div
        className="relative w-full aspect-video bg-gray-900 cursor-pointer overflow-hidden"
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }}
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-0.5 rounded">
              {video.duration}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transform group-hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                <svg viewBox="0 0 68 48" className="w-14 h-10" fill="none">
                  <path d="M66.52 7.74C65.7 4.8 63.42 2.5 60.5 1.68 55.2 0 34 0 34 0S12.8 0 7.5 1.68C4.58 2.5 2.3 4.8 1.48 7.74 0 13.05 0 24 0 24s0 10.95 1.48 16.26c.82 2.94 3.1 5.24 6.02 6.06C12.8 48 34 48 34 48s21.2 0 26.5-1.68c2.92-.82 5.2-3.12 6.02-6.06C68 34.95 68 24 68 24s0-10.95-1.48-16.26z" fill="#FF0000"/>
                  <path d="M27 34l18-10-18-10v20z" fill="white"/>
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-3 md:p-4">
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${subjectColors[video.subject] ?? 'bg-blue-100 text-blue-700'}`}>
          {video.subject}
        </span>
        <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
          {video.title}
        </h3>
        <button
          onClick={() => setPlaying(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold py-2 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Watch Now
        </button>
      </div>
    </div>
  );
};

const LastAttemptSeries = () => {
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Scroll to page index — desktop shows 3 cards per page, mobile shows 1
  const scrollToPage = (pageIdx) => {
    const container = scrollRef.current;
    if (!container) return;
    const isMobile = window.innerWidth < 640;
    const cardsPerPage = isMobile ? 1 : 3;
    const card = container.children[pageIdx * cardsPerPage];
    if (card) {
      container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
    setActiveIdx(pageIdx);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const isMobile = window.innerWidth < 640;
    const cardsPerPage = isMobile ? 1 : 3;
    const cardWidth = container.children[0]?.offsetWidth ?? 1;
    const gap = 24;
    const pageWidth = (cardWidth + gap) * cardsPerPage;
    const idx = Math.round(container.scrollLeft / pageWidth);
    const maxPage = Math.ceil(videos.length / cardsPerPage) - 1;
    setActiveIdx(Math.min(idx, maxPage));
  };

  const maxPage = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    return Math.ceil(videos.length / (isMobile ? 1 : 3)) - 1;
  };

  return (
    <section className="w-full py-10 md:py-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="text-center mt-2 md:my-4 px-4 mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Free for All Students
        </div>
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
          Last Attempt{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Broadcast Series
          </span>
        </h2>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
          High-impact revision sessions covering the most important topics, amendments, and exam strategies — right before your attempt.
        </p>
      </div>

      {/* Single scroll container used by BOTH mobile and desktop nav buttons */}
      <div className="relative">
        <div className="px-6 md:px-8">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6"
            style={{ scrollBehavior: 'smooth' }}
          >
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 snap-start py-3 w-[80vw] sm:w-[calc((100%-3rem)/3)]"
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>

        {/* Nav buttons — work on ALL screen sizes */}
        <div className="flex justify-center gap-3 md:gap-4 mt-6 md:mt-8 px-4">
          <button
            onClick={() => scrollToPage(Math.max(activeIdx - 1, 0))}
            aria-label="Previous"
            className="rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 focus:outline-none bg-white cursor-pointer border border-gray-200 shadow-md hover:shadow-lg hover:border-blue-300 hover:text-blue-600 text-gray-500"
          >
            <IoChevronBack className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={() => scrollToPage(Math.min(activeIdx + 1, maxPage()))}
            aria-label="Next"
            className="rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 focus:outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md hover:shadow-lg text-white"
          >
            <IoChevronForward className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex sm:hidden justify-center gap-2 mt-4">
          {videos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToPage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${activeIdx === idx ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center px-4">
        <a
          href="https://www.youtube.com/@focasedu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4 0-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.8 19 12 19 12 19s4.2 0 7-.1c.4 0 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l6 3-6 3z"/>
          </svg>
          View All Sessions on YouTube
        </a>
      </div>

      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default memo(LastAttemptSeries);
