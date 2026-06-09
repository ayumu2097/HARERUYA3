console.log("JSの読み込みと最適化に成功しました。");

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".contents-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const slides = document.querySelectorAll(".contents");
  
  if (!track || !prevBtn || !nextBtn || slides.length === 0) return;

  // 1個のスライドの物理的な幅＋余白(gap:30px)
  const gap = 30;
  let slideWidth = slides[0].offsetWidth + gap;

  // 表示枚数を定義（PCは3枚、スマホは1枚など）
  let visibleSlides = window.innerWidth <= 768 ? 1 : 3;
  let currentIndex = visibleSlides; // クローン分ずらした位置をスタートに

  // --- クローンの作成 ---
  // 無限ループ用に前方と後方に要素をコピーする
  // 前方に配置：後ろ側の要素
  for (let i = slides.length - visibleSlides; i < slides.length; i++) {
    if (slides[i]) {
      const clone = slides[i].cloneNode(true);
      track.insertBefore(clone, track.firstChild);
    }
  }

  // 後方に配置：前側の要素
  for (let i = 0; i < visibleSlides; i++) {
    if (slides[i]) {
      const clone = slides[i].cloneNode(true);
      track.appendChild(clone);
    }
  }

  // クローン設置後のすべてのスライドを取得
  const allSlides = track.children;
  const originalCount = slides.length;

  // 初期位置の設定
  track.style.transition = "none";
  updateSlidePosition();

  // --- スライダー更新関数 ---
  function updateSlidePosition() {
    const offset = -(currentIndex * slideWidth);
    track.style.transform = `translateX(${offset}px)`;
  }

  // レスポンシブ幅調整対応
  window.addEventListener("resize", () => {
    slideWidth = slides[0].offsetWidth + gap;
    visibleSlides = window.innerWidth <= 768 ? 1 : 3;
    updateSlidePosition();
  });

  // --- インデックス制御とトランジション ---
  let isTransitioning = false;

  function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex++;
    track.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    updateSlidePosition();

    // 終端（後方クローン）に達した場合、瞬時に本物（開始位置）へ戻す
    track.addEventListener("transitionend", function handleTransitionEnd() {
      if (currentIndex >= originalCount + visibleSlides) {
        track.style.transition = "none";
        currentIndex = visibleSlides;
        updateSlidePosition();
      }
      isTransitioning = false;
      track.removeEventListener("transitionend", handleTransitionEnd);
    });
  }

  function movePrev() {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex--;
    track.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    updateSlidePosition();

    // 先頭（前方クローン）に達した場合、瞬時に本物（終了位置）へ移動する
    track.addEventListener("transitionend", function handleTransitionEnd() {
      if (currentIndex <= 0) {
        track.style.transition = "none";
        currentIndex = originalCount;
        updateSlidePosition();
      }
      isTransitioning = false;
      track.removeEventListener("transitionend", handleTransitionEnd);
    });
  }

  // --- イベントハンドラー ---
  nextBtn.addEventListener("click", moveNext);
  prevBtn.addEventListener("click", movePrev);

  // オプション: 自動再生をオンにする場合は以下を追加
  let autoPlay = setInterval(moveNext, 5000);

  const resetAutoPlay = () => {
    clearInterval(autoPlay);
    autoPlay = setInterval(moveNext, 5000);
  };

  nextBtn.addEventListener("click", resetAutoPlay);
  prevBtn.addEventListener("click", resetAutoPlay);
});