import Image from 'next/image';
import logo from '@/assets/logo.png';
import { Card, CardDescription, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function Feature({ title = '', description = '', path = '' }) {
  const containerClassName = cn('lg:basis-3/12');

  const content = (
    <Card className={cn('h-full flex flex-col')}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );

  if (path) {
    return (
      <Link href={`/docs/${path}`} className={cn(containerClassName, 'hover:shadow-lg cursor-pointer')}>
        {content}
      </Link>
    );
  }

  return <div className={containerClassName}>{content}</div>;
}

export default function Home() {
  return (
    <div className="container max-w-8xl min-h-full pt-12 md:pt-30 pb-10">
      <div className="text-center">
        <Image src={logo} alt="logo" width={100} className="block m-auto" />
        <div className="mt-2 text-lg text-foreground">遊戲機器人</div>
        <div className="text-muted-foreground">提供遊戲輔助功能的聊天軟件機器人</div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 justify-center">
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
          description="參與遊戲並達成某種條件取得，例如狼人殺的「我是村民」，「嫌疑犯」，「披著羊皮的狼」，用於遊戲或者機器人相關回覆。"
        />
        <Feature title="猜猜畫畫 (考慮中)" description="需要找合適儲存圖片的服務" />
        <Feature title="海戰 (考慮中)" description="猜謎遊戲，或者叫海戰棋？要考慮一下多人玩法" />
        <Feature title="擲骰子 (考慮中)" description="打開網頁，配合3D動畫，但3D相關知識是零，找到合適的參考會試試" />
        <Feature title="其他遊戲" description="暫時不考慮撲克相關，歡迎提供其他建議" />
      </div>
    </div>
  );
}
