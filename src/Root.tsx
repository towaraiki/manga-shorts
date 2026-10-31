import React from "react";
import { Composition } from "remotion";
import { MangaShort, MangaShortProps } from "./MangaShort";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="MangaShort"
        component={MangaShort}
        durationInFrames={300} // 30fps * 10秒 = 300フレーム
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          title: "間違いには注意w",
          quote: "引用:MTcomic.jpg",
          comicSrc: "sample_comic.jpg",
          waveBgSrc: "wave_bg.mp4",
          bgmSrc: "bgm.mp3",
          guideText: "続きは右上の・・・から説明へ",
          fadeOutStartFrame: 225, // 約7.5秒からフェードアウト開始
          fadeOutEndFrame: 255,   // 約8.5秒で完全に消える（残り1.5秒は導線強調）
        } satisfies MangaShortProps}
      />
    </>
  );
};
