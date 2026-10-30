import CategoryRow from "@/components/home/CategoryRow";
import GameSceneCanvas from "@/components/home/GameSceneCanvas";
import HomeProductCarousels from "@/components/HomeProductCarousels";

export default function Home() {
  return (
    <>
      {/* <GameSceneCanvas /> */}
      <CategoryRow />
      <HomeProductCarousels />
    </>
  );
}