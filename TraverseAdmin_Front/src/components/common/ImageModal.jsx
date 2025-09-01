import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageModal = ({ isOpen, imageUrls = [], initialIndex = 0, onClose }) => {
  const [imgRatio, setImgRatio] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setImgRatio(null);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex]);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgRatio(naturalWidth / naturalHeight);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen || imageUrls.length === 0) return null;

  let imgClass = "rounded-lg object-contain";
  if (imgRatio) {
    imgClass +=
      imgRatio > 1
        ? " max-w-[98vw] max-h-[95vh] w-auto h-auto min-w-[600px]"
        : " max-h-[95vh] max-w-[80vw] w-auto h-auto min-h-[800px]";
  } else {
    imgClass += " max-w-[98vw] max-h-[95vh]";
  }

  return (
    <div
      className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="flex relative justify-center items-center w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* 이전 버튼 */}
        {imageUrls.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* 이미지 */}
        <img
          key={currentIndex} // key 추가: 이미지 변경 시 React가 완전히 새로 렌더링
          src={imageUrls[currentIndex]}
          alt={`이미지 ${currentIndex + 1}`}
          className={imgClass}
          onLoad={handleImageLoad}
        />

        {/* 다음 버튼 */}
        {imageUrls.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
