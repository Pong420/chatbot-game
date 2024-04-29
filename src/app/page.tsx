import Image from 'next/image';
import logo from '@/assets/logo.png';
import LineLogo from '@/assets/LINE_logo.svg';
import { Card, CardDescription, CardFooter, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

function Feature({ title = '', description = '', path = '/', line = false }) {
  return (
    <Link href={`/docs/${path}`} className="lg:basis-3/12">
      <Card className="h-full flex flex-col hover:shadow-lg hover:cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>

        <CardFooter className="flex mt-auto mb-0">{line && <LineLogo width={30} />}</CardFooter>
      </Card>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="container max-w-6xl min-h-full pt-12 md:pt-30 pb-10">
      <div className="text-center">
        <Image src={logo} alt="logo" width={100} className="block m-auto" />
        <div className="mt-2 text-lg text-foreground">遊戲機器人</div>
        <div className="text-muted-foreground">提供遊戲功能的聊天軟件機器人</div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <Feature
          path="nickname"
          title="暱稱系統"
          description="用於遊戲或者機器人相關回覆，默認使用聊天軟件中的暱稱，之後可以向機器人提交修改暱稱指示，修改聊天軟件的暱稱後不會自動更新。"
          line
        />
        <Feature
          path="werewolf"
          title="狼人殺"
          description="在群組發起狼人殺後，群組內的用戶即可參與遊戲，機器人會負責遊戲管理，派發角色，玩家通過私聊機器人進行操作，發起人(主持人)在群組輸入的查詢指令，判斷玩家是否完成操作，完成後機器人會回覆當前狀態"
          line
        />
      </div>
    </div>
  );
}
