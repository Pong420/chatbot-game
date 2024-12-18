import Link from 'next/link';
import { default as LineLogo } from '@/assets/LINE_logo.svg';
import { Logo } from '@/components/Logo';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Feature } from '@/components/Home/Feature';

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <Header />

      <main className="container max-w-7xl flex-1 pt-4 sm:pt-12 md:pt-30 pb-10 select-none">
        <div className="flex flex-col-reverse gap-4 mx-auto items-center text-center sm:flex-row sm:text-left sm:justify-between sm:items-start">
          <div>
            <h1 className="mt-2 text-xl sm:text-3xl text-foreground">遊戲機器人</h1>
            <h2 className="text-md text-muted-foreground">提供遊戲輔助功能的聊天軟件機器人</h2>
            <div className="flex mt-2 justify-center sm:justify-start">
              <Link
                href={`https://line.me/R/ti/p/${process.env.LINE_BOT_ID}`}
                target="_blank"
                aria-label="link to LINE app"
              >
                <LineLogo width={30} />
              </Link>
            </div>
          </div>
          <Logo size={150} className="block sm:mr-10" style={{ transform: `scale(-1, 1)` }} />
        </div>

        <div className="flex flex-wrap gap-y-4 mt-4 sm:mt-20 justify-between">
          <Feature
            path="werewolf"
            title="狼人殺"
            description="在群組發起狼人殺後，群組內的用戶即可參與遊戲，機器人會負責遊戲管理，派發角色，玩家通過私聊機器人進行操作，發起人(主持人)在群組輸入的查詢指令，判斷玩家是否完成操作，完成後機器人會回覆當前狀態"
          />
          <Feature
            path="nickname"
            title="暱稱系統"
            description="用於遊戲或者機器人相關回覆，默認使用聊天軟件中的暱稱，之後可以向機器人提交修改暱稱指示，修改聊天軟件的暱稱後不會自動更新。"
          />
          <Feature
            path="designation"
            title="稱號系統 (未完成)"
            description="參與遊戲並達成某種條件取得，例如狼人殺的【我是村民」，「嫌疑犯」，「披著羊皮的狼】，用於遊戲或者機器人相關回覆。"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
