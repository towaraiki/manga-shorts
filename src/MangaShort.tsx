import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Img,
  Audio,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

export interface MangaShortProps {
  title: string;              // メインタイトル（例: "間違いには注意w"）
  quote: string;              // 引用元（例: "引用:MTcomic.jpg"）
  comicSrc: string;            // 漫画コマ画像
  waveBgSrc: string;           // 背景動画
  bgmSrc?: string;             // BGM
  guideText?: string;          // 最下部案内文（"続きは右上の・・・から説明へ"）
  fadeOutStartFrame?: number;  // 漫画・タイトルのフェードアウト開始フレーム（デフォルト: 230f = 約7.7秒）
  fadeOutEndFrame?: number;    // 漫画・タイトルのフェードアウト完了フレーム（デフォルト: 260f = 約8.7秒）
}

export const MangaShort: React.FC<MangaShortProps> = ({
  title = "間違いには注意w",
  quote = "引用:MTcomic.jpg",
  comicSrc = "sample_comic.jpg",
  waveBgSrc = "wave_bg.mp4",
  bgmSrc = "bgm.mp3",
  guideText = "続きは右上の・・・から説明へ",
  fadeOutStartFrame = 230,     // 約7.7秒からフェードアウト開始
  fadeOutEndFrame = 260,       // 約8.7秒で完全フェードアウト
}) => {
  const frame = useCurrentFrame();

  // 1. 背景のフェードイン（0〜45f）とラストの暗転（285〜300f）
  const bgOpacity = interpolate(
    frame,
    [0, 45, 285, 300],
    [0, 1, 1, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 2. 漫画カード：ゆっくりフェードイン（0〜60f）→ 早めのフェードアウト（230〜260f）
  const comicOpacity = interpolate(
    frame,
    [0, 60, fadeOutStartFrame, fadeOutEndFrame],
    [0, 1, 1, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const comicScale = interpolate(
    frame,
    [0, 60, fadeOutStartFrame, fadeOutEndFrame],
    [0.95, 1, 1, 0.96],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 3. タイトル：ゆっくりフェードイン（10〜65f）→ フェードアウト（230〜260f）
  const titleOpacity = interpolate(
    frame,
    [10, 65, fadeOutStartFrame, fadeOutEndFrame],
    [0, 1, 1, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const titleY = interpolate(
    frame,
    [10, 65],
    [12, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 4. 引用クレジット：ゆっくりフェードイン（15〜70f）→ フェードアウト（230〜260f）
  const quoteOpacity = interpolate(
    frame,
    [15, 70, fadeOutStartFrame, fadeOutEndFrame],
    [0, 1, 1, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 5. 最下部案内文「続きは右上の・・・から説明へ」：
  // ユーザー指示「続きは右上の・・・ってやつは常に置いとく」
  // 漫画が消えた後も画面に残り続け、最後の最後（290〜300f）までしっかり見せる
  const guideOpacity = interpolate(
    frame,
    [20, 75, 290, 300],
    [0, 1, 1, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic Bold', 'Noto Sans JP', sans-serif",
      }}
    >
      {/* 音声（BGM） */}
      {bgmSrc && <Audio src={staticFile(bgmSrc)} />}

      {/* 1. 背景動画 */}
      <AbsoluteFill style={{ opacity: bgOpacity }}>
        <OffthreadVideo
          src={staticFile(waveBgSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* 2. 最上部：引用表記 */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: quoteOpacity,
          zIndex: 20,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textShadow:
              "0 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.7)",
          }}
        >
          {quote}
        </span>
      </div>

      {/* 3. 上部：メインタイトル */}
      <div
        style={{
          position: "absolute",
          top: 125,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          zIndex: 20,
          padding: "0 24px",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: "0.02em",
            WebkitTextStroke: "10px #111111",
            paintOrder: "stroke fill",
            textShadow:
              "0 6px 12px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.8)",
            textAlign: "center",
            lineHeight: 1.25,
          }}
        >
          {title}
        </span>
      </div>

      {/* 4. 中央：漫画コマ画像（フェードアウトで消えて導線を際立たせる） */}
      <div
        style={{
          position: "absolute",
          top: 240,
          bottom: 145,
          left: 20,
          right: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: 6,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          opacity: comicOpacity,
          transform: `scale(${comicScale})`,
          zIndex: 10,
        }}
      >
        <Img
          src={staticFile(comicSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* 5. 最下部：常時固定案内（最後まで残ってクリックを誘導） */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: guideOpacity,
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: "0.03em",
            background:
              "linear-gradient(180deg, #fff7b2 0%, #ffd028 50%, #d49500 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter:
              "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 16px rgba(255, 204, 0, 0.85))",
          }}
        >
          {guideText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
